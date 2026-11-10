/**
 * "¿Cómo nos conociste?": la pregunta del evento de Calendly.
 *
 * HubSpot es el único lugar donde se analiza el canal: Calendly solo junta la
 * respuesta. Este archivo traduce el texto que contestó la persona al valor de
 * la propiedad `ss_como_nos_conocio`.
 *
 * Un valor que no está en las opciones de HubSpot hace fallar toda la escritura
 * del contacto, así que lo que no se reconoce cae siempre en "otro".
 */
export type Canal =
  | "tiktok"
  | "instagram"
  | "linkedin"
  | "google"
  | "recomendacion"
  | "whatsapp"
  | "youtube"
  | "ia"
  | "mail"
  | "partner"
  | "otro";

interface Respuesta {
  question: string;
  answer: string;
}

function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function canalDeCalendly(respuestas?: Respuesta[]): Canal | undefined {
  const respuesta = respuestas?.find((r) => normalizar(r.question ?? "").includes("como nos conociste"));
  const texto = normalizar(respuesta?.answer ?? "");
  if (!texto) return undefined;

  if (texto.includes("tiktok")) return "tiktok";
  if (texto.includes("instagram")) return "instagram";
  if (texto.includes("linkedin")) return "linkedin";
  if (texto.includes("google")) return "google";
  if (texto.includes("recomend")) return "recomendacion";
  if (texto.includes("whatsapp")) return "whatsapp";
  if (texto.includes("youtube")) return "youtube";
  if (/chatgpt|gemini|claude|perplexity|copilot|\bia\b|inteligencia artificial/.test(texto)) return "ia";
  if (/\bmail\b|correo|email/.test(texto)) return "mail";
  if (texto.includes("partner") || texto.includes("consultor")) return "partner";
  return "otro";
}
