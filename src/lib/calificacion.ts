/**
 * Criterios de calificación del embudo.
 *
 * QUÉ CAMBIÓ (06/09/2026) Y POR QUÉ
 *
 * El formulario pasó a ser un modal de tres datos y dejó de mandar empleados,
 * rubro y rol. Como un campo vacío no calificaba, `calificar()` devolvía
 * `false` para TODO el mundo: cada lead entraba a HubSpot como `no_califica`
 * y el dato dejó de significar nada.
 *
 * Además el encuadre viejo era equivocado en el fondo. Decía que el filtro
 * existía para enseñarle al algoritmo, pero con USD 15 por día son unos 5 a 8
 * eventos por semana contra los ~50 que Meta necesita para salir de la fase de
 * aprendizaje: el algoritmo no va a optimizar nada a este volumen. El que
 * filtra es el creativo y este formulario.
 *
 * Entonces el filtro dejó de proteger a Meta y pasa a proteger lo único
 * escaso: la media hora de la reunión de puesta en marcha.
 *
 * SOLO TRES COSAS DESCALIFICAN
 *
 *   1. Estudiante o alguien que no trabaja en esto.
 *   2. Consultor independiente de menos de 10 personas. El consultor con
 *      estructura queda adentro: es el que revende.
 *   3. Ya usa una plataforma de seguridad e higiene y le funciona bien. Ese
 *      no tiene problema que resolver.
 *
 * Rubro y tamaño NO descalifican: son dato. Las inspecciones, las mediciones
 * y la entrega de EPP son transversales a todos los rubros, y una empresa
 * grande no es un mal prospecto — es otra venta, más lenta. La promesa de la
 * oferta ("salís con un proceso andando") es verdadera a cualquier tamaño,
 * porque se configura un proceso, no la empresa entera.
 *
 * Un campo que no vino NO descalifica. Es la corrección del bug: el modal no
 * pregunta rubro, y eso no puede tumbar a nadie.
 */

export const EMPLEADOS_OPCIONES = [
  { value: "1-9", label: "1 a 9", califica: true },
  { value: "10-49", label: "10 a 49", califica: true },
  { value: "50-99", label: "50 a 99", califica: true },
  { value: "100-249", label: "100 a 249", califica: true },
  { value: "250-499", label: "250 a 499", califica: true },
  { value: "500+", label: "Más de 500", califica: true },
] as const;

/**
 * Ninguno descalifica. Se guarda para saber con quién estás hablando antes de
 * entrar a la reunión y para elegir qué caso contar, no para dejar afuera.
 */
export const RUBRO_OPCIONES = [
  { value: "metalurgica", label: "Metalúrgica", califica: true },
  { value: "construccion", label: "Construcción", califica: true },
  { value: "logistica", label: "Logística y transporte", califica: true },
  { value: "alimenticia", label: "Alimenticia", califica: true },
  { value: "manufactura", label: "Manufactura / industria", califica: true },
  { value: "mantenimiento", label: "Mantenimiento industrial", califica: true },
  { value: "agroindustria", label: "Agroindustria", califica: true },
  { value: "energia", label: "Energía / petroquímica", califica: true },
  { value: "petroleo", label: "Servicios petroleros", califica: true },
  { value: "mineria", label: "Minería", califica: true },
  { value: "vial", label: "Obras viales", califica: true },
  { value: "electrica", label: "Distribución eléctrica / cuadrillas", califica: true },
  { value: "laboratorio", label: "Laboratorio / química", califica: true },
  { value: "otro", label: "Otro", califica: true },
] as const;

/**
 * El responsable de SyH casi nunca firma, pero es el impulsor interno y sin él
 * el proyecto no entra. Califica igual: lo que hacemos es pedirle que sume al
 * decisor a la llamada, no bloquearlo.
 *
 * El consultor califica acá, pero cae por tamaño si es independiente. Ver
 * `calificar()`.
 */
export const ROL_OPCIONES = [
  { value: "syh", label: "Responsable de Seguridad e Higiene / HSE", califica: true },
  { value: "gerencia_planta", label: "Gerencia de planta u operaciones", califica: true },
  { value: "direccion", label: "Dirección / dueño", califica: true },
  { value: "rrhh", label: "RRHH con SST a cargo", califica: true },
  { value: "mantenimiento", label: "Mantenimiento", califica: true },
  { value: "consultor", label: "Consultor externo de SyH", califica: true },
  { value: "estudiante", label: "Estudiante / no trabajo en esto", califica: false },
] as const;

/**
 * Ojo con cómo está partida esta pregunta.
 *
 * La versión vieja descalificaba a cualquiera que tuviera "otra plataforma".
 * Estaba mal: preguntaba por POSESIÓN cuando lo que importa es si el problema
 * está RESUELTO.
 *
 * Quien tiene un sistema que no le alcanza suele calificar mejor que quien
 * tiene papel: ya aceptó que esto se resuelve con software, tiene presupuesto
 * en esa línea, sabe qué le falta y está frustrado ahora. El caso de
 * referencia es una empresa grande con SAP que igual arma los KPIs a mano.
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

  // Un campo que no vino no descalifica: solo evaluamos lo que la persona
  // efectivamente contestó. El modal pregunta tres cosas; los formularios
  // largos preguntan más. Los dos tienen que funcionar.
  if (r.rol && !evaluar(ROL_OPCIONES, r.rol)) motivos.push("rol");

  // Único criterio combinado: el consultor de una sola persona. Con estructura
  // queda adentro porque revende; solo no llega a implementar.
  if (r.rol === "consultor" && r.empleados === "1-9") {
    motivos.push("consultor_independiente");
  }

  if (r.gestion && !evaluar(GESTION_OPCIONES, r.gestion)) motivos.push("gestion");

  return { califica: motivos.length === 0, motivos };
}
