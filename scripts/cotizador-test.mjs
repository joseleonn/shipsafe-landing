/**
 * Prueba de las cuentas del cotizador contra los casos validados.
 *
 *     npm run cotizador:test
 *
 * No es un test de UI: es la condición de correctitud. Si esto falla, la página
 * está cotizando mal y no hay que usarla.
 */
const {
  cotizar, verificar, PRESETS, PRECIO_USUARIO, ENTRADA_INICIAL,
  precioEstablecimiento, ESTABLECIMIENTOS_ENTERPRISE, CASO_ENTERPRISE, DESCUENTO_ANUAL,
} = await import("../src/lib/cotizador.ts");

let fallos = 0;
const ok = (cond, msg) => {
  console.log(`  ${cond ? "ok   " : "FALLA"}  ${msg}`);
  if (!cond) fallos++;
};
const base = { ...ENTRADA_INICIAL, tipoOperacion: "sucursales", requisitosTecnicos: false, setupIncluido: false };

console.log("\nLos casos validados:");
for (const v of verificar(PRECIO_USUARIO.def)) {
  ok(v.ok, `${v.nombre} (${v.config}) → abono ${v.abonoDio}/${v.abonoEsperado}, setup ${v.setupDio}/${v.setupEsperado}`);
}

console.log("\nAdecoagro, el número que importa:");
const ade = cotizar({ ...base, usuarios: CASO_ENTERPRISE.usuarios, establecimientos: CASO_ENTERPRISE.establecimientos, equipos: CASO_ENTERPRISE.equipos });
ok(ade.linea === "Enterprise", `cae en Enterprise (${ade.razon})`);
ok(ade.abono === 3005, `abono ${ade.abono}/mes (esperaba 3005)`);
ok(ade.abonoAnualTotal === 36060, `anual ${ade.abonoAnualTotal} (esperaba 36060, sin descuento)`);
ok(ade.setup === 1050, `implementación ${ade.setup} (esperaba 1050)`);
ok(DESCUENTO_ANUAL.Enterprise === 0, "Enterprise no lleva descuento anual");

console.log("\nLa invariante de la recta: los dos planes dan igual con CUALQUIER precio de usuario.");
for (let p = PRECIO_USUARIO.min; p <= PRECIO_USUARIO.max; p++) {
  const dos = verificar(p).slice(0, 2).every((v) => v.ok);
  if (!dos || [PRECIO_USUARIO.min, PRECIO_USUARIO.def, PRECIO_USUARIO.max].includes(p)) {
    ok(dos, `precioUsuario=${p} (establecimiento queda en ${precioEstablecimiento(p).toFixed(2)})`);
  }
}

console.log("\nEl orden de detección: consultora ANTES que enterprise.");
ok(
  cotizar({ ...base, tipoOperacion: "clientes", usuarios: 6, establecimientos: 15, equipos: 300 }).linea === "Consultora",
  "una consultora con 15 clientes sigue siendo Consultora, no Enterprise"
);
ok(
  cotizar({ ...base, establecimientos: 15 }).linea === "Enterprise",
  "una empresa con 15 establecimientos sí es Enterprise"
);
ok(cotizar({ ...base, usuarios: 1, establecimientos: 3 }).linea === "Profesional", "un solo usuario → Profesional");

console.log("\nEl tamaño en equipos ya NO manda a Enterprise:");
for (const eq of [1001, 2000, 5000]) {
  ok(cotizar({ ...base, usuarios: 6, establecimientos: 5, equipos: eq }).linea === "Empresa", `5 establecimientos con ${eq} equipos → Empresa`);
}
ok(
  cotizar({ ...base, usuarios: 6, establecimientos: ESTABLECIMIENTOS_ENTERPRISE, equipos: 1000 }).linea === "Empresa",
  `exactamente ${ESTABLECIMIENTOS_ENTERPRISE} establecimientos → Empresa (el disparador es >${ESTABLECIMIENTOS_ENTERPRISE})`
);
ok(
  cotizar({ ...base, usuarios: 6, establecimientos: ESTABLECIMIENTOS_ENTERPRISE + 1 }).linea === "Enterprise",
  `${ESTABLECIMIENTOS_ENTERPRISE + 1} establecimientos → Enterprise`
);

console.log("\nFuera de Enterprise los equipos no entran al abono:");
const a = cotizar({ ...base, usuarios: 6, establecimientos: 5, equipos: 0 });
const b = cotizar({ ...base, usuarios: 6, establecimientos: 5, equipos: 5000 });
ok(a.abono === b.abono, `0 equipos y 5000 equipos dan el mismo abono (${a.abono})`);
ok(a.setup !== b.setup, "pero sí cambian la implementación");

console.log("\nLínea de cada preset:");
const esperado = { "Federico Quint": "Consultora", "SW Petrol": "Empresa", "Empresa Starter": "Empresa", "Empresa Advanced": "Empresa", Adecoagro: "Enterprise" };
for (const p of PRESETS) {
  const r = cotizar({ ...ENTRADA_INICIAL, ...p, setupIncluido: false });
  ok(r.linea === esperado[p.nombre], `${p.nombre} → ${r.linea} (esperaba ${esperado[p.nombre]})`);
}

console.log("\nPor cliente, el número que mira la consultora:");
const fq = cotizar({ ...ENTRADA_INICIAL, ...PRESETS[0], setupIncluido: false });
ok(fq.porCliente !== null, "Consultora muestra por-cliente");
ok(Math.abs(fq.porCliente - fq.abono / 10) < 1e-9, `${fq.abono} / 10 clientes = ${fq.porCliente.toFixed(2)}`);
ok(cotizar({ ...ENTRADA_INICIAL, ...PRESETS[1], setupIncluido: false }).porCliente === null, "Empresa NO muestra por-cliente");

console.log("\nImplementación regalada: el número tiene que quedar a la vista.");
const reg = cotizar({ ...base, usuarios: CASO_ENTERPRISE.usuarios, establecimientos: CASO_ENTERPRISE.establecimientos, equipos: CASO_ENTERPRISE.equipos, setupIncluido: true });
ok(reg.setupCobrado === 0, "se cobra 0");
ok(reg.concesion === 1050, `pero la concesión queda registrada en ${reg.concesion}`);
ok(reg.setup === 1050, "y la fórmula sigue dando 1050");
ok(reg.primerMes === reg.abono, "el primer mes es solo el abono");

console.log("\nAvisos:");
ok(ade.avisos.some((x) => /piso/.test(x)), "Enterprise avisa que la fórmula es el piso");
ok(
  cotizar({ ...base, usuarios: 6, establecimientos: 11, equipos: 300 }).avisos.some((x) => /umbral/.test(x)),
  "justo arriba del umbral avisa del escalón"
);
ok(
  cotizar({ ...base, tipoOperacion: "clientes", requisitosTecnicos: true }).avisos.some((x) => /a mano/.test(x)),
  "consultora con requisitos técnicos avisa que quedó a precio de lista"
);
ok(
  cotizar({ ...base, usuarios: 3, establecimientos: 2, equipos: 900 }).avisos.some((x) => /techo/.test(x)),
  "450 equipos por establecimiento dispara el aviso de techo"
);
ok(cotizar({ ...ENTRADA_INICIAL, ...PRESETS[3], setupIncluido: false }).avisos.length === 0, "Empresa Advanced no avisa nada");

console.log(fallos ? `\n${fallos} falla(s).\n` : "\nTodo bien.\n");
process.exit(fallos ? 1 : 0);
