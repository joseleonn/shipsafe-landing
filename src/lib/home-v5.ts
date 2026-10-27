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

export type Video = { src: string; poster: string; webm?: string } | null;

export const MEDIA: {
  /** Hero: José y Walter a cámara, 60 a 90 s, con subtítulos quemados. */
  founderVideo: Video;
  /** Testimonio del responsable de HSE de SW Petrol. Solo con autorización escrita. */
  testimonialVideo: Video;
} = {
  // VSL de 93 s (26/10/2026): motion graphics con la voz clonada de José. Las partes a cámara se reemplazan cuando estén grabadas.
  founderVideo: { src: "/video/vsl.mp4?v=7", webm: "/video/vsl.webm?v=7", poster: "/video/vsl.jpg?v=7" },
  testimonialVideo: null,
};

/**
 * Vista previa: mientras esté en true, cada video que falta se muestra como un
 * recuadro de video con su descripción, para ver cómo queda la página
 * terminada. PONERLO EN false ANTES DE PASAR A PRODUCCIÓN: con false, cada
 * hueco vuelve a mostrar capturas reales y la sección de testimonios se oculta
 * hasta que haya alguno cargado.
 */
export const SHOW_VIDEO_PLACEHOLDERS = false;

/**
 * Testimonios en video. Solo con autorización escrita de cada cliente y con
 * la frase textual aprobada por ellos. Los que tienen `video: null` y
 * corchetes son lugares reservados para la vista previa, no se publican.
 */
export const TESTIMONIOS: { video: Video; quote: string; name: string; role: string; company: string }[] = [
  { video: null, quote: "[Frase textual aprobada por el cliente]", name: "[Nombre y apellido]", role: "Responsable de HSE", company: "SW Petrol" },
  { video: null, quote: "[Frase textual aprobada por el cliente]", name: "[Nombre y apellido]", role: "[Cargo]", company: "[Cliente 2]" },
  { video: null, quote: "[Frase textual aprobada por el cliente]", name: "[Nombre y apellido]", role: "[Cargo]", company: "[Cliente 3]" },
];

/**
 * Sección "Cada proceso, de punta a punta": una pestaña por proceso, con su
 * screen recording (o la captura real mientras no exista) y tres pasos.
 * `shot` y `phone` son claves de SHOTS (home-content.ts).
 */
/**
 * Franja de confianza (Confianza.tsx). Solo empresas que lo usan de verdad y
 * que autorizaron mostrar su logo (DLC lo autorizó, según José el 27/10/2026).
 * Lo de la SRT dice solo lo que da el registro
 * temporario: la inscripción y el número.
 */
export const CONFIANZA: { name: string; note: string; logo: string | null; w: number; h: number; href: string | null }[] = [
  { name: "SW Petrol", note: "Neuquén, Argentina", logo: "/clientes/swpetrol.png", w: 245, h: 124, href: "#caso" },
  { name: "Corporación DLC", note: "Guatemala", logo: "/clientes/dlc.png", w: 270, h: 114, href: null },
  { name: "Prestador Integral 4.0", note: "Registro de la SRT · PR-005-PI", logo: null, w: 0, h: 0, href: "https://www.argentina.gob.ar/srt/prevencion/registro-de-prestadores-40" },
];

export const PROCESOS: {
  id: string;
  tab: string;
  steps: [string, string, string];
  video: Video;
  shot: "checklists" | "epp" | "permisoFirmas" | "permisos" | "accidentes" | "capacitaciones" | "desvioDetalle" | "mapa" | "mediciones";
  phone: "pChecklist" | "mEpp" | "mPermisos" | "mDesvioDetalle" | null;
}[] = [
  { id: "inspecciones", tab: "Inspecciones y desvíos", steps: ["Se escanea el QR y se completa el checklist", "El hallazgo genera el desvío con responsable y fecha", "Mantenimiento lo resuelve y Seguridad e Higiene lo cierra"], video: { src: "/video/proceso-inspecciones.mp4", webm: "/video/proceso-inspecciones.webm", poster: "/video/proceso-inspecciones.jpg" }, shot: "desvioDetalle", phone: "pChecklist" },
  { id: "epp", tab: "Entregas de EPP", steps: ["Se registra la entrega", "El trabajador firma en el momento o a distancia, con su documento", "Queda la constancia en PDF con certificado de firma"], video: { src: "/video/proceso-epp.mp4", webm: "/video/proceso-epp.webm", poster: "/video/proceso-epp.jpg" }, shot: "epp", phone: "mEpp" },
  { id: "permisos", tab: "Permisos de trabajo", steps: ["Se carga el permiso", "Lo aprueban y firman a distancia", "Queda el historial de cada firma"], video: null, shot: "permisoFirmas", phone: "mPermisos" },
  // Matriz IPER: pasos provisorios hasta grabar el video; confirmarlos contra lo que se ve.
  { id: "ats", tab: "ATS", steps: ["Cada paso de la tarea, con sus riesgos, controles y EPP", "La IA lo revisa antes de enviarlo; decide el profesional", "Se firma, se aprueba y sale el PDF"], video: { src: "/video/proceso-ats.mp4", webm: "/video/proceso-ats.webm", poster: "/video/proceso-ats.jpg" }, shot: "permisos", phone: null },
  { id: "matriz", tab: "Matriz IPER", steps: ["Se identifican los peligros de cada puesto y tarea", "Se evalúa cada riesgo y se ve en el mapa", "Se definen los controles para bajarlo"], video: null, shot: "mapa", phone: null },
  { id: "mediciones", tab: "Mediciones", steps: ["Protocolos cargados: iluminación, ruido, vibraciones y más", "El instrumento con su certificado; cada punto contra su límite", "Protocolo en PDF y aviso antes del próximo vencimiento"], video: { src: "/video/proceso-mediciones.mp4", webm: "/video/proceso-mediciones.webm", poster: "/video/proceso-mediciones.jpg" }, shot: "mediciones", phone: null },
  { id: "accidentes", tab: "Accidentes", steps: ["Se registra el accidente, el accidentado y la lesión", "La IA propone la causa raíz con Ishikawa y cinco porqués; decide el profesional", "Acciones correctivas con prioridad e informe en PDF"], video: { src: "/video/proceso-accidentes.mp4", webm: "/video/proceso-accidentes.webm", poster: "/video/proceso-accidentes.jpg" }, shot: "accidentes", phone: null },
  { id: "capacitaciones", tab: "Capacitaciones", steps: ["Calendario anual, con participantes y material de estudio", "Presencial o a distancia: examen y firma desde el celular", "Constancia en PDF, avisos por email y diplomas de proveedores"], video: { src: "/video/proceso-capacitaciones.mp4", webm: "/video/proceso-capacitaciones.webm", poster: "/video/proceso-capacitaciones.jpg" }, shot: "capacitaciones", phone: null },
];

export const HOME5 = {
  cta: "Agenda 30 minutos",
  hero: {
    h1: "Seguridad y salud en el trabajo,",
    h1Accent: "bajo control en cada operación.",
    lede: "Una sola plataforma para todas tus plantas, sedes y equipos de campo en Latinoamérica.",
    secondary: "Pruébalo en tu celular",
  },
  clientes: {
    label: "En uso todos los días · Registro oficial SRT",
  },
  /**
   * Registro de la SRT (Argentina). Solo se dice lo que da el tramo temporario:
   * la inscripción y el número. Nada de valor probatorio: eso llega con el
   * registro provisorio. Si se sube el logo oficial, completar `logo`.
   */
  registro: {
    label: "Registro oficial en Argentina",
    title: "Prestador Integral 4.0",
    text: "Inscriptos en el Registro de Prestadores de Soluciones 4.0 de la SRT",
    num: "PR-005-PI",
    // Listado oficial de la SRT donde figura la inscripción.
    href: "https://www.argentina.gob.ar/srt/prevencion/registro-de-prestadores-40",
    linkLabel: "Ver en el registro oficial",
    // Sello "Prestador 4.0" que envió la SRT. Mientras sea null se muestra el escudo.
    logo: null as string | null,
  },
  plataforma: {
    /**
     * El momento en que un cliente grande audita al contratista (eje "estándar
     * del cliente", 25/10/2026: SW Petrol y MCQ llegaron por esto). Cada zona es
     * un pedido del auditor y la pantalla real que lo contesta. Coordenadas en
     * porcentajes de cada captura (todas 2880x1800, cuenta demo).
     * Guardrail 4: se dice que lo muestras sin salir a juntar, nunca que "pasas la auditoría".
     */
    h2: "Lo que te pide una auditoría,",
    h2Accent: "listo para mostrar.",
    zonas: [
      {
        title: "Constancia de entrega de EPP",
        accent: "firmada por cada trabajador",
        shot: { src: "/screenshots/v4/epp-1-entregas.jpg", url: "app.shipsafe.lat/epp", alt: "Entregas de EPP por empleado con documento, estado de firma y constancia", width: 2880, height: 1800 },
        x: 23, y: 63.8, w: 73.5, h: 7,
      },
      {
        title: "Historial de cada desvío",
        accent: "hasta su cierre",
        shot: { src: "/screenshots/v4/desvm-2-resolucion.jpg", url: "app.shipsafe.lat/desvios/501", alt: "Historial de un desvío: asignado, en proceso, comentario y resuelto, con usuario y fecha", width: 2878, height: 1798 },
        x: 11.5, y: 9.5, w: 54, h: 81,
      },
      {
        title: "Registro de cada cambio:",
        accent: "quién, cuándo y desde dónde",
        shot: { src: "/screenshots/v4/desvm-4-auditoria.jpg", url: "app.shipsafe.lat/trazabilidad", alt: "Trazabilidad: evidencia de auditoría con fecha, acción, tipo de registro, usuario y origen", width: 2880, height: 1800 },
        x: 20.5, y: 21, w: 58.5, h: 77,
      },
      {
        title: "Pendientes y vencimientos",
        accent: "de todas tus sedes",
        shot: { src: "/screenshots/v4/dash-1-tarjetas.jpg", url: "app.shipsafe.lat/dashboard", alt: "Dashboard: requiere atención, con inspecciones vencidas, sin completar y próximas", width: 2880, height: 1800 },
        x: 20.5, y: 51, w: 76, h: 48,
      },
    ],
    more: "Ver todos los módulos",
  },
  procesos: {
    h2: "Cada proceso,",
    h2Accent: "de punta a punta.",
  },
  probalo: {
    h2: "Pruébalo",
    h2Accent: "en tu celular.",
    lede: "Escanea el código. Sin registro.",
    button: "Abrir aquí",
  },
  caso: {
    claim: "De Excel a flota, EPP y accidentes en una misma plataforma.",
    meta: "Servicios petroleros · Neuquén, Argentina · 60 personas",
  },
  testimonios: {
    h2: "Lo que dicen",
    h2Accent: "quienes lo usan.",
  },
  nosotros: {
    h2: "Quiénes estamos",
    h2Accent: "detrás.",
    team: [
      // linkedin: URL completa del perfil. Si queda en null, no se muestra el botón.
      { name: "José León Cáceres", role: "Fundador · Rosario, Santa Fe", bio: "+6 años en software y producto", photo: "/equipo/jose.jpg" as string | null, initials: "JC", linkedin: "https://www.linkedin.com/in/joseleoncaceresmusso" as string | null },
      { name: "Walter Rodríguez", role: "Fundador · La Plata", bio: "+13 años de experiencia en SST", photo: "/equipo/walter.jpg" as string | null, initials: "WR", linkedin: "https://www.linkedin.com/in/walter-dario-rodriguez-69b468213" as string | null },
    ],
  },
  cierre: {
    h2: "Veámoslo",
    h2Accent: "con tu operación.",
    lede: "30 minutos. Propuesta el mismo día.",
    whatsapp: "O escríbenos por WhatsApp",
  },
};
