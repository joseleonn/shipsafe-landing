/**
 * Atribución del lado del cliente.
 *
 * El problema que resuelve: el visitante llega desde un anuncio a la landing
 * con ?utm_content=AUDITORIA-VID-v1&fbclid=..., navega, y para cuando deja los
 * datos esos parámetros ya no están en la URL. Si no los guardamos, el lead
 * llega a HubSpot sin origen y nunca vas a saber qué anuncio lo trajo.
 *
 * Guardamos en localStorage y con "first touch wins": si el tipo vuelve por
 * orgánico tres días después, el crédito queda en el anuncio que lo trajo la
 * primera vez.
 */

const STORAGE_KEY = "ss_attribution";

export const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

export type Attribution = Partial<Record<(typeof TRACKED_PARAMS)[number], string>> & {
  landing_page?: string;
  captured_at?: string;
};

function safeRead(): Attribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    // Modo incógnito o storage bloqueado: seguimos sin romper nada
    return null;
  }
}

function safeWrite(value: Attribution): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* noop */
  }
}

/**
 * Se llama una vez por pageview. Si la URL trae parámetros de campaña y todavía
 * no hay nada guardado, los persiste.
 */
export function captureAttribution(search = typeof window !== "undefined" ? window.location.search : ""): Attribution {
  if (typeof window === "undefined") return {};

  const existing = safeRead();
  const params = new URLSearchParams(search);
  const incoming: Attribution = {};

  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) incoming[key] = value;
  }

  const hasIncoming = Object.keys(incoming).length > 0;
  if (!hasIncoming) return existing ?? {};

  // First touch wins
  if (existing && Object.keys(existing).length > 0) return existing;

  incoming.landing_page = window.location.pathname;
  incoming.captured_at = new Date().toISOString();
  safeWrite(incoming);
  return incoming;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  return safeRead() ?? {};
}

/** Lee una cookie por nombre (para _fbp y _fbc que escribe el pixel). */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]!) : null;
}

/**
 * ID de evento compartido entre el pixel del navegador y la API de
 * Conversiones. Sin esto Meta cuenta el mismo lead dos veces.
 */
export function newEventId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${Date.now()}-${random}`;
}
