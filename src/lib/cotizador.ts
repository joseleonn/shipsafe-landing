/**
 * Cotizador interno: las cuentas.
 *
 * Esto es toda la lógica de precios, sin React y sin nada del navegador, para
 * que se pueda probar sola (scripts/cotizador-test.mjs la corre con los casos
 * validados).
 *
 * ATENCIÓN: este módulo expone la estructura de precios. NO lo importes desde
 * ninguna página pública. Hoy lo usa solamente /interno/cotizador, que está
 * detrás del login. Si aparece importado en otro lado, lo que se filtra no es
 * un número suelto: es con qué margen negociamos.
 *
 * Hay DOS regímenes de precio y no uno solo:
 *
 * - Empresa, Profesional y Consultora usan la recta ajustada sobre Starter y
 *   Advanced, los dos planes vendidos. El establecimiento se deriva.
 * - Enterprise tiene precios propios, calibrados con la cotización de
 *   Adecoagro (17/9/2026). La recta de arriba está ajustada entre 300 y 520 por
 *   mes; Adecoagro está cuatro veces más arriba y extrapolarla daba 1.380
 *   contra los 36.000 anuales que se cotizaron de verdad.
 */

/** Los dos planes que ya se vendieron. La recta tiene que reproducirlos. */
export const PLANES_VALIDADOS = [
  { nombre: "Starter", usuarios: 3, establecimientos: 5, equipos: 250, abono: 300, setup: 150 },
  { nombre: "Advanced", usuarios: 6, establecimientos: 10, equipos: 1000, abono: 520, setup: 380 },
] as const;

/**
 * La cotización que calibra Enterprise. OJO: está validada como cotización, no
 * como pago. Adecoagro todavía no compró. Si negocia para abajo, hay que
 * recalibrar `establecimientoEnterprise`.
 */
export const CASO_ENTERPRISE = {
  nombre: "Adecoagro",
  usuarios: 20,
  establecimientos: 25,
  equipos: 2500,
  abono: 3005,
  setup: 1050,
} as const;

export type Tarifa = {
  /** Fijo del abono, independiente del tamaño. */
  base: number;
  /** Enterprise: precio por establecimiento. No se deriva, es una calibración. */
  establecimientoEnterprise: number;
  /** Enterprise: precio por equipo por mes. Fuera de Enterprise los equipos no entran al abono. */
  equipoEnterprise: number;
  setupUsuario: number;
  setupEstablecimiento: number;
  setupEquipo: number;
};

export const TARIFA: Tarifa = {
  base: 80,
  establecimientoEnterprise: 60,
  equipoEnterprise: 0.25,
  setupUsuario: 20,
  setupEstablecimiento: 10,
  setupEquipo: 0.16,
};

export const PRECIO_USUARIO = { min: 10, max: 70, def: 40 } as const;

/**
 * Arriba de este número de establecimientos, una misma organización pasa a
 * Enterprise. El 10 es el techo del plan Advanced: el último punto donde la
 * recta está calibrada. Arriba de ahí estaría extrapolando.
 *
 * No es un dato de mercado: es el borde de la calibración. Conviene chequearlo
 * contra las próximas dos cotizaciones Enterprise.
 */
export const ESTABLECIMIENTOS_ENTERPRISE = 10;

export type TipoOperacion = "sucursales" | "clientes";

export type Entrada = {
  usuarios: number;
  establecimientos: number;
  equipos: number;
  tipoOperacion: TipoOperacion;
  requisitosTecnicos: boolean;
  /** La implementación se regala como palanca de cierre, pero el número queda a la vista. */
  setupIncluido: boolean;
  precioUsuario: number;
  pesosPorDolar: number;
};

export const ENTRADA_INICIAL: Entrada = {
  usuarios: 6,
  establecimientos: 10,
  equipos: 300,
  tipoOperacion: "clientes",
  requisitosTecnicos: false,
  setupIncluido: false,
  precioUsuario: PRECIO_USUARIO.def,
  pesosPorDolar: 1333,
};

export type Linea = "Enterprise" | "Profesional" | "Consultora" | "Empresa";

/** Enterprise en 0: ese precio ya se cotiza anual. */
export const DESCUENTO_ANUAL: Record<Linea, number> = {
  Enterprise: 0,
  Profesional: 0.15,
  Consultora: 0.18,
  Empresa: 0.18,
};

/**
 * Fuera de Enterprise el establecimiento NO se ingresa: sale de despejarlo del
 * plan Starter. Por eso cualquier reparto que elija el comercial entre usuario
 * y establecimiento sigue dando los mismos 300 y 520 de los planes vendidos.
 *
 *   base + p·u + q·e = abono   →   q = (abono - base - p·u) / e
 *
 * Con la tarifa de hoy queda q = (220 - 3p) / 5, que es la fórmula de siempre.
 * Tener dos inputs sueltos rompería la invariante.
 */
export function precioEstablecimiento(precioUsuario: number, t: Tarifa = TARIFA): number {
  const a = PLANES_VALIDADOS[0];
  return (a.abono - t.base - precioUsuario * a.usuarios) / a.establecimientos;
}

/** El techo de la línea: más de esto por establecimiento ya no es de lista. */
export const EQUIPOS_POR_ESTABLECIMIENTO_MAX = 100;

export type Resultado = {
  linea: Linea;
  razon: string;
  descuento: number;
  precioEstablecimiento: number;
  /** Solo en Enterprise: lo que entra al abono por equipo. */
  precioEquipo: number;
  abono: number;
  /** Lo que da la fórmula de implementación, se cobre o no. */
  setup: number;
  /** Lo que se cobra: 0 si va incluida. */
  setupCobrado: number;
  /** Lo que se regaló, para que no quede en un cero silencioso. */
  concesion: number;
  primerMes: number;
  abonoAnualMensual: number;
  abonoAnualTotal: number;
  /** Solo en Consultora: lo que le queda por cada cliente que gestiona. */
  porCliente: number | null;
  avisos: string[];
  desgloseAbono: { etiqueta: string; monto: number }[];
  desgloseSetup: { etiqueta: string; monto: number }[];
};

/**
 * El orden importa y no es el obvio.
 *
 * Consultora se evalúa ANTES que Enterprise: un cliente de consultora es una
 * empresa chica que ella audita, más parecido a una sucursal que a un molino.
 * Con el orden al revés, una consultora con 15 clientes caía en Enterprise y se
 * le cotizaba el triple.
 *
 * El tamaño solo no manda a Enterprise: la cantidad de equipos la resuelve la
 * fórmula sola. Lo que manda son los requisitos técnicos, o pasar el techo de
 * la calibración en establecimientos de una misma organización.
 */
function detectarLinea(e: Entrada): { linea: Linea; razon: string } {
  if (e.tipoOperacion === "clientes") return { linea: "Consultora", razon: "gestiona clientes distintos" };
  if (e.requisitosTecnicos) return { linea: "Enterprise", razon: "pide requisitos técnicos" };
  if (e.establecimientos > ESTABLECIMIENTOS_ENTERPRISE)
    return { linea: "Enterprise", razon: `más de ${ESTABLECIMIENTOS_ENTERPRISE} establecimientos` };
  if (e.usuarios === 1) return { linea: "Profesional", razon: "un solo usuario" };
  return { linea: "Empresa", razon: "sucursales de una misma empresa" };
}

export function cotizar(e: Entrada, t: Tarifa = TARIFA): Resultado {
  const usuarios = Math.max(1, Math.floor(e.usuarios) || 1);
  const establecimientos = Math.max(1, Math.floor(e.establecimientos) || 1);
  const equipos = Math.max(0, Math.floor(e.equipos) || 0);

  const { linea, razon } = detectarLinea({ ...e, usuarios, establecimientos, equipos });
  const enterprise = linea === "Enterprise";

  const q = enterprise ? t.establecimientoEnterprise : precioEstablecimiento(e.precioUsuario, t);
  const precioEquipo = enterprise ? t.equipoEnterprise : 0;

  const porUsuarios = e.precioUsuario * usuarios;
  const porEstablecimientos = q * establecimientos;
  const porEquipos = precioEquipo * equipos;
  const abono = t.base + porUsuarios + porEstablecimientos + porEquipos;

  const setupUsuarios = t.setupUsuario * usuarios;
  const setupEstablecimientos = t.setupEstablecimiento * establecimientos;
  const setupEquipos = t.setupEquipo * equipos;
  const setup = setupUsuarios + setupEstablecimientos + setupEquipos;
  const setupCobrado = e.setupIncluido ? 0 : setup;
  const concesion = e.setupIncluido ? setup : 0;

  const descuento = DESCUENTO_ANUAL[linea];
  const abonoAnualMensual = abono * (1 - descuento);

  const avisos: string[] = [];
  if (enterprise) {
    avisos.push(
      "La fórmula da el piso. Arriba van los agregados: integración por sistema, SLA, account manager, white-label, on-premise. Nunca tarifa de lista."
    );
    // El escalón es real y conviene verlo antes de que lo vea el cliente.
    if (!e.requisitosTecnicos && establecimientos === ESTABLECIMIENTOS_ENTERPRISE + 1) {
      const enElTope =
        t.base + porUsuarios + precioEstablecimiento(e.precioUsuario, t) * ESTABLECIMIENTOS_ENTERPRISE;
      avisos.push(
        `Está justo pasando el umbral: con ${ESTABLECIMIENTOS_ENTERPRISE} establecimientos serían ${usd(enElTope)} y con ${establecimientos} son ${usd(abono)}. Si el cliente hace esa cuenta te la va a hacer en la llamada.`
      );
    }
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
  if (linea === "Consultora" && e.requisitosTecnicos) {
    avisos.push(
      "Marcaste requisitos técnicos pero la línea es Consultora, así que quedó con precio de lista. Consultora se evalúa antes que Enterprise a propósito. Si estos requisitos son de verdad, cotizalo a mano."
    );
  }

  const etiquetaEstablecimiento = e.tipoOperacion === "clientes" ? "clientes" : "establecimientos";

  const desgloseAbono = [
    { etiqueta: "Base", monto: t.base },
    { etiqueta: `${fmt(usuarios)} usuarios × ${e.precioUsuario}`, monto: porUsuarios },
    { etiqueta: `${fmt(establecimientos)} ${etiquetaEstablecimiento} × ${redondear(q)}`, monto: porEstablecimientos },
  ];
  if (enterprise) {
    desgloseAbono.push({ etiqueta: `${fmt(equipos)} equipos × ${precioEquipo}`, monto: porEquipos });
  }

  return {
    linea,
    razon,
    descuento,
    precioEstablecimiento: q,
    precioEquipo,
    abono,
    setup,
    setupCobrado,
    concesion,
    primerMes: abono + setupCobrado,
    abonoAnualMensual,
    abonoAnualTotal: abonoAnualMensual * 12,
    porCliente: linea === "Consultora" ? abono / establecimientos : null,
    avisos,
    desgloseAbono,
    desgloseSetup: [
      { etiqueta: `${fmt(usuarios)} usuarios × ${t.setupUsuario}`, monto: setupUsuarios },
      { etiqueta: `${fmt(establecimientos)} ${etiquetaEstablecimiento} × ${t.setupEstablecimiento}`, monto: setupEstablecimientos },
      { etiqueta: `${fmt(equipos)} equipos × ${t.setupEquipo}`, monto: setupEquipos },
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
  {
    nombre: CASO_ENTERPRISE.nombre,
    usuarios: CASO_ENTERPRISE.usuarios,
    establecimientos: CASO_ENTERPRISE.establecimientos,
    equipos: CASO_ENTERPRISE.equipos,
    requisitosTecnicos: false,
    tipoOperacion: "sucursales",
  },
];

/**
 * La comprobación que se muestra en vivo. Si alguno da cruz, la implementación
 * se rompió y no hay que cotizar con eso.
 *
 * Los dos planes se comprueban con el precio de usuario que esté puesto, porque
 * la derivación los deja invariantes. Enterprise NO: está calibrado con el
 * precio de usuario por defecto, así que se comprueba siempre contra ese y no
 * contra el que el comercial tenga en el acordeón.
 */
export function verificar(precioUsuario: number, t: Tarifa = TARIFA) {
  const base = { ...ENTRADA_INICIAL, tipoOperacion: "sucursales" as const, requisitosTecnicos: false, setupIncluido: false };

  const filas = PLANES_VALIDADOS.map((p) => {
    const r = cotizar({ ...base, usuarios: p.usuarios, establecimientos: p.establecimientos, equipos: p.equipos, precioUsuario }, t);
    return fila(p.nombre, `${p.usuarios}u · ${p.establecimientos} est · ${p.equipos} eq`, p.abono, r.abono, p.setup, r.setup);
  });

  const e = CASO_ENTERPRISE;
  const re = cotizar(
    { ...base, usuarios: e.usuarios, establecimientos: e.establecimientos, equipos: e.equipos, precioUsuario: PRECIO_USUARIO.def },
    t
  );
  filas.push(fila(`${e.nombre} · Enterprise`, `${e.usuarios}u · ${e.establecimientos} est · ${e.equipos} eq`, e.abono, re.abono, e.setup, re.setup));

  return filas;
}

function fila(nombre: string, config: string, abonoEsperado: number, abonoDio: number, setupEsperado: number, setupDio: number) {
  return {
    nombre,
    config,
    abonoEsperado,
    abonoDio: redondear(abonoDio),
    setupEsperado,
    setupDio: redondear(setupDio),
    ok: redondear(abonoDio) === abonoEsperado && redondear(setupDio) === setupEsperado,
  };
}

/** Formateo compartido: separador de miles es-AR, sin decimales de más. */
export const fmt = (n: number, decimales = 0) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(n);

export const usd = (n: number) => `USD ${fmt(Math.round(n))}`;
export const ars = (n: number, tc: number) => `$ ${fmt(Math.round(n * tc))}`;
