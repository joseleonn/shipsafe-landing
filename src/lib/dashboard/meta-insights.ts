/**
 * Gasto y entrega de los anuncios, leídos de la Marketing API de Meta.
 *
 * OJO con el token: NO sirve el de la API de Conversiones. Ese solo escribe
 * eventos. Para leer cuánto gastaste hace falta uno con permiso `ads_read`
 * sobre la cuenta publicitaria. Son dos tokens distintos y conviven sin
 * problema — ver docs/dashboard.md.
 *
 * Si falta la configuración esto NO rompe el dashboard: devuelve `null` y la
 * página muestra el embudo sin las métricas de costo, diciendo por qué.
 */

const API_VERSION = "v21.0";

export interface EntregaAnuncio {
  nombre: string;
  gasto: number;
  impresiones: number;
  clicsEnlace: number;
  /** Reproducciones de 3 segundos. 0 si el anuncio no es de video. */
  vistas3s: number;
}

export interface DatosMeta {
  moneda: string;
  gasto: number;
  impresiones: number;
  clicsEnlace: number;
  /** CPM en la moneda de la cuenta. */
  cpm: number | null;
  /** CTR de enlace en porcentaje. Es el que compara el playbook, no el CTR total. */
  ctrEnlace: number | null;
  /**
   * Reproducciones de 3 segundos sobre impresiones, en porcentaje.
   *
   * Es el que separa "el problema son los primeros 3 segundos" de "el problema
   * es el resto del anuncio": con hook alto y CTR bajo, el gancho funciona y se
   * cae después; con hook bajo, no pasaron del primer plano.
   *
   * `null` si no hay anuncios de video en el período.
   */
  hookRate: number | null;
  porAnuncio: EntregaAnuncio[];
  /** Gasto por día, para la línea de tiempo. Clave: YYYY-MM-DD. */
  porDia: Record<string, number>;
}

export interface ResultadoMeta {
  datos: DatosMeta | null;
  /** Por qué no hay datos. Se muestra tal cual en la página. */
  aviso: string | null;
}

function cuenta(): string | null {
  const id = process.env.META_AD_ACCOUNT_ID?.trim();
  if (!id) return null;
  return id.startsWith("act_") ? id : `act_${id}`;
}

function aFecha(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

async function pedir(
  ruta: string,
  params: Record<string, string>
): Promise<Record<string, unknown>[]> {
  const token = process.env.META_ADS_TOKEN!;
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${ruta}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("access_token", token);

  const res = await fetch(url.toString(), { cache: "no-store" });
  const body = (await res.json()) as {
    data?: Record<string, unknown>[];
    error?: { message?: string; code?: number };
  };

  if (!res.ok || body.error) {
    const msg = body.error?.message ?? `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body.data ?? [];
}

const num = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Las métricas de video no vienen como número sino como un array de acciones:
 *   [{ action_type: "video_view", value: "1234" }]
 * Si el anuncio no es de video, el campo directamente no viene.
 */
const accion = (v: unknown): number => {
  if (!Array.isArray(v) || v.length === 0) return 0;
  const primera = v[0] as { value?: unknown };
  return num(primera?.value);
};

export async function leerMeta(desde: number, hasta: number): Promise<ResultadoMeta> {
  const act = cuenta();

  if (!process.env.META_ADS_TOKEN || !act) {
    return {
      datos: null,
      aviso:
        "Faltan META_ADS_TOKEN y META_AD_ACCOUNT_ID. Sin ellos el dashboard muestra el embudo pero no el costo: no hay CPL, ni CAC, ni retorno.",
    };
  }

  const rango = JSON.stringify({ since: aFecha(desde), until: aFecha(hasta) });

  try {
    // Tres consultas: el total, el desglose por anuncio y la serie diaria.
    // Van en paralelo porque son independientes entre sí.
    const [total, porAnuncio, porDia] = await Promise.all([
      pedir(`${act}/insights`, {
        fields: "spend,impressions,inline_link_clicks,cpm,account_currency,video_3_sec_watched_actions",
        time_range: rango,
        level: "account",
      }),
      pedir(`${act}/insights`, {
        fields: "ad_name,spend,impressions,inline_link_clicks,video_3_sec_watched_actions",
        time_range: rango,
        level: "ad",
        limit: "200",
      }),
      pedir(`${act}/insights`, {
        fields: "spend",
        time_range: rango,
        level: "account",
        time_increment: "1",
      }),
    ]);

    const t = total[0] ?? {};
    const impresiones = num(t.impressions);
    const clicsEnlace = num(t.inline_link_clicks);
    const vistas3s = accion(t.video_3_sec_watched_actions);

    return {
      datos: {
        moneda: String(t.account_currency ?? "USD"),
        gasto: num(t.spend),
        impresiones,
        clicsEnlace,
        cpm: t.cpm !== undefined ? num(t.cpm) : null,
        ctrEnlace: impresiones > 0 ? (clicsEnlace / impresiones) * 100 : null,
        hookRate:
          vistas3s > 0 && impresiones > 0 ? (vistas3s / impresiones) * 100 : null,
        porAnuncio: porAnuncio
          .map((a) => ({
            nombre: String(a.ad_name ?? "sin nombre"),
            gasto: num(a.spend),
            impresiones: num(a.impressions),
            clicsEnlace: num(a.inline_link_clicks),
            vistas3s: accion(a.video_3_sec_watched_actions),
          }))
          .sort((a, b) => b.gasto - a.gasto),
        porDia: Object.fromEntries(
          porDia.map((d) => [String(d.date_start ?? ""), num(d.spend)])
        ),
      },
      aviso: null,
    };
  } catch (err) {
    const mensaje = err instanceof Error ? err.message : "error desconocido";
    console.error("[dashboard] Meta Ads falló:", mensaje);
    return {
      datos: null,
      aviso: `No pude leer la cuenta publicitaria: ${mensaje}. Si dice algo de permisos, al token le falta ads_read.`,
    };
  }
}
