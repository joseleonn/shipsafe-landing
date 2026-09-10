/**
 * Saca las 67 capturas de la app y las guarda con el nombre que le toca a cada
 * paso, en public/screenshots/v4/.
 *
 *     npm i -D playwright && npx playwright install chromium   (una sola vez)
 *     npm run capturar
 *
 * Cómo funciona: abre una ventana de Chrome de verdad, espera a que te
 * loguees vos (yo no toco tu contraseña), y a partir de ahí navega solo. Las
 * pantallas que se abren con una URL las dispara sin preguntar; las que
 * necesitan un click tuyo (abrir un registro, una pestaña, un modal) las deja
 * a mano, te dice qué poner en pantalla y espera a que aprietes Enter.
 *
 * Se puede cortar y retomar: saltea las que ya están. Con `--rehacer nombre`
 * vuelve a sacar solo esa.
 *
 *     npm run capturar -- --rehacer cap-2-calendario.jpg
 *     npm run capturar -- --solo cap        (solo los pasos del módulo cap)
 */
import { mkdir, readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { chromium } from "playwright";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "public/screenshots/v4");
const perfil = join(raiz, ".playwright-perfil");
const APP = "https://app.shipsafe.lat";

await mkdir(salida, { recursive: true });

/**
 * Adónde va cada captura y qué hay que dejar en pantalla.
 * `auto: true` = se saca sola apenas carga la página.
 * Sin `auto` = el script para y espera Enter, para que abras lo que dice.
 */
const PLAN = {
  // ---- Inspecciones y checklists ----
  "insp-1-plantillas.jpg": { ir: "/checklists", auto: true, nota: "listado de plantillas, filtro Activos" },
  "insp-2-preguntas.jpg": { ir: "/checklists", nota: "abrí una plantilla y dejá a la vista sus preguntas (sirve la de extintores IRAM 3517)" },
  "insp-3-preuso.jpg": { ir: "/checklists", nota: "dejá arriba la tarjeta de Vehículo Liviano, que muestra preuso y postuso" },
  "insp-4-asignada.jpg": { ir: "/checklists", nota: "una plantilla con sus equipos asignados y el QR a la vista" },

  // ---- Desvíos ----
  "desv-1-listado.jpg": { ir: "/desvios", auto: true, nota: "el listado completo" },
  "desv-2-filtros.jpg": { ir: "/desvios?isOverdue=true", nota: "abrí el panel de Filtros, o dejá la pestaña Vencidos" },
  "desv-3-asignado.jpg": { ir: "/desvios", nota: "abrí un desvío y dejá a la vista el grupo asignado" },
  "desv-4-plazo.jpg": { ir: "/desvios", nota: "un desvío con su prioridad y su fecha límite" },

  // ---- Seguimiento ----
  "desvm-1-origen.jpg": { ir: "/desvios", nota: "un desvío abierto, con el bloque Del problema y el link Ver ejecución" },
  "desvm-2-resolucion.jpg": { ir: "/desvios", nota: "un desvío resuelto, con la solución aplicada y la foto" },
  "desvm-3-historial.jpg": { ir: "/desvios", nota: "bajá hasta el Historial de cambios" },
  "desvm-4-auditoria.jpg": { ir: "/desvios", nota: "seguí bajando hasta el Historial del registro, campo por campo" },

  // ---- Permisos ----
  "perm-1-listado.jpg": { ir: "/permisos-trabajo", auto: true, nota: "la tabla con los cuatro estados" },
  "perm-2-nuevo.jpg": { ir: "/permisos-trabajo", nota: "tocá Nuevo Permiso y dejá el formulario con la plantilla elegida" },
  "perm-3-condiciones.jpg": { ir: "/permisos-trabajo", nota: "el checklist de condiciones del permiso" },
  "perm-4-personas.jpg": { ir: "/permisos-trabajo", nota: "abrí un permiso y dejá a la vista Personas y fechas (usá uno de prueba: se ven nombre y documento)" },

  // ---- Firmas ----
  "firm-1-pendiente.jpg": { ir: "/permisos-trabajo?estado=Pendiente", nota: "un permiso esperando autorización" },
  "firm-2-firmas.jpg": { ir: "/permisos-trabajo", nota: "abrí un permiso y dejá el bloque FIRMAS" },
  "firm-3-aprobado.jpg": { ir: "/permisos-trabajo", nota: "el bloque HISTORIAL: borrador, pendiente, aprobado" },
  "firm-4-pdf.jpg": { ir: "/permisos-trabajo", nota: "el PDF del permiso abierto" },

  // ---- EPP ----
  "epp-1-entregas.jpg": { ir: "/epp", auto: true, nota: "pestaña Entregas" },
  "epp-2-nueva.jpg": { ir: "/epp", nota: "tocá Nueva entrega y dejá el catálogo a la vista" },
  "epp-3-firma.jpg": { ir: "/epp", nota: "la firma con el campo de conformidad" },
  "epp-4-constancia.jpg": { ir: "/epp", nota: "la constancia en PDF" },
  "epp-5-stock.jpg": { ir: "/epp", nota: "pestaña Stock o Catálogo" },

  // ---- Capacitaciones ----
  "cap-1-listado.jpg": { ir: "/capacitaciones", auto: true, nota: "el listado, pestaña Lista" },
  "cap-2-calendario.jpg": { ir: "/capacitaciones", nota: "tocá la pestaña Calendario anual" },
  "cap-3-adentro.jpg": { ir: "/capacitaciones", nota: "abrí una capacitación y dejá a la vista Información (duración, tipo, % mínimo)" },
  "cap-4-contenidos.jpg": { ir: "/capacitaciones", nota: "el bloque Contenidos, con videos o links cargados" },
  "cap-5-asignacion.jpg": { ir: "/capacitaciones", nota: "el bloque Empleados asignados, con gente adentro" },
  "cap-6-examen.jpg": { ir: "/capacitaciones", nota: "el examen de una capacitación" },
  "cap-7-resultados.jpg": { ir: "/capacitaciones", nota: "los Participantes con su resultado" },
  "cap-8-tablero.jpg": { ir: "/analytics", nota: "pestaña Capacitaciones de Análisis" },

  // ---- Equipamiento ----
  "equ-1-inventario.jpg": { ir: "/equipamiento", auto: true, nota: "el inventario completo" },
  "equ-2-alta.jpg": { ir: "/equipamiento", nota: "tocá Nuevo equipo" },
  "equ-3-qr.jpg": { ir: "/equipamiento", nota: "tocá Exportar QRs" },
  "equ-4-vencidos.jpg": { ir: "/equipamiento", nota: "filtrá por vencimiento expirado" },

  // ---- Mediciones ----
  "med-1-catalogo.jpg": { ir: "/mediciones", auto: true, nota: "las mediciones con su norma, unidad y límite" },
  "med-2-carga.jpg": { ir: "/mediciones", nota: "abrí la carga de una medición" },
  "med-3-resultado.jpg": { ir: "/mediciones", nota: "un resultado comparado contra el límite" },
  "med-4-vencimiento.jpg": { ir: "/mediciones", nota: "la periodicidad y el próximo vencimiento" },

  // ---- Accidentes ----
  "acc-1-listado.jpg": { ir: "/accidentes", auto: true, nota: "el registro con el aviso de denuncia ART" },
  "acc-2-detalle.jpg": { ir: "/accidentes", nota: "abrí un accidente DE PRUEBA (no el que dice copia SWP) y dejá el relato y la denuncia ART" },
  "acc-3-causa.jpg": { ir: "/accidentes", nota: "bajá hasta Análisis de causa raíz" },
  "acc-4-supuestos.jpg": { ir: "/accidentes", nota: "el bloque de supuestos y datos faltantes" },
  "acc-5-acciones.jpg": { ir: "/accidentes", nota: "las acciones correctivas y preventivas con responsable y plazo" },

  // ---- Matrices y mapa ----
  "mapa-1-matrices.jpg": { ir: "/matrices", auto: true, nota: "la portada de Matrices" },
  "mapa-2-arbol.jpg": { ir: "/mapa", nota: "elegí una matriz vigente y cerrá el cartel de ayuda (Entendido)" },
  "mapa-3-detalle.jpg": { ir: "/mapa", nota: "abrí una caja y dejá a la vista lo que falta" },

  // ---- Tablero ----
  "dash-1-tarjetas.jpg": { ir: "/dashboard", auto: true, nota: "las cinco tarjetas de arriba" },
  "dash-2-pendientes.jpg": { ir: "/dashboard", nota: "bajá hasta las pestañas Vencidos / Sin completar / Próximos" },

  // ---- Analytics ----
  "kpi-1-resumen.jpg": { ir: "/analytics", auto: true, nota: "pestaña Resumen" },
  "kpi-2-desvios.jpg": { ir: "/analytics", nota: "pestaña Desvíos" },
  "kpi-3-inspecciones.jpg": { ir: "/analytics", nota: "pestaña Inspecciones" },
  "kpi-4-accidentes.jpg": { ir: "/analytics", nota: "pestaña Accidentes" },
  "kpi-5-epp.jpg": { ir: "/analytics", nota: "pestaña EPP" },

  // ---- Celular ----
  "exec-1-escaneo.jpg": { ir: "/dashboard", nota: "tocá Escanear en la barra de abajo" },
  "exec-2-checklist.jpg": { ir: "/checklists", nota: "ejecutá un checklist y dejá las preguntas con OK / NO OK / N/A" },
  "exec-3-foto.jpg": { ir: "/checklists", nota: "marcá un ítem en NO OK, con foto y observación" },
  "exec-4-firma.jpg": { ir: "/checklists", nota: "la pantalla de firma antes de enviar" },
  "eppm-1-entrega.jpg": { ir: "/epp", nota: "la entrega desde el celular" },
  "eppm-2-firma.jpg": { ir: "/epp", nota: "el operario firmando" },
  "eppm-3-constancia.jpg": { ir: "/epp", nota: "la constancia emitida" },
  "mob-1-dashboard.jpg": { ir: "/dashboard", auto: true, nota: "el tablero en el celular" },
  "mob-2-desvios.jpg": { ir: "/desvios", auto: true, nota: "los desvíos en el celular" },
  "mob-3-permisos.jpg": { ir: "/permisos-trabajo", auto: true, nota: "los permisos en el celular" },
  "mob-4-equipos.jpg": { ir: "/equipamiento", auto: true, nota: "el equipamiento en el celular" },
};

// El orden y el tipo (escritorio o celular) salen de recorridos.ts, que es la
// fuente de verdad de los pasos.
const src = await readFile(join(raiz, "src/lib/recorridos.ts"), "utf8");
const pasos = [];
for (const m of src.matchAll(/file: "([^"]+)",\s*kind: "(browser|phone)"/g)) {
  pasos.push({ file: m[1], kind: m[2] });
}

const args = process.argv.slice(2);
const rehacer = args.includes("--rehacer") ? args[args.indexOf("--rehacer") + 1] : null;
const solo = args.includes("--solo") ? args[args.indexOf("--solo") + 1] : null;

const pendientes = pasos.filter((p) => {
  if (rehacer) return p.file === rehacer;
  if (solo && !p.file.startsWith(solo + "-")) return false;
  return !existsSync(join(salida, p.file));
});

if (!pendientes.length) {
  console.log("No queda ninguna captura por sacar. Con --rehacer <archivo> volvés a sacar una.");
  process.exit(0);
}

const faltanPlan = pendientes.filter((p) => !PLAN[p.file]);
if (faltanPlan.length) {
  console.log("Estos pasos no tienen destino en el PLAN de este script:", faltanPlan.map((p) => p.file).join(", "));
}

const ESCRITORIO = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };

const ctx = await chromium.launchPersistentContext(perfil, {
  headless: false,
  viewport: ESCRITORIO,
  deviceScaleFactor: 2,
  args: ["--window-size=1460,1000"],
});
const page = ctx.pages()[0] ?? (await ctx.newPage());

const rl = createInterface({ input: process.stdin, output: process.stdout });
const enter = (t) => rl.question(t);

await page.goto(APP + "/dashboard", { waitUntil: "domcontentloaded" });
const logueado = async () => Boolean(await page.$('a[href="/desvios"]'));
if (!(await logueado())) {
  console.log("\n>> Logueate en la ventana que se abrió. Cuando estés adentro, volvé acá y apretá Enter.");
  await enter("   [Enter cuando estés adentro] ");
}
if (!(await logueado())) {
  console.log("Todavía no veo la sesión iniciada. Cortá con Ctrl+C y volvé a correrlo.");
  await ctx.close();
  process.exit(1);
}
console.log(`\nSesión lista. ${pendientes.length} captura(s) por sacar.\n`);

let hechas = 0;
for (const [i, paso] of pendientes.entries()) {
  const plan = PLAN[paso.file];
  if (!plan) continue;
  const cel = paso.kind === "phone";
  await page.setViewportSize(cel ? CELULAR : ESCRITORIO);
  await page.goto(APP + plan.ir, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1200);

  const cabecera = `[${i + 1}/${pendientes.length}] ${paso.file}  ${cel ? "(celular)" : "(escritorio)"}`;
  if (plan.auto) {
    console.log(`${cabecera}  ${plan.nota}`);
  } else {
    console.log(`\n${cabecera}\n   ${plan.nota}`);
    const r = await enter("   [Enter para disparar · s = saltear] ");
    if (r.trim().toLowerCase() === "s") { console.log("   salteada"); continue; }
  }

  await page.screenshot({ path: join(salida, paso.file), type: "jpeg", quality: 92 });
  hechas++;
}

rl.close();
await ctx.close();

const total = (await readdir(salida)).filter((f) => /\.jpe?g$/i.test(f)).length;
console.log(`\n${hechas} captura(s) nueva(s). ${total} de ${pasos.length} listas.`);
console.log("Ahora corré: npm run capturas");
