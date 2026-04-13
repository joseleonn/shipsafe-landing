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
    label: "Agendá una demo",
    href: "https://cal.com/shipsoftwareteam/chat-with-developer-from-ship-team",
  },
  secondary: {
    label: "Hablemos por WhatsApp",
    href: "https://wa.me/DEFINIR?text=Hola%2C%20quiero%20consultar%20sobre%20SHIPSAFE",
  },
  whatsapp: {
    number: "DEFINIR",
    message: "Hola, quiero consultar sobre SHIPSAFE",
    get url() {
      return `https://wa.me/${this.number}?text=${encodeURIComponent(this.message)}`;
    },
  },
};

export const NAV_LINKS = [
  { label: "Funcionalidades", href: "#funcionalidades" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Beneficios", href: "#beneficios" },
  { label: "FAQ", href: "#faq" },
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

export const TESTIMONIALS = [
  {
    name: "María González",
    role: "Responsable SyH",
    company: "Metalúrgica del Sur",
    initials: "MG",
    quote:
      "Pasamos de perder horas armando planillas a tener todo actualizado en tiempo real. La ART quedó impresionada en la última auditoría.",
  },
  {
    name: "Carlos Méndez",
    role: "Gerente de Planta",
    company: "Alimentos del Litoral",
    initials: "CM",
    quote:
      "Por primera vez tengo visibilidad real de la seguridad en las 3 plantas. Los dashboards me dan tranquilidad.",
  },
  {
    name: "Laura Fernández",
    role: "Consultora SyH Externa",
    company: "LF Seguridad Industrial",
    initials: "LF",
    quote:
      "Gestiono 12 clientes desde SHIPSAFE. Lo que antes me llevaba una semana, ahora lo resuelvo en un día.",
  },
];

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
      "Sí. El plan para consultores permite gestionar múltiples clientes desde una sola cuenta, con acceso independiente a cada empresa y reportes personalizados con tu marca.",
  },
  {
    question: "¿Cómo puedo ver SHIPSAFE en acción?",
    answer:
      "Agendá una demo con nuestro equipo y te mostramos la plataforma funcionando con datos reales. También podés escribirnos por WhatsApp para resolver cualquier duda.",
  },
];

export const FOOTER_LINKS = {
  producto: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Beneficios", href: "#beneficios" },
    { label: "FAQ", href: "#faq" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "#" },
    { label: "Política de privacidad", href: "#" },
  ],
  contacto: [
    { label: "shipsoftwareteam@gmail.com", href: "mailto:shipsoftwareteam@gmail.com" },
    { label: "WhatsApp", href: CTAS.whatsapp.url },
  ],
};

export const GA_MEASUREMENT_ID = "G-N285LPRVM1";
