/**
 * Copy y medios de la HOME v5 (24/10/2026).
 *
 * Qué cambió respecto de v4 (home-content.ts):
 *  - Posicionamiento: plataforma de SST para toda Latinoamérica, no solo
 *    Argentina. Por eso el copy de la home está en español neutro ("Agenda",
 *    "Pruébalo"), no en voseo.
 *  - Mucho menos texto: título de sección y, como mucho, una línea debajo.
 *    Los módulos van solo con su nombre; el detalle de cada uno vive en
 *    /plataforma (que reutiliza las secciones de la v4).
 *  - Personas: video de los fundadores, fotos reales y testimonio en video
 *    cuando estén. Mientras no estén, cada sección muestra capturas reales
 *    del producto (nunca un recuadro vacío en producción).
 *
 * Para activar un video, completá su entrada en MEDIA con la ruta del mp4
 * (en /public/video/) y su póster. Nada más que tocar.
 */

export type Video = { src: string; poster: string } | null;

export const MEDIA: {
  /** Hero: José y Walter a cámara, 60 a 90 s, con subtítulos quemados. */
  founderVideo: Video;
  /** "Cada hallazgo, hasta el cierre": screen recording real en loop, sin sonido, ~30 s. */
  flowVideo: Video;
  /** Testimonio del responsable de HSE de SW Petrol. Solo con autorización escrita. */
  testimonialVideo: Video;
} = {
  founderVideo: null,
  flowVideo: null,
  testimonialVideo: null,
};

export const HOME5 = {
  cta: "Agenda 30 minutos",
  hero: {
    h1: "Seguridad y salud en el trabajo, bajo control en cada operación.",
    lede: "Una sola plataforma para todas tus plantas, sedes y equipos de campo en Latinoamérica.",
    secondary: "Pruébalo en tu celular",
  },
  region: "Seguridad e higiene, SST o HSE: como se llame en tu país.",
  plataforma: {
    h2: "Toda tu SST, en un mismo lugar.",
    modules: [
      "Inspecciones con QR",
      "Desvíos",
      "Entregas de EPP",
      "Permisos de trabajo",
      "ATS",
      "Capacitaciones",
      "Mediciones",
      "Accidentes y causa raíz",
      "Matriz de riesgos",
      "Equipos y vencimientos",
      "Varias sedes",
      "Reportes",
      "Asistente con IA",
    ],
    more: "Ver todos los módulos",
  },
  flujo: {
    h2: "Cada hallazgo, hasta el cierre.",
    steps: ["Se detecta", "Se asigna", "Se resuelve", "Se verifica"],
  },
  probalo: {
    h2: "Pruébalo en tu celular.",
    lede: "Escanea el código. Sin registro.",
    button: "Abrir aquí",
  },
  caso: {
    claim: "De Excel a flota, EPP y accidentes en una misma plataforma.",
    meta: "Servicios petroleros · Neuquén, Argentina · 60 personas",
  },
  nosotros: {
    h2: "Quiénes estamos detrás.",
    team: [
      { name: "José Cáceres", role: "Producto · Rosario, Santa Fe", photo: "/equipo/jose.jpg" as string | null, initials: "JC" },
      { name: "Walter Rodríguez", role: "Seguridad e higiene · La Plata", photo: null as string | null, initials: "WR" },
    ],
  },
  cierre: {
    h2: "Veámoslo con tu operación.",
    lede: "30 minutos. Propuesta el mismo día.",
    whatsapp: "O escríbenos por WhatsApp",
  },
};
