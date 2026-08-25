/**
 * HubSpot CRM — alta/actualización de contactos desde el embudo de Meta Ads.
 *
 * Requiere una Private App con los scopes `crm.objects.contacts.read` y
 * `crm.objects.contacts.write`. El token va en HUBSPOT_ACCESS_TOKEN.
 *
 * PROPIEDADES A CREAR EN HUBSPOT antes de usar esto
 * (Settings → Properties → Contact properties). Los nombres internos tienen
 * que coincidir exactamente con las claves de CONTACT_PROPERTIES:
 *
 *   ss_cantidad_empleados   Dropdown  1-9 / 10-49 / 50-99 / 100-249 / 250-499 / 500+
 *   ss_rubro                Dropdown  metalurgica / construccion / logistica /
 *                                     alimenticia / manufactura / mantenimiento /
 *                                     agroindustria / energia / otro
 *   ss_rol                  Dropdown  syh / gerencia_planta / direccion / rrhh / otro
 *   ss_gestion_actual       Dropdown  excel / papel / otra_plataforma / nada
 *   ss_calificacion         Dropdown  califica / no_califica
 *   ss_lead_magnet          Texto     slug del recurso descargado
 *   ss_utm_source           Texto
 *   ss_utm_medium           Texto
 *   ss_utm_campaign         Texto
 *   ss_utm_content          Texto     ← el que dice QUÉ ÁNGULO trajo al lead
 *   ss_utm_term             Texto
 *   ss_fbclid               Texto
 *
 * ss_utm_content es la propiedad más importante de todas: es la que después
 * te deja contestar "¿qué anuncio trajo a los clientes que cerraron?".
 */

const BASE_URL = "https://api.hubapi.com";

export interface LeadProperties {
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  company?: string;
  ss_cantidad_empleados?: string;
  ss_rubro?: string;
  ss_rol?: string;
  ss_gestion_actual?: string;
  ss_calificacion?: "califica" | "no_califica";
  ss_lead_magnet?: string;
  ss_utm_source?: string;
  ss_utm_medium?: string;
  ss_utm_campaign?: string;
  ss_utm_content?: string;
  ss_utm_term?: string;
  ss_fbclid?: string;
  /** URI del invitado de Calendly de la reunión que se está recordando */
  ss_wa_reunion_uri?: string;
  /** Claves de recordatorios ya enviados para esa reunión, separadas por coma */
  ss_wa_enviados?: string;
  /** Qué contestó a la confirmación por WhatsApp */
  ss_wa_respuesta?: "confirmo" | "reagendar";
  /** "true" cuando la reunión está cerca y todavía no confirmó. Dispara la tarea de llamado */
  ss_wa_sin_confirmar?: string;
  /** Fecha ISO en que entró a la cola de setting. Evita encolarlo dos veces */
  ss_setting_encolado?: string;
  /** El mensaje de WhatsApp ya redactado para este lead, listo para copiar */
  ss_setting_mensaje?: string;
}

export interface HubSpotResult {
  ok: boolean;
  contactId?: string;
  created?: boolean;
  error?: string;
}

function clean(props: LeadProperties): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      out[key] = String(value).trim();
    }
  }
  return out;
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

/**
 * Crea o actualiza el contacto usando el email como clave única.
 *
 * HubSpot permite hacer PATCH por una propiedad única (`idProperty=email`).
 * Si el contacto no existe devuelve 404 y ahí recién creamos. Así evitamos
 * duplicar al que descarga dos recursos distintos.
 *
 * NUNCA lanza: si HubSpot está caído, el lead igual tiene que poder avanzar
 * en el embudo. Se loguea y seguimos.
 */
export async function upsertContact(props: LeadProperties): Promise<HubSpotResult> {
  const properties = clean(props);
  const email = properties.email;
  if (!email) return { ok: false, error: "missing_email" };

  try {
    const patch = await request(
      `/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
      { method: "PATCH", body: JSON.stringify({ properties }) }
    );

    if (patch.ok) {
      const body = (await patch.json()) as { id: string };
      return { ok: true, contactId: body.id, created: false };
    }

    if (patch.status === 404) {
      const post = await request("/crm/v3/objects/contacts", {
        method: "POST",
        body: JSON.stringify({ properties }),
      });
      if (post.ok) {
        const body = (await post.json()) as { id: string };
        return { ok: true, contactId: body.id, created: true };
      }
      const errBody = await post.text();
      console.error("[hubspot] create falló", post.status, errBody);
      return { ok: false, error: `create_${post.status}` };
    }

    const errBody = await patch.text();
    console.error("[hubspot] patch falló", patch.status, errBody);
    return { ok: false, error: `patch_${patch.status}` };
  } catch (err) {
    console.error("[hubspot] excepción", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/** Busca un contacto por email. Se usa desde el webhook de Calendly para
 *  recuperar la atribución (los UTM) que se guardó cuando dejó los datos. */
export async function findContactByEmail(
  email: string,
  properties: string[] = ["ss_utm_source", "ss_utm_campaign", "ss_utm_content", "ss_fbclid", "firstname", "lastname", "phone"]
): Promise<{ ok: boolean; contactId?: string; properties?: Record<string, string | null>; error?: string }> {
  try {
    const params = new URLSearchParams({ idProperty: "email" });
    for (const p of properties) params.append("properties", p);
    const res = await request(
      `/crm/v3/objects/contacts/${encodeURIComponent(email)}?${params.toString()}`,
      { method: "GET" }
    );
    if (!res.ok) return { ok: false, error: `lookup_${res.status}` };
    const body = (await res.json()) as { id: string; properties: Record<string, string | null> };
    return { ok: true, contactId: body.id, properties: body.properties };
  } catch (err) {
    console.error("[hubspot] lookup excepción", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/**
 * Busca un contacto por teléfono. Lo usa el webhook de WhatsApp, donde lo único
 * que llega es el número.
 *
 * Prueba varios formatos porque HubSpot guarda el teléfono tal como se cargó:
 * el mismo número puede estar como "+54 9 341 306-7158", "3413067158" o
 * "5493413067158" según quién lo haya escrito.
 */
export async function buscarContactoPorTelefono(
  telefonoNormalizado: string
): Promise<{ ok: boolean; contactId?: string; email?: string; error?: string }> {
  const local = telefonoNormalizado.startsWith("549")
    ? telefonoNormalizado.slice(3)
    : telefonoNormalizado;

  const variantes = [
    telefonoNormalizado,
    `+${telefonoNormalizado}`,
    local,
    `+54${local}`,
  ];

  try {
    for (const propiedad of ["phone", "mobilephone"]) {
      const res = await request("/crm/v3/objects/contacts/search", {
        method: "POST",
        body: JSON.stringify({
          filterGroups: variantes.map((valor) => ({
            filters: [{ propertyName: propiedad, operator: "EQ", value: valor }],
          })),
          properties: ["email", "firstname"],
          limit: 1,
        }),
      });
      if (!res.ok) continue;
      const body = (await res.json()) as {
        results?: { id: string; properties: Record<string, string | null> }[];
      };
      const encontrado = body.results?.[0];
      if (encontrado) {
        return {
          ok: true,
          contactId: encontrado.id,
          email: encontrado.properties.email ?? undefined,
        };
      }
    }
    return { ok: false, error: "no_encontrado" };
  } catch (err) {
    console.error("[hubspot] búsqueda por teléfono falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

export interface CandidatoSetting {
  contactId: string;
  email: string;
  nombre: string;
  empresa: string;
  rubro: string;
  empleados: string;
  utmContent: string;
}

/**
 * Leads calificados que dejaron los datos hace más de 24 h y todavía no fueron
 * encolados para contacto manual.
 *
 * Es la mitad del filtro: la otra mitad —si agendaron o no— se resuelve en el
 * cron mirando si el contacto tiene un negocio asociado, porque el negocio se
 * crea justamente al agendar y la API de búsqueda no puede filtrar por ausencia
 * de asociación.
 *
 * La ventana se corta a 14 días para no volver a recorrer toda la base en cada
 * ejecución.
 */
export async function candidatosASetting(limite = 50): Promise<CandidatoSetting[]> {
  const ahora = Date.now();
  const hace24h = ahora - 24 * 60 * 60 * 1000;
  const hace14d = ahora - 14 * 24 * 60 * 60 * 1000;

  try {
    const res = await request("/crm/v3/objects/contacts/search", {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              { propertyName: "ss_calificacion", operator: "EQ", value: "califica" },
              { propertyName: "createdate", operator: "LTE", value: String(hace24h) },
              { propertyName: "createdate", operator: "GTE", value: String(hace14d) },
              { propertyName: "ss_setting_encolado", operator: "NOT_HAS_PROPERTY" },
            ],
          },
        ],
        properties: ["email", "firstname", "lastname", "company", "ss_rubro", "ss_cantidad_empleados", "ss_utm_content"],
        limit: limite,
      }),
    });

    if (!res.ok) {
      console.error("[hubspot] búsqueda de setting falló", res.status);
      return [];
    }
    const body = (await res.json()) as {
      results?: { id: string; properties: Record<string, string | null> }[];
    };

    return (body.results ?? []).map((c) => ({
      contactId: c.id,
      email: (c.properties.email ?? "").trim().toLowerCase(),
      nombre: [c.properties.firstname, c.properties.lastname].filter(Boolean).join(" ").trim(),
      empresa: c.properties.company ?? "",
      rubro: c.properties.ss_rubro ?? "",
      empleados: c.properties.ss_cantidad_empleados ?? "",
      utmContent: c.properties.ss_utm_content ?? "",
    }));
  } catch (err) {
    console.error("[hubspot] búsqueda de setting excepción", err);
    return [];
  }
}

/** ¿Este contacto ya tiene un negocio? Si lo tiene, agendó. */
export async function tieneNegocio(contactId: string): Promise<boolean> {
  try {
    const res = await request(`/crm/v4/objects/contacts/${contactId}/associations/deals`, {
      method: "GET",
    });
    if (!res.ok) return false;
    const body = (await res.json()) as { results?: unknown[] };
    return (body.results ?? []).length > 0;
  } catch {
    return false;
  }
}
