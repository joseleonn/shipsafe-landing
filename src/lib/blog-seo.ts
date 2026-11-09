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
 * - pais: para el filtro y el orden por país de /blog. Sin pais cuenta como LATAM.
 *
 * Un artículo que no está acá funciona igual, con su título completo y sin
 * relacionados.
 */
/** Países de Latinoamérica para el filtro de /blog (código ISO, como lo manda Vercel). */
export const PAISES = {
  AR: "Argentina",
  BO: "Bolivia",
  CL: "Chile",
  CO: "Colombia",
  CR: "Costa Rica",
  EC: "Ecuador",
  SV: "El Salvador",
  GT: "Guatemala",
  HN: "Honduras",
  MX: "México",
  NI: "Nicaragua",
  PA: "Panamá",
  PY: "Paraguay",
  PE: "Perú",
  DO: "República Dominicana",
  UY: "Uruguay",
  VE: "Venezuela",
} as const;

export type CodigoPais = keyof typeof PAISES;

/** País al que apunta el artículo. "LATAM" = sirve para cualquiera. */
export type PaisBlog = CodigoPais | "LATAM";

export const NOMBRE_PAIS: Record<PaisBlog, string> = { ...PAISES, LATAM: "Latinoamérica" };

export const esCodigoPais = (v: string | null | undefined): v is CodigoPais =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(PAISES, v);

export interface AjusteSeo {
  pais?: PaisBlog;
  /** Imagen para compartir (og:image), ruta dentro de /public. Sin esto se usa /og-image.png. */
  imagen?: { url: string; width: number; height: number };
  tituloSeo?: string;
  recursos?: string[];
  blog?: string[];
}

export const AJUSTES_SEO: Record<string, AjusteSeo> = {
  "constancia-entrega-epp-res-srt-299-11": {
    pais: "AR",
    tituloSeo: "Constancia de entrega de EPP (Res. SRT 299/11) en digital",
    recursos: ["app-inspecciones-seguridad-qr", "software-seguridad-higiene-vs-excel"],
    blog: ["checklist-control-extintores"],
  },
  "como-justificar-compra-software-seguridad-higiene": {
    pais: "LATAM",
    tituloSeo: "Cómo justificar la compra de un software de seguridad e higiene",
    recursos: ["software-seguridad-higiene-vs-excel", "mejores-software-seguridad-higiene-argentina"],
    blog: ["safetyculture-mitti-alternativas"],
  },
  "checklist-control-extintores": {
    pais: "AR",
    tituloSeo: "Checklist de control de extintores (IRAM 3517-2)",
    recursos: ["app-inspecciones-seguridad-qr", "como-digitalizar-inspecciones-planta"],
    blog: ["revision-mensual-extintores-nom-002-stps", "checklist-vehicular-preuso"],
  },
  "revision-mensual-extintores-nom-002-stps": {
    pais: "MX",
    tituloSeo: "Revisión mensual de extintores: NOM-002-STPS-2010",
    recursos: ["app-inspecciones-seguridad-qr", "como-digitalizar-inspecciones-planta"],
    blog: ["checklist-control-extintores"],
  },
  "checklist-vehicular-preuso": {
    pais: "LATAM",
    tituloSeo: "Checklist vehicular de preuso: qué revisar y cómo registrarlo",
    recursos: ["app-inspecciones-seguridad-qr", "gestion-desvios-seguridad-industrial"],
    blog: ["checklist-control-extintores"],
  },
  "safetyculture-mitti-alternativas": {
    pais: "LATAM",
    tituloSeo: "SafetyCulture ahora es Mitti: qué cambió y alternativas",
    recursos: ["mejores-software-seguridad-higiene-argentina", "software-sg-sst"],
    blog: ["como-justificar-compra-software-seguridad-higiene"],
  },
  "estandares-minimos-sg-sst-resolucion-0312": {
    pais: "CO",
    tituloSeo: "Estándares mínimos del SG-SST (Resolución 0312 de 2019)",
    recursos: ["software-sg-sst", "app-inspecciones-seguridad-qr"],
    blog: ["checklist-vehicular-preuso"],
  },
  "nom-035-stps-2018-que-pide-segun-trabajadores": {
    pais: "MX",
    tituloSeo: "NOM-035-STPS-2018: qué pide según el número de trabajadores",
    recursos: ["gestion-desvios-seguridad-industrial"],
    blog: ["revision-mensual-extintores-nom-002-stps"],
  },
  "matriz-de-riesgos-iperc-plantilla-excel": {
    pais: "LATAM",
    tituloSeo: "Matriz de riesgos (IPERC): guía y plantilla en Excel",
    imagen: { url: "/blog/matriz-de-riesgos/mapa.webp", width: 1200, height: 731 },
    recursos: ["app-inspecciones-seguridad-qr", "gestion-desvios-seguridad-industrial"],
    blog: ["estandares-minimos-sg-sst-resolucion-0312", "checklist-vehicular-preuso"],
  },
};
