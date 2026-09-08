/**
 * Lee public/screenshots/v4/ y escribe src/lib/capturas-v4.ts con el nombre y
 * las medidas reales de cada archivo.
 *
 * La landing usa ese inventario para decidir qué módulos ya tienen su
 * recorrido completo (src/lib/recorridos.ts) y cuáles siguen mostrando la
 * captura vieja. Así se pueden ir subiendo capturas de a tandas sin tocar
 * código y sin que nada apunte a un archivo que no existe.
 *
 *     node scripts/capturas.mjs
 */
import { readdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(raiz, "public/screenshots/v4");

let archivos = [];
try {
  archivos = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort();
} catch {
  console.log("Todavía no existe public/screenshots/v4/. Inventario vacío.");
}

const entradas = [];
for (const f of archivos) {
  const { width, height } = await sharp(join(dir, f)).metadata();
  if (!width || !height) {
    console.warn(`  ! ${f}: no pude leer las medidas, la salteo`);
    continue;
  }
  entradas.push([f, width, height]);
}

const cuerpo = entradas.map(([f, w, h]) => `  ${JSON.stringify(f)}: [${w}, ${h}],`).join("\n");
await writeFile(
  join(raiz, "src/lib/capturas-v4.ts"),
  `// Generado por scripts/capturas.mjs. No editar a mano.\n` +
    `// Nombre de archivo en public/screenshots/v4/ y sus medidas en píxeles.\n` +
    `export const CAPTURAS_V4: Record<string, [number, number]> = {\n${cuerpo}\n};\n`,
  "utf8",
);

console.log(`${entradas.length} captura(s) en el inventario.`);
for (const [f, w, h] of entradas) console.log(`  ${f}  ${w}x${h}`);
