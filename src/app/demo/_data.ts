/**
 * Datos y configuración de la landing de campaña /demo.
 *
 * Esta landing es un destino de tráfico pago dirigido a EMPRESAS (equipos de
 * SST, jefes de operaciones, gerencia). A diferencia de
 * /prueba-gratis (self-service, trial), acá la venta es asistida: el objetivo
 * único es AGENDAR UNA DEMO en Calendly.
 *
 * Reglas de copy: lenguaje simple, criollo, específico (no superlativo),
 * CERO promesas legales (nunca "cumplí con la SRT" ni "evitá multas"; el valor
 * es ordenar, centralizar y dar visibilidad de inspecciones y desvíos). Una
 * sola acción: todo apunta a DEMO_URL.
 *
 * Aislada a propósito de src/lib/constants.ts para no afectar el home.
 */

// Destino único de TODOS los CTAs: agendar la demo en Calendly.
export const CALENDLY_BASE_URL = "https://calendly.com/shipsoftwareteam/30min";

// UTM por defecto si el visitante llegó SIN parámetros (tráfico directo/orgánico).
const DEFAULT_UTM: Record<string, string> = {
  utm_source: "demo",
  utm_medium: "landing",
  utm_campaign: "demo-empresas",
};

// Parámetros que reenviamos de la landing a Calendly para no perder atribución.
// Calendly registra los utm_* en el evento agendado; los click-id de cada red
// (ttclid=TikTok, fbclid=Meta, gclid=Google) se reenvían por si se necesitan.
const FORWARDED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "ttclid",
  "fbclid",
  "gclid",
];

/**
 * Construye la URL de la demo reenviando los UTM/click-id con los que el
 * visitante llegó a la landing. Así un clic de un ad conserva su utm_source
 * hasta Calendly, en vez de un valor hardcodeado. Si la landing se abrió sin
 * UTM, aplica DEFAULT_UTM.
 */
export function buildDemoUrl(search = ""): string {
  const incoming = new URLSearchParams(search);
  const url = new URL(CALENDLY_BASE_URL);
  let hasUtm = false;
  for (const key of FORWARDED_PARAMS) {
    const value = incoming.get(key);
    if (value) {
      url.searchParams.set(key, value);
      if (key.startsWith("utm_")) hasUtm = true;
    }
  }
  if (!hasUtm) {
    for (const [key, value] of Object.entries(DEFAULT_UTM)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}

// Valor por defecto para el render del servidor (antes de leer la URL real en
// el cliente). Se reemplaza al montar con los UTM reales del visitante.
export const DEMO_URL = buildDemoUrl();

// La demo es corta y sin compromiso → es el mayor argumento de conversión.
export const CTA_LABEL = "Agendá una demo";

export const MICRO_TRUST =
  "Demo de 30 minutos · Sin compromiso · Te la mostramos con tu operación";

/**
 * VSL de José.
 *
 * PENDIENTE: el video todavía no está en el repo. Para activarlo:
 *  - Opción A (archivo propio): dejá el .mp4 en public/video/vsl-jose.mp4
 *    (+ un poster .jpg), poné `available: true` y `type: "mp4"`.
 *  - Opción B (YouTube/Vimeo): poné `type: "youtube"`, `src` con el ID o URL
 *    del embed y `available: true`.
 *
 * Mientras `available` sea false, el hero muestra un screenshot real de la app
 * como fallback (no rompe el build ni hace 404).
 */
export const VSL: {
  available: boolean;
  type: "mp4" | "youtube";
  src: string;
  poster: string;
} = {
  available: true,
  type: "youtube",
  // "Como funciona SHIPSAFE?" — https://youtu.be/ehirzx0T8cg (horizontal 16:9)
  src: "https://www.youtube.com/embed/ehirzx0T8cg",
  poster: "https://i.ytimg.com/vi/ehirzx0T8cg/maxresdefault.jpg",
};

export const HERO = {
  eyebrow: "Software de SST para empresas",
  // Benefit-driven, ataca el dolor de la empresa (visibilidad y estándar único).
  headline:
    "Toda la gestión de SST de tu empresa, ordenada y en un solo lugar.",
  subheadline:
    "SHIPSAFE centraliza inspecciones, entrega de EPP, permisos de trabajo, accidentes y reportes de todos tus establecimientos. Agendá una demo y te lo mostramos con tu propia operación.",
};

// Dolores del público EMPRESA (equipos de SST, operaciones, gerencia).
// Tono operativo, cero promesas legales.
export const PAINS = [
  "Cada establecimiento maneja sus propios Excel y no hay un estándar único para todo tu equipo.",
  "No tenés visibilidad en tiempo real de qué se inspeccionó y qué desvíos siguen abiertos.",
  "Las entregas de EPP y los permisos de trabajo quedan en papeles sueltos que después no encontrás.",
  "Cuando pasa un accidente, reconstruir qué pasó y por qué te lleva días de trabajo.",
];

export const STEPS = [
  {
    number: "01",
    title: "Agendás la demo",
    description:
      "Elegís el horario que te queda cómodo. Son 30 minutos por videollamada, sin compromiso.",
  },
  {
    number: "02",
    title: "Te la mostramos con tu operación",
    description:
      "Vemos juntos tus checklists, tus desvíos y los reportes que necesita tu empresa. Nada genérico.",
  },
  {
    number: "03",
    title: "Armamos tu implementación",
    description:
      "Te pasamos una propuesta a medida para tus establecimientos y equipos, con precios claros el mismo día.",
  },
];

// Feature → beneficio (no features sueltas). Cada bloque usa un screenshot real.
// Cubre toda la plataforma de SST, no solo inspecciones.
export const FEATURES = [
  {
    icon: "QrCode",
    title: "Inspecciones y checklists con QR",
    benefit:
      "Tu equipo escanea el QR del equipo y completa la inspección en minutos desde el celular. Un estándar único para toda la empresa.",
    screenshot: "/screenshots/checklist.jpg",
    alt: "Pantalla de checklist de inspección en SHIPSAFE",
  },
  {
    icon: "AlertTriangle",
    title: "Gestión de desvíos",
    benefit:
      "Cada desvío se reporta con foto, responsable y plazo, y se sigue hasta el cierre. Sabés en todo momento qué está abierto y qué no.",
    screenshot: "/screenshots/menu.jpg",
    alt: "Gestión de desvíos en SHIPSAFE",
  },
  {
    icon: "HardHat",
    title: "Entrega de EPP con constancia",
    benefit:
      "Registrás la entrega de EPP a cada trabajador y queda la constancia firmada (formato Res. 299). Controlás stock y quién tiene qué.",
    screenshot: "/screenshots/dashboard.jpg",
    alt: "Control y entrega de EPP en SHIPSAFE",
  },
  {
    icon: "FileCheck",
    title: "Permisos de trabajo y ATS",
    benefit:
      "Generás y aprobás permisos de trabajo y análisis de trabajo seguro desde el celular, con toda la trazabilidad guardada.",
    screenshot: "/screenshots/menu.jpg",
    alt: "Permisos de trabajo y ATS en SHIPSAFE",
  },
  {
    icon: "Brain",
    title: "Accidentes con análisis de causa raíz por IA",
    benefit:
      "Cargás el accidente y la IA te ayuda a armar el análisis de causa raíz y las acciones. Lo que llevaba días, en minutos.",
    screenshot: "/screenshots/analytics.jpg",
    alt: "Análisis de accidentes con IA en SHIPSAFE",
  },
  {
    icon: "LayoutDashboard",
    title: "Gráficos y reportes para gerencia",
    benefit:
      "Tableros y gráficos en tiempo real por establecimiento, con vista consolidada de toda la organización y reportes exportables en PDF.",
    screenshot: "/screenshots/dashboard.jpg",
    alt: "Tableros, gráficos y reportes en SHIPSAFE",
  },
] as const;

// Un solo plan con TODO incluido. Lo único que mueve el precio es el tamaño de
// la empresa (establecimientos y usuarios), no los módulos.
export const PLANS = [
  {
    id: "empresa",
    name: "Empresa, todo incluido",
    price: "A medida",
    priceDetail: "según el tamaño de tu empresa",
    target: "Todos los módulos incluidos. Te armamos la propuesta según tu operación.",
    features: [
      "Inspecciones y checklists con QR ilimitados",
      "Gestión de desvíos con foto y seguimiento",
      "Entrega de EPP con constancia (Res. 299) y control de stock",
      "Permisos de trabajo y ATS",
      "Accidentología con análisis de causa raíz por IA",
      "Gráficos, tableros y reportes exportables en PDF",
      "Varios establecimientos con datos separados y vista consolidada",
      "Usuarios para todo tu equipo",
      "Onboarding y seguimiento personalizado",
    ],
    highlighted: true,
    badge: "Todo incluido",
  },
] as const;

export const FAQS = [
  {
    question: "¿Qué pasa en la demo?",
    answer:
      "Son 30 minutos por videollamada donde te mostramos SHIPSAFE funcionando con tu operación: inspecciones, entrega de EPP, permisos de trabajo, accidentes con IA y los reportes que necesitás. Sin compromiso.",
  },
  {
    question: "¿Necesito preparar algo?",
    answer:
      "No hace falta. Ayuda si venís con una idea de cuántos establecimientos y equipos querés controlar, pero lo vemos juntos en la llamada.",
  },
  {
    question: "¿Cuánto sale?",
    answer:
      "El plan Empresa incluye todos los módulos. El precio depende del tamaño de tu empresa (establecimientos y usuarios) y del onboarding y seguimiento personalizado que necesites. En la misma demo te pasamos una propuesta concreta y clara, sin sorpresas.",
  },
  {
    question: "¿Necesito instalar algo?",
    answer:
      "No. SHIPSAFE funciona desde el navegador del celular y la computadora. Tu equipo escanea un código QR y entra directo, sin descargar ninguna app.",
  },
  {
    question: "¿Sirve para varias plantas o sucursales?",
    answer:
      "Sí. Podés gestionar varios establecimientos con datos separados y una vista consolidada para gerencia. Lo configuramos según cómo esté organizada tu empresa.",
  },
  {
    question: "¿Sirve para mi rubro?",
    answer:
      "Sí. Los checklists son personalizables, así que se adaptan a cualquier tipo de operación, establecimiento o servicio que necesites controlar.",
  },
];
