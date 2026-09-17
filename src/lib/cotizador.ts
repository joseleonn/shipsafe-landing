/**
 * Cotizador interno: las cuentas.
 *
 * Esto es toda la lógica de precios, sin React y sin nada del navegador, para
 * que se pueda probar sola (scripts/cotizador-test.mjs la corre con los dos
 * planes validados).
 *
 * ATENCIÓN: este módulo expone la estructura de precios. NO lo importes desde
 * ninguna página pública. Hoy lo usa solamente /interno/cotizador, que está
 * detrás del login. Si aparece importado en otro lado, lo que se filtra no es
 * un número suelto: es con qué margen negociamos.
 */

/** Los dos planes que ya se vendieron. La fórmula tiene que reproducirlos. */
export const PLANES_VALIDADOS = [
  { nombre: "Starter", usuarios: 3, establecimientos: 5, equipos: 250, abono: 300, setup: 150 },
  { nombre: "Advanced", usuarios: 6, establecimientos: 10, equipos: 1000, abono: 520, setup: 380 },
] as const;

/**
 * Las constantes de la cuenta. Van por parámetro y no hardcodeadas adentro de
 * las funciones para que la página pueda leerlas del entorno cuando haga falta
 * (ver src/app/interno/cotizador/page.tsx) sin que este módulo sepa nada de
 * process.env, que en un componente de cliente no existe.
 */
export type Tarifa = {
  /** Fijo del abono, independiente del tamaño. */
  base: number;
  setupUsuario: number;
  setupEstablecimiento: number;
  setupEquipo: number;
};

export const TARIFA: Tarifa = {
  base: 80,
  setupUsuario: 20,
  setupEstablecimiento: 10,
  setupEquipo: 0.16,
};

export const PRECIO_USUARIO = { min: 10, max: 70, def: 40 } as const;

export type TipoOperacion = "sucursales" | "clientes";

export type Entrada = {
  usuarios: number;
  establecimientos: number;
  equipos: number;
  tipoOperacion: TipoOperacion;
  requisitosTecnicos: boolean;
  precioUsuario: number;
  pesosPorDolar: number;
};

export const ENTRADA_INICIAL: Entrada = {
  usuarios: 6,
  establecimientos: 10,
  equipos: 300,
  tipoOperacion: "clientes",
  requisitosTecnicos: false,
  precioUsuario: PRECIO_USUARIO.def,
  pesosPorDolar: 1333,
};

export type Linea = "Enterprise" | "Profesional" | "Consultora" | "Empresa";

export const DESCUENTO_ANUAL: Record<Linea, number> = {
  Enterprise: 0.2,
  Profesional: 0.15,
  Consultora: 0.18,
  Empresa: 0.18,
};

/**
 * El precio del establecimiento NO se ingresa: sale de despejarlo del plan
 * Starter. Por eso cualquier reparto que elija el comercial entre usuario y
 * establecimiento sigue dando los mismos 300 y 520 de los planes vendidos.
 *
 *   base + p·u + q·e = abono   →   q = (abono - base - p·u) / e
 *
 * Con la tarifa de hoy queda q = (220 - 3p) / 5, que es la fórmula de siempre.
 * Tener dos inputs sueltos rompería la invariante y cada cotización arrancaría
 * de un plan distinto.
 */
export function precioEstablecimiento(precioUsuario: number, t: Tarifa = TARIFA): number {
  const a = PLANES_VALIDADOS[0];
  return (a.abono - t.base - precioUsuario * a.usuarios) / a.establecimientos;
}

/** El techo de la línea: más de esto por establecimiento ya no es de lista. */
export const EQUIPOS_POR_ESTABLECIMIENTO_MAX = 100;
const EQUIPOS_ENTERPRISE = 1000;

export type Resultado = {
  linea: Linea;
  razon: string;
  descuento: number;
  precioEstablecimiento: number;
  abono: number;
  setup: number;
  primerMes: number;
  abonoAnualMensual: number;
  abonoAnualTotal: number;
  /** Solo en Consultora: lo que le queda por cada cliente que gestiona. */
  porCliente: number | null;
  avisos: string[];
  desgloseAbono: { etiqueta: string; monto: number }[];
  desgloseSetup: { etiqueta: string; monto: number }[];
};

/** Se evalúa en orden: el primero que aplica manda. */
function detectarLinea(e: Entrada): { linea: Linea; razon: string } {
  if (e.requisitosTecnicos) return { linea: "Enterprise", razon: "pide requisitos técnicos" };
  if (e.equipos > EQUIPOS_ENTERPRISE)
    return { linea: "Enterprise", razon: `más de ${EQUIPOS_ENTERPRISE} equipos` };
  if (e.usuarios === 1) return { linea: "Profesional", razon: "un solo usuario" };
  if (e.tipoOperacion === "clientes")
    return { linea: "Consultora", razon: "gestiona clientes distintos" };
  return { linea: "Empresa", razon: "sucursales de una misma empresa" };
}

export function cotizar(e: Entrada, t: Tarifa = TARIFA): Resultado {
  const usuarios = Math.max(1, Math.floor(e.usuarios) || 1);
  const establecimientos = Math.max(1, Math.floor(e.establecimientos) || 1);
  const equipos = Math.max(0, Math.floor(e.equipos) || 0);

  const q = precioEstablecimiento(e.precioUsuario, t);
  const porUsuarios = e.precioUsuario * usuarios;
  const porEstablecimientos = q * establecimientos;
  const abono = t.base + porUsuarios + porEstablecimientos;

  const setupUsuarios = t.setupUsuario * usuarios;
  const setupEstablecimientos = t.setupEstablecimiento * establecimientos;
  const setupEquipos = t.setupEquipo * equipos;
  const setup = setupUsuarios + setupEstablecimientos + setupEquipos;

  const { linea, razon } = detectarLinea({ ...e, usuarios, establecimientos, equipos });
  const descuento = DESCUENTO_ANUAL[linea];
  const abonoAnualMensual = abono * (1 - descuento);

  const avisos: string[] = [];
  if (linea === "Enterprise") {
    avisos.push(
      "La fórmula da el piso. Arriba van los agregados: integración por sistema, SLA, account manager, white-label, on-premise. Nunca tarifa de lista."
    );
  } else if (equipos / establecimientos > EQUIPOS_POR_ESTABLECIMIENTO_MAX) {
    avisos.push(
      `El techo de la línea son ${EQUIPOS_POR_ESTABLECIMIENTO_MAX} equipos por establecimiento y esta operación va en ${Math.round(equipos / establecimientos)}. Revisá si entra o si va a Enterprise.`
    );
  }
  if (q < 0) {
    avisos.push(
      "Con este precio de usuario el establecimiento da negativo: le estarías pagando al cliente por sumar sucursales. Bajá el precio del usuario."
    );
  }

  const etiquetaEstablecimiento = e.tipoOperacion === "clientes" ? "clientes" : "establecimientos";

  return {
    linea,
    razon,
    descuento,
    precioEstablecimiento: q,
    abono,
    setup,
    primerMes: abono + setup,
    abonoAnualMensual,
    abonoAnualTotal: abonoAnualMensual * 12,
    porCliente: linea === "Consultora" ? abono / establecimientos : null,
    avisos,
    desgloseAbono: [
      { etiqueta: "Base", monto: t.base },
      { etiqueta: `${usuarios} usuarios × ${e.precioUsuario}`, monto: porUsuarios },
      { etiqueta: `${establecimientos} ${etiquetaEstablecimiento} × ${redondear(q)}`, monto: porEstablecimientos },
    ],
    desgloseSetup: [
      { etiqueta: `${usuarios} usuarios × ${t.setupUsuario}`, monto: setupUsuarios },
      { etiqueta: `${establecimientos} ${etiquetaEstablecimiento} × ${t.setupEstablecimiento}`, monto: setupEstablecimientos },
      { etiqueta: `${equipos} equipos × ${t.setupEquipo}`, monto: setupEquipos },
    ],
  };
}

function redondear(n: number): number {
  return Math.round(n * 100) / 100;
}

export type Preset = { nombre: string } & Pick<
  Entrada,
  "usuarios" | "establecimientos" | "equipos" | "requisitosTecnicos" | "tipoOperacion"
>;

export const PRESETS: Preset[] = [
  { nombre: "Federico Quint", usuarios: 6, establecimientos: 10, equipos: 300, requisitosTecnicos: false, tipoOperacion: "clientes" },
  { nombre: "SW Petrol", usuarios: 4, establecimientos: 5, equipos: 250, requisitosTecnicos: false, tipoOperacion: "sucursales" },
  { nombre: "Empresa Starter", usuarios: 3, establecimientos: 5, equipos: 250, requisitosTecnicos: false, tipoOperacion: "sucursales" },
  { nombre: "Empresa Advanced", usuarios: 6, establecimientos: 10, equipos: 1000, requisitosTecnicos: false, tipoOperacion: "sucursales" },
  { nombre: "Adecoagro", usuarios: 15, establecimientos: 30, equipos: 3000, requisitosTecnicos: true, tipoOperacion: "sucursales" },
];

/**
 * La comprobación que se muestra en vivo en la página. Si alguno da cruz, la
 * implementación se rompió y no hay que cotizar con eso.
 */
export function verificar(precioUsuario: number, t: Tarifa = TARIFA) {
  return PLANES_VALIDADOS.map((p) => {
    const r = cotizar(
      {
        ...ENTRADA_INICIAL,
        usuarios: p.usuarios,
        establecimientos: p.establecimientos,
        equipos: p.equipos,
        tipoOperacion: "sucursales",
        requisitosTecnicos: false,
        precioUsuario,
      },
      t
    );
    return {
      nombre: p.nombre,
      config: `${p.usuarios} usuarios, ${p.establecimientos} establecimientos, ${p.equipos} equipos`,
      abonoEsperado: p.abono,
      abonoDio: redondear(r.abono),
      setupEsperado: p.setup,
      setupDio: redondear(r.setup),
      ok: redondear(r.abono) === p.abono && redondear(r.setup) === p.setup,
    };
  });
}

/** Formateo compartido: separador de miles es-AR, sin decimales de más. */
export const fmt = (n: number, decimales = 0) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);

export const usd = (n: number) => `USD ${fmt(Math.round(n))}`;
export const ars = (n: number, tc: number) => `$ ${fmt(Math.round(n * tc))}`;
