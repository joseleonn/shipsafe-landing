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
 *
 * Corre solo antes de `npm run dev` y de `npm run build` (predev/prebuild),
 * así el inventario nunca queda apuntando a archivos que no están. Eso
 * importa porque los rellenos no van al repositorio: sin esto, un clon nuevo
 * levantaba en dev con las 67 imágenes rotas.
 */
import { readdir, writeFile, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

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

/**
 * Medidas de un JPEG o un PNG leyendo la cabecera, sin librerías. Este script
 * corre antes de `dev` y de `build`, así que no puede depender de nada que no
 * esté declarado en package.json.
 */
function medidas(buf) {
  // PNG: IHDR en los bytes 16..24
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
  }
  // JPEG: se recorren los segmentos hasta el SOF, que trae alto y ancho
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marca = buf[i + 1];
      const largo = buf.readUInt16BE(i + 2);
      const esSOF = marca >= 0xc0 && marca <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marca);
      if (esSOF) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
      i += 2 + largo;
    }
  }
  return [0, 0];
}

const entradas = [];
for (const [f, carpeta, esRelleno] of [...reales.map((f) => [f, dir, false]), ...rellenos.map((f) => [f, dirRel, true])]) {
  const [width, height] = medidas(await readFile(join(carpeta, f)));
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
