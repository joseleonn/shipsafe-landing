/**
 * Criterios de calificación del embudo de Meta Ads.
 *
 * Esta es la pieza que define de qué aprende el algoritmo de Meta. El evento
 * `Schedule` solo se dispara para quien califica, así que Meta sale a buscar
 * gente parecida a la que califica — no parecida a cualquiera que dejó un mail.
 *
 * Contexto de la decisión: la capacidad de implementación es de 1 a 2 clientes
 * por mes. Con ese límite, una demo con una empresa de 20 empleados no es "un
 * lead más": es la hora que le sacaste a la que sí compraba. Por eso el filtro
 * es duro desde el día uno.
 *
 * Si cambiás estos criterios, cambiás lo que Meta va a buscar. No es un detalle
 * de formulario.
 */

export const EMPLEADOS_OPCIONES = [
  { value: "1-9", label: "1 a 9", califica: false },
  { value: "10-49", label: "10 a 49", califica: false },
  { value: "50-99", label: "50 a 99", califica: true },
  { value: "100-249", label: "100 a 249", califica: true },
  { value: "250-499", label: "250 a 499", califica: true },
  { value: "500+", label: "Más de 500", califica: true },
] as const;

export const RUBRO_OPCIONES = [
  { value: "metalurgica", label: "Metalúrgica", califica: true },
  { value: "construccion", label: "Construcción", califica: true },
  { value: "logistica", label: "Logística y transporte", califica: true },
  { value: "alimenticia", label: "Alimenticia", califica: true },
  { value: "manufactura", label: "Manufactura / industria", califica: true },
  { value: "mantenimiento", label: "Mantenimiento industrial", califica: true },
  { value: "agroindustria", label: "Agroindustria", califica: true },
  { value: "energia", label: "Energía / petroquímica", califica: true },
  { value: "laboratorio", label: "Laboratorio / química", califica: true },
  { value: "otro", label: "Otro", califica: false },
] as const;

/**
 * Ojo con el criterio de rol: el responsable de SyH casi nunca firma, pero es
 * el impulsor interno y sin él el proyecto no entra. Califica igual. Lo que
 * hacemos es pedirle que sume al decisor a la llamada, no bloquearlo.
 */
export const ROL_OPCIONES = [
  { value: "syh", label: "Responsable de Seguridad e Higiene / HSE", califica: true },
  { value: "gerencia_planta", label: "Gerencia de planta u operaciones", califica: true },
  { value: "direccion", label: "Dirección / dueño", califica: true },
  { value: "rrhh", label: "RRHH con SST a cargo", califica: true },
  { value: "consultor", label: "Consultor externo de SyH", califica: false },
  { value: "estudiante", label: "Estudiante / otro", califica: false },
] as const;

/**
 * Ojo con cómo está partida esta pregunta.
 *
 * La versión anterior descalificaba a cualquiera que tuviera "otra plataforma".
 * Estaba mal: preguntaba por POSESIÓN cuando lo que importa es si el problema
 * está RESUELTO. Son cosas distintas, y confundirlas dejaba afuera al mejor
 * prospecto que hay.
 *
 * Quien tiene un sistema que no le alcanza suele calificar mejor que quien
 * tiene papel: ya aceptó que esto se resuelve con software, ya tiene
 * presupuesto en esa línea, sabe exactamente qué le falta, y está frustrado
 * ahora. El caso real de referencia es una empresa grande con SAP que igual
 * arma los KPIs a mano en un Drive.
 *
 * El único que descalifica de verdad es el que tiene una plataforma de SST y le
 * funciona bien. Ese no tiene problema que resolver.
 */
export const GESTION_OPCIONES = [
  { value: "excel", label: "Excel y planillas", califica: true },
  { value: "papel", label: "Papel y carpetas", califica: true },
  { value: "mixto", label: "Un poco de todo (papel, Excel, WhatsApp)", califica: true },
  {
    value: "sistema_incompleto",
    label: "Tenemos un sistema, pero no cubre lo que necesitamos",
    califica: true,
  },
  {
    value: "otra_plataforma",
    label: "Ya usamos una plataforma de seguridad e higiene y nos funciona bien",
    califica: false,
  },
] as const;

export interface RespuestasCalificacion {
  empleados?: string;
  rubro?: string;
  rol?: string;
  gestion?: string;
}

export interface ResultadoCalificacion {
  califica: boolean;
  /** Qué criterio falló. Sirve para ver en HubSpot por qué se descarta gente. */
  motivos: string[];
}

function evaluar(
  opciones: readonly { value: string; califica: boolean }[],
  valor: string | undefined
): boolean {
  if (!valor) return false;
  return opciones.some((o) => o.value === valor && o.califica);
}

export function calificar(r: RespuestasCalificacion): ResultadoCalificacion {
  const motivos: string[] = [];

  if (!evaluar(EMPLEADOS_OPCIONES, r.empleados)) motivos.push("empleados");
  if (!evaluar(RUBRO_OPCIONES, r.rubro)) motivos.push("rubro");
  if (!evaluar(ROL_OPCIONES, r.rol)) motivos.push("rol");
  // La gestión actual es señal blanda: solo descalifica quien ya tiene una
  // plataforma de SST que le funciona. No responder no descalifica por sí solo.
  if (r.gestion && !evaluar(GESTION_OPCIONES, r.gestion)) motivos.push("gestion");

  return { califica: motivos.length === 0, motivos };
}
