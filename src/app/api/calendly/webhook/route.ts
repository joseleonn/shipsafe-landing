/**
 * POST /api/calendly/webhook
 *
 * La pieza de mayor apalancamiento de todo el sistema.
 *
 * Cuando alguien confirma una reunión en Calendly, este webhook manda el evento
 * `Schedule` a Meta. Eso es la Optimización 2: Meta toma la base de todos los
 * que agendaron y sale a buscar gente parecida con su base de datos.
 *
 * Lo importante: funciona igual si la reunión la agendó el lead solo desde la
 * página de recurso, o si la agendaste vos a mano por WhatsApp usando el link
 * de Calendly. Por eso la regla es NUNCA agendar por fuera de Calendly: si lo
 * hacés, Meta no se entera y perdés la señal más valiosa que tenés.
 *
 * Registro del webhook (una sola vez, desde tu terminal):
 *
 *   curl -X POST https://api.calendly.com/webhook_subscriptions \
 *     -H "Authorization: Bearer $CALENDLY_TOKEN" \
 *     -H "Content-Type: application/json" \
 *     -d '{
 *       "url": "https://www.shipsafe.lat/api/calendly/webhook",
 *       "events": ["invitee.created", "invitee.canceled"],
 *       "organization": "https://api.calendly.com/organizations/XXXX",
 *       "scope": "organization",
 *       "signing_key": "un-secreto-largo-que-guardas-en-CALENDLY_WEBHOOK_SECRET"
 *     }'
 */
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { sendMetaEvent, buildFbc } from "@/lib/meta-capi";
import { findContactByEmail, upsertContact } from "@/lib/hubspot";
import { crearNegocioSiNoExiste, type ResultadoNegocio } from "@/lib/hubspot-deals";
import { enviarPlantilla, formatearFechaAR } from "@/lib/whatsapp";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Tolerancia de reloj para el timestamp firmado (3 minutos). */
const TOLERANCIA_SEGUNDOS = 180;

/**
 * Calendly firma con el header `Calendly-Webhook-Signature: t=<unix>,v1=<hmac>`
 * donde el hmac es SHA-256 de `${t}.${rawBody}` con la signing key.
 */
function firmaValida(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;

  const partes = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    })
  ) as { t?: string; v1?: string };

  if (!partes.t || !partes.v1) return false;

  const edad = Math.abs(Math.floor(Date.now() / 1000) - Number(partes.t));
  if (!Number.isFinite(edad) || edad > TOLERANCIA_SEGUNDOS) return false;

  const esperado = createHmac("sha256", secret)
    .update(`${partes.t}.${rawBody}`)
    .digest("hex");

  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(partes.v1, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface CalendlyPayload {
  event?: string;
  payload?: {
    email?: string;
    name?: string;
    first_name?: string | null;
    last_name?: string | null;
    text_reminder_number?: string | null;
    tracking?: {
      utm_source?: string | null;
      utm_medium?: string | null;
      utm_campaign?: string | null;
      utm_content?: string | null;
      utm_term?: string | null;
      salesforce_uuid?: string | null;
    };
    questions_and_answers?: { question: string; answer: string }[];
    scheduled_event?: { start_time?: string; uri?: string };
    uri?: string;
  };
}

export async function POST(request: Request) {
  const raw = await request.text();
  const secret = process.env.CALENDLY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("[calendly] falta CALENDLY_WEBHOOK_SECRET");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!firmaValida(raw, request.headers.get("calendly-webhook-signature"), secret)) {
    return NextResponse.json({ ok: false, error: "firma_invalida" }, { status: 401 });
  }

  let body: CalendlyPayload;
  try {
    body = JSON.parse(raw) as CalendlyPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "json_invalido" }, { status: 400 });
  }

  // Las cancelaciones se registran en HubSpot pero NO mandan evento a Meta:
  // no queremos que el algoritmo aprenda de agendas que no se sostuvieron.
  if (body.event === "invitee.canceled") {
    const email = body.payload?.email?.trim().toLowerCase();
    if (!email) return NextResponse.json({ ok: true, handled: "canceled" });

    // Se limpia el historial de recordatorios: si reagenda, la secuencia
    // tiene que arrancar de cero para la reunión nueva.
    await upsertContact({ email, ss_wa_reunion_uri: "", ss_wa_enviados: "" });

    // Una cancelación es el mejor momento para reagendar: la persona todavía
    // tiene el tema en la cabeza. Un día después ya es otra conversación.
    const contactoCancelado = await findContactByEmail(email, ["phone", "firstname"]);
    const telefonoCancelado =
      body.payload?.text_reminder_number ?? contactoCancelado.properties?.phone ?? null;

    if (telefonoCancelado) {
      const nombreCancelado =
        (body.payload?.name ?? "").trim().split(" ")[0] ||
        contactoCancelado.properties?.firstname ||
        "Hola";
      await enviarPlantilla(telefonoCancelado, "demo_reagendar", [nombreCancelado]);
    }

    return NextResponse.json({ ok: true, handled: "canceled" });
  }

  if (body.event !== "invitee.created") {
    return NextResponse.json({ ok: true, handled: "ignored" });
  }

  const invitee = body.payload ?? {};
  const email = invitee.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ ok: false, error: "sin_email" }, { status: 400 });

  // La atribución puede venir por dos caminos: en los UTM que Calendly recibió
  // en la URL, o guardada en HubSpot desde que el lead dejó los datos en la
  // landing. El segundo es el que sirve cuando la reunión la agendaste vos a
  // mano días después.
  const tracking = invitee.tracking ?? {};
  const contacto = await findContactByEmail(email, [
    "ss_utm_source", "ss_utm_campaign", "ss_utm_content", "ss_fbclid",
    "ss_lead_magnet", "firstname", "lastname", "phone", "company",
  ]);
  const guardado = contacto.properties ?? {};

  const utmSource = tracking.utm_source ?? guardado.ss_utm_source ?? undefined;
  const utmCampaign = tracking.utm_campaign ?? guardado.ss_utm_campaign ?? undefined;
  const utmContent = tracking.utm_content ?? guardado.ss_utm_content ?? undefined;
  const fbclid = guardado.ss_fbclid ?? undefined;

  const [nombre, ...resto] = (invitee.name ?? "").trim().split(" ");
  const firstName = invitee.first_name ?? nombre ?? guardado.firstname ?? undefined;
  const lastName = invitee.last_name ?? (resto.length ? resto.join(" ") : undefined) ?? guardado.lastname ?? undefined;
  const telefono = invitee.text_reminder_number ?? guardado.phone ?? undefined;

  // event_id determinístico a partir del URI de la invitación: si Calendly
  // reintenta el webhook, Meta lo deduplica solo.
  const eventId = `schedule-${(invitee.uri ?? email).split("/").pop()}`;

  // El contacto primero, porque necesitamos su ID para colgarle el negocio.
  // Puede no existir todavía: alguien que entra directo a /demo y agenda sin
  // pasar por la landing del recurso llega acá sin haber pasado por /api/lead.
  const contactoActualizado = await upsertContact({
    email,
    firstname: firstName,
    lastname: lastName,
    phone: telefono,
    ss_utm_source: utmSource,
    ss_utm_campaign: utmCampaign,
    ss_utm_content: utmContent,
  });

  const contactId = contactoActualizado.contactId ?? contacto.contactId;

  const [meta, negocio] = await Promise.allSettled([
    sendMetaEvent({
      eventName: "Schedule",
      eventId,
      eventSourceUrl: `${SITE.url}/demo`,
      user: {
        email,
        phone: telefono,
        firstName,
        lastName,
        country: "ar",
        fbc: buildFbc(fbclid),
        externalId: email,
      },
      custom: {
        content_name: "demo-30min",
        utm_source: utmSource,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
      },
    }),
    contactId
      ? crearNegocioSiNoExiste({
          contactId,
          email,
          empresa: guardado.company ?? undefined,
          utmSource,
          utmCampaign,
          utmContent,
          leadMagnet: guardado.ss_lead_magnet ?? undefined,
        })
      : Promise.resolve<ResultadoNegocio>({ ok: false, error: "sin_contact_id" }),
  ]);

  if (meta.status === "rejected") console.error("[calendly] meta falló", meta.reason);
  if (negocio.status === "rejected") console.error("[calendly] negocio falló", negocio.reason);

  // Confirmación inmediata por WhatsApp. Es el mensaje más importante de la
  // secuencia: además de confirmar, es donde se pide sumar al decisor, que es
  // lo que evita la reunión extra de repetir todo.
  const inicio = invitee.scheduled_event?.start_time;
  if (telefono && inicio) {
    const nombreCorto = (firstName ?? "").trim() || "Hola";
    const envio = await enviarPlantilla(telefono, "demo_confirmada", [
      nombreCorto,
      formatearFechaAR(inicio),
    ]);
    if (!envio.ok) console.error("[calendly] no se pudo confirmar por WhatsApp:", envio.error);
  }

  return NextResponse.json({
    ok: true,
    handled: "scheduled",
    eventId,
    dealId: negocio.status === "fulfilled" ? negocio.value.dealId : undefined,
  });
}
