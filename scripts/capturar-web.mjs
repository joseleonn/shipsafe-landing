/**
 * Capturas nuevas para la web (v5): tablero y analítica en escritorio, y
 * tablero y desvíos en el celular, con la interfaz actual de la app.
 * Se guardan en public/screenshots/v5/.
 *
 * Abre un Chrome de verdad y espera a que te loguees vos (el script no toca
 * tu contraseña). Después navega y saca las capturas solo. Con --pausa, antes
 * de cada captura espera Enter, para que acomodes la pantalla.
 */
import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";
import { chromium } from "playwright";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const salida = join(raiz, "public/screenshots/v5");
const perfil = join(raiz, ".playwright-perfil");
const APP = "https://app.shipsafe.lat";
const pausa = process.argv.includes("--pausa");

const ESCRITORIO = { width: 1440, height: 900 };
const CELULAR = { width: 390, height: 844 };

const PLAN = [
  { file: "dashboard.jpg", ir: "/dashboard", vista: ESCRITORIO, nota: "el tablero completo" },
  { file: "analytics.jpg", ir: "/analytics", vista: ESCRITORIO, nota: "la analítica, pestaña Resumen" },
  { file: "m-dashboard.jpg", ir: "/dashboard", vista: CELULAR, nota: "el tablero en el celular" },
  { file: "m-desvios.jpg", ir: "/desvios", vista: CELULAR, nota: "los desvíos en el celular" },
];

await mkdir(salida, { recursive: true });
const ctx = await chromium.launchPersistentContext(perfil, {
  headless: false,
  viewport: ESCRITORIO,
  deviceScaleFactor: 2,
  args: ["--window-size=1460,1000"],
});
const page = ctx.pages()[0] ?? (await ctx.newPage());
const rl = createInterface({ input: process.stdin, output: process.stdout });

await page.goto(APP + "/dashboard", { waitUntil: "domcontentloaded" });
const logueado = async () => Boolean(await page.$('a[href="/desvios"]'));
if (!(await logueado())) {
  console.log("\n>> Logueate en la ventana de Chrome que se abrió (con la cuenta demo).");
  await rl.question("   Cuando estés adentro, volvé acá y apretá Enter. ");
}
if (!(await logueado())) {
  console.log("No veo la sesión iniciada. Cerrá con Ctrl+C y volvé a correrlo.");
  await ctx.close();
  process.exit(1);
}

for (const p of PLAN) {
  await page.setViewportSize(p.vista);
  await page.goto(APP + p.ir, { waitUntil: "networkidle" }).catch(() => {});
  await page.waitForTimeout(1500);
  if (pausa) await rl.question(`\n${p.file}: ${p.nota}. Enter para sacarla. `);
  await page.screenshot({ path: join(salida, p.file), type: "jpeg", quality: 92 });
  console.log(`listo  ${p.file}`);
}

rl.close();
await ctx.close();
console.log("\nCapturas guardadas en public/screenshots/v5/. Avisale a Claude.");
