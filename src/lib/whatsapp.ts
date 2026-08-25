/**
 * WhatsApp vía YCloud — confirmaciones y recordatorios de reuniones.
 *
 * Por qué esto mueve la aguja: el no-show en B2B argentino, con agenda a 3–5
 * días vista y sin recordatorios, está entre 30% y 50%. Con una secuencia bien
 * puesta baja a 10–20%. Es la mejora más barata del embudo: no toca el
 * presupuesto de ads y sube la métrica que más cuesta, las demos REALIZADAS.
 *
 * ─── Por qué YCloud y no la Cloud API de Meta directo ───────────────────────
 * Las dos cuestan lo mismo —solo se pagan las conversaciones de Meta— pero
 * YCloud suma una bandeja de entrada compartida. Eso es lo que permite usar el
 * MISMO número (341 306-7158) para automatizar y para conversar: con Cloud API
 * pelado, un número conectado a la API deja de tener app de celular y los
 * mensajes entrantes solo llegan a un webhook.
 *
 * Y el embudo manda gente a escribir a ese número: la página de gracias del
 * recurso y la de post-agenda tienen el botón de WhatsApp.
 *
 * ─── La regla de las 24 horas ───────────────────────────────────────────────
 * WhatsApp solo permite escribir libremente dentro de las 24 h posteriores al
 * último mensaje DE LA PERSONA. Fuera de esa ventana, solo plantillas
 * aprobadas. Todos los recordatorios caen fuera, así que todos son plantillas.
 *
 * Las plantillas a crear están documentadas en docs/whatsapp.md
 */
import { normalizarTelefonoAR } from "./telefono";

const API = "https://api.ycloud.com/v2/whatsapp/messages/sendDirectly";

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

function credenciales() {
  return {
    apiKey: process.env.YCLOUD_API_KEY,
    from: process.env.WHATSAPP_FROM,
  };
}

async function enviar(cuerpo: Record<string, unknown>): Promise<ResultadoWhatsApp> {
  const { apiKey } = credenciales();
  if (!apiKey) return { ok: false, error: "missing_credentials" };

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: { "X-API-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });

    const respuesta = (await res.json().catch(() => ({}))) as {
      id?: string;
      wamid?: string;
      error?: { message?: string };
      message?: string;
    };

    if (!res.ok) {
      const detalle = respuesta.error?.message ?? respuesta.message ?? `http_${res.status}`;
      console.error("[whatsapp] error", res.status, detalle);
      return { ok: false, error: detalle };
    }
    return { ok: true, messageId: respuesta.id ?? respuesta.wamid };
  } catch (err) {
    console.error("[whatsapp] fetch falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "fetch_failed" };
  }
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
  const { apiKey, from } = credenciales();
  if (!apiKey || !from) {
    console.warn("[whatsapp] Falta YCLOUD_API_KEY o WHATSAPP_FROM");
    return { ok: false, error: "missing_credentials" };
  }

  const destino = normalizarTelefonoAR(telefono);
  if (!destino) return { ok: false, error: "telefono_invalido" };

  return enviar({
    from,
    to: destino,
    type: "template",
    template: {
      name: plantilla,
      // "deterministic" fuerza el idioma exacto: sin esto, WhatsApp puede
      // elegir otra traducción de la misma plantilla si existiera.
      language: { code: "es_AR", policy: "deterministic" },
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
  });
}

/**
 * Manda un mensaje de texto libre, SIN plantilla.
 *
 * Solo funciona dentro de la ventana de 24 h que se abre cuando la persona
 * escribe o toca un botón. Por eso sirve para responderle a quien tocó
 * "Necesito reagendar": ese toque abrió la ventana, así que le podemos mandar
 * el link de reagenda sin pasar por aprobación de Meta.
 *
 * Fuera de la ventana la API devuelve error y el mensaje no sale. Es esperable:
 * no es un fallo del código.
 */
export async function enviarTexto(
  telefono: string,
  texto: string
): Promise<ResultadoWhatsApp> {
  const { apiKey, from } = credenciales();
  if (!apiKey || !from) return { ok: false, error: "missing_credentials" };

  const destino = normalizarTelefonoAR(telefono);
  if (!destino) return { ok: false, error: "telefono_invalido" };

  return enviar({
    from,
    to: destino,
    type: "text",
    text: { body: texto, preview_url: true },
  });
}

/**
 * Formatea una fecha ISO para el texto del mensaje, en hora de Argentina.
 * Devuelve por ejemplo: "martes, 2 de septiembre a las 15:30"
 */
export function formatearFechaAR(iso: string): string {
  const fecha = new Date(iso);
  const dia = new Intl.DateTimeFormat("es-AR", {
    weekday: "long", day: "numeric", month: "long",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(fecha);
  return `${dia} a las ${formatearHoraAR(iso)}`;
}

/** Solo la hora, para los recordatorios cortos: "15:30" */
export function formatearHoraAR(iso: string): string {
  return new Intl.DateTimeFormat("es-AR", {
    hour: "2-digit", minute: "2-digit", hour12: false,
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date(iso));
}
