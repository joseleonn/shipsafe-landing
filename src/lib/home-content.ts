/**
 * Copy y datos de la HOME (v3, 4/9/2026).
 *
 * Fuente: manifiesto-shipsafe.md (§2 el problema, §4 la tabla, §7 el próximo
 * paso) + el encuadre de PLATAFORMA INTEGRAL: no somos una app de inspecciones
 * para un técnico, somos el lugar donde trabaja toda la operación de SST.
 *
 * Reglas de copy (manifiesto §8): nombrar el problema antes que el producto,
 * frases cortas, sin adjetivos de folleto, nada que no hayamos hecho. Las
 * capturas son del producto real; si algo no existe, no se muestra.
 */
import { GESTION_OPCIONES } from "./calificacion";

export const CALENDLY_URL = "https://calendly.com/shipsoftwareteam/30min";
export const WHATSAPP_NUMBER = "5493413067158";
export const APP_URL = "https://shipsafe-web.fly.dev";
export const YOUTUBE_ID = "ehirzx0T8cg";
/** Adonde apunta el QR de "Probalo por tu cuenta" hasta que exista un checklist público de prueba. */
export const PROBALO_URL = "/demo?utm_source=landing&utm_medium=qr&utm_campaign=probalo";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const NAV = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Roles", href: "#roles" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precios", href: "#precios" },
  { label: "Consultores", href: "/consultores", quiet: true },
] as const;

export const HERO = {
  eyebrow: "Plataforma integral de seguridad e higiene",
  h1: "Toda la operación de seguridad e higiene,",
  h1Accent: "en una sola plataforma.",
  pain:
    "Hoy no sabés qué pasa donde no estás: la planilla que no vuelve del frente, el desvío que nadie cerró, el EPP sin firma, el vencimiento que aparece solo.",
  platform:
    "SHIPSAFE pone inspecciones, desvíos, permisos de trabajo, EPP, capacitaciones, mediciones y vencimientos en un solo lugar, y a cada persona de la operación trabajando ahí desde su rol: el operario desde el celular, mantenimiento, el supervisor y la gerencia.",
  secondary: "Ver la plataforma en 90 s",
  proof: [
    "En producción con flota y frentes remotos",
    "Sin instalar nada: QR y navegador",
    "Varias sucursales, una sola cuenta",
    "Datos cifrados, backups diarios",
  ],
  /** Los "eventos" que rotan sobre el escenario del hero: resumen de lo que el producto hace, no pantallas inventadas. */
  events: [
    { tone: "ok", title: "Inspección registrada", meta: "Camión IVECO · Frente Norte · con foto y firma" },
    { tone: "warn", title: "Desvío #503 → Mantenimiento", meta: "Prioridad alta · vence en 72 h" },
    { tone: "ok", title: "Permiso de trabajo aprobado", meta: "Trabajo en caliente · firmado a distancia" },
  ] as const,
};

export type Shot =
  | { kind: "browser"; src: string; url: string; alt: string; width: number; height: number }
  | { kind: "phone"; src: string; alt: string; width: number; height: number; short?: boolean };

type BrowserShot = Extract<Shot, { kind: "browser" }>;
type PhoneShot = Extract<Shot, { kind: "phone" }>;
const B = (file: string, url: string, alt: string, width = 2000, height = 1047): BrowserShot => ({
  kind: "browser",
  src: `/screenshots/v3/${file}`,
  url,
  alt,
  width,
  height,
});
const P = (file: string, alt: string, short = true): PhoneShot => ({
  kind: "phone",
  src: `/screenshots/v3/${file}`,
  alt,
  width: short ? 812 : 720,
  height: short ? 1458 : 1560,
  short,
});

export const SHOTS = {
  dashboard: B("dashboard.jpg", "app.shipsafe.lat/dashboard", "Dashboard: desvíos activos, vencidos, checklists pendientes, equipos a revisar y permisos"),
  dashboardCharts: B("dashboard-charts.jpg", "app.shipsafe.lat/dashboard", "Tableros: desvíos por estado y prioridad, equipos por estado, mapa de lesiones"),
  desvios: B("desvios.jpg", "app.shipsafe.lat/desvios", "Listado de desvíos con equipo, sucursal, origen y checklist"),
  desvioDetalle: B("desvio-detalle.jpg", "app.shipsafe.lat/desvios/501", "Detalle de un desvío resuelto con historial de cambios"),
  permisos: B("permisos.jpg", "app.shipsafe.lat/permisos-trabajo", "Permisos de trabajo por tipo y estado"),
  permisoFirmas: B("permiso-firmas.jpg", "app.shipsafe.lat/permisos-trabajo/PTS-2026-0009", "Firmas e historial de un permiso de trabajo aprobado"),
  epp: B("epp.jpg", "app.shipsafe.lat/epp", "Entregas de EPP con estado de firma y constancia"),
  checklists: B("checklists.jpg", "app.shipsafe.lat/checklists", "Plantillas de checklists activas"),
  capacitaciones: B("capacitaciones.jpg", "app.shipsafe.lat/capacitaciones", "Capacitaciones con límite, duración y examen"),
  accidentes: B("accidentes-2col.jpg", "app.shipsafe.lat/accidentes", "Registro de accidentes con gravedad, estado y alerta de denuncia ART", 1420, 1047),
  mediciones: B("mediciones.jpg", "app.shipsafe.lat/mediciones", "Mediciones reglamentarias con norma, unidad y límite"),
  equipamiento: B("equipamiento.jpg", "app.shipsafe.lat/equipamiento", "Inventario de equipos con código, estado y vencimiento"),
  mapa: B("mapa.jpg", "app.shipsafe.lat/mapa", "Mapa de la organización: filtros y plan de control de riesgos", 1568, 1401),
  pChecklist: P("p-checklist.jpg", "Ejecución de un checklist de extintores desde el celular", false),
  mDesvioDetalle: P("m-desvio-detalle.jpg", "Detalle de un desvío en el celular: problema, resolución e historial"),
  mEpp: P("m-epp.jpg", "Entregas de EPP en el celular"),
  mPermisos: P("m-permisos.jpg", "Permisos de trabajo en el celular"),
  mDesvios: P("m-desvios.jpg", "Desvíos en el celular"),
  mEquipamiento: P("m-equipamiento.jpg", "Equipamiento en el celular"),
};

export const ROLES = [
  {
    id: "operario",
    label: "Operario",
    icon: "hat",
    title: "Escanea el QR y registra en el lugar, en dos minutos",
    text: "El checklist de la empresa, no uno genérico. Con foto y firma. Sin app que instalar ni cuenta que crear en cada teléfono.",
    bullets: [
      "Preuso y postuso de vehículos, matafuegos, tableros, máquinas",
      "Si algo está NO OK, el desvío nace solo, con prioridad y plazo",
      "Firma la entrega de su EPP en el pañol, con conformidad",
    ],
    shot: SHOTS.pChecklist,
  },
  {
    id: "mantenimiento",
    label: "Mantenimiento",
    icon: "wrench",
    title: "Recibe el desvío con dueño y fecha. Lo cierra con la foto.",
    text: "Nadie lo persigue por WhatsApp. El desvío llega asignado, con prioridad y fecha límite, y queda cerrado con evidencia e historial.",
    bullets: [
      "Desvíos asignados, con historial de cambios y comentarios",
      "Permisos de trabajo de alto riesgo: se piden y se firman a distancia",
      "Equipos a revisar con vencimiento, sin salir a buscarlos",
    ],
    shot: SHOTS.mDesvioDetalle,
  },
  {
    id: "supervisor",
    label: "Supervisor de SST",
    icon: "shield",
    title: "Ve qué se hizo y qué no, en todos los frentes",
    text: "Desvíos por estado y sucursal, EPP por reponer, mediciones contra límites legales, capacitaciones vencidas, permisos pendientes. Todo con dueño, fecha y evidencia.",
    bullets: [
      "Vencimientos que avisan antes, no después",
      "Mapa de la organización: lo que las matrices exigen, cruzado con lo hecho",
      "Reportes en PDF listos para presentar",
    ],
    shot: SHOTS.desvios,
  },
  {
    id: "gerencia",
    label: "Gerencia",
    icon: "chart",
    title: "Un tablero honesto, sin armar nada a mano",
    text: "Desvíos por estado y prioridad, equipos por estado, mapa de lesiones, top por sector. Y un resumen mensual que llega solo por mail.",
    bullets: [
      "KPIs de inspecciones, desvíos y mediciones sin Excel",
      "Varias sucursales o establecimientos, una sola vista",
      "Qué se había hecho, con fecha y firma, cuando alguien pregunta",
    ],
    shot: SHOTS.dashboardCharts,
  },
] as const;

export interface ModuleItem {
  id: string;
  title: string;
  text: string;
  shot: Shot;
}
export interface ModuleGroup {
  name: string;
  items: ModuleItem[];
}

export const MODULE_GROUPS: ModuleGroup[] = [
  {
    name: "Operación",
    items: [
      { id: "insp", title: "Inspecciones y checklists con QR", text: "Checklists totalmente personalizables: los armás desde cero o partís de plantillas listas para usar (extintores, vehículos, andamios, tableros, EPP…). Preuso y postuso, asignados a cada equipo con su código QR.", shot: SHOTS.checklists },
      { id: "exec", title: "Ejecución desde el celular", text: "El operario escanea el QR, responde OK / NO OK / N/A, adjunta la foto y firma. Desde el navegador: sin app y sin cuenta que crear.", shot: SHOTS.pChecklist },
      { id: "desv", title: "Desvíos con dueño y fecha", text: "Cada NO OK genera un desvío con equipo, sucursal, origen, prioridad y plazo. Se filtra por estado, se asigna, se exporta a PDF.", shot: SHOTS.desvios },
      { id: "desvm", title: "Seguimiento hasta el cierre", text: "Del problema y de la resolución, con historial de cambios: quién lo abrió, quién lo resolvió, cuándo, y el link a la ejecución que lo originó.", shot: SHOTS.desvioDetalle },
      { id: "perm", title: "Permisos de trabajo", text: "Trabajo en caliente, en altura, espacio confinado. Borrador → pendiente → aprobado → en ejecución, con solicitante, ejecutante y autorizante.", shot: SHOTS.permisos },
      { id: "firm", title: "Firmas y aprobaciones a distancia", text: "Checklist de condiciones, firma del solicitante y del ejecutante, historial de estados. Se revisa y se aprueba desde otra sucursal, sin frenar la tarea.", shot: SHOTS.permisoFirmas },
    ],
  },
  {
    name: "Personas y recursos",
    items: [
      { id: "epp", title: "Entregas de EPP con firma", text: "Entregas individuales o masivas, pendientes de firma y firmadas, constancia en PDF. Catálogo, convenios y stock en la misma pantalla.", shot: SHOTS.epp },
      { id: "eppm", title: "El pañol en el celular", text: "El pañolero entrega, el operario firma en el momento con conformidad, y queda la constancia. Nada de planillas que se pierden.", shot: SHOTS.mEpp },
      { id: "cap", title: "Capacitaciones", text: "Programa anual, límite por capacitación, duración, asistencia y examen. Las legales, marcadas; las vencidas, a la vista.", shot: SHOTS.capacitaciones },
      { id: "equ", title: "Equipamiento con QR y vencimientos", text: "Inventario con código, tipo, sucursal, sector, estado y vencimiento. Exportá los QR, pegalos en cada equipo, y el checklist se abre desde ahí.", shot: SHOTS.equipamiento },
    ],
  },
  {
    name: "Cumplimiento",
    items: [
      { id: "med", title: "Mediciones reglamentarias", text: "Puesta a tierra, ruido, iluminación, carga térmica, agua, contaminantes, vibraciones, ergonomía: cada una con su resolución, su unidad y su límite.", shot: SHOTS.mediciones },
      { id: "acc", title: "Accidentes e investigación", text: "Registro con gravedad, tipo y estado de la investigación, con aviso de los plazos de denuncia. Con imágenes y análisis de causa raíz.", shot: SHOTS.accidentes },
      { id: "mapa", title: "Matrices y mapa de la organización", text: "Lo que las matrices de riesgo exigen, cruzado con lo que la empresa hizo: sin cumplir, vencidas, vencen en 30 días, por sector y por responsable.", shot: SHOTS.mapa },
    ],
  },
  {
    name: "Gestión",
    items: [
      { id: "dash", title: "Lo que requiere atención, hoy", text: "Desvíos activos y vencidos, checklists pendientes, equipos a revisar y permisos esperando autorización, con el botón para completar desde ahí.", shot: SHOTS.dashboard },
      { id: "kpi", title: "Tableros para la gerencia", text: "Desvíos por estado y prioridad, equipos por estado, mapa de lesiones, top de desvíos por sector. Sin armar nada a mano, y con resumen mensual por mail.", shot: SHOTS.dashboardCharts },
      { id: "mob", title: "Todo también en el celular", text: "La misma plataforma en el teléfono del supervisor: desvíos, permisos, equipos, EPP y tablero. Para recorrer la planta con los datos en la mano.", shot: SHOTS.mPermisos },
    ],
  },
];

export const MODULE_CHIPS = [
  "ATS · análisis de trabajo seguro",
  "Instructivos",
  "RGRL completo (161 ítems)",
  "Matriz de riesgos y plan de acción",
  "Multi-establecimiento",
  "Resumen mensual por mail",
  "Reportes y constancias en PDF",
  "Asistente con IA",
];

export const FLOW_TODAY =
  "Planilla en la camioneta → foto por WhatsApp → alguien lo anota el viernes → nadie sabe si se cerró.";

export const FLOW_STEPS = [
  { who: "Operario", icon: "hat", title: "Marca NO OK en el extintor de la camioneta", text: "Escaneó el QR, respondió el checklist, sacó la foto y firmó. Dos minutos, en el frente." },
  { who: "SHIPSAFE", icon: "zap", sys: true, title: "Nace el desvío #503", text: "Prioridad alta, fecha límite en 72 h, con el equipo, la sucursal y la evidencia ya cargados." },
  { who: "Mantenimiento", icon: "wrench", title: "Lo recibe, lo resuelve, sube la foto", text: "Lo ve en su celular, lo asigna a alguien de su equipo y lo cierra con la evidencia del cambio." },
  { who: "Supervisor de SST", icon: "shield", title: "Verifica y queda el histórico", text: "Quién, cuándo, con qué foto. Si alguien pregunta qué se había hecho, la respuesta tarda diez segundos." },
  { who: "Gerencia", icon: "chart", title: "Lo ve en el tablero, sin pedirlo", text: "Desvíos abiertos bajaron, el vencido ya no está, y el resumen del mes llega solo por mail." },
] as const;

export const COMPARE_ROWS = [
  ["Dónde se registra", "En papel, en el frente; se carga después, en la oficina", "En el celular, en el lugar, en el momento"],
  ["Quién consolida", "Una persona, a mano, los viernes", "Nadie: ya está consolidado"],
  ["Cuándo te enterás", "Cuando pedís el dato, o cuando pasa algo", "Mientras pasa"],
  ["Qué prueba tenés", "Una carpeta que hay que salir a buscar", "El registro, con foto, fecha y firma"],
  ["Qué pasa con un desvío", "Se reporta y se pierde", "Tiene dueño, fecha y estado hasta que se cierra"],
  ["Qué pasa con un vencimiento", "Alguien se acuerda", "Avisa antes"],
  ["Costo de registrar", "Más alto que la tarea → no se hace", "Más bajo que la tarea → se hace"],
] as const;

export const TIERS = [
  {
    name: "Profesional",
    from: "Desde",
    price: "$90.000",
    unit: "/ mes",
    who: "Técnicos y consultores con sus propios clientes, o PyMEs muy chicas. Hasta 3 empresas-cliente con datos separados.",
    inc: ["Checklists con QR, capacitaciones y desvíos", "RGRL completo", "Reporte mensual incluido"],
    cta: { kind: "link", label: "Programa de consultores", href: "/consultores" },
    hi: false,
  },
  {
    name: "Empresa",
    from: "Desde",
    price: "$400.000",
    unit: "/ mes",
    who: "Industria, energía, logística y servicios. Hasta 60 operarios y 3 supervisores, más un setup inicial único.",
    inc: [
      "Todos los módulos: inspecciones, desvíos, permisos, EPP, capacitaciones, mediciones",
      "Desvíos con fotos y línea de tiempo hasta el cierre",
      "Acceso de gerencia y resumen mensual automático",
      "Onboarding asistido y soporte por WhatsApp",
    ],
    cta: { kind: "demo", label: "Agendá una demo" },
    hi: true,
  },
  {
    name: "Enterprise",
    from: "Propuesta",
    price: "A medida",
    unit: "",
    who: "Empresas grandes y holdings: miles de equipos, varios establecimientos, requisitos corporativos.",
    inc: ["SSO e integraciones (SAP, Active Directory)", "White-label con tu marca", "SLA 24/7 y account manager"],
    cta: { kind: "whatsapp", label: "Coordiná una reunión", message: "Hola, quiero coordinar una reunión por la línea Enterprise de SHIPSAFE" },
    hi: false,
  },
] as const;

export const PRICE_NOTES = ["Mensual, sin permanencia", "Pagando por año, entre 15 % y 20 % de descuento", "Precios orientativos en ARS"];

export const HOME_FAQS = [
  { q: "¿Hay que instalar algo en los celulares?", a: "No. Funciona desde el navegador: el operario escanea el QR y entra directo. No hay app que descargar ni cuentas que crear en cada teléfono." },
  { q: "¿Es solo para inspecciones?", a: "No. Las inspecciones son la puerta de entrada porque las hace el que está en el frente, pero la plataforma cubre desvíos, permisos de trabajo, EPP, capacitaciones, mediciones, accidentes, RGRL, equipamiento y vencimientos, con roles para cada persona de la operación." },
  { q: "¿Convive con SAP u otro ERP?", a: "Sí. SHIPSAFE no reemplaza al ERP: es la capa del día a día desde el celular. En la línea Enterprise hay integraciones (SAP, Active Directory) y SSO." },
  { q: "¿Puedo traer lo que ya tengo en Excel?", a: "Sí. Importación masiva de equipos, operarios, sectores e históricos. Te acompañamos en la migración para que el primer día ya tengas tu operación cargada." },
  { q: "¿Cuánto tarda en estar andando?", a: "La configuración básica, menos de un día: empresa, establecimientos, sectores y equipos. Importar históricos lleva unos días según el volumen." },
  { q: "¿Quién ve qué?", a: "Hay perfiles: el operario carga lo suyo, mantenimiento ve sus desvíos, el supervisor sigue todos los frentes y la gerencia ve el resumen. Los datos viajan y se guardan cifrados, con backups diarios." },
];

export const GESTION = GESTION_OPCIONES;

/**
 * Caso de éxito nombrado. SW Petrol (Service World Petrol) es cliente de
 * SHIPSAFE: servicios para la industria petrolera en Plottier, Neuquén.
 * `logo`: ruta en /public (ej. "/clientes/swpetrol.png"); con null se muestra
 * el nombre en texto. Datos de la empresa tomados de swpetrol.com.ar.
 */
export const CASE = {
  name: "SW Petrol",
  legal: "Service World Petrol",
  url: "https://swpetrol.com.ar/",
  where: "Plottier, Neuquén",
  sector: "Servicios para la industria petrolera",
  what: "Cuadrillas de soldadura, mantenimiento de flota pesada y de equipos de alta presión, pruebas hidráulicas y montaje en yacimiento.",
  size: "60 empleados, flota y frentes remotos",
  logo: "/clientes/swpetrol.png" as string | null,
  before:
    "Las inspecciones de la flota se hacían en papel. Con la gente repartida en frentes, juntar las planillas era tan difícil que terminaban no haciéndose. No había evidencia real de qué pasaba con los vehículos.",
  today:
    "Inspecciones de flota, entrega y stock de EPP, y accidentología con imágenes y causa raíz. Saben qué se hizo y qué no, en el momento.",
};

export const FOOTER = {
  tag: "Plataforma integral de seguridad e higiene para operaciones dispersas. Un producto de Ship Software Team, Rosario.",
  producto: [
    { label: "Plataforma", href: "#plataforma" },
    { label: "Roles", href: "#roles" },
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Probalo", href: "#probalo" },
    { label: "Precios", href: "#precios" },
    { label: "Programa de consultores", href: "/consultores" },
    { label: "Ingresar", href: APP_URL },
  ],
  recursos: [
    { label: "Software vs. Excel", href: "/software-seguridad-higiene-vs-excel" },
    { label: "Guía Ley 19.587", href: "/ley-19587-guia-completa" },
    { label: "Inspecciones con QR", href: "/app-inspecciones-seguridad-qr" },
    { label: "Gestión de desvíos", href: "/gestion-desvios-seguridad-industrial" },
    { label: "Mejores software de SyH", href: "/mejores-software-seguridad-higiene-argentina" },
  ],
  legal: [
    { label: "Términos y condiciones", href: "/terminos" },
    { label: "Política de privacidad", href: "/politica-privacidad" },
    { label: "Tratamiento de datos", href: "/tratamiento-de-datos" },
    { label: "Botón de arrepentimiento", href: "/arrepentimiento" },
  ],
};
