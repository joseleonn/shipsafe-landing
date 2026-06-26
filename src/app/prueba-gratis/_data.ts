/**
 * Datos y configuración de la landing de campaña /prueba-gratis.
 *
 * Esta landing es un destino de tráfico pago (ads de Meta/Instagram) dirigido a
 * un público self-service: técnicos independientes, consultores chicos y
 * micro-PyMEs. Objetivo único: iniciar la prueba gratis de 14 días.
 *
 * Reglas de copy: lenguaje simple, criollo, específico (no superlativo),
 * CERO promesas legales, una sola acción (todo apunta a TRIAL_URL).
 *
 * Aislada a propósito de src/lib/constants.ts para no afectar el home.
 */

// Destino único de TODOS los CTAs: la pantalla de registro de la app.
export const TRIAL_BASE_URL = "https://app.shipsafe.lat/registro";

// UTM por defecto si el visitante llegó SIN parámetros (tráfico directo/orgánico).
const DEFAULT_UTM: Record<string, string> = {
  utm_source: "prueba-gratis",
  utm_medium: "landing",
  utm_campaign: "prueba-gratis",
};

// Parámetros que reenviamos de la landing al registro para no perder atribución.
// Incluye los click-id de cada red (ttclid=TikTok, fbclid=Meta, gclid=Google).
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
 * Construye la URL del trial reenviando los UTM/click-id con los que el
 * visitante llegó a la landing. Así un clic de un ad de TikTok conserva
 * utm_source=tiktok hasta el registro, en vez de un valor hardcodeado.
 * Si la landing se abrió sin UTM, aplica DEFAULT_UTM.
 */
export function buildTrialUrl(search = ""): string {
  const incoming = new URLSearchParams(search);
  const url = new URL(TRIAL_BASE_URL);
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
export const TRIAL_URL = buildTrialUrl();

// Trial sin tarjeta → es el mayor argumento de conversión, se repite en todos los CTAs.
export const CTA_LABEL = "Probá gratis 14 días — sin tarjeta";

export const MICRO_TRUST =
  "Sin instalar nada · Funciona desde el navegador del celular · Listo en minutos";

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
  eyebrow: "Software de inspecciones y checklists",
  // Benefit-driven, ataca el dolor, no la feature. Específico, no superlativo.
  headline: "Tus inspecciones y desvíos, ordenados y a mano. Sin papel, sin Excel.",
  subheadline:
    "La forma más simple de hacer checklists con QR, reportar desvíos y tener todo registrado desde el celular. Pensado para técnicos y consultores de seguridad e higiene.",
};

// Dolores del público self-service (técnico/consultor independiente).
// Tono operativo, cero promesas legales.
export const PAINS = [
  "Hacés las inspecciones en papel y después perdés horas pasándolas a la compu.",
  "Tus checklists viven en distintos Excel y nunca encontrás el que necesitás.",
  "Reportás desvíos por WhatsApp y se pierden entre mensajes.",
  "Cuando necesitás el historial de una inspección, tardás un día en armarlo.",
];

export const STEPS = [
  {
    number: "01",
    title: "Creás tu cuenta",
    description:
      "Te registrás y armás tu primer checklist en minutos. Sin instalaciones ni configuraciones largas.",
  },
  {
    number: "02",
    title: "Escaneás el QR y completás",
    description:
      "Desde el celular, sin instalar nada. El operario o vos completan la inspección en el lugar.",
  },
  {
    number: "03",
    title: "Todo queda registrado",
    description:
      "Historial, desvíos con seguimiento hasta el cierre y reportes exportables cuando los necesites.",
  },
];

// Feature → beneficio (no features sueltas). Cada bloque usa un screenshot real.
export const FEATURES = [
  {
    icon: "QrCode",
    title: "Checklists con QR",
    benefit:
      "Escaneás el QR del equipo y completás la inspección en 2 minutos desde el celular. Se acabó el papeleo.",
    screenshot: "/screenshots/checklist.jpg",
    alt: "Pantalla de checklist de inspección en SHIPSAFE",
  },
  {
    icon: "AlertTriangle",
    title: "Gestión de desvíos",
    benefit:
      "Reportás el desvío con foto, asignás responsable y le seguís el rastro hasta el cierre. Nada se pierde.",
    screenshot: "/screenshots/menu.jpg",
    alt: "Gestión de desvíos en SHIPSAFE",
  },
  {
    icon: "FolderClock",
    title: "Historial y registros",
    benefit:
      "Cada inspección queda trazada y exportable en PDF. El historial que antes te llevaba un día, lo tenés en un clic.",
    screenshot: "/screenshots/dashboard.jpg",
    alt: "Historial y tablero de registros en SHIPSAFE",
  },
  {
    icon: "Smartphone",
    title: "Ultra fácil de usar",
    benefit:
      "Cualquier operario o técnico lo maneja desde el primer día. Funciona en el navegador del celular, sin descargar nada.",
    screenshot: "/screenshots/analytics.jpg",
    alt: "Vista de indicadores en el celular con SHIPSAFE",
  },
] as const;

export const PLANS = [
  {
    id: "basico",
    name: "Básico",
    price: "$50.000",
    priceDetail: "por mes",
    target: "Para arrancar a digitalizar tus checklists y desvíos.",
    features: [
      "Checklists con QR ilimitados",
      "Gestión de desvíos con foto y seguimiento",
      "Historial y reportes exportables en PDF",
      "Acceso desde el navegador del celular",
    ],
    highlighted: false,
    badge: null as string | null,
  },
  {
    id: "profesional",
    name: "Profesional / Independiente",
    price: "$90.000",
    priceDetail: "por mes",
    target: "Para técnicos y consultores que gestionan varios clientes.",
    features: [
      "Todo lo del plan Básico",
      "Hasta 3 empresas-cliente con datos separados",
      "Más usuarios y establecimientos",
      "Plus — Módulo de EPP: entregas y control de stock",
      "Plus — Módulo de análisis",
      "Plus — Módulo de permisos de trabajo",
      "Plus — Módulo de ATS (análisis de trabajo seguro)",
      "Plus — Módulo de accidentología con IA",
      "Soporte prioritario por email",
    ],
    highlighted: true,
    badge: "Más elegido",
  },
] as const;

export const FAQS = [
  {
    question: "¿Necesito tarjeta de crédito para la prueba?",
    answer:
      "No. La prueba de 14 días es gratis y no te pedimos tarjeta. Te registrás y empezás a usarlo al instante.",
  },
  {
    question: "¿Qué pasa cuando terminan los 14 días?",
    answer:
      "Elegís si seguís con un plan pago o no. Si no hacés nada, la cuenta queda en pausa: no te cobramos sin tu confirmación.",
  },
  {
    question: "¿Necesito instalar algo?",
    answer:
      "No. SHIPSAFE funciona desde el navegador del celular. El operario escanea un código QR y entra directo, sin descargar ninguna app.",
  },
  {
    question: "¿Funciona sin internet?",
    answer:
      "Hoy SHIPSAFE necesita conexión para sincronizar los datos. Estamos trabajando en un modo offline para inspecciones en zonas sin cobertura.",
  },
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer:
      "Sí. La suscripción es mensual y la cancelás cuando quieras, sin permanencia ni penalidades.",
  },
  {
    question: "¿Sirve para mi rubro?",
    answer:
      "Sí. Los checklists son personalizables, así que podés adaptarlos a cualquier tipo de operación, establecimiento o servicio que controles.",
  },
];
