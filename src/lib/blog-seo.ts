/**
 * Ajustes SEO de los artículos del blog que no viven en la base.
 *
 * - tituloSeo: el <title> que ve Google. El título del artículo (H1) puede ser
 *   largo; Google corta el <title> cerca de los 60 caracteres, así que acá va
 *   una versión corta con la palabra clave adelante. Se le suma " | SHIPSAFE".
 * - recursos: slugs de ARTICLES (páginas fijas) que se muestran como
 *   "Artículos relacionados". Es el link interno hacia la landing del tema.
 * - blog: slugs de otros artículos del blog para enlazar entre sí.
 *
 * Un artículo que no está acá funciona igual, con su título completo y sin
 * relacionados.
 */
export interface AjusteSeo {
  tituloSeo?: string;
  recursos?: string[];
  blog?: string[];
}

export const AJUSTES_SEO: Record<string, AjusteSeo> = {
  "constancia-entrega-epp-res-srt-299-11": {
    tituloSeo: "Constancia de entrega de EPP (Res. SRT 299/11) en digital",
    recursos: ["app-inspecciones-seguridad-qr", "software-seguridad-higiene-vs-excel"],
    blog: ["checklist-control-extintores"],
  },
  "como-justificar-compra-software-seguridad-higiene": {
    tituloSeo: "Cómo justificar la compra de un software de seguridad e higiene",
    recursos: ["software-seguridad-higiene-vs-excel", "mejores-software-seguridad-higiene-argentina"],
    blog: ["safetyculture-mitti-alternativas"],
  },
  "checklist-control-extintores": {
    tituloSeo: "Checklist de control de extintores (IRAM 3517-2)",
    recursos: ["app-inspecciones-seguridad-qr", "como-digitalizar-inspecciones-planta"],
    blog: ["revision-mensual-extintores-nom-002-stps", "checklist-vehicular-preuso"],
  },
  "revision-mensual-extintores-nom-002-stps": {
    tituloSeo: "Revisión mensual de extintores: NOM-002-STPS-2010",
    recursos: ["app-inspecciones-seguridad-qr", "como-digitalizar-inspecciones-planta"],
    blog: ["checklist-control-extintores"],
  },
  "checklist-vehicular-preuso": {
    tituloSeo: "Checklist vehicular de preuso: qué revisar y cómo registrarlo",
    recursos: ["app-inspecciones-seguridad-qr", "gestion-desvios-seguridad-industrial"],
    blog: ["checklist-control-extintores"],
  },
  "safetyculture-mitti-alternativas": {
    tituloSeo: "SafetyCulture ahora es Mitti: qué cambió y alternativas",
    recursos: ["mejores-software-seguridad-higiene-argentina", "software-sg-sst"],
    blog: ["como-justificar-compra-software-seguridad-higiene"],
  },
  "estandares-minimos-sg-sst-resolucion-0312": {
    tituloSeo: "Estándares mínimos del SG-SST (Resolución 0312 de 2019)",
    recursos: ["software-sg-sst", "app-inspecciones-seguridad-qr"],
    blog: ["checklist-vehicular-preuso"],
  },
  "nom-035-stps-2018-que-pide-segun-trabajadores": {
    tituloSeo: "NOM-035-STPS-2018: qué pide según el número de trabajadores",
    recursos: ["gestion-desvios-seguridad-industrial"],
    blog: ["revision-mensual-extintores-nom-002-stps"],
  },
};
