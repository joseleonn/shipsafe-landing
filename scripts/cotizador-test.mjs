/**
 * Prueba de las cuentas del cotizador contra los dos planes ya vendidos.
 *
 *     npm run cotizador:test
 *
 * No es un test de UI: es la condición de correctitud del spec. Si esto falla,
 * la página está cotizando mal y no hay que usarla.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";

// Se corre el .ts directo con el type stripping de Node 22+.
process.env.NODE_OPTIONS = "";

const { cotizar, verificar, PRESETS, PRECIO_USUARIO, ENTRADA_INICIAL, precioEstablecimiento } =
  await import("../src/lib/cotizador.ts");

let fallos = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? "ok  " : "FALLA"}  ${msg}`);
  if (!cond) fallos++;
};

console.log("\nLos dos planes validados, con el precio de usuario por defecto:");
for (const v of verificar(PRECIO_USUARIO.def)) {
  ok(v.ok, `${v.nombre} (${v.config}) → abono ${v.abonoDio}/${v.abonoEsperado}, setup ${v.setupDio}/${v.setupEsperado}`);
}

console.log("\nLa invariante: los planes tienen que dar igual con CUALQUIER precio de usuario.");
for (let p = PRECIO_USUARIO.min; p <= PRECIO_USUARIO.max; p++) {
  const todos = verificar(p).every((v) => v.ok);
  if (!todos || p === PRECIO_USUARIO.min || p === PRECIO_USUARIO.def || p === PRECIO_USUARIO.max) {
    ok(todos, `precioUsuario=${p} (establecimiento queda en ${precioEstablecimiento(p).toFixed(2)})`);
  }
}

console.log("\nLínea detectada en cada preset:");
const esperado = {
  "Federico Quint": "Consultora",
  "SW Petrol": "Empresa",
  "Empresa Starter": "Empresa",
  "Empresa Advanced": "Empresa",
  Adecoagro: "Enterprise",
};
for (const p of PRESETS) {
  const r = cotizar({ ...ENTRADA_INICIAL, ...p });
  ok(r.linea === esperado[p.nombre], `${p.nombre} → ${r.linea} (esperaba ${esperado[p.nombre]})`);
}

console.log("\nPor cliente, que es el número que mira la consultora:");
const fq = cotizar({ ...ENTRADA_INICIAL, ...PRESETS[0] });
ok(fq.porCliente !== null, "Consultora muestra por-cliente");
ok(
  Math.abs(fq.porCliente - fq.abono / 10) < 1e-9,
  `Federico Quint: ${fq.abono} / 10 clientes = ${fq.porCliente.toFixed(2)} por cliente`
);
ok(cotizar({ ...ENTRADA_INICIAL, ...PRESETS[1] }).porCliente === null, "Empresa NO muestra por-cliente");

console.log("\nAvisos:");
ok(cotizar({ ...ENTRADA_INICIAL, ...PRESETS[4] }).avisos.length > 0, "Enterprise avisa que la fórmula es el piso");
ok(
  cotizar({ ...ENTRADA_INICIAL, usuarios: 3, establecimientos: 2, equipos: 900, tipoOperacion: "sucursales" }).avisos
    .length > 0,
  "450 equipos por establecimiento dispara el aviso de techo"
);
ok(
  cotizar({ ...ENTRADA_INICIAL, ...PRESETS[3] }).avisos.length === 0,
  "Empresa Advanced (exactamente 100 por establecimiento) no avisa"
);

console.log(fallos ? `\n${fallos} falla(s).\n` : "\nTodo bien.\n");
process.exit(fallos ? 1 : 0);
