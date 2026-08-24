/**
 * Webhook de WhatsApp Cloud API.
 *
 * GET  — verificación del webhook cuando lo configurás en Meta (una sola vez)
 * POST — mensajes entrantes
 *
 * Lo que más importa que funcione: las respuestas a los botones de la plantilla
 * de confirmación. Cuando alguien toca "Confirmo" o "Necesito reagendar", eso
 * queda en HubSpot y te dice, un día antes, quién va a faltar. Un no-show que
 * ves venir con 24 horas es una reunión que se reagenda; uno que descubrís a la
 * hora de la reunión es media hora perdida del equipo comercial.
 */
import { NextResponse } from "next/server";
import { normalizarTelefonoAR } from "@/lib/telefono";
import { buscarContactoPorTelefono, upsertContact } from "@/lib/hubspot";
import { proximaReunionDe, cancelarReunion } from "@/lib/calendly";
import { enviarTexto } from "@/lib/whatsapp";

/** Link de agenda que se le manda a quien pide reagendar. */
const LINK_AGENDA = "https://calendly.com/shipsoftwareteam/30min";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Verificación inicial: Meta pega un GET y espera que le devuelvas el challenge. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const modo = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");

  if (modo === "subscribe" && token && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ ok: false }, { status: 403 });
}

interface MensajeEntrante {
  from?: string;
  type?: string;
  text?: { body?: string };
  /** Respuesta a un botón de plantilla */
  button?: { text?: string; payload?: string };
  /** Respuesta a un botón interactivo */
  interactive?: { button_reply?: { id?: string; title?: string } };
}

/** Interpreta la respuesta del usuario sin depender del texto exacto del botón. */
function interpretar(mensaje: MensajeEntrante): "confirmo" | "reagendar" | null {
  const crudo = (
    mensaje.button?.payload ??
    mensaje.button?.text ??
    mensaje.interactive?.button_reply?.id ??
    mensaje.interactive?.button_reply?.title ??
    mensaje.text?.body ??
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
  let cuerpo: {
    entry?: { changes?: { value?: { messages?: MensajeEntrante[] } }[] }[];
  };
  try {
    cuerpo = await request.json();
  } catch {
    // Meta reintenta ante cualquier respuesta que no sea 200. Un body raro no
    // amerita reintentos infinitos.
    return NextResponse.json({ ok: true });
  }

  const mensajes =
    cuerpo.entry?.flatMap((e) => e.changes?.flatMap((c) => c.value?.messages ?? []) ?? []) ?? [];

  for (const mensaje of mensajes) {
    if (!mensaje.from) continue;

    const telefono = normalizarTelefonoAR(mensaje.from);
    if (!telefono) continue;

    const respuesta = interpretar(mensaje);
    if (!respuesta) {
      console.log("[whatsapp] mensaje entrante sin acción automática, de", telefono);
      continue;
    }

    const contacto = await buscarContactoPorTelefono(telefono);
    if (!contacto.ok || !contacto.email) {
      console.warn("[whatsapp] no encontré contacto para", telefono);
      continue;
    }

    await upsertContact({
      email: contacto.email,
      ss_wa_respuesta: respuesta,
      // Contestó: ya no hace falta que nadie lo persiga
      ss_wa_sin_confirmar: "",
    });
    console.log(`[whatsapp] ${contacto.email} respondió: ${respuesta}`);

    if (respuesta !== "reagendar") continue;

    // Pidió reagendar explícitamente: ahí sí liberamos el horario. Nunca por
    // silencio — ver la nota de docs/whatsapp.md.
    const reunion = await proximaReunionDe(contacto.email);
    if (!reunion) {
      console.warn("[whatsapp] pidió reagendar pero no le encontré reunión:", contacto.email);
      continue;
    }

    const cancelada = await cancelarReunion(reunion.eventoUri);

    // El toque del botón abrió la ventana de 24 h, así que este mensaje puede
    // ir como texto libre, con el link y todo, sin plantilla aprobada.
    await enviarTexto(
      telefono,
      cancelada.ok
        ? `Listo, liberé ese horario. Cuando quieras elegí uno nuevo acá: ${LINK_AGENDA}\n\nSi preferís, decime dos momentos que te sirvan y lo coordino yo.`
        : `Sin problema. Elegí el horario que te venga bien acá: ${LINK_AGENDA}`
    );

    // Se limpia el historial para que la secuencia arranque de cero en la
    // reunión nueva.
    await upsertContact({
      email: contacto.email,
      ss_wa_reunion_uri: "",
      ss_wa_enviados: "",
    });
  }

  // Siempre 200: si devolvés otra cosa, Meta reintenta y te duplica el procesamiento
  return NextResponse.json({ ok: true });
}
