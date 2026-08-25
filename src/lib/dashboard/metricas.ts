/**
 * Donde se juntan las dos fuentes y salen los números que se miran.
 *
 * Regla que atraviesa todo el archivo: si un dato no está, el resultado es
 * `null` y la página dice "sin datos". Nunca cero. Un cero se lee como "salió
 * mal" y un null se lee como "todavía no sé", que es la verdad durante las dos
 * primeras semanas de campaña.
 */

import { leerHubSpot, ORDEN_ETAPAS, type DatosHubSpot } from "./hubspot-metricas";
import { leerMeta, type ResultadoMeta } from "./meta-insights";
import { TICKET_ARS, TIPO_DE_CAMBIO } from "./metas";

export const PERIODOS = {
  "7d": { label: "Últimos 7 días", dias: 7 },
  "30d": { label: "Últimos 30 días", dias: 30 },
  "90d": { label: "Últimos 90 días", dias: 90 },
  todo: { label: "Todo", dias: 3650 },
} as const;

export type ClavePeriodo = keyof typeof PERIODOS;

export function esPeriodo(v: string | undefined): v is ClavePeriodo {
  return v !== undefined && v in PERIODOS;
}

/**
 * Meses de retención que se asumen para calcular el LTV.
 *
 * Es una HIPÓTESIS: con un cliente no hay dato de retención. El playbook usa 24
 * meses y de ahí sale el techo alternativo de CAC de USD 2.100 — que igual no
 * manda, porque el criterio que manda es recuperar el CAC antes de 90 días.
 */
const MESES_RETENCION = Number(process.env.DASHBOARD_MESES_RETENCION ?? 24);

function dividir(a: number | null, b: number | null): number | null {
  if (a === null || b === null || !Number.isFinite(a) || !Number.isFinite(b) || b === 0) {
    return null;
  }
  return a / b;
}

function porcentaje(parte: number, total: number): number | null {
  if (total <= 0) return null;
  return (parte / total) * 100;
}

export interface EtapaEmbudo {
  etiqueta: string;
  cantidad: number;
  /** Conversión desde la etapa anterior, en porcentaje. */
  desdeAnterior: number | null;
}

export interface FilaCreativo {
  nombre: string;
  gastoUsd: number | null;
  leads: number;
  calificados: number;
  agendadas: number;
  ganados: number;
  cplUsd: number | null;
  /** true si el nombre vino de Meta y no matcheó ningún utm_content, o al revés. */
  soloUnLado: "meta" | "hubspot" | null;
}

export interface Metricas {
  periodo: ClavePeriodo;
  desde: number;
  hasta: number;

  // Inversión
  moneda: string;
  gastoUsd: number | null;
  impresiones: number | null;
  cpmUsd: number | null;
  ctrEnlace: number | null;
  clicsEnlace: number | null;

  // Embudo
  embudo: EtapaEmbudo[];
  leads: number;
  calificados: number;
  agendadas: number;
  realizadas: number;
  pruebas: number;
  ganados: number;

  // Costos y tasas
  conversionLanding: number | null;
  cplUsd: number | null;
  leadAAgenda: number | null;
  costoPorAgendaUsd: number | null;
  asistencia: number | null;
  demoACierre: number | null;
  cacUsd: number | null;
  ltvCac: number | null;
  facturacionArs: number | null;

  // Detalle
  porCreativo: FilaCreativo[];
  serie: { fecha: string; leads: number; gastoUsd: number | null }[];

  // Estado de las fuentes
  errorHubSpot: string | null;
  avisoMeta: string | null;
  calculadoEn: number;
}

/** Normaliza para poder cruzar el nombre del anuncio con el utm_content. */
function clave(nombre: string): string {
  return nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function calcularMetricas(periodo: ClavePeriodo): Promise<Metricas> {
  const hasta = Date.now();
  const desde = hasta - PERIODOS[periodo].dias * 24 * 60 * 60 * 1000;

  const [hs, meta]: [DatosHubSpot, ResultadoMeta] = await Promise.all([
    leerHubSpot(desde, hasta),
    leerMeta(desde, hasta),
  ]);

  // ── Inversión, siempre convertida a USD para poder compararla con las metas
  const aUsd = (n: number | null): number | null => {
    if (n === null || !meta.datos) return null;
    return meta.datos.moneda === "USD" ? n : n / TIPO_DE_CAMBIO;
  };

  const gastoUsd = meta.datos ? aUsd(meta.datos.gasto) : null;

  // ── Embudo
  const leads = hs.leads.length;
  const calificados = hs.leads.filter((l) => l.califica).length;

  const llegaron = (etiqueta: string) =>
    hs.negocios.filter((n) => n.alcanzo.has(etiqueta)).length;

  const agendadas = llegaron("Demo agendada");
  const realizadas = llegaron("Demo realizada");
  const pruebas = llegaron("Prueba guiada en curso");
  const ganados = llegaron("Ganado");

  const cantidades: Record<string, number> = { Lead: leads };
  for (const etiqueta of ORDEN_ETAPAS) {
    if (etiqueta !== "Lead") cantidades[etiqueta] = llegaron(etiqueta);
  }

  const embudo: EtapaEmbudo[] = ORDEN_ETAPAS.map((etiqueta, i) => {
    const cantidad = cantidades[etiqueta] ?? 0;
    const anterior = i === 0 ? null : (cantidades[ORDEN_ETAPAS[i - 1]] ?? 0);
    return {
      etiqueta,
      cantidad,
      desdeAnterior: anterior === null ? null : porcentaje(cantidad, anterior),
    };
  });

  // ── Facturación: la suma real de los negocios ganados. Si están sin monto
  //    cargado, se estima con el ticket, y se avisa en la página.
  const montos = hs.negocios
    .filter((n) => n.alcanzo.has("Ganado"))
    .map((n) => n.monto)
    .filter((m): m is number => m !== null && m > 0);

  const facturacionArs =
    ganados === 0 ? null : montos.length > 0 ? montos.reduce((a, b) => a + b, 0) : ganados * TICKET_ARS;

  const ticketUsd = TICKET_ARS / TIPO_DE_CAMBIO;
  const cacUsd = dividir(gastoUsd, ganados || null);

  // ── Por creativo: se cruza el nombre del anuncio en Meta con el utm_content
  //    que quedó guardado en HubSpot. Lo que no matchea NO se descarta: se
  //    muestra marcado, porque un anuncio que gasta y no trae leads atribuidos
  //    es exactamente lo que hay que ver.
  const filas = new Map<string, FilaCreativo>();
  const tomar = (nombre: string): FilaCreativo => {
    const k = clave(nombre);
    let fila = filas.get(k);
    if (!fila) {
      fila = {
        nombre,
        gastoUsd: null,
        leads: 0,
        calificados: 0,
        agendadas: 0,
        ganados: 0,
        cplUsd: null,
        soloUnLado: null,
      };
      filas.set(k, fila);
    }
    return fila;
  };

  const vistoEnMeta = new Set<string>();
  for (const anuncio of meta.datos?.porAnuncio ?? []) {
    const fila = tomar(anuncio.nombre);
    fila.gastoUsd = aUsd(anuncio.gasto);
    vistoEnMeta.add(clave(anuncio.nombre));
  }

  const vistoEnHubSpot = new Set<string>();
  for (const lead of hs.leads) {
    if (!lead.utmContent) continue;
    const fila = tomar(lead.utmContent);
    fila.leads += 1;
    if (lead.califica) fila.calificados += 1;
    vistoEnHubSpot.add(clave(lead.utmContent));
  }
  for (const negocio of hs.negocios) {
    if (!negocio.utmContent) continue;
    const fila = tomar(negocio.utmContent);
    if (negocio.alcanzo.has("Demo agendada")) fila.agendadas += 1;
    if (negocio.alcanzo.has("Ganado")) fila.ganados += 1;
    vistoEnHubSpot.add(clave(negocio.utmContent));
  }

  for (const [k, fila] of filas) {
    fila.cplUsd = dividir(fila.gastoUsd, fila.leads || null);
    const enMeta = vistoEnMeta.has(k);
    const enHubSpot = vistoEnHubSpot.has(k);
    fila.soloUnLado = enMeta && enHubSpot ? null : enMeta ? "meta" : "hubspot";
  }

  // ── Serie diaria
  const leadsPorDia = new Map<string, number>();
  for (const lead of hs.leads) {
    if (!lead.creado) continue;
    const f = new Date(lead.creado).toISOString().slice(0, 10);
    leadsPorDia.set(f, (leadsPorDia.get(f) ?? 0) + 1);
  }

  const serie: Metricas["serie"] = [];
  const dias = Math.min(PERIODOS[periodo].dias, 90);
  for (let i = dias - 1; i >= 0; i--) {
    const f = new Date(hasta - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const gastoDia = meta.datos?.porDia[f];
    serie.push({
      fecha: f,
      leads: leadsPorDia.get(f) ?? 0,
      gastoUsd: gastoDia === undefined ? null : aUsd(gastoDia),
    });
  }

  return {
    periodo,
    desde,
    hasta,
    moneda: meta.datos?.moneda ?? "USD",
    gastoUsd,
    impresiones: meta.datos?.impresiones ?? null,
    cpmUsd: meta.datos?.cpm !== undefined && meta.datos !== null ? aUsd(meta.datos.cpm) : null,
    ctrEnlace: meta.datos?.ctrEnlace ?? null,
    clicsEnlace: meta.datos?.clicsEnlace ?? null,
    embudo,
    leads,
    calificados,
    agendadas,
    realizadas,
    pruebas,
    ganados,
    conversionLanding: meta.datos?.clicsEnlace ? porcentaje(leads, meta.datos.clicsEnlace) : null,
    cplUsd: dividir(gastoUsd, leads || null),
    leadAAgenda: porcentaje(agendadas, leads),
    costoPorAgendaUsd: dividir(gastoUsd, agendadas || null),
    asistencia: porcentaje(realizadas, agendadas),
    demoACierre: porcentaje(ganados, realizadas),
    cacUsd,
    ltvCac: dividir(ticketUsd * MESES_RETENCION, cacUsd),
    facturacionArs,
    porCreativo: Array.from(filas.values()).sort(
      (a, b) => (b.gastoUsd ?? 0) - (a.gastoUsd ?? 0) || b.leads - a.leads
    ),
    serie,
    errorHubSpot: hs.error,
    avisoMeta: meta.aviso,
    calculadoEn: Date.now(),
  };
}
