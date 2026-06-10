export const SITE = {
  name: "SHIPSAFE",
  url: "https://shipsafe.lat",
  appUrl: "https://shipsafe-web.fly.dev",
  tagline: "Software de Seguridad e Higiene Laboral",
  description:
    "SHIPSAFE es el software de seguridad e higiene laboral para plantas industriales en Argentina. Digitalizá inspecciones, gestioná desvíos y cumplí con la SRT sin papel ni Excel.",
  title: "SHIPSAFE | Software de Seguridad e Higiene Laboral Argentina",
};

export const CTAS = {
  primary: {
    label: "Contactanos",
    href: "#contacto",
  },
  secondary: {
    label: "Hablemos por WhatsApp",
    href: "https://wa.me/5493413067158?text=Hola%2C%20quiero%20consultar%20sobre%20SHIPSAFE",
  },
  whatsapp: {
    number: "5493413067158",
    message: "Hola, quiero consultar sobre SHIPSAFE",
    get url() {
      return `https://wa.me/${this.number}?text=${encodeURIComponent(this.message)}`;
    },
  },
};

export const NAV_LINKS = [
  { label: "Funcionalidades", href: "/#funcionalidades" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Beneficios", href: "/#beneficios" },
  { label: "Precios", href: "/#precios" },
  { label: "Consultores", href: "/consultores" },
  { label: "FAQ", href: "/#faq" },
];

export const PAIN_POINTS = [
  "Tenés 300 registros de inspecciones en una carpeta de Excel que nadie revisa hasta que llega la ART.",
  "El operario tuvo un accidente y no hay registro del último relevamiento de riesgos del puesto.",
  "Cargaste todo para la auditoría, pero te falta el registro de entrega de EPP firmado por el operario.",
  "Tu equipo reporta desvíos por WhatsApp y se pierden entre mensajes de grupo.",
  "Cada planta maneja su propia planilla y cuando consolidás datos, nada coincide.",
  "Te enterás de que un matafuego venció porque lo viste de casualidad en la recorrida.",
];

export const FEATURES = [
  {
    icon: "QrCode",
    title: "Inspecciones con QR",
    description:
      "Escaneá el código QR del equipo y completá la inspección desde el celular. Sin papel, sin demoras.",
  },
  {
    icon: "AlertTriangle",
    title: "Gestión de desvíos",
    description:
      "Reportá desvíos con foto y ubicación. Asigná responsables y hacé seguimiento hasta el cierre.",
  },
  {
    icon: "BarChart3",
    title: "Tableros en tiempo real",
    description:
      "Dashboards con indicadores clave: tasa de desvíos, inspecciones pendientes, vencimientos.",
  },
  {
    icon: "Gauge",
    title: "Mediciones ambientales",
    description:
      "Registrá mediciones de ruido, iluminación, temperatura y compará contra límites legales.",
  },
  {
    icon: "GraduationCap",
    title: "Capacitaciones",
    description:
      "Cargá cursos, asigná asistentes, registrá firmas digitales y generá certificados.",
  },
  {
    icon: "HeartPulse",
    title: "Exámenes médicos",
    description:
      "Controlá vencimientos de exámenes preocupacionales, periódicos y de egreso.",
  },
  {
    icon: "Smartphone",
    title: "100% mobile",
    description:
      "Toda la información disponible desde el celular. Ideal para recorridas en planta.",
  },
  {
    icon: "Building2",
    title: "Multi-planta",
    description:
      "Gestioná múltiples plantas desde una sola cuenta. Datos consolidados al instante.",
  },
  {
    icon: "Download",
    title: "Exportación y reportes",
    description:
      "Exportá informes en PDF listos para presentar a la ART o en auditorías.",
  },
  {
    icon: "Shield",
    title: "Cumplimiento normativo",
    description:
      "Alineado con Ley 19.587, Dec. 351/79 y resoluciones SRT vigentes.",
  },
  {
    icon: "BellRing",
    title: "Seguimiento de incidentes",
    description:
      "Recibí notificaciones por email y mensajes en el celular ante cada incidente. Seguí el estado hasta su resolución sin perder nada de vista.",
  },
  {
    icon: "ClipboardCheck",
    title: "Cuestionarios y checklists",
    description:
      "Incluye todos los cuestionarios requeridos por la ley argentina. Personalizá los existentes o creá checklists nuevos para cada caso.",
  },
];

export const STEPS = [
  {
    number: "01",
    title: "Cargá tu empresa",
    description:
      "Configurá plantas, sectores, puestos y equipos en minutos. Importá datos desde Excel si ya los tenés.",
  },
  {
    number: "02",
    title: "Tu equipo escanea y registra",
    description:
      "Cada operario escanea el QR del equipo o sector y completa inspecciones, reporta desvíos o firma capacitaciones.",
  },
  {
    number: "03",
    title: "Vos ves todo en tiempo real",
    description:
      "Dashboards actualizados al instante. Alertas automáticas. Reportes listos para la ART con un clic.",
  },
];

export const BENEFITS = [
  {
    title: "Operación diaria",
    subtitle: "Para quienes están en planta todos los días",
    icon: "HardHat",
    benefits: [
      "Inspecciones desde el celular en segundos",
      "Reportá desvíos con foto y ubicación al instante",
      "Alertas automáticas de vencimientos",
      "Firma digital de capacitaciones y entregas de EPP",
      "Menos tiempo en Excel, más tiempo en planta",
    ],
  },
  {
    title: "Gestión y visibilidad",
    subtitle: "Para quienes necesitan ver el panorama completo",
    icon: "BarChart3",
    benefits: [
      "Dashboards en tiempo real con indicadores clave",
      "Visión consolidada de todas las plantas",
      "Reportes listos para la ART con un clic",
      "Trazabilidad completa de cada acción",
      "Datos para tomar decisiones informadas",
    ],
  },
  {
    title: "Cumplimiento y auditoría",
    subtitle: "Para cuando llega la ART o la auditoría interna",
    icon: "ShieldCheck",
    benefits: [
      "Documentación completa y organizada",
      "Historial de inspecciones con evidencia",
      "Registros de capacitaciones con firmas",
      "Mediciones ambientales contra límites legales",
      "Exportación en formatos que las ART aceptan",
    ],
  },
];

export const COMPLIANCE_ITEMS = [
  {
    title: "Ley 19.587",
    description: "Ley de Higiene y Seguridad en el Trabajo. Marco legal general.",
    icon: "Scale",
  },
  {
    title: "Decreto 351/79",
    description: "Reglamentación de la Ley 19.587. Requisitos técnicos específicos.",
    icon: "FileText",
  },
  {
    title: "Res. SRT 299/11",
    description: "Provisión de elementos de protección personal. Registro obligatorio.",
    icon: "HardHat",
  },
  {
    title: "Res. SRT 3067/14",
    description: "Relevamiento de agentes de riesgo. Mediciones obligatorias.",
    icon: "Activity",
  },
  {
    title: "Cobertura ART",
    description:
      "Documentación completa para presentar ante tu aseguradora de riesgos del trabajo.",
    icon: "ShieldCheck",
  },
];

export const CASE_STUDIES = [
  {
    // TODO(founder): confirmar con el cliente si se puede publicar el nombre
    // de la empresa. Mientras tanto se muestra de forma anónima.
    company: "Empresa industrial — Neuquén",
    industry: "Planta industrial",
    employees: "60 empleados",
    summary:
      "Reemplazó las planillas de Excel y los reportes por WhatsApp con SHIPSAFE: inspecciones desde el celular, desvíos con seguimiento hasta el cierre y tableros en tiempo real para todo el equipo.",
    // TODO(founder): pedir un quote real al cliente. Mientras esté vacío,
    // la card muestra solo los hechos del caso, sin testimonio.
    quote: "",
    quoteRole: "Responsable de Seguridad e Higiene",
  },
];

// Precios públicos: solo los pisos "desde" de cada línea (pre-calificación).
// La matriz completa de planes vive en la guía interna de pricing — no
// publicarla. Enterprise nunca con tarifa de lista. Ajustar semestralmente
// por inflación (política interna: IPC con tope).
export const PRICING = {
  disclaimer:
    "Precios orientativos en ARS, según equipos a controlar y usuarios activos. Pagando anual obtenés entre 15% y 20% de descuento. Te pasamos la propuesta concreta el mismo día de la demo.",
  tiers: [
    {
      id: "profesional",
      name: "Profesional",
      target:
        "Para técnicos y consultores de SyH que atienden sus propios clientes, o PyMEs muy chicas",
      price: "Desde $90.000",
      priceDetail: "por mes — incluye hasta 3 empresas-cliente",
      features: [
        "Hasta 3 empresas-cliente con datos separados",
        "Checklists con QR, capacitaciones y gestión de desvíos",
        "RGRL completo (161 ítems)",
        "Reporte mensual incluido",
        "Onboarding con video y soporte por email",
      ],
      cta: { label: "Conocé el programa", href: "/consultores" },
      highlighted: false,
      badge: null as string | null,
    },
    {
      id: "empresa",
      name: "Empresa",
      target:
        "Para PyMEs industriales, constructoras y logísticas con planta propia",
      price: "Desde $400.000",
      priceDetail: "por mes, según equipos y usuarios + setup inicial único",
      features: [
        "Acceso de gerencia y resumen mensual automático por mail",
        "Hasta 60 operarios y 3 técnicos supervisores",
        "Desvíos con fotos y línea de tiempo hasta el cierre",
        "Reporte mensual listo para la ART incluido",
        "Onboarding asistido y soporte por WhatsApp",
      ],
      cta: { label: "Hablemos de tu planta", href: "/#contacto" },
      highlighted: true,
      badge: "Más elegido" as string | null,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      target:
        "Para empresas grandes y holdings: miles de equipos, múltiples plantas, requisitos corporativos",
      price: "A medida",
      priceDetail: "propuesta tras una reunión de descubrimiento",
      features: [
        "Todo lo de la línea Empresa, sin límites",
        "SSO corporativo e integraciones (SAP, Active Directory)",
        "White-label con tu marca",
        "SLA 24/7 y account manager dedicado",
        "Implementación white-glove multi-planta",
      ],
      cta: { label: "Coordiná una reunión", href: CTAS.whatsapp.url },
      highlighted: false,
      badge: null as string | null,
    },
  ],
};

export const PRICING_FAQS = [
  {
    question: "¿Qué define el precio final?",
    answer:
      "Dos variables: la cantidad de equipos a controlar (matafuegos, tableros, luces de emergencia, máquinas) y la cantidad de usuarios activos. También influyen los establecimientos y features premium como integraciones o white-label. Con esos datos te pasamos una propuesta concreta el mismo día de la demo.",
  },
  {
    question: "¿Puedo probarlo antes de contratar?",
    answer:
      "Sí. Después de la demo te ofrecemos una prueba guiada de 7 días con onboarding incluido: cargás tus equipos reales, lo usás en tu operación y ahí decidís.",
  },
  {
    question: "¿La implementación está incluida?",
    answer:
      "En la línea Empresa la puesta en marcha se cubre con un setup inicial único que incluye onboarding, carga inicial de equipos y configuración de checklists. En la línea Profesional el onboarding es con video guiado o asistido según el plan.",
  },
  {
    question: "¿Hay permanencia mínima?",
    answer:
      "No. La suscripción es mensual y podés darte de baja cuando quieras. Si pagás anual por adelantado, obtenés entre 15% y 20% de descuento según la línea.",
  },
  {
    question: "¿Tienen un plan para consultores de seguridad e higiene?",
    answer:
      "Sí. La línea Profesional arranca en $90.000 por mes e incluye hasta 3 empresas-cliente con datos separados; el plan superior llega a 5. Conocé los detalles en la página del Programa de Consultores.",
  },
];

export const PROVINCIAS = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

export const CONSULTORES = {
  hero: {
    badge: "Programa de consultores",
    title: "Gestioná todos tus clientes desde una sola cuenta",
    description:
      "Sumá SHIPSAFE a tu consultora de seguridad e higiene: cada empresa-cliente con sus datos separados, sus inspecciones y sus reportes. Vos cobrás tu servicio profesional; nosotros te damos la herramienta para hacerlo en una fracción del tiempo.",
    cta: "Aplicar al programa",
  },
  pains: [
    "Tenés un Excel distinto por cada cliente y armás cada informe a mano, todos los meses.",
    "Cuando la ART le pide documentación a un cliente, salís a perseguir planillas, fotos y firmas por WhatsApp.",
    "Podrías atender más clientes, pero el tiempo administrativo te pone el techo.",
  ],
  steps: [
    {
      number: "01",
      title: "Aplicás al programa",
      description:
        "Completás el formulario con tu matrícula y cuántas empresas gestionás hoy. Te contactamos en menos de 24 horas.",
    },
    {
      number: "02",
      title: "Te damos de alta y migramos tus clientes",
      description:
        "Configuramos tu cuenta de consultor y te acompañamos a cargar cada empresa-cliente con sus sucursales, equipos y checklists.",
    },
    {
      number: "03",
      title: "Elegís el plan según tu cartera",
      description:
        "Una sola suscripción mensual que incluye hasta 3 empresas-cliente; si gestionás más, el plan superior llega a 5.",
    },
  ],
  pricing: {
    price: "Desde $90.000",
    priceDetail: "por mes — incluye hasta 3 empresas-cliente",
    note: "¿Gestionás más clientes? El plan Advanced Pro incluye hasta 5 empresas por $170.000/mes. Pagando anual, 15% de descuento.",
  },
  programNote:
    "El programa tiene cupos limitados: estamos sumando a los primeros consultores y acompañamos personalmente la puesta en marcha de cada uno.",
};

export const FAQS = [
  {
    question: "¿Necesito instalar algo en los celulares de los operarios?",
    answer:
      "No. SHIPSAFE funciona desde el navegador del celular. No necesitás descargar ninguna app. El operario escanea un código QR y accede directamente.",
  },
  {
    question: "¿Puedo importar mis datos actuales desde Excel?",
    answer:
      "Sí. Tenemos herramientas de importación masiva para equipos, operarios, sectores y datos históricos. Te acompañamos en el proceso de migración.",
  },
  {
    question: "¿Cumple con la normativa SRT vigente?",
    answer:
      "Sí. SHIPSAFE está diseñado para cumplir con la Ley 19.587, Decreto 351/79, Res. SRT 299/11 y Res. SRT 3067/14. Los reportes se generan en los formatos que las ART requieren.",
  },
  {
    question: "¿Funciona sin conexión a internet?",
    answer:
      "SHIPSAFE requiere conexión para sincronizar datos. Sin embargo, estamos trabajando en modo offline para inspecciones en zonas sin cobertura.",
  },
  {
    question: "¿Cuánto tiempo lleva implementarlo?",
    answer:
      "La configuración básica lleva menos de un día. Podés cargar tu empresa, plantas y sectores en minutos. La importación de datos históricos puede llevar unos días dependiendo del volumen.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer:
      "Sí. Usamos encriptación en tránsito y en reposo. Los datos se almacenan en servidores seguros con backups automáticos diarios. Cumplimos con las mejores prácticas de seguridad de la información.",
  },
  {
    question: "¿Puedo gestionar múltiples empresas como consultor?",
    answer:
      "Sí. La línea Profesional permite gestionar hasta 5 empresas-cliente desde una sola cuenta, con datos y accesos independientes por cliente y reportes mensuales incluidos para presentar a cada uno.",
  },
  {
    question: "¿Cómo puedo ver SHIPSAFE en acción?",
    answer:
      "Agendá una demo con nuestro equipo y te mostramos la plataforma funcionando con datos reales. También podés escribirnos por WhatsApp para resolver cualquier duda.",
  },
  {
    question:
      "¿Qué software usan los profesionales de seguridad e higiene en Argentina?",
    answer:
      "Los profesionales de seguridad e higiene laboral en Argentina están migrando de planillas Excel a software especializado como SHIPSAFE. Un sistema de gestión de seguridad e higiene permite digitalizar inspecciones, gestionar desvíos, controlar vencimientos y generar reportes para la ART de forma automática.",
  },
  {
    question: "¿SHIPSAFE reemplaza a una app de seguridad industrial?",
    answer:
      "SHIPSAFE funciona como una app de seguridad industrial completa, accesible desde el navegador del celular sin necesidad de descarga. Cubre inspecciones con QR, gestión de desvíos, capacitaciones, mediciones ambientales y todo lo que necesitás para la gestión de seguridad e higiene laboral en planta.",
  },
];

export const ARTICLES = [
  {
    slug: "software-seguridad-higiene-vs-excel",
    title: "Software de Seguridad e Higiene vs Excel: Comparativa Completa",
    description:
      "Descubrí por qué las plantas industriales en Argentina están dejando Excel para gestionar seguridad e higiene. Comparativa real de funcionalidades, riesgos y costos.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
    relatedSlugs: ["como-digitalizar-inspecciones-planta", "gestion-desvios-seguridad-industrial"],
  },
  {
    slug: "ley-19587-guia-completa",
    title: "Ley 19.587: Guía Completa de Higiene y Seguridad en el Trabajo",
    description:
      "Todo lo que necesitás saber sobre la Ley 19.587 de Higiene y Seguridad en el Trabajo en Argentina. Requisitos, obligaciones y cómo cumplir con la normativa.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
    relatedSlugs: ["que-es-srt-argentina", "software-seguridad-higiene-vs-excel"],
  },
  {
    slug: "como-digitalizar-inspecciones-planta",
    title: "Cómo Digitalizar Inspecciones de Seguridad en Planta Industrial",
    description:
      "Guía paso a paso para pasar de inspecciones en papel o Excel a un sistema digital. Beneficios, proceso de implementación y resultados reales.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
    relatedSlugs: ["software-seguridad-higiene-vs-excel", "gestion-desvios-seguridad-industrial"],
  },
  {
    slug: "que-es-srt-argentina",
    title: "¿Qué es la SRT? Guía de Cumplimiento para Empresas en Argentina",
    description:
      "Qué es la Superintendencia de Riesgos del Trabajo, qué exige a las empresas argentinas y cómo cumplir con sus resoluciones sin complicaciones.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
    relatedSlugs: ["ley-19587-guia-completa", "software-seguridad-higiene-vs-excel"],
  },
  {
    slug: "gestion-desvios-seguridad-industrial",
    title: "Gestión de Desvíos en Seguridad Industrial: Guía Práctica",
    description:
      "Cómo implementar un sistema efectivo de reporte y gestión de desvíos de seguridad en plantas industriales. Del reporte al cierre.",
    datePublished: "2026-04-13",
    dateModified: "2026-04-13",
    relatedSlugs: ["como-digitalizar-inspecciones-planta", "que-es-srt-argentina"],
  },
  {
    slug: "mejores-software-seguridad-higiene-argentina",
    title: "Mejores Software de Seguridad e Higiene en Argentina (2026)",
    description:
      "Comparativa de los mejores software de seguridad e higiene laboral en Argentina. Qué mirar antes de elegir, funcionalidades clave y cómo evitar errores comunes.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["software-seguridad-higiene-vs-excel", "software-sg-sst"],
  },
  {
    slug: "software-sg-sst",
    title: "Software SG-SST: Qué es y Cómo Elegirlo en Argentina",
    description:
      "Qué es un software SG-SST (Sistema de Gestión de Seguridad y Salud en el Trabajo), cómo se relaciona con la normativa argentina e ISO 45001, y qué funciones necesita.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["mejores-software-seguridad-higiene-argentina", "ley-19587-guia-completa"],
  },
  {
    slug: "app-inspecciones-seguridad-qr",
    title: "App de Inspecciones de Seguridad con QR para Planta Industrial",
    description:
      "Cómo funciona una app de inspecciones de seguridad con códigos QR en planta: registro desde el celular, sin instalación, con trazabilidad y reportes automáticos.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["como-digitalizar-inspecciones-planta", "gestion-desvios-seguridad-industrial"],
  },
  {
    slug: "software-seguridad-higiene-industria-alimenticia",
    title: "Software de Seguridad e Higiene para la Industria Alimenticia",
    description:
      "Gestión de seguridad e higiene laboral en plantas de alimentos: riesgos específicos, normativa, BPM y cómo digitalizar inspecciones y desvíos sin papel.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["app-inspecciones-seguridad-qr", "software-seguridad-higiene-vs-excel"],
  },
  {
    slug: "software-seguridad-higiene-metalurgica",
    title: "Software de Seguridad e Higiene para la Industria Metalúrgica",
    description:
      "Riesgos de la industria metalúrgica y cómo un software de seguridad e higiene ayuda a gestionar EPP, mediciones de ruido, trabajos en caliente y cumplimiento SRT.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["app-inspecciones-seguridad-qr", "gestion-desvios-seguridad-industrial"],
  },
  {
    slug: "software-seguridad-higiene-construccion",
    title: "Software de Seguridad e Higiene para la Construcción",
    description:
      "Seguridad e higiene en obra: legajo técnico, trabajo en altura, AST y cómo digitalizar inspecciones y capacitaciones en construcción según la Res. SRT 51/97 y 35/98.",
    datePublished: "2026-06-10",
    dateModified: "2026-06-10",
    relatedSlugs: ["app-inspecciones-seguridad-qr", "que-es-srt-argentina"],
  },
];

export const FOOTER_LINKS = {
  producto: [
    { label: "Funcionalidades", href: "/#funcionalidades" },
    { label: "Beneficios", href: "/#beneficios" },
    { label: "Precios", href: "/precios" },
    { label: "Programa de Consultores", href: "/consultores" },
    { label: "FAQ", href: "/#faq" },
  ],
  recursos: [
    { label: "Mejores software de SyH", href: "/mejores-software-seguridad-higiene-argentina" },
    { label: "Qué es un software SG-SST", href: "/software-sg-sst" },
    { label: "App de inspecciones con QR", href: "/app-inspecciones-seguridad-qr" },
    { label: "Software vs Excel", href: "/software-seguridad-higiene-vs-excel" },
    { label: "Guía Ley 19.587", href: "/ley-19587-guia-completa" },
    { label: "Digitalizar inspecciones", href: "/como-digitalizar-inspecciones-planta" },
    { label: "¿Qué es la SRT?", href: "/que-es-srt-argentina" },
    { label: "Gestión de desvíos", href: "/gestion-desvios-seguridad-industrial" },
  ],
  sectores: [
    { label: "Industria alimenticia", href: "/software-seguridad-higiene-industria-alimenticia" },
    { label: "Industria metalúrgica", href: "/software-seguridad-higiene-metalurgica" },
    { label: "Construcción", href: "/software-seguridad-higiene-construccion" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de privacidad", href: "/politica-privacidad" },
  ],
  contacto: [
    { label: "shipsoftwareteam@gmail.com", href: "mailto:shipsoftwareteam@gmail.com" },
    { label: "WhatsApp", href: CTAS.whatsapp.url },
  ],
};

export const GA_MEASUREMENT_ID = "G-N285LPRVM1";

export const WEB3FORMS_KEY = "1870ccde-d48a-40e8-88ce-345015fb7572";
