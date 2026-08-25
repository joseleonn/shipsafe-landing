/**
 * Los números del embudo, leídos de HubSpot.
 *
 * Dos fuentes distintas y es importante entender por qué:
 *
 *   - Los LEADS salen de contactos. Quien descarga el recurso y no califica
 *     nunca genera un negocio, así que si contáramos leads con negocios nos
 *     faltaría justo la gente que el filtro descarta — que es la mitad del
 *     diagnóstico.
 *   - Todo lo que pasa DESPUÉS de agendar sale de negocios, porque las etapas
 *     y sus fechas viven ahí.
 *
 * El criterio de conteo es de cohorte: "de la gente que entró en este período,
 * cuántos llegaron hasta cada etapa". No es "cuántos pasaron por esa etapa en
 * este período". La cohorte es la que sirve para juzgar una campaña; la otra
 * mezcla leads de agosto que cierran en octubre.
 */

import { etapasDelPipeline } from "../hubspot-deals";

const BASE_URL = "https://api.hubapi.com";

/** Orden real del pipeline. Define qué significa "llegó hasta". */
export const ORDEN_ETAPAS = [
  "Lead",
  "Demo agendada",
  "Demo realizada",
  "Pricing enviado",
  "Prueba guiada en curso",
  "Decisión",
  "Ganado",
] as const;

export const ETAPA_PERDIDO = "Perdido";

export interface Lead {
  creado: number;
  califica: boolean;
  utmContent: string | null;
  leadMagnet: string | null;
}

export interface Negocio {
  creado: number;
  etapa: string;
  monto: number | null;
  utmContent: string | null;
  /** Etiquetas de etapa por las que pasó, según hs_date_entered_*. */
  alcanzo: Set<string>;
  /**
   * Cuándo entró a cada etapa, en epoch ms. Solo fechas reales de HubSpot:
   * a diferencia de `alcanzo`, acá no hay relleno por deducción, porque una
   * fecha inventada arruinaría la mediana del ciclo de venta.
   */
  fechas: Record<string, number>;
}

export interface DatosHubSpot {
  leads: Lead[];
  negocios: Negocio[];
  /** Se llena si HubSpot respondió mal. El dashboard lo muestra en vez de mentir. */
  error: string | null;
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
    cache: "no-store",
  });
}

/** Tope de páginas. 1.000 registros por objeto alcanza y sobra para este canal. */
const MAX_PAGINAS = 10;

interface ResultadoCrm {
  id: string;
  properties: Record<string, string | null>;
}

async function buscarTodo(
  objeto: "contacts" | "deals",
  filtros: { propertyName: string; operator: string; value?: string }[],
  properties: string[]
): Promise<ResultadoCrm[]> {
  const todos: ResultadoCrm[] = [];
  let after: string | undefined;

  for (let pagina = 0; pagina < MAX_PAGINAS; pagina++) {
    const res = await request(`/crm/v3/objects/${objeto}/search`, {
      method: "POST",
      body: JSON.stringify({
        filterGroups: [{ filters: filtros }],
        properties,
        limit: 100,
        ...(after ? { after } : {}),
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      throw new Error(`hubspot_${objeto}_${res.status}: ${detalle.slice(0, 200)}`);
    }

    const body = (await res.json()) as {
      results?: ResultadoCrm[];
      paging?: { next?: { after?: string } };
    };

    todos.push(...(body.results ?? []));
    after = body.paging?.next?.after;
    if (!after) break;
  }

  return todos;
}

function aMillis(valor: string | null | undefined): number {
  if (!valor) return 0;
  const n = Number(valor);
  if (Number.isFinite(n) && n > 1e11) return n; // ya venía en epoch ms
  const t = Date.parse(valor);
  return Number.isFinite(t) ? t : 0;
}

export async function leerHubSpot(desde: number, hasta: number): Promise<DatosHubSpot> {
  const vacio: DatosHubSpot = { leads: [], negocios: [], error: null };

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    return { ...vacio, error: "Falta HUBSPOT_ACCESS_TOKEN en las variables de entorno." };
  }

  try {
    // 1. Las etapas, para saber qué propiedades hs_date_entered_* pedir.
    const etapas = await etapasDelPipeline();
    const idPorEtiqueta = new Map<string, string>();
    for (const [id, etiqueta] of etapas) idPorEtiqueta.set(etiqueta.trim(), id);

    const propsFecha = Array.from(etapas.keys()).map((id) => `hs_date_entered_${id}`);

    // 2. Leads: contactos que entraron por un recurso del embudo.
    const contactos = await buscarTodo(
      "contacts",
      [
        { propertyName: "createdate", operator: "GTE", value: String(desde) },
        { propertyName: "createdate", operator: "LTE", value: String(hasta) },
        { propertyName: "ss_lead_magnet", operator: "HAS_PROPERTY" },
      ],
      ["createdate", "ss_calificacion", "ss_utm_content", "ss_lead_magnet"]
    );

    const leads: Lead[] = contactos.map((c) => ({
      creado: aMillis(c.properties.createdate),
      califica: c.properties.ss_calificacion === "califica",
      utmContent: c.properties.ss_utm_content?.trim() || null,
      leadMagnet: c.properties.ss_lead_magnet?.trim() || null,
    }));

    // 3. Negocios del pipeline creados en el período.
    const pipelineId = process.env.HUBSPOT_PIPELINE_ID;
    let negocios: Negocio[] = [];

    if (pipelineId) {
      const deals = await buscarTodo(
        "deals",
        [
          { propertyName: "pipeline", operator: "EQ", value: pipelineId },
          { propertyName: "createdate", operator: "GTE", value: String(desde) },
          { propertyName: "createdate", operator: "LTE", value: String(hasta) },
        ],
        ["createdate", "dealstage", "amount", "ss_utm_content", ...propsFecha]
      );

      negocios = deals.map((d) => {
        const alcanzo = new Set<string>();
        const fechas: Record<string, number> = {};
        for (const [id, etiqueta] of etapas) {
          const crudo = d.properties[`hs_date_entered_${id}`];
          if (crudo) {
            alcanzo.add(etiqueta.trim());
            const t = aMillis(crudo);
            if (t > 0) fechas[etiqueta.trim()] = t;
          }
        }

        // Red de seguridad: si por lo que sea falta hs_date_entered_, damos por
        // alcanzada la etapa actual y todas las anteriores. Sin esto, un negocio
        // recién movido a mano podría no contarse en ninguna parte.
        const etiquetaActual = etapas.get(d.properties.dealstage ?? "")?.trim();
        if (etiquetaActual) {
          const i = ORDEN_ETAPAS.indexOf(etiquetaActual as (typeof ORDEN_ETAPAS)[number]);
          if (i >= 0) for (let k = 0; k <= i; k++) alcanzo.add(ORDEN_ETAPAS[k]);
          else alcanzo.add(etiquetaActual);
        }

        return {
          creado: aMillis(d.properties.createdate),
          etapa: etiquetaActual ?? "",
          monto: d.properties.amount ? Number(d.properties.amount) : null,
          utmContent: d.properties.ss_utm_content?.trim() || null,
          alcanzo,
          fechas,
        };
      });
    }

    return { leads, negocios, error: null };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "error desconocido";
    console.error("[dashboard] HubSpot falló:", mensaje);
    return { ...vacio, error: `No pude leer HubSpot: ${mensaje}` };
  }
}
