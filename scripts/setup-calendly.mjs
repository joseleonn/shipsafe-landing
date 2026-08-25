#!/usr/bin/env node
/**
 * Setup de Calendly para el embudo de Meta Ads.
 *
 * Hace todo el bloque 4 de un saque:
 *   1. Averigua tu organización
 *   2. Genera un signing key
 *   3. Registra el webhook (invitee.created + invitee.canceled)
 *   4. Escribe CALENDLY_ORGANIZATION y CALENDLY_WEBHOOK_SECRET en .env.local
 *
 * Uso (desde la raíz del proyecto):
 *   set -a; source .env.local; set +a
 *   CALENDLY_TOKEN=<tu PAT> node scripts/setup-calendly.mjs --dry-run
 *   CALENDLY_TOKEN=<tu PAT> node scripts/setup-calendly.mjs
 *
 * Flags:
 *   --dry-run    muestra qué haría, sin escribir nada
 *   --recrear    si ya existe un webhook para esta URL, lo borra y lo crea de nuevo
 *
 * REQUIERE plan Standard o superior. En el plan gratuito Calendly no permite
 * webhooks y este script te lo va a decir con el error exacto.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";

const TOKEN = process.env.CALENDLY_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const RECREAR = process.argv.includes("--recrear");
const ARCHIVO_ENV = ".env.local";

const URL_WEBHOOK =
  process.env.CALENDLY_WEBHOOK_URL ?? "https://www.shipsafe.lat/api/calendly/webhook";
const EVENTOS = ["invitee.created", "invitee.canceled"];
const BASE = "https://api.calendly.com";

if (!TOKEN) {
  console.error("\nFalta CALENDLY_TOKEN.");
  console.error("Sacalo de: Calendly → Integrations & apps → API & webhooks → Personal Access Tokens\n");
  process.exit(1);
}

const ok = (m) => console.log(`  ✓ ${m}`);
const info = (m) => console.log(`  · ${m}`);
const fail = (m) => console.log(`  ✗ ${m}`);

async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });
  } catch (err) {
    return { ok: false, red: false, status: 0, body: { message: String(err) } };
  }
  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }
  return { ok: res.ok, red: true, status: res.status, body };
}

/** Escribe en .env.local sin tocar el resto del archivo. */
function escribirEnv(valores) {
  if (!existsSync(ARCHIVO_ENV)) {
    console.log(`\n  ⚠ No encontré ${ARCHIVO_ENV}. Corré el script desde la raíz del proyecto.`);
    return false;
  }
  let contenido = readFileSync(ARCHIVO_ENV, "utf8");
  for (const [clave, valor] of Object.entries(valores)) {
    if (!valor || valor === "undefined") continue;
    const linea = `${clave}=${valor}`;
    const patron = new RegExp(`^${clave}=.*$`, "m");
    contenido = patron.test(contenido)
      ? contenido.replace(patron, linea)
      : `${contenido.trimEnd()}\n${linea}\n`;
  }
  writeFileSync(ARCHIVO_ENV, contenido);
  return true;
}

async function main() {
  console.log(`\nSetup de Calendly${DRY_RUN ? "  [DRY RUN, no escribe nada]" : ""}\n`);

  // ── 1. Quién soy y a qué organización pertenezco
  const yo = await api("/users/me");
  if (!yo.ok && yo.red === false) {
    fail("No pude llegar a api.calendly.com. Es un problema de red, no del token.");
    process.exit(1);
  }
  if (!yo.ok) {
    fail(`Calendly rechazó el token (HTTP ${yo.status}): ${yo.body?.message ?? ""}`);
    console.error("\nRevisá que el Personal Access Token esté vigente.\n");
    process.exit(1);
  }

  const organizacion = yo.body.resource.current_organization;
  ok(`Token válido — ${yo.body.resource.name} <${yo.body.resource.email}>`);
  info(`Organización: ${organizacion}`);

  // ── 2. ¿Ya hay un webhook para esta URL?
  const params = new URLSearchParams({ organization: organizacion, scope: "organization", count: "100" });
  const existentes = await api(`/webhook_subscriptions?${params}`);

  if (!existentes.ok) {
    fail(`No pude listar los webhooks (HTTP ${existentes.status}): ${existentes.body?.message ?? ""}`);
    if (existentes.status === 403) {
      console.error("\n  Los webhooks requieren plan Standard o superior.");
      console.error("  En el plan gratuito Calendly no los permite.\n");
    }
    process.exit(1);
  }

  const yaExiste = (existentes.body.collection ?? []).find((w) => w.callback_url === URL_WEBHOOK);

  if (yaExiste && !RECREAR) {
    info(`Ya existe un webhook para ${URL_WEBHOOK}`);
    console.log("\n  Calendly no devuelve el signing key de un webhook existente, así que");
    console.log("  no puedo recuperarlo. Si no lo tenés guardado en .env.local, corré:");
    console.log("    node scripts/setup-calendly.mjs --recrear");
    console.log("  Eso lo borra y lo crea de nuevo con un secreto que sí queda guardado.\n");
    escribirEnvSiCorresponde({ CALENDLY_ORGANIZATION: organizacion });
    return;
  }

  if (yaExiste && RECREAR) {
    if (DRY_RUN) {
      ok(`[dry-run] borraría el webhook existente y crearía uno nuevo`);
    } else {
      const uuid = yaExiste.uri.split("/").pop();
      const borrado = await api(`/webhook_subscriptions/${uuid}`, { method: "DELETE" });
      borrado.ok ? ok("Webhook anterior borrado") : fail(`No pude borrar el anterior (HTTP ${borrado.status})`);
    }
  }

  // ── 3. Crear el webhook
  const signingKey = randomBytes(32).toString("hex");

  if (DRY_RUN) {
    ok(`[dry-run] crearía el webhook en ${URL_WEBHOOK}`);
    info(`eventos: ${EVENTOS.join(", ")}`);
    console.log("\nVolvé a correr sin --dry-run para hacerlo de verdad.\n");
    return;
  }

  const creado = await api("/webhook_subscriptions", {
    method: "POST",
    body: JSON.stringify({
      url: URL_WEBHOOK,
      events: EVENTOS,
      organization: organizacion,
      scope: "organization",
      signing_key: signingKey,
    }),
  });

  if (!creado.ok) {
    fail(`No se pudo crear el webhook (HTTP ${creado.status}): ${creado.body?.message ?? ""}`);
    if (creado.body?.details) console.error(JSON.stringify(creado.body.details, null, 2));
    process.exit(1);
  }

  ok(`Webhook creado en ${URL_WEBHOOK}`);
  info(`eventos: ${EVENTOS.join(", ")}`);

  // ── 4. Guardar en .env.local
  const escrito = escribirEnv({
    CALENDLY_ORGANIZATION: organizacion,
    CALENDLY_WEBHOOK_SECRET: signingKey,
    CALENDLY_TOKEN: TOKEN,
  });

  console.log("\n" + "─".repeat(64));
  if (escrito) {
    console.log(`  ✓ CALENDLY_ORGANIZATION, CALENDLY_WEBHOOK_SECRET y CALENDLY_TOKEN`);
    console.log(`    quedaron cargados en ${ARCHIVO_ENV}`);
  } else {
    console.log(`CALENDLY_ORGANIZATION=${organizacion}`);
    console.log(`CALENDLY_WEBHOOK_SECRET=${signingKey}`);
  }
  console.log("\n  Acordate de cargarlas también en Vercel.");
  console.log("─".repeat(64));

  console.log("\nFalta una sola cosa, y es a mano en la interfaz de Calendly:");
  console.log("  Evento de 30 min → Confirmation Page → Redirect to an external site");
  console.log("    URL: https://www.shipsafe.lat/demo/agendado");
  console.log("  Y activá el tilde \"Pass event details to your redirected page\".");
  console.log("  Sin ese tilde, Meta cuenta cada agenda DOS veces.\n");
}

function escribirEnvSiCorresponde(valores) {
  if (DRY_RUN) return;
  if (escribirEnv(valores)) ok(`Actualizado ${ARCHIVO_ENV}`);
}

main().catch((err) => {
  console.error("\nSe rompió algo inesperado:", err);
  process.exit(1);
});
