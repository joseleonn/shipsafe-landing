/**
 * POST /api/whatsapp/webhook — mensajes entrantes desde YCloud.
 *
 * Lo que más importa que funcione: las respuestas a los botones de la plantilla
 * de confirmación. Cuando alguien toca "Confirmo" o "Necesito reagendar", eso
 * queda en HubSpot y te dice, un día antes, quién va a faltar. Un no-show que
 * ves venir con 24 horas es una reunión que se reagenda; uno que descubrís a la
 * hora de la reunión es media hora perdida del equipo comercial.
 *
 * Lo que NO hace: contestar preguntas. Si alguien escribe algo que no es
 * confirmar ni reagendar, el mensaje queda en la bandeja de YCloud para que lo
 * atienda una persona. Es a propósito: un bot contestando dudas comerciales de
 * un SaaS B2B hace más daño que bien.
 *
 * Configuración en YCloud: Developers → Webhook → endpoint apuntando acá,
 * suscrito al evento de mensajes entrantes de WhatsApp.
 */
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { normalizarTelefonoAR } from "@/lib/telefono";
import { buscarContactoPorTelefono, upsertContact } from "@/lib/hubspot";
import { proximaReunionDe, cancelarReunion } from "@/lib/calendly";
import { enviarTexto } from "@/lib/whatsapp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Link de agenda que se le manda a quien pide reagendar. */
const LINK_AGENDA = "https://calendly.com/shipsoftwareteam/30min";

/** Tolerancia de reloj para el timestamp firmado (5 minutos). */
const TOLERANCIA_SEGUNDOS = 300;

/**
 * YCloud firma con el header `YCloud-Signature: t={timestamp},s={firma}`,
 * donde la firma es HMAC-SHA256 de `{timestamp}.{cuerpo}`.
 */
function firmaValida(cuerpo: string, header: string | null, secreto: string): boolean {
  if (!header) return false;

  const partes = Object.fromEntries(
    header.split(",").map((p) => {
      const [k, ...v] = p.trim().split("=");
      return [k, v.join("=")];
    })
  ) as { t?: string; s?: string };

  if (!partes.t || !partes.s) return false;

  const edad = Math.abs(Math.floor(Date.now() / 1000) - Number(partes.t));
  if (!Number.isFinite(edad) || edad > TOLERANCIA_SEGUNDOS) return false;

  const esperado = createHmac("sha256", secreto)
    .update(`${partes.t}.${cuerpo}`)
    .digest("hex");

  const a = Buffer.from(esperado, "utf8");
  const b = Buffer.from(partes.s, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

interface EventoYCloud {
  type?: string;
  whatsappInboundMessage?: {
    from?: string;
    type?: string;
    text?: { body?: string };
    button?: { payload?: string; text?: string };
    interactive?: { button_reply?: { id?: string; title?: string } };
  };
}

/** Interpreta la respuesta sin depender del texto exacto del botón. */
function interpretar(m: NonNullable<EventoYCloud["whatsappInboundMessage"]>): "confirmo" | "reagendar" | null {
  const crudo = (
    m.button?.payload ??
    m.button?.text ??
    m.interactive?.button_reply?.id ??
    m.interactive?.button_reply?.title ??
    m.text?.body ??
    ""
  )
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  if (!crudo) return null;
  if (/confirm|si,? voy|ahi estoy|dale/.test(crudo)) return "confirmo";
  if (/reagend|reprogram|no puedo|cambiar.*(hora|dia)|otro (dia|horario)/.test(crudo)) return "reagendar";
  return null;
}

export async function POST(request: Request) {
  const crudo = await request.text();
  const secreto = process.env.YCLOUD_WEBHOOK_SECRET;

  if (!secreto) {
    console.error("[whatsapp] falta YCLOUD_WEBHOOK_SECRET");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (!firmaValida(crudo, request.headers.get("ycloud-signature"), secreto)) {
    return NextResponse.json({ ok: false, error: "firma_invalida" }, { status: 401 });
  }

  let evento: EventoYCloud;
  try {
    evento = JSON.parse(crudo) as EventoYCloud;
  } catch {
    // YCloud reintenta ante cualquier respuesta que no sea 2xx. Un body ilegible
    // no amerita reintentos infinitos.
    return NextResponse.json({ ok: true });
  }

  const mensaje = evento.whatsappInboundMessage;
  if (!mensaje?.from) return NextResponse.json({ ok: true, handled: "sin_mensaje" });

  const telefono = normalizarTelefonoAR(mensaje.from);
  if (!telefono) return NextResponse.json({ ok: true, handled: "telefono_invalido" });

  const respuesta = interpretar(mensaje);
  if (!respuesta) {
    // Conversación real: queda en la bandeja de YCloud para una persona
    console.log("[whatsapp] mensaje entrante para atención humana, de", telefono);
    return NextResponse.json({ ok: true, handled: "humano" });
  }

  const contacto = await buscarContactoPorTelefono(telefono);
  if (!contacto.ok || !contacto.email) {
    console.warn("[whatsapp] no encontré contacto para", telefono);
    return NextResponse.json({ ok: true, handled: "sin_contacto" });
  }

  await upsertContact({
    email: contacto.email,
    ss_wa_respuesta: respuesta,
    ss_wa_sin_confirmar: "", // contestó: ya no hace falta perseguirlo
  });
  console.log(`[whatsapp] ${contacto.email} respondió: ${respuesta}`);

  if (respuesta !== "reagendar") {
    return NextResponse.json({ ok: true, handled: "confirmo" });
  }

  // Pidió reagendar explícitamente: ahí sí liberamos el horario. Nunca por
  // silencio — ver la nota de docs/whatsapp.md.
  const reunion = await proximaReunionDe(contacto.email);
  if (!reunion) {
    console.warn("[whatsapp] pidió reagendar pero no le encontré reunión:", contacto.email);
    return NextResponse.json({ ok: true, handled: "reagendar_sin_reunion" });
  }

  const cancelada = await cancelarReunion(reunion.eventoUri);

  // El toque del botón abrió la ventana de 24 h, así que este mensaje puede ir
  // como texto libre, con el link y todo, sin plantilla aprobada.
  await enviarTexto(
    telefono,
    cancelada.ok
      ? `Listo, liberé ese horario. Cuando quieras elegí uno nuevo acá: ${LINK_AGENDA}\n\nSi preferís, decime dos momentos que te sirvan y lo coordino yo.`
      : `Sin problema. Elegí el horario que te venga bien acá: ${LINK_AGENDA}`
  );

  // Se limpia el historial para que la secuencia arranque de cero en la nueva
  await upsertContact({
    email: contacto.email,
    ss_wa_reunion_uri: "",
    ss_wa_enviados: "",
  });

  return NextResponse.json({ ok: true, handled: "reagendado" });
}
