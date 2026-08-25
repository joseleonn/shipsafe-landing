/**
 * Las metas contra las que se compara cada número del dashboard.
 *
 * Todo esto sale de la "Tabla de control (semanal)" y de "Unit economics" del
 * playbook (plan-metaads-shipsafe.md). Son HIPÓTESIS de arranque, no promesas:
 * a los 14 días de campaña se reemplazan por los números reales. Este archivo
 * es el único lugar donde se tocan — el dashboard no tiene ninguna cifra
 * hardcodeada adentro.
 *
 * Cambiar un valor acá cambia qué se pinta como "en objetivo". No es cosmético.
 */

/** ARS por USD. Referencia del playbook al 24/08/2026 (oficial mayorista 1.499). */
export const TIPO_DE_CAMBIO = Number(process.env.DASHBOARD_ARS_POR_USD ?? 1500);

/** Ticket mensual del plan Empresa. */
export const TICKET_ARS = Number(process.env.META_VALOR_CLIENTE_ARS ?? 400_000);

export type Direccion = "mayor_mejor" | "menor_mejor";

export interface Meta {
  /** Rango esperado. El primer valor es el borde "bueno". */
  min?: number;
  max?: number;
  /** Límite duro. Cruzarlo no es "atención": es que el canal no cierra. */
  techo?: number;
  direccion: Direccion;
  /** Qué hacer si está mal. Sale de la última columna de la tabla del playbook. */
  diagnostico: string;
}

export const METAS: Record<string, Meta> = {
  cpm: {
    min: 2, max: 6, direccion: "menor_mejor",
    diagnostico: "Audiencia demasiado angosta o creativo penalizado.",
  },
  ctr: {
    min: 1, direccion: "mayor_mejor",
    diagnostico: "Es el ángulo, no el presupuesto.",
  },
  hookRate: {
    min: 25, direccion: "mayor_mejor",
    diagnostico: "Los primeros 3 segundos del video. Con hook alto y CTR bajo el gancho funciona y se cae después; con hook bajo no pasaron del primer plano.",
  },
  conversionLanding: {
    min: 15, max: 30, direccion: "mayor_mejor",
    diagnostico: "El titular de la landing no matchea el anuncio, o el formulario pide demasiado.",
  },
  cpl: {
    min: 2, max: 4, direccion: "menor_mejor",
    diagnostico: "Combinación de CTR y conversión de landing.",
  },
  leadAAgenda: {
    min: 8, max: 15, direccion: "mayor_mejor",
    diagnostico: "Si baja de 5%: criterios de calificación mal calibrados, o el calendario no se ve.",
  },
  costoPorAgenda: {
    min: 25, max: 50, techo: 160, direccion: "menor_mejor",
    diagnostico: "Es la métrica madre. Todo lo demás es diagnóstico.",
  },
  asistencia: {
    min: 80, max: 90, direccion: "mayor_mejor",
    diagnostico: "Playbook de asistencia flojo. Los recordatorios de WhatsApp son la palanca.",
  },
  demoACierre: {
    min: 15, max: 30, direccion: "mayor_mejor",
    diagnostico: "Calidad de lead o estructura de la llamada.",
  },
  cac: {
    max: 800, techo: 800, direccion: "menor_mejor",
    diagnostico: "Si lo superás, o subís el precio o revisás el embudo. El criterio que manda es recuperarlo antes de 90 días.",
  },
  ltvCac: {
    min: 3, direccion: "mayor_mejor",
    diagnostico: "Con 24 meses de retención el techo de CAC sería USD 2.100; manda el recupero a 90 días.",
  },
};

export type Estado = "bueno" | "atencion" | "malo" | "sin_datos";

export interface Evaluacion {
  estado: Estado;
  /** SIEMPRE se muestra como texto. El color solo acompaña: rojo y verde son
   *  indistinguibles con deuteranopía (ΔE 4,1 medido sobre este fondo). */
  etiqueta: string;
  diagnostico?: string;
}

export function evaluar(clave: string, valor: number | null): Evaluacion {
  const meta = METAS[clave];
  if (!meta || valor === null || !Number.isFinite(valor)) {
    return { estado: "sin_datos", etiqueta: "Sin datos" };
  }

  if (meta.techo !== undefined) {
    const cruzado = meta.direccion === "menor_mejor" ? valor > meta.techo : valor < meta.techo;
    if (cruzado) {
      return { estado: "malo", etiqueta: "Fuera de techo", diagnostico: meta.diagnostico };
    }
  }

  const dentro =
    (meta.min === undefined ||
      (meta.direccion === "mayor_mejor" ? valor >= meta.min : valor >= meta.min)) &&
    (meta.max === undefined ||
      (meta.direccion === "menor_mejor" ? valor <= meta.max : true));

  // Para "mayor mejor", superar el máximo es una buena noticia, no un problema.
  const superaPorArriba =
    meta.direccion === "mayor_mejor" && meta.max !== undefined && valor > meta.max;

  if (dentro || superaPorArriba) {
    return { estado: "bueno", etiqueta: "En objetivo" };
  }

  // Está afuera pero sin cruzar el techo: es una señal, no una alarma.
  return { estado: "atencion", etiqueta: "Fuera de rango", diagnostico: meta.diagnostico };
}

/** Texto del rango esperado, para mostrarlo al lado del número real. */
export function rangoTexto(clave: string, unidad: "usd" | "pct" | "x"): string | null {
  const meta = METAS[clave];
  if (!meta) return null;

  const fmt = (n: number) =>
    unidad === "usd" ? `USD ${n}` : unidad === "pct" ? `${n}%` : `${n}:1`;

  if (meta.min !== undefined && meta.max !== undefined) {
    return `Objetivo ${fmt(meta.min)} a ${fmt(meta.max)}`;
  }
  if (meta.min !== undefined) return `Objetivo ${fmt(meta.min)} o más`;
  if (meta.max !== undefined) return `Objetivo hasta ${fmt(meta.max)}`;
  return null;
}
