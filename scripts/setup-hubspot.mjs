#!/usr/bin/env node
/**
 * Setup de HubSpot para el embudo de Meta Ads.
 *
 * Crea, si no existen ya:
 *   - el grupo de propiedades "Embudo Meta Ads"
 *   - 18 propiedades de contacto (calificación + atribución + estado de WhatsApp)
 *   - 5 propiedades de negocio (atribución a nivel deal + control de eventos)
 *   - el pipeline "SHIPSAFE — Ventas" con sus 8 etapas
 *
 * Es IDEMPOTENTE: se puede correr todas las veces que quieras. Lo que ya existe
 * no se toca ni se duplica.
 *
 * Uso (desde la raíz del proyecto):
 *   node scripts/setup-hubspot.mjs --dry-run      # muestra qué haría
 *   node scripts/setup-hubspot.mjs                # crea lo que falte
 *   node scripts/setup-hubspot.mjs --escribir-env # además carga los IDs en .env.local
 *   node scripts/setup-hubspot.mjs --adaptar-pipeline --escribir-env
 *       ↑ en HubSpot Free solo se permite UN pipeline de negocios. Con este flag,
 *         en vez de crear uno nuevo, le agrega las etapas que falten al que ya
 *         tenés. NO borra ni renombra las etapas existentes.
 *
 * Al terminar imprime las variables de entorno que hay que cargar en Vercel.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";

const TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const DRY_RUN = process.argv.includes("--dry-run");
const ESCRIBIR_ENV = process.argv.includes("--escribir-env");
const ADAPTAR = process.argv.includes("--adaptar-pipeline");
const ARCHIVO_ENV = ".env.local";
const BASE = "https://api.hubapi.com";
const GRUPO = "shipsafe_embudo";

const SCOPES_NECESARIOS = [
  "crm.objects.contacts.read",
  "crm.objects.contacts.write",
  "crm.objects.deals.read",
  "crm.objects.deals.write",
  "crm.schemas.contacts.write",
  "crm.schemas.deals.read",
  "crm.schemas.deals.write",
];

if (!TOKEN) {
  console.error("Falta HUBSPOT_ACCESS_TOKEN.\n");
  console.error("Sacalo de: HubSpot → Settings → Integrations → Private Apps → tu app → Auth");
  console.error("Scopes necesarios:");
  for (const s of SCOPES_NECESARIOS) console.error(`  - ${s}`);
  console.error("");
  process.exit(1);
}

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
    // Sin red, detrás de un proxy o con DNS bloqueado. No es un problema de
    // permisos, y confundir las dos cosas hace perder mucho tiempo.
    return { ok: false, red: false, status: 0, body: { message: String(err) } };
  }

  const text = await res.text();
  let body;
  try { body = text ? JSON.parse(text) : {}; } catch { body = { raw: text }; }

  // Algunos proxies devuelven 403 con un cuerpo que no es JSON de HubSpot.
  // Eso tampoco es un problema de permisos.
  if (!res.ok && body.raw && !body.category) {
    return { ok: false, red: false, status: res.status, body };
  }
  return { ok: res.ok, red: true, status: res.status, body };
}

const ok = (m) => console.log(`  ✓ ${m}`);

/**
 * Carga los IDs en .env.local sin tocar el resto del archivo.
 *
 * Reemplaza la línea si la variable ya está (aunque esté vacía) y la agrega al
 * final si no existe. Así se puede correr las veces que haga falta.
 */
function escribirEnv(valores) {
  if (!existsSync(ARCHIVO_ENV)) {
    console.log(`\n  · No encontré ${ARCHIVO_ENV} en este directorio.`);
    console.log("    Corré el script desde la raíz del proyecto, o cargá los IDs a mano.");
    return false;
  }

  let contenido = readFileSync(ARCHIVO_ENV, "utf8");

  for (const [clave, valor] of Object.entries(valores)) {
    // Nunca escribir undefined/null: dejar la variable vacía es mucho menos
    // dañino que dejarla con la cadena "undefined", que parece un valor válido.
    if (!valor || valor === "undefined") {
      console.log(`  ⚠ No pude resolver ${clave}, lo dejo como estaba.`);
      continue;
    }
    const linea = `${clave}=${valor}`;
    const patron = new RegExp(`^${clave}=.*$`, "m");
    contenido = patron.test(contenido)
      ? contenido.replace(patron, linea)
      : `${contenido.trimEnd()}\n${linea}\n`;
  }

  writeFileSync(ARCHIVO_ENV, contenido);
  return true;
}
const skip = (m) => console.log(`  · ${m} (ya existía)`);
const fail = (m, d) => console.log(`  ✗ ${m} — ${d}`);

// ─────────────────────────────────────────── definiciones

const opciones = (pares) =>
  pares.map(([value, label], i) => ({ label, value, displayOrder: i, hidden: false }));

const PROPIEDADES_CONTACTO = [
  {
    name: "ss_cantidad_empleados", label: "Cantidad de empleados",
    type: "enumeration", fieldType: "select",
    options: opciones([
      ["1-9", "1 a 9"], ["10-49", "10 a 49"], ["50-99", "50 a 99"],
      ["100-249", "100 a 249"], ["250-499", "250 a 499"], ["500+", "Más de 500"],
    ]),
  },
  {
    name: "ss_rubro", label: "Rubro",
    type: "enumeration", fieldType: "select",
    options: opciones([
      ["metalurgica", "Metalúrgica"], ["construccion", "Construcción"],
      ["logistica", "Logística y transporte"], ["alimenticia", "Alimenticia"],
      ["manufactura", "Manufactura / industria"], ["mantenimiento", "Mantenimiento industrial"],
      ["agroindustria", "Agroindustria"], ["energia", "Energía / petroquímica"],
      ["laboratorio", "Laboratorio / química"], ["otro", "Otro"],
    ]),
  },
  {
    name: "ss_rol", label: "Rol en la empresa",
    type: "enumeration", fieldType: "select",
    options: opciones([
      ["syh", "Responsable de Seguridad e Higiene / HSE"],
      ["gerencia_planta", "Gerencia de planta u operaciones"],
      ["direccion", "Dirección / dueño"], ["rrhh", "RRHH con SST a cargo"],
      ["consultor", "Consultor externo de SyH"], ["estudiante", "Estudiante / otro"],
    ]),
  },
  {
    name: "ss_gestion_actual", label: "Cómo gestiona SST hoy",
    type: "enumeration", fieldType: "select",
    options: opciones([
      ["excel", "Excel y planillas"], ["papel", "Papel y carpetas"],
      ["mixto", "Un poco de todo"],
      ["sistema_incompleto", "Tiene un sistema que no le alcanza"],
      ["otra_plataforma", "Ya usa una plataforma de SST que le funciona"],
    ]),
  },
  {
    name: "ss_calificacion", label: "Calificación",
    type: "enumeration", fieldType: "select",
    options: opciones([["califica", "Califica"], ["no_califica", "No califica"]]),
  },
  { name: "ss_lead_magnet", label: "Recurso descargado", type: "string", fieldType: "text" },
  { name: "ss_utm_source", label: "UTM source", type: "string", fieldType: "text" },
  { name: "ss_utm_medium", label: "UTM medium", type: "string", fieldType: "text" },
  { name: "ss_utm_campaign", label: "UTM campaign", type: "string", fieldType: "text" },
  {
    name: "ss_utm_content", label: "UTM content (ángulo del anuncio)",
    type: "string", fieldType: "text",
    description: "El ángulo del creativo que trajo al lead. Es la propiedad que responde qué anuncio trae los clientes que cierran.",
  },
  { name: "ss_utm_term", label: "UTM term", type: "string", fieldType: "text" },
  { name: "ss_fbclid", label: "Facebook click ID", type: "string", fieldType: "text" },

  // Estado de la secuencia de WhatsApp. Sirven para no mandar dos veces el
  // mismo recordatorio y para ver quién confirmó asistencia.
  { name: "ss_wa_reunion_uri", label: "WhatsApp · reunión en curso", type: "string", fieldType: "text" },
  { name: "ss_wa_enviados", label: "WhatsApp · recordatorios enviados", type: "string", fieldType: "text" },
  {
    name: "ss_wa_respuesta", label: "WhatsApp · respuesta a la confirmación",
    type: "enumeration", fieldType: "select",
    options: opciones([["confirmo", "Confirmó asistencia"], ["reagendar", "Pidió reagendar"]]),
    description: "Lo que contestó a los botones del mensaje de confirmación. Un 'pidió reagendar' 24 h antes es un no-show que se evita.",
  },
  {
    name: "ss_wa_sin_confirmar", label: "WhatsApp · no confirmó",
    type: "string", fieldType: "text",
    description: "Se pone en 'true' cuando faltan pocas horas para la reunión y la persona todavía no confirmó. Sirve para disparar una tarea de llamado.",
  },
  {
    name: "ss_setting_encolado", label: "Setting · encolado",
    type: "string", fieldType: "text",
    description: "Fecha en que entró a la cola de contacto manual, o 'agendó' si no hizo falta. Lo maneja el cron: no lo edites a mano.",
  },
  {
    name: "ss_setting_mensaje", label: "Setting · mensaje sugerido",
    type: "string", fieldType: "textarea",
    description: "El mensaje de WhatsApp ya escrito y personalizado para este lead. Lo genera el cron: copiá y pegá.",
  },
];

// La atribución se copia también al negocio: sin esto no podés hacer un informe
// de ingresos por ángulo de anuncio, que es el informe que importa.
const PROPIEDADES_NEGOCIO = [
  { name: "ss_utm_source", label: "UTM source", type: "string", fieldType: "text" },
  { name: "ss_utm_campaign", label: "UTM campaign", type: "string", fieldType: "text" },
  { name: "ss_utm_content", label: "UTM content (ángulo del anuncio)", type: "string", fieldType: "text" },
  { name: "ss_lead_magnet", label: "Recurso descargado", type: "string", fieldType: "text" },
  {
    name: "ss_meta_eventos", label: "Eventos ya enviados a Meta",
    type: "string", fieldType: "text",
    description: "Etapas cuyo evento ya se le mandó a Meta, separadas por coma. Lo maneja el cron: no lo edites a mano.",
  },
];

// Las 8 etapas del proceso comercial real, con las fechas que después dan el
// ciclo de venta por etapa.
const ETAPAS = [
  { label: "Lead", probability: "0.05" },
  { label: "Demo agendada", probability: "0.15" },
  { label: "Demo realizada", probability: "0.3" },
  { label: "Pricing enviado", probability: "0.4" },
  { label: "Prueba guiada en curso", probability: "0.6" },
  { label: "Decisión", probability: "0.8" },
  { label: "Ganado", probability: "1.0", closed: true },
  { label: "Perdido", probability: "0.0", closed: true },
];

const PIPELINE_LABEL = "SHIPSAFE — Ventas";

// ─────────────────────────────────────────── ejecución

async function crearGrupo(objeto) {
  const existentes = await api(`/crm/v3/properties/${objeto}/groups`);
  if (existentes.ok && existentes.body.results?.some((g) => g.name === GRUPO)) {
    skip(`Grupo de propiedades en ${objeto}`);
    return;
  }
  if (DRY_RUN) return ok(`[dry-run] crearía el grupo en ${objeto}`);
  const res = await api(`/crm/v3/properties/${objeto}/groups`, {
    method: "POST",
    body: JSON.stringify({ name: GRUPO, label: "Embudo Meta Ads", displayOrder: -1 }),
  });
  res.ok ? ok(`Grupo de propiedades en ${objeto}`) : fail(`Grupo en ${objeto}`, res.body?.message);
}

/**
 * Agrega a una propiedad de tipo enumeration las opciones que le falten.
 * Devuelve cuántas agregó. No toca nada si la propiedad no es enumeration.
 */
async function agregarOpcionesFaltantes(objeto, def, actual) {
  if (def.type !== "enumeration" || !def.options || !actual) return 0;

  const yaEstan = new Set((actual.options ?? []).map((o) => o.value));
  const faltantes = def.options.filter((o) => !yaEstan.has(o.value));
  if (faltantes.length === 0) return 0;

  if (DRY_RUN) {
    for (const o of faltantes) ok(`[dry-run] agregaría ${objeto}.${def.name} = "${o.label}"`);
    return faltantes.length;
  }

  const res = await api(`/crm/v3/properties/${objeto}/${def.name}`, {
    method: "PATCH",
    body: JSON.stringify({ options: [...(actual.options ?? []), ...faltantes] }),
  });
  if (!res.ok) {
    fail(`${objeto}.${def.name} — no pude agregar opciones`, res.body?.message);
    return 0;
  }
  return faltantes.length;
}

async function crearPropiedades(objeto, definiciones) {
  const actuales = await api(`/crm/v3/properties/${objeto}`);
  if (!actuales.ok) {
    fail(`No pude leer las propiedades de ${objeto}`, actuales.body?.message);
    return;
  }
  const existentes = new Set(actuales.body.results.map((p) => p.name));

  const porNombre = new Map(actuales.body.results.map((p) => [p.name, p]));

  for (const def of definiciones) {
    if (existentes.has(def.name)) {
      // La propiedad existe, pero puede haberle crecido una opción nueva.
      //
      // Antes esto salteaba y listo, y ahí quedaba una trampa silenciosa: si el
      // formulario ofrece un valor que HubSpot no conoce, el contacto se crea
      // igual pero esa propiedad llega vacía. Sin error, sin aviso.
      //
      // Solo AGREGA opciones que falten. Nunca saca las que ya están: sacarlas
      // dejaría huérfanos a los contactos que ya tienen ese valor cargado.
      const nuevas = await agregarOpcionesFaltantes(objeto, def, porNombre.get(def.name));
      if (nuevas > 0) ok(`${objeto}.${def.name} — ${nuevas} opción(es) nueva(s)`);
      else skip(`${objeto}.${def.name}`);
      continue;
    }
    if (DRY_RUN) { ok(`[dry-run] crearía ${objeto}.${def.name}`); continue; }

    const res = await api(`/crm/v3/properties/${objeto}`, {
      method: "POST",
      body: JSON.stringify({ ...def, groupName: GRUPO }),
    });
    res.ok ? ok(`${objeto}.${def.name}`) : fail(`${objeto}.${def.name}`, res.body?.message);
  }
}

async function crearPipeline() {
  const actuales = await api("/crm/v3/pipelines/deals");
  if (!actuales.ok) {
    fail("No pude leer los pipelines", actuales.body?.message);
    return null;
  }
  const existente = actuales.body.results.find((p) => p.label === PIPELINE_LABEL);
  if (existente) {
    skip(`Pipeline "${PIPELINE_LABEL}"`);
    return existente;
  }

  /**
   * En HubSpot Free solo se permite un pipeline de negocios, así que las etapas
   * se agregaron al que ya existía y NO hay ninguno con nuestro label.
   *
   * Si ese pipeline ya tiene las 8 etapas, el trabajo está hecho: no tiene
   * sentido intentar crear uno nuevo para chocar contra el límite y mostrar un
   * error rojo en cada corrida. Lo detectamos y seguimos.
   */
  const yaAdaptado = actuales.body.results.find((p) => {
    const etiquetas = new Set((p.stages ?? []).map((e) => e.label.trim().toLowerCase()));
    return ETAPAS.every((e) => etiquetas.has(e.label.toLowerCase()));
  });
  if (yaAdaptado) {
    skip(`Las ${ETAPAS.length} etapas ya están en el pipeline "${yaAdaptado.label}"`);
    return yaAdaptado;
  }
  if (DRY_RUN) { ok(`[dry-run] crearía el pipeline "${PIPELINE_LABEL}"`); return null; }

  const res = await api("/crm/v3/pipelines/deals", {
    method: "POST",
    body: JSON.stringify({
      label: PIPELINE_LABEL,
      displayOrder: 0,
      stages: ETAPAS.map((e, i) => ({
        label: e.label,
        displayOrder: i,
        metadata: { isClosed: e.closed ? "true" : "false", probability: e.probability },
      })),
    }),
  });
  if (!res.ok) {
    const limite = /limit of \d+ deal pipeline/i.test(res.body?.message ?? "");
    if (limite && !ADAPTAR) {
      fail("Pipeline", res.body.message);
      console.log("\n  HubSpot Free permite un solo pipeline de negocios.");
      console.log("  Volvé a correr con --adaptar-pipeline y le agrego las etapas");
      console.log("  que falten al pipeline que ya tenés, sin tocar las actuales.\n");
      return null;
    }
    if (!limite) { fail("Pipeline", res.body?.message); return null; }
    return adaptarPipeline(actuales.body.results);
  }
  ok(`Pipeline "${PIPELINE_LABEL}" con ${ETAPAS.length} etapas`);
  return res.body;
}

/**
 * Plan B para HubSpot Free: en vez de crear un pipeline nuevo, le agrega al que
 * ya existe las etapas que le falten.
 *
 * Es conservador a propósito: no borra ni renombra nada de lo que ya está. Si
 * tenías etapas propias, siguen ahí; las nuestras se suman al final, antes de
 * las de cierre.
 */
async function adaptarPipeline(pipelines) {
  const destino = pipelines[0];
  if (!destino) { fail("Adaptar pipeline", "no hay ningún pipeline"); return null; }

  console.log(`\n  Adaptando el pipeline existente: "${destino.label}"`);

  const existentes = new Map(
    (destino.stages ?? []).map((e) => [e.label.trim().toLowerCase(), e])
  );
  const faltantes = ETAPAS.filter((e) => !existentes.has(e.label.toLowerCase()));

  if (!faltantes.length) {
    skip("Todas las etapas ya existen");
    return destino;
  }

  if (DRY_RUN) {
    for (const e of faltantes) ok(`[dry-run] agregaría la etapa "${e.label}"`);
    return destino;
  }

  // Las etapas de cierre van siempre al final
  const ordenBase = Math.max(
    0,
    ...(destino.stages ?? []).filter((e) => e.metadata?.isClosed !== "true").map((e) => e.displayOrder ?? 0)
  );

  let creadas = 0;
  for (const [i, etapa] of faltantes.entries()) {
    const res = await api(`/crm/v3/pipelines/deals/${destino.id}/stages`, {
      method: "POST",
      body: JSON.stringify({
        label: etapa.label,
        displayOrder: etapa.closed ? 100 + i : ordenBase + 1 + i,
        metadata: { isClosed: etapa.closed ? "true" : "false", probability: etapa.probability },
      }),
    });
    if (res.ok) { ok(`Etapa "${etapa.label}"`); creadas++; }
    else fail(`Etapa "${etapa.label}"`, res.body?.message);
  }

  if (!creadas) return destino;

  // Se relee para devolver los stageId nuevos
  const actualizado = await api(`/crm/v3/pipelines/deals/${destino.id}`);
  return actualizado.ok ? actualizado.body : destino;
}

async function main() {
  console.log(`\nSetup de HubSpot — embudo Meta Ads${DRY_RUN ? "  [DRY RUN, no escribe nada]" : ""}\n`);

  const quien = await api("/crm/v3/objects/contacts?limit=1");

  if (!quien.ok && quien.red === false) {
    console.error("\nNo pude llegar a api.hubapi.com.");
    console.error("Esto NO es un problema de permisos del token: es de red.");
    console.error(`Detalle: ${quien.body?.message ?? quien.body?.raw ?? "sin detalle"}`.slice(0, 300));
    console.error("\nCorré este script desde una máquina con salida a internet sin restricciones.\n");
    process.exit(1);
  }

  if (!quien.ok) {
    console.error(`\nHubSpot rechazó el token (HTTP ${quien.status}): ${quien.body?.message ?? ""}`);

    // Le preguntamos a HubSpot qué scopes tiene el token y le decimos al usuario
    // exactamente cuál agregar, en vez de mandarlo a revisar siete a ojo.
    try {
      const info = await fetch(`${BASE}/oauth/v1/access-tokens/${TOKEN}`);
      const datos = await info.json();
      if (Array.isArray(datos.scopes)) {
        const faltan = SCOPES_NECESARIOS.filter((s) => !datos.scopes.includes(s));
        if (faltan.length) {
          console.error("\nLe faltan estos scopes a la Private App:");
          for (const s of faltan) console.error(`  ✗ ${s}`);
          console.error("\nSettings → Integrations → Private Apps → tu app → Scopes.");
          console.error("Agregalos, guardá, y volvé a correr este script.\n");
        } else {
          console.error("\nLos scopes están todos. Revisá que el token no esté vencido o revocado.\n");
        }
      }
    } catch {
      console.error("\nScopes necesarios:");
      for (const s of SCOPES_NECESARIOS) console.error(`  - ${s}`);
      console.error("");
    }
    process.exit(1);
  }
  ok("Token válido, con los scopes necesarios");

  console.log("\nPropiedades de contacto");
  await crearGrupo("contacts");
  await crearPropiedades("contacts", PROPIEDADES_CONTACTO);

  console.log("\nPropiedades de negocio");
  await crearGrupo("deals");
  await crearPropiedades("deals", PROPIEDADES_NEGOCIO);

  console.log("\nPipeline de ventas");
  const pipeline = await crearPipeline();

  if (pipeline) {
    const etapa = (label) => pipeline.stages?.find((s) => s.label === label);
    const agendada = etapa("Demo agendada");

    console.log("\n" + "─".repeat(64));
    console.log(`HUBSPOT_PIPELINE_ID=${pipeline.id}`);
    if (agendada?.id) console.log(`HUBSPOT_STAGE_DEMO_AGENDADA=${agendada.id}`);

    if (ESCRIBIR_ENV && !DRY_RUN) {
      const escrito = escribirEnv({
        HUBSPOT_PIPELINE_ID: pipeline.id,
        HUBSPOT_STAGE_DEMO_AGENDADA: agendada?.id,
      });
      if (escrito) {
        console.log(`\n  ✓ Cargados en ${ARCHIVO_ENV}`);
        console.log("    Acordate de ponerlos también en Vercel.");
      }
    } else if (!DRY_RUN) {
      console.log("\nPara cargarlos solos en .env.local, volvé a correr con --escribir-env");
    }

    console.log("\nIDs de todas las etapas, por si los necesitás en workflows:\n");
    for (const s of pipeline.stages?.sort((a, b) => a.displayOrder - b.displayOrder) ?? []) {
      console.log(`  ${String(s.label).padEnd(26)} ${s.id}`);
    }
    console.log("─".repeat(64) + "\n");
  }

  console.log("Listo.\n");
}

main().catch((err) => {
  console.error("\nSe rompió algo inesperado:", err);
  process.exit(1);
});
