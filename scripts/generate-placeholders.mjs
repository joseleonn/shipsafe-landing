/**
 * generate-placeholders.mjs
 *
 * Generates 4 minimal valid PNG placeholder screenshots (360x780) for the
 * SHIPSAFE mobile app. Uses pure Node.js with no external dependencies.
 *
 * NOTE: PhoneShowcase.tsx now renders inline React screen components instead
 * of loading external images, so these PNGs are only kept as static fallbacks.
 *
 * Usage:  node scripts/generate-placeholders.mjs
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "screenshots");

mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------------------
// Minimal PNG encoder (uncompressed RGBA -> valid PNG)
// ---------------------------------------------------------------------------

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const typeBytes = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([typeBytes, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function createPNG(width, height, r, g, b) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Raw image data: each row = filter byte (0) + RGB pixels
  const rowSize = 1 + width * 3;
  const raw = Buffer.alloc(rowSize * height);
  for (let y = 0; y < height; y++) {
    const offset = y * rowSize;
    raw[offset] = 0; // no filter
    for (let x = 0; x < width; x++) {
      const px = offset + 1 + x * 3;
      raw[px] = r;
      raw[px + 1] = g;
      raw[px + 2] = b;
    }
  }

  const compressed = deflateSync(raw);

  // IEND
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([
    signature,
    makeChunk("IHDR", ihdr),
    makeChunk("IDAT", compressed),
    iend,
  ]);
}

// ---------------------------------------------------------------------------
// Generate the 4 screenshots
// ---------------------------------------------------------------------------

const screens = [
  { name: "dashboard.png", r: 249, g: 250, b: 251 },
  { name: "analytics.png", r: 249, g: 250, b: 251 },
  { name: "checklist.png", r: 249, g: 250, b: 251 },
  { name: "menu.png", r: 255, g: 255, b: 255 },
];

for (const s of screens) {
  const png = createPNG(360, 780, s.r, s.g, s.b);
  const out = join(outDir, s.name);
  writeFileSync(out, png);
  console.log(`Created ${out} (${png.length} bytes)`);
}

console.log("\nDone! 4 placeholder PNGs generated.");
