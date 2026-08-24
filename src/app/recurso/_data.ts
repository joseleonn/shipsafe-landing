/**
 * Recursos (lead magnets) del embudo de Meta Ads.
 *
 * PENDIENTE: José lo define con Walter. Hasta entonces, `carpeta-auditoria`
 * queda como candidato principal con el copy ya escrito y `archivoListo: false`,
 * así la página se puede ver y ajustar sin que exista todavía el PDF.
 *
 * Para activar un recurso hacen falta dos cosas:
 *   1. Dejar el archivo en public/recursos/<archivo>
 *   2. Poner `archivoListo: true`
 *
 * Para cambiar de lead magnet NO se toca ningún componente: se edita este
 * objeto. Esa es toda la gracia de tenerlo separado.
 */

export interface Recurso {
  slug: string;
  /** Se muestra arriba de todo, chiquito. Nombra a quién le hablamos. */
  kicker: string;
  titulo: string;
  subtitulo: string;
  /** 3 a 5 bullets de qué se lleva. Concretos, nada de "aprendé sobre..." */
  incluye: string[];
  /** Texto del botón del formulario */
  cta: string;
  /** Nombre del archivo dentro de public/recursos/ */
  archivo: string;
  archivoListo: boolean;
  /** Metadata para el <head> */
  metaTitle: string;
  metaDescription: string;
}

export const RECURSOS: Record<string, Recurso> = {
  "checklists-planta": {
    slug: "checklists-planta",
    kicker: "Para responsables de Seguridad e Higiene",
    titulo: "10 checklists listos para usar en planta, y qué hacer con cada No OK",
    subtitulo:
      "Los checklists son la parte fácil. Lo difícil empieza cuando algo da No OK: quién se hace cargo, en cuánto tiempo, con qué evidencia se cierra y quién verifica. Acá van los diez que más se usan, y el criterio para que ninguno quede anotado y sin cerrar.",
    incluye: [
      "Los 10 checklists completos, listos para imprimir o cargar en tu sistema",
      "Qué mirar en cada punto, no solo qué tildar",
      "Los tres ítems que más se pasan por alto en cada uno",
      "Qué hacer cuando algo da No OK: responsable, plazo, evidencia y verificación",
      "Cómo armar tus propios checklists sin que queden en una lista de deseos",
    ],
    cta: "Quiero los 10 checklists",
    archivo: "checklists-planta.pdf",
    archivoListo: true,
    metaTitle: "10 checklists de seguridad para planta | SHIPSAFE",
    metaDescription:
      "Diez checklists de inspección listos para usar en planta, con qué mirar en cada punto y qué hacer cuando algo da No OK.",
  },

  "carpeta-auditoria": {
    slug: "carpeta-auditoria",
    kicker: "Para responsables de Seguridad e Higiene",
    titulo: "La carpeta de auditoría: qué te van a pedir y en qué orden",
    subtitulo:
      "Te avisan una auditoría y arrancan tres días de juntar papeles. No es que no lo hiciste: es que está todo desparramado. Esta guía ordena qué documentación se pide, cómo conviene tenerla y qué es lo primero que miran.",
    incluye: [
      "El listado de documentación agrupado por tema, no por norma suelta",
      "Qué se revisa primero y por qué",
      "Los registros que más veces aparecen incompletos",
      "Una checklist para imprimir y usar el día de la auditoría",
    ],
    cta: "Quiero la guía",
    archivo: "carpeta-auditoria.pdf",
    archivoListo: false,
    metaTitle: "Carpeta de auditoría de Seguridad e Higiene | SHIPSAFE",
    metaDescription:
      "Guía práctica con la documentación que se pide en una auditoría de seguridad e higiene, ordenada por tema y lista para usar.",
  },

  "control-vencimientos": {
    slug: "control-vencimientos",
    kicker: "Para responsables de Seguridad e Higiene",
    titulo: "Planilla de control de vencimientos",
    subtitulo:
      "Mediciones, capacitaciones, habilitaciones y entregas de EPP en una sola planilla, con las fechas calculadas y el aviso antes de que se venza. No después.",
    incluye: [
      "Vencimientos de mediciones, capacitaciones y habilitaciones en una vista",
      "Alertas automáticas por fórmula, sin macros",
      "Columna de responsable para que cada vencimiento tenga dueño",
      "Hoja aparte para el histórico, que es lo que después te piden",
    ],
    cta: "Quiero la planilla",
    archivo: "control-vencimientos.xlsx",
    archivoListo: false,
    metaTitle: "Planilla de control de vencimientos SST | SHIPSAFE",
    metaDescription:
      "Planilla para controlar vencimientos de mediciones, capacitaciones, habilitaciones y EPP, con alertas y responsable asignado.",
  },
};

/** El que está corriendo en campaña ahora. Se cambia acá y en el anuncio. */
export const RECURSO_ACTIVO = "checklists-planta";

export function getRecurso(slug: string): Recurso | null {
  return RECURSOS[slug] ?? null;
}

export const CALENDLY_URL = "https://calendly.com/shipsoftwareteam/30min";
