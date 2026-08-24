/**
 * GET /api/cron/recordatorios
 *
 * El playbook de asistencia, automatizado. Corre cada 15 minutos, mira qué
 * reuniones vienen y manda por WhatsApp el recordatorio que corresponda.
 *
 * Ventanas de envío. Son anchas a propósito: con el cron cada 15 minutos, una
 * ventana angosta se puede saltear un envío si un ciclo se demora.
 *
 *   t24  →  entre 22 y 26 horas antes
 *   t2   →  entre 90 y 150 minutos antes
 *   t10  →  entre 5 y 25 minutos antes
 *
 * La confirmación inmediata NO sale de acá: la manda el webhook de Calendly en
 * el momento de agendar.
 *
 * Idempotencia: lo ya enviado queda anotado en el contacto de HubSpot, en
 * `ss_wa_enviados`, junto con el URI de la reunión. Si el cron corre dos veces
 * en la misma ventana, el segundo no manda nada. Si la persona reagenda, cambia
 * el URI y el contador se reinicia solo.
 *
 * Programación en Vercel: está en vercel.json. Si el plan no permite crons cada
 * 15 minutos, sirve cualquier cron externo (cron-job.org, por ejemplo) pegándole
 * a esta URL con el header de autorización.
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { reunionesProximas } from "@/lib/calendly";
import { enviarPlantilla, formatearHoraAR, type NombrePlantilla } from "@/lib/whatsapp";
import { findContactByEmail, upsertContact } from "@/lib/hubspot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface Recordatorio {
  clave: string;
  /** Si falta, el paso no manda mensaje: solo marca una propiedad en HubSpot */
  plantilla?: NombrePlantilla;
  minMinutos: number;
  maxMinutos: number;
  parametros?: (nombre: string, hora: string) => string[];
}

const RECORDATORIOS: Recordatorio[] = [
  {
    clave: "t24",
    plantilla: "demo_recordatorio_24h",
    minMinutos: 22 * 60,
    maxMinutos: 26 * 60,
    parametros: (nombre, hora) => [nombre, hora],
  },
  {
    // No manda nada: marca al que todavía no confirmó, para que alguien lo
    // llame. Es a propósito que NO cancele la reunión — el silencio en B2B
    // casi nunca significa "no voy", significa "estoy en una planta".
    clave: "alerta",
    minMinutos: 3 * 60,
    maxMinutos: 6 * 60,
  },
  {
    clave: "t2",
    plantilla: "demo_recordatorio_2h",
    minMinutos: 90,
    maxMinutos: 150,
    parametros: (nombre, hora) => [nombre, hora],
  },
  {
    clave: "t10",
    plantilla: "demo_por_empezar",
    minMinutos: 5,
    maxMinutos: 25,
    parametros: (nombre) => [nombre],
  },
];

function autorizado(request: Request): boolean {
  const esperado = process.env.WEBHOOK_SHARED_SECRET ?? process.env.CRON_SECRET;
  if (!esperado) return false;
  const header = request.headers.get("authorization") ?? "";
  const recibido = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (!recibido) return false;
  const a = createHash("sha256").update(esperado).digest();
  const b = createHash("sha256").update(recibido).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  // WhatsApp es opcional: el resto del embudo funciona sin él. Mientras no esté
  // configurado, el cron responde 200 y no hace nada, en vez de tirar un error
  // cada 15 minutos y ensuciar los logs de Vercel.
  const configurado =
    process.env.WHATSAPP_PHONE_NUMBER_ID &&
    process.env.WHATSAPP_ACCESS_TOKEN &&
    process.env.CALENDLY_TOKEN &&
    process.env.CALENDLY_ORGANIZATION;

  if (!configurado) {
    return NextResponse.json({
      ok: true,
      estado: "whatsapp_no_configurado",
      detalle: "Faltan variables de entorno. Ver docs/whatsapp.md",
    });
  }

  let proximas;
  try {
    proximas = await reunionesProximas(27);
  } catch (err) {
    console.error("[cron] no pude leer Calendly", err);
    return NextResponse.json({ ok: false, error: "calendly_falló" }, { status: 502 });
  }

  const ahora = Date.now();
  const enviados: { email: string; recordatorio: string }[] = [];
  const omitidos: { email: string; motivo: string }[] = [];

  for (const invitado of proximas) {
    const minutosFaltan = (new Date(invitado.inicio).getTime() - ahora) / 60000;

    const toca = RECORDATORIOS.find(
      (r) => minutosFaltan >= r.minMinutos && minutosFaltan <= r.maxMinutos
    );
    if (!toca) continue;

    const contacto = await findContactByEmail(invitado.email, [
      "phone", "firstname", "ss_wa_reunion_uri", "ss_wa_enviados", "ss_wa_respuesta",
    ]);
    const guardado = contacto.properties ?? {};

    // Si el URI cambió, es otra reunión: el historial de envíos no aplica
    const mismaReunion = guardado.ss_wa_reunion_uri === invitado.uri;
    const yaEnviados = mismaReunion
      ? (guardado.ss_wa_enviados ?? "").split(",").filter(Boolean)
      : [];

    if (yaEnviados.includes(toca.clave)) continue;

    const telefono = invitado.telefono ?? guardado.phone ?? null;
    if (!telefono) {
      omitidos.push({ email: invitado.email, motivo: "sin_telefono" });
      continue;
    }

    const nombre = invitado.nombre.split(" ")[0] || guardado.firstname || "Hola";

    if (toca.plantilla) {
      const resultado = await enviarPlantilla(
        telefono,
        toca.plantilla,
        toca.parametros?.(nombre, formatearHoraAR(invitado.inicio)) ?? []
      );
      if (!resultado.ok) {
        omitidos.push({ email: invitado.email, motivo: resultado.error ?? "error" });
        continue;
      }
    }

    // El paso "alerta" no manda mensaje: marca al que no contestó todavía, y un
    // workflow de HubSpot convierte esa marca en una tarea de llamado.
    const marcaAlerta =
      toca.clave === "alerta" && !guardado.ss_wa_respuesta
        ? { ss_wa_sin_confirmar: "true" }
        : {};

    await upsertContact({
      email: invitado.email,
      ss_wa_reunion_uri: invitado.uri,
      ss_wa_enviados: [...yaEnviados, toca.clave].join(","),
      ...marcaAlerta,
    });

    enviados.push({ email: invitado.email, recordatorio: toca.clave });
  }

  console.log(`[cron] ${proximas.length} reuniones revisadas, ${enviados.length} mensajes enviados`);

  return NextResponse.json({
    ok: true,
    revisadas: proximas.length,
    enviados,
    omitidos,
  });
}
