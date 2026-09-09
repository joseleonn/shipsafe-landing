/**
 * Genera una imagen de relleno por cada captura que falta en
 * public/screenshots/v4/, con el nombre del archivo escrito encima.
 *
 * Para qué: los pasos de un módulo no se dibujan sin su imagen, así que
 * mientras faltan capturas el recorrido es invisible y no se puede revisar ni
 * el orden ni los textos. Con los rellenos el recorrido completo se ve en
 * `npm run dev`, cada pantalla dice qué captura va en su lugar, y se van
 * reemplazando de a una.
 *
 * NUNCA salen publicadas: home-content.ts las ignora cuando NODE_ENV es
 * production. Los nombres quedan anotados en .placeholders.json para eso.
 *
 *     node scripts/placeholders.mjs
 */
import { readdir, writeFile, readFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(raiz, "public/screenshots/v4");
// Los rellenos viven aparte y están en .gitignore: así nunca se mezclan con
// las capturas de verdad ni entran al repositorio.
const dirRel = join(raiz, "public/screenshots/v4-rellenos");
await mkdir(dirRel, { recursive: true });

// Los pasos se leen del propio recorridos.ts, sin compilar TypeScript.
const src = await readFile(join(raiz, "src/lib/recorridos.ts"), "utf8");
const pasos = [];
for (const m of src.matchAll(/\{\s*label: "((?:[^"\\]|\\.)*)",\s*text: "(?:[^"\\]|\\.)*",\s*file: "([^"]+)",\s*kind: "(browser|phone)"/g)) {
  pasos.push({ label: m[1], file: m[2], kind: m[3] });
}
// A qué módulo pertenece cada uno, para escribirlo en la imagen.
const modulos = {};
for (const m of src.matchAll(/\n  (\w+): \[([\s\S]*?)\n  \],/g)) {
  for (const f of m[2].matchAll(/file: "([^"]+)"/g)) modulos[f[1]] = m[1];
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const hechos = [];
for (const p of pasos) {
  if (existsSync(join(dir, p.file)) || existsSync(join(dirRel, p.file))) continue;
  const [W, H] = p.kind === "phone" ? [720, 1560] : [2000, 1047];
  const chico = p.kind === "phone";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="100%" height="100%" fill="#EEF2F9"/>
    <rect x="${W * 0.06}" y="${H * 0.3}" width="${W * 0.88}" height="${H * 0.4}" rx="${chico ? 28 : 26}"
          fill="#ffffff" stroke="#C9D4E5" stroke-width="3" stroke-dasharray="14 12"/>
    <text x="50%" y="${H * 0.41}" text-anchor="middle" font-family="Menlo, monospace"
          font-size="${chico ? 26 : 34}" fill="#7C8CA5" letter-spacing="3">FALTA LA CAPTURA</text>
    <text x="50%" y="${H * 0.5}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="${chico ? 42 : 62}" font-weight="700" fill="#0B1F3B">${esc(p.label)}</text>
    <text x="50%" y="${H * 0.57}" text-anchor="middle" font-family="Menlo, monospace"
          font-size="${chico ? 22 : 30}" fill="#005CD6">${esc(p.file)}</text>
    <text x="50%" y="${H * 0.63}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif"
          font-size="${chico ? 20 : 26}" fill="#7C8CA5">módulo ${esc(modulos[p.file] ?? "")} · reemplazá este archivo y listo</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toFile(join(dirRel, p.file));
  hechos.push(p.file);
}

const reales = (await readdir(dir)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length;
const rell = (await readdir(dirRel)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).length;
console.log(`${hechos.length} relleno(s) nuevo(s). ${reales} captura(s) real(es) y ${rell} de relleno.`);
if (hechos.length) console.log("Poné la captura real en public/screenshots/v4/ con el mismo nombre y corré: npm run capturas");
