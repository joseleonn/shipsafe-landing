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
import { readdir, writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(raiz, "public/screenshots/v4");
const dirRel = join(raiz, "public/screenshots/v4-rellenos");

const leer = async (d) => {
  try { return (await readdir(d)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort(); }
  catch { return []; }
};
const reales = await leer(dir);
const rellenos = (await leer(dirRel)).filter((f) => !reales.includes(f));
if (!reales.length && !rellenos.length) console.log("No hay capturas todavía en public/screenshots/v4/.");

const entradas = [];
for (const [f, carpeta, esRelleno] of [...reales.map((f) => [f, dir, false]), ...rellenos.map((f) => [f, dirRel, true])]) {
  const { width, height } = await sharp(join(carpeta, f)).metadata();
  if (!width || !height) {
    console.warn(`  ! ${f}: no pude leer las medidas, la salteo`);
    continue;
  }
  entradas.push([f, width, height, esRelleno]);
}
entradas.sort((a, b) => a[0].localeCompare(b[0]));

const cuerpo = entradas.map(([f, w, h]) => `  ${JSON.stringify(f)}: [${w}, ${h}],`).join("\n");
const relleno = entradas.filter(([, , , r]) => r).map(([f]) => `  ${JSON.stringify(f)},`).join("\n");
await writeFile(
  join(raiz, "src/lib/capturas-v4.ts"),
  `// Generado por scripts/capturas.mjs. No editar a mano.\n` +
    `// Nombre de archivo en public/screenshots/v4/ y sus medidas en píxeles.\n` +
    `export const CAPTURAS_V4: Record<string, [number, number]> = {\n${cuerpo}\n};\n\n` +
    `// Imágenes de relleno (scripts/placeholders.mjs). Se ven en \`npm run dev\`\n` +
    `// para poder revisar el recorrido, y NUNCA en el sitio publicado.\n` +
    `export const RELLENOS: ReadonlySet<string> = new Set([\n${relleno}\n]);\n`,
  "utf8",
);

console.log(`${entradas.length} captura(s) en el inventario, ${entradas.filter(([, , , r]) => r).length} todavía de relleno.`);
for (const [f, w, h, r] of entradas) console.log(`  ${r ? "relleno" : "  real "}  ${f}  ${w}x${h}`);
