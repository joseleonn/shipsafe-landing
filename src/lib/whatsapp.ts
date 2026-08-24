/**
 * WhatsApp Cloud API — recordatorios y confirmaciones de reuniones.
 *
 * Por qué esto mueve la aguja: el no-show en B2B argentino, con agenda a 3–5
 * días vista y sin recordatorios, está entre 30% y 50%. Con una secuencia bien
 * puesta baja a 10–20%. Es la mejora más barata del embudo entero: no toca el
 * presupuesto de ads y sube la métrica que más cuesta, las demos REALIZADAS.
 *
 * ─── La regla de las 24 horas ────────────────────────────────────────────────
 * WhatsApp solo permite escribirle libremente a alguien dentro de las 24 h
 * posteriores a SU último mensaje. Fuera de esa ventana solo se pueden mandar
 * PLANTILLAS APROBADAS por Meta. Todos nuestros recordatorios caen fuera de la
 * ventana, así que todos son plantillas. No es un detalle: es la razón por la
 * que el texto de cada mensaje tiene que estar aprobado antes de poder usarse.
 *
 * Las plantillas de categoría "utilidad" (recordatorios de algo que la persona
 * agendó) se aprueban rápido y cuestan centavos. Con 15 demos al mes son
 * alrededor de USD 2 mensuales.
 *
 * Las plantillas a crear están documentadas en docs/whatsapp.md
 */
import { normalizarTelefonoAR } from "./telefono";

const API_VERSION = "v21.0";

export type NombrePlantilla =
  | "demo_confirmada"
  | "demo_recordatorio_24h"
  | "demo_recordatorio_2h"
  | "demo_por_empezar"
  | "demo_reagendar";

export interface ResultadoWhatsApp {
  ok: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Manda una plantilla. Los parámetros van en orden y reemplazan a {{1}}, {{2}}...
 * del cuerpo aprobado.
 *
 * NUNCA lanza: que falle un recordatorio no puede tumbar el webhook que lo
 * disparó ni el cron que lo corre.
 */
export async function enviarPlantilla(
  telefono: string,
  plantilla: NombrePlantilla,
  parametros: string[] = []
): Promise<ResultadoWhatsApp> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !token) {
    console.warn("[whatsapp] Falta WHATSAPP_PHONE_NUMBER_ID o WHATSAPP_ACCESS_TOKEN");
    return { ok: false, error: "missing_credentials" };
  }

  const destino = normalizarTelefonoAR(telefono);
  if (!destino) return { ok: false, error: "telefono_invalido" };

  const body = {
    messaging_product: "whatsapp",
    to: destino,
    type: "template",
    template: {
      name: plantilla,
      language: { code: "es_AR" },
      ...(parametros.length
        ? {
            components: [
              {
                type: "body",
                parameters: parametros.map((text) => ({ type: "text", text })),
              },
            ],
          }
        : {}),
    },
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const respuesta = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message?: string; error_data?: { details?: string } };
    };

    if (!res.ok) {
      const detalle = respuesta.error?.error_data?.details ?? respuesta.error?.message;
      console.error("[whatsapp] error", res.status, detalle);
      return { ok: false, error: detalle ?? `http_${res.status}` };
    }

    return { ok: true, messageId: respuesta.messages?.[0]?.id };
  } catch (err) {
    console.error("[whatsapp] fetch falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "fetch_failed" };
  }
}

/**
 * Formatea una fecha ISO para el texto del mensaje, en hora de Argentina.
 * Devuelve por ejemplo: "martes 2 de septiembre a las 15:30"
 */
export function formatearFechaAR(iso: string): string {
  const fecha = new Date(iso);
  const dia = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(fecha);
  const hora = new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(fecha);
  return `${dia} a las ${hora}`;
}

/** Solo la hora, para los recordatorios cortos: "15:30" */
export function formatearHoraAR(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
}

/**
 * Manda un mensaje de texto libre, SIN plantilla.
 *
 * Solo funciona dentro de la ventana de 24 h que se abre cuando la persona te
 * escribe o toca un botón. Justamente por eso sirve para responder a quien tocó
 * "Necesito reagendar": ese toque abrió la ventana, así que podemos mandarle el
 * link de reagenda en un mensaje normal, sin pasar por aprobación de Meta.
 *
 * Fuera de la ventana, la API devuelve error y el mensaje no sale. Es esperable:
 * no es un fallo del código.
 */
export async function enviarTexto(
  telefono: string,
  texto: string
): Promise<ResultadoWhatsApp> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!phoneNumberId || !token) return { ok: false, error: "missing_credentials" };

  const destino = normalizarTelefonoAR(telefono);
  if (!destino) return { ok: false, error: "telefono_invalido" };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: destino,
          type: "text",
          text: { preview_url: true, body: texto },
        }),
      }
    );
    const respuesta = (await res.json()) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };
    if (!res.ok) {
      console.error("[whatsapp] texto libre falló", res.status, respuesta.error?.message);
      return { ok: false, error: respuesta.error?.message ?? `http_${res.status}` };
    }
    return { ok: true, messageId: respuesta.messages?.[0]?.id };
  } catch (err) {
    console.error("[whatsapp] fetch falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "fetch_failed" };
  }
}
