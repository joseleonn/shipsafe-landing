/**
 * POST /api/lead
 *
 * Es el paso 2 del embudo: el visitante deja sus datos a cambio del recurso.
 *
 * Hace tres cosas, en este orden de importancia:
 *   1. Manda el evento `Lead` a Meta por la API de Conversiones (Optimización 1)
 *   2. Crea o actualiza el contacto en HubSpot con la atribución completa
 *   3. Le dice al front si califica, para mostrarle o no el calendario
 *
 * Nada de esto puede romper la experiencia del usuario: si Meta o HubSpot
 * fallan, el lead igual recibe su recurso. Por eso todo va con Promise.allSettled
 * y los errores se loguean en vez de propagarse.
 */
import { NextResponse } from "next/server";
import { sendMetaEvent, buildFbc, clientIpFrom } from "@/lib/meta-capi";
import { upsertContact, type LeadProperties } from "@/lib/hubspot";
import { calificar } from "@/lib/calificacion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface LeadPayload {
  email?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  empresa?: string;
  empleados?: string;
  rubro?: string;
  rol?: string;
  gestion?: string;
  /** Slug del recurso descargado */
  leadMagnet?: string;
  /** Mismo event_id que usó el pixel del navegador, para deduplicar */
  eventId?: string;
  /** Cookies _fbc y _fbp leídas en el cliente */
  fbc?: string;
  fbp?: string;
  attribution?: Record<string, string>;
  sourceUrl?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Dominios de mail gratuito. No descalifican (mucha PyME industrial usa
 *  Gmail), pero se marcan para poder medir si convierten distinto. */
const DOMINIOS_GENERICOS = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.ar",
  "live.com", "icloud.com", "hotmail.com.ar",
]);

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "json_invalido" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "email_invalido" }, { status: 400 });
  }

  const resultado = calificar({
    empleados: payload.empleados,
    rubro: payload.rubro,
    rol: payload.rol,
    gestion: payload.gestion,
  });

  const attr = payload.attribution ?? {};
  const eventId = payload.eventId ?? `lead-${Date.now()}`;
  const dominio = email.split("@")[1] ?? "";

  const hubspotProps: LeadProperties = {
    email,
    firstname: payload.nombre,
    lastname: payload.apellido,
    phone: payload.telefono,
    company: payload.empresa,
    ss_cantidad_empleados: payload.empleados,
    ss_rubro: payload.rubro,
    ss_rol: payload.rol,
    ss_gestion_actual: payload.gestion,
    ss_calificacion: resultado.califica ? "califica" : "no_califica",
    ss_lead_magnet: payload.leadMagnet,
    ss_utm_source: attr.utm_source,
    ss_utm_medium: attr.utm_medium,
    ss_utm_campaign: attr.utm_campaign,
    ss_utm_content: attr.utm_content,
    ss_utm_term: attr.utm_term,
    ss_fbclid: attr.fbclid,
  };

  const [meta, hubspot] = await Promise.allSettled([
    sendMetaEvent({
      eventName: "Lead",
      eventId,
      eventSourceUrl: payload.sourceUrl,
      user: {
        email,
        phone: payload.telefono,
        firstName: payload.nombre,
        lastName: payload.apellido,
        country: "ar",
        fbc: payload.fbc ?? buildFbc(attr.fbclid),
        fbp: payload.fbp,
        clientIp: clientIpFrom(request.headers),
        userAgent: request.headers.get("user-agent"),
        externalId: email,
      },
      custom: {
        content_name: payload.leadMagnet ?? "sin-recurso",
        // Le mandamos la calificación a Meta como dato del evento. No optimiza
        // por esto directamente, pero queda disponible para desgloses.
        lead_calificado: resultado.califica ? 1 : 0,
        empleados: payload.empleados,
        rubro: payload.rubro,
        rol: payload.rol,
        email_corporativo: DOMINIOS_GENERICOS.has(dominio) ? 0 : 1,
      },
    }),
    upsertContact(hubspotProps),
  ]);

  if (meta.status === "rejected") console.error("[api/lead] meta falló", meta.reason);
  if (hubspot.status === "rejected") console.error("[api/lead] hubspot falló", hubspot.reason);

  return NextResponse.json({
    ok: true,
    califica: resultado.califica,
    motivos: resultado.motivos,
    eventId,
  });
}
