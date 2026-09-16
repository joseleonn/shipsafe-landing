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

/**
 * Un bloque de campañas que comparten destino.
 *
 * Existe porque la cuenta corre dos embudos distintos: las campañas que mandan
 * a la landing (formulario → filtro → Calendly) y la de comentarios a DM, que
 * no tiene enlace. Sumarlas para calcular CPM, hook rate o costo por lead
 * mezclaba peras con manzanas: la de DM aportaba casi la mitad del gasto y el
 * 80% de las impresiones a números que solo describen a la otra.
 */
export interface BloqueEntrega {
  /** Nombres de las campañas que caen en este bloque. */
  campanas: string[];
  gasto: number;
  impresiones: number;
  clicsEnlace: number;
  cpm: number | null;
  ctrEnlace: number | null;
  hookRate: number | null;
}

export interface DatosMeta {
  moneda: string;
  gasto: number;
  impresiones: number;
  clicsEnlace: number;
  /** CPM en la moneda de la cuenta. */
  cpm: number | null;
  /**
   * CTR de enlace en porcentaje, calculado SOLO sobre los anuncios que llevan
   * a un enlace. Es el que compara el playbook, no el CTR total.
   */
  ctrEnlace: number | null;
  /** Denominador real del CTR: impresiones de los anuncios que sí tienen enlace. */
  impresionesConEnlace: number | null;
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
  /** Campañas que mandan a la landing. Es el embudo que mide esta página. */
  landing: BloqueEntrega;
  /** El resto —hoy, comentarios a DM—. `null` si no hay ninguna. */
  otras: BloqueEntrega | null;
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
const accion = (v: unknown, tipo: string): number => {
  if (!Array.isArray(v) || v.length === 0) return 0;
  const fila = (v as { action_type?: unknown; value?: unknown }[]).find(
    (a) => String(a?.action_type ?? "") === tipo
  );
  return num(fila?.value);
};

/**
 * Vistas de 3 segundos. Meta dio de baja `video_3_sec_watched_actions` en la
 * Marketing API: pedirlo hacía fallar la consulta ENTERA con
 * "(#100) ... is not valid for fields param", así que el dashboard se quedaba
 * sin gasto, sin CPM y sin CTR por un campo que solo alimenta el hook rate.
 * Ahora sale del array `actions`, que es un campo estable, buscando el
 * action_type `video_view` (así llama Meta a la vista de 3 segundos). Si el
 * anuncio no es de video, no viene esa fila y el hook rate queda en null.
 */
const vistas3sDe = (fila: Record<string, unknown>): number =>
  accion(fila.actions, "video_view");

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
    // Cuatro consultas: el total, el desglose por campaña, el desglose por
    // anuncio y la serie diaria. Van en paralelo porque son independientes.
    const [total, porCampana, porAnuncio, porDia] = await Promise.all([
      pedir(`${act}/insights`, {
        fields: "spend,impressions,inline_link_clicks,cpm,account_currency,actions",
        time_range: rango,
        level: "account",
      }),
      pedir(`${act}/insights`, {
        fields: "campaign_name,spend,impressions,inline_link_clicks,cpm,actions",
        time_range: rango,
        level: "campaign",
        limit: "100",
      }),
      pedir(`${act}/insights`, {
        fields: "ad_name,spend,impressions,inline_link_clicks,actions",
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
    const vistas3s = vistas3sDe(t);

    const anuncios: EntregaAnuncio[] = porAnuncio
      .map((a) => ({
        nombre: String(a.ad_name ?? "sin nombre"),
        gasto: num(a.spend),
        impresiones: num(a.impressions),
        clicsEnlace: num(a.inline_link_clicks),
        vistas3s: vistas3sDe(a),
      }))
      .sort((a, b) => b.gasto - a.gasto);

    // Las campañas se parten en dos bloques según manden o no a un enlace.
    //
    // Mismo criterio que abajo para el CTR: "registró algún clic al enlace"
    // alcanza como proxy de "tiene enlace". Una campaña optimizada a ThruPlay
    // no lleva a ninguna parte y nunca junta clics, así que cae sola del otro
    // lado sin que haya que hardcodear su nombre.
    const campanas = porCampana.map((c) => ({
      nombre: String(c.campaign_name ?? "sin nombre"),
      gasto: num(c.spend),
      impresiones: num(c.impressions),
      clicsEnlace: num(c.inline_link_clicks),
      gastoPorMil: c.cpm !== undefined ? num(c.cpm) : null,
      vistas3s: vistas3sDe(c),
    }));

    const bloque = (grupo: typeof campanas): BloqueEntrega | null => {
      if (grupo.length === 0) return null;
      const impr = grupo.reduce((acc, c) => acc + c.impresiones, 0);
      const gasto = grupo.reduce((acc, c) => acc + c.gasto, 0);
      const clics = grupo.reduce((acc, c) => acc + c.clicsEnlace, 0);
      const v3s = grupo.reduce((acc, c) => acc + c.vistas3s, 0);
      return {
        campanas: grupo.map((c) => c.nombre),
        gasto,
        impresiones: impr,
        clicsEnlace: clics,
        // El CPM se recalcula sobre el bloque en vez de promediar los de Meta:
        // un promedio simple le daría el mismo peso a una campaña de 100
        // impresiones que a una de 10.000.
        cpm: impr > 0 ? (gasto / impr) * 1000 : null,
        ctrEnlace: impr > 0 && clics > 0 ? (clics / impr) * 100 : null,
        hookRate: v3s > 0 && impr > 0 ? (v3s / impr) * 100 : null,
      };
    };

    const landing = bloque(campanas.filter((c) => c.clicsEnlace > 0));
    const otras = bloque(campanas.filter((c) => c.clicsEnlace === 0));

    // El CTR de enlace se calcula solo sobre los anuncios que TIENEN enlace.
    //
    // Si no, un conjunto optimizado a ThruPlay —que no lleva a ninguna parte y
    // aporta miles de impresiones— hunde el número del resto. Pasó: 40 clics
    // sobre 10.023 impresiones daba 0,4% y disparaba "es el ángulo, no el
    // presupuesto", cuando el CTR real de los anuncios con enlace era 2,4%.
    //
    // "Registró algún clic" alcanza como proxy de "tiene enlace": un anuncio
    // con enlace y volumen real siempre junta alguno. El sesgo aparece solo con
    // un anuncio con enlace y cero clics, que a esa altura ya es su propia señal.
    const conEnlace = anuncios.filter((a) => a.clicsEnlace > 0);
    const impresionesConEnlace = conEnlace.reduce((acc, a) => acc + a.impresiones, 0);
    const clicsConEnlace = conEnlace.reduce((acc, a) => acc + a.clicsEnlace, 0);

    return {
      datos: {
        moneda: String(t.account_currency ?? "USD"),
        gasto: num(t.spend),
        impresiones,
        clicsEnlace,
        cpm: t.cpm !== undefined ? num(t.cpm) : null,
        ctrEnlace:
          impresionesConEnlace > 0
            ? (clicsConEnlace / impresionesConEnlace) * 100
            : null,
        impresionesConEnlace: impresionesConEnlace || null,
        hookRate:
          vistas3s > 0 && impresiones > 0 ? (vistas3s / impresiones) * 100 : null,
        landing: landing ?? {
          campanas: [],
          gasto: 0,
          impresiones: 0,
          clicsEnlace: 0,
          cpm: null,
          ctrEnlace: null,
          hookRate: null,
        },
        otras,
        porAnuncio: anuncios,
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
