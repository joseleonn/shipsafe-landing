/**
 * Negocios (deals) en HubSpot.
 *
 * Por qué existe: los contactos solos no alcanzan. Sin negocios no hay etapas,
 * y sin etapas no hay fechas — que es lo único que a los 60 días te va a decir
 * cuál es tu ciclo de venta real y qué etapa se estira.
 *
 * El pipeline y sus etapas los crea `scripts/setup-hubspot.mjs`, que además
 * imprime los IDs que van en HUBSPOT_PIPELINE_ID y HUBSPOT_STAGE_DEMO_AGENDADA.
 */

const BASE_URL = "https://api.hubapi.com";

/** deal → contact en la API de asociaciones de HubSpot */
const ASOC_DEAL_A_CONTACTO = 3;

/** Etiqueta de etapa ↔ stageId, leído del pipeline configurado. */
export async function etapasDelPipeline(): Promise<Map<string, string>> {
  const pipelineId = process.env.HUBSPOT_PIPELINE_ID;
  const mapa = new Map<string, string>();
  if (!pipelineId) return mapa;

  try {
    const res = await request(`/crm/v3/pipelines/deals/${pipelineId}`, { method: "GET" });
    if (!res.ok) return mapa;
    const body = (await res.json()) as { stages?: { label: string; id: string }[] };
    // La API v3 devuelve el identificador de la etapa en "id", no en "stageId"
    for (const etapa of body.stages ?? []) mapa.set(etapa.id, etapa.label);
  } catch (err) {
    console.error("[hubspot-deals] no pude leer las etapas", err);
  }
  return mapa;
}

export interface NegocioModificado {
  id: string;
  dealstage: string;
  eventosEnviados: string[];
  monto: number | null;
}

/**
 * Negocios del pipeline modificados en los últimos N minutos.
 *
 * Reemplaza al workflow de HubSpot que no existe en el plan Free: en vez de que
 * HubSpot nos avise cuando algo cambia, preguntamos nosotros cada 15 minutos.
 * La ventana es más ancha que el intervalo del cron a propósito, para que un
 * ciclo demorado no se saltee un cambio.
 */
export async function negociosModificados(minutos = 30): Promise<NegocioModificado[]> {
  const pipelineId = process.env.HUBSPOT_PIPELINE_ID;
  if (!pipelineId) return [];

  const desde = Date.now() - minutos * 60 * 1000;

  /**
   * Corte de seguridad para los negocios que ya existían antes de conectar esto.
   *
   * El problema concreto: si en HubSpot hacés una edición masiva sobre negocios
   * viejos —moverlos de etapa, ordenar el pipeline, lo que sea— todos quedan
   * "modificados" y el cron los tomaría como si acabaran de avanzar. Resultado:
   * una tanda de conversiones falsas mandadas a Meta, que además envenenan el
   * modelo con gente que nunca vino de un anuncio.
   *
   * Con META_EVENTOS_DESDE en una fecha ISO, todo lo creado antes se ignora
   * para siempre. Poné la fecha en que arrancás las campañas.
   */
  const corte = process.env.META_EVENTOS_DESDE
    ? Date.parse(process.env.META_EVENTOS_DESDE)
    : NaN;

  const filtros: { propertyName: string; operator: string; value: string }[] = [
    { propertyName: "pipeline", operator: "EQ", value: pipelineId },
    { propertyName: "hs_lastmodifieddate", operator: "GTE", value: String(desde) },
  ];
  if (Number.isFinite(corte)) {
    filtros.push({ propertyName: "createdate", operator: "GTE", value: String(corte) });
  }

  try {
    const res = await request("/crm/v3/objects/deals/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [{ filters: filtros }],
        properties: ["dealstage", "ss_meta_eventos", "amount"],
        limit: 100,
      }),
    });
    if (!res.ok) {
      console.error("[hubspot-deals] búsqueda falló", res.status);
      return [];
    }
    const body = (await res.json()) as {
      results?: { id: string; properties: Record<string, string | null> }[];
    };
    return (body.results ?? []).map((d) => ({
      id: d.id,
      dealstage: d.properties.dealstage ?? "",
      eventosEnviados: (d.properties.ss_meta_eventos ?? "").split(",").filter(Boolean),
      monto: d.properties.amount ? Number(d.properties.amount) : null,
    }));
  } catch (err) {
    console.error("[hubspot-deals] búsqueda excepción", err);
    return [];
  }
}

/** Email del contacto asociado a un negocio. */
export async function emailDelNegocio(dealId: string): Promise<string | null> {
  try {
    const asoc = await request(`/crm/v4/objects/deals/${dealId}/associations/contacts`, {
      method: "GET",
    });
    if (!asoc.ok) return null;
    const body = (await asoc.json()) as { results?: { toObjectId: string | number }[] };
    const contactId = body.results?.[0]?.toObjectId;
    if (!contactId) return null;

    const contacto = await request(
      `/crm/v3/objects/contacts/${contactId}?properties=email`,
      { method: "GET" }
    );
    if (!contacto.ok) return null;
    const datos = (await contacto.json()) as { properties?: { email?: string | null } };
    return datos.properties?.email?.trim().toLowerCase() ?? null;
  } catch (err) {
    console.error("[hubspot-deals] no pude leer el contacto de", dealId, err);
    return null;
  }
}

/** Anota en el negocio qué eventos ya se mandaron, para no repetirlos. */
export async function marcarEventosEnviados(
  dealId: string,
  eventos: string[]
): Promise<boolean> {
  try {
    const res = await request(`/crm/v3/objects/deals/${dealId}`, {
      method: "PATCH",
      body: JSON.stringify({ properties: { ss_meta_eventos: eventos.join(",") } }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export interface DatosNegocio {
  contactId: string;
  email: string;
  empresa?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  leadMagnet?: string;
}

export interface ResultadoNegocio {
  ok: boolean;
  dealId?: string;
  creado?: boolean;
  error?: string;
}

async function request(path: string, init: RequestInit) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("missing_hubspot_token");
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

/** Devuelve los IDs de negocios ya asociados a un contacto. */
async function negociosDelContacto(contactId: string): Promise<string[]> {
  try {
    const res = await request(`/crm/v4/objects/contacts/${contactId}/associations/deals`, {
      method: "GET",
    });
    if (!res.ok) return [];
    const body = (await res.json()) as { results?: { toObjectId: string | number }[] };
    return (body.results ?? []).map((r) => String(r.toObjectId));
  } catch {
    return [];
  }
}

/**
 * Crea el negocio cuando la persona agenda, si todavía no tiene uno.
 *
 * Es idempotente a propósito: si alguien agenda, cancela y vuelve a agendar,
 * no queremos tres negocios para la misma empresa inflando el pipeline. Un
 * contacto con negocio existente no genera uno nuevo.
 *
 * NUNCA lanza: si HubSpot falla, la agenda igual se registró y el evento a Meta
 * igual salió. Se loguea y seguimos.
 */
export async function crearNegocioSiNoExiste(datos: DatosNegocio): Promise<ResultadoNegocio> {
  const pipeline = process.env.HUBSPOT_PIPELINE_ID;
  const etapa = process.env.HUBSPOT_STAGE_DEMO_AGENDADA;

  if (!pipeline || !etapa) {
    console.warn("[hubspot-deals] Falta HUBSPOT_PIPELINE_ID o HUBSPOT_STAGE_DEMO_AGENDADA. Corré scripts/setup-hubspot.mjs");
    return { ok: false, error: "missing_pipeline_config" };
  }

  try {
    const existentes = await negociosDelContacto(datos.contactId);
    if (existentes.length > 0) {
      return { ok: true, dealId: existentes[0], creado: false };
    }

    const nombre = datos.empresa?.trim()
      ? `${datos.empresa.trim()} — SHIPSAFE`
      : `${datos.email} — SHIPSAFE`;

    const properties: Record<string, string> = {
      dealname: nombre,
      pipeline,
      dealstage: etapa,
    };
    if (datos.utmSource) properties.ss_utm_source = datos.utmSource;
    if (datos.utmCampaign) properties.ss_utm_campaign = datos.utmCampaign;
    if (datos.utmContent) properties.ss_utm_content = datos.utmContent;
    if (datos.leadMagnet) properties.ss_lead_magnet = datos.leadMagnet;

    const res = await request("/crm/v3/objects/deals", {
      method: "POST",
      body: JSON.stringify({
        properties,
        associations: [
          {
            to: { id: datos.contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: ASOC_DEAL_A_CONTACTO,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      console.error("[hubspot-deals] no se pudo crear", res.status, detalle);
      return { ok: false, error: `create_${res.status}` };
    }

    const body = (await res.json()) as { id: string };
    return { ok: true, dealId: body.id, creado: true };
  } catch (err) {
    console.error("[hubspot-deals] excepción", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
