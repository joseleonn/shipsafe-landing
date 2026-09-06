/**
 * Calendly sin salir del sitio.
 *
 * Carga el widget oficial (script + css) recién cuando hace falta y abre el
 * evento en un modal sobre la página (a pantalla completa en el celular).
 * Si el widget no llega —red, bloqueador— el que llama cae al link normal.
 *
 * Después de agendar, Calendly redirige la ventana a /demo/agendado (está
 * configurado en el evento: "Redirect to an external site" + "Pass event
 * details"). Por si esa redirección no ocurre dentro del modal, acá también
 * escuchamos el evento `calendly.event_scheduled` y llevamos a la persona a
 * la misma página con su `invitee_uuid`, que es lo que el pixel necesita para
 * deduplicar contra el webhook.
 */

const WIDGET_JS = "https://assets.calendly.com/assets/external/widget.js";
const WIDGET_CSS = "https://assets.calendly.com/assets/external/widget.css";
const AGENDADO = "/demo/agendado";

type Prefill = { name?: string; email?: string };

interface CalendlyApi {
  initPopupWidget: (opts: { url: string; prefill?: Prefill }) => void;
  closePopupWidget?: () => void;
}

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

let loading: Promise<CalendlyApi> | null = null;
let listening = false;
let onScheduled: ((inviteeUuid: string | null) => void) | null = null;

/** Trae el widget una sola vez. Se puede llamar al pasar el mouse para ganar tiempo. */
export function loadCalendly(timeoutMs = 7000): Promise<CalendlyApi> {
  if (typeof window === "undefined") return Promise.reject(new Error("ssr"));
  if (window.Calendly?.initPopupWidget) return Promise.resolve(window.Calendly);
  if (loading) return loading;
  loading = new Promise<CalendlyApi>((resolve, reject) => {
    if (!document.querySelector(`link[href="${WIDGET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = WIDGET_CSS;
      document.head.appendChild(link);
    }
    const script = document.createElement("script");
    script.src = WIDGET_JS;
    script.async = true;
    const fail = (why: string) => {
      clearTimeout(timer);
      loading = null;
      script.remove();
      reject(new Error(why));
    };
    const timer = setTimeout(() => fail("timeout"), timeoutMs);
    script.onload = () => {
      clearTimeout(timer);
      if (window.Calendly?.initPopupWidget) resolve(window.Calendly);
      else fail("no-api");
    };
    script.onerror = () => fail("error");
    document.head.appendChild(script);
  });
  return loading;
}

/** Colores y ajustes del embed para que el modal se vea parte del sitio. */
function embedUrl(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("hide_gdpr_banner", "1");
    u.searchParams.set("background_color", "ffffff");
    u.searchParams.set("text_color", "0b1f3b");
    u.searchParams.set("primary_color", "005cd6");
    return u.toString();
  } catch {
    return url;
  }
}

function inviteeUuidFrom(payload: unknown): string | null {
  const uri = (payload as { invitee?: { uri?: string } } | undefined)?.invitee?.uri;
  if (typeof uri !== "string") return null;
  const uuid = uri.split("/").pop();
  return uuid && uuid.length > 8 ? uuid : null;
}

function fromCalendly(origin: string) {
  try {
    return /(^|\.)calendly\.com$/.test(new URL(origin).hostname);
  } catch {
    return false;
  }
}

function listen() {
  if (listening) return;
  listening = true;
  window.addEventListener("message", (e: MessageEvent) => {
    if (typeof e.origin !== "string" || !fromCalendly(e.origin)) return;
    const data = e.data as { event?: string; payload?: unknown } | null;
    if (!data || data.event !== "calendly.event_scheduled") return;
    const uuid = inviteeUuidFrom(data.payload);
    onScheduled?.(uuid);
    // Si Calendly ya redirigió, esto no llega a correr. Si no, vamos nosotros.
    window.setTimeout(() => {
      const dest = uuid ? `${AGENDADO}?invitee_uuid=${encodeURIComponent(uuid)}` : AGENDADO;
      window.location.assign(dest);
    }, 1200);
  });
}

/**
 * Abre el evento en el modal. Devuelve false si el widget no está disponible,
 * para que el que llama use el link como siempre.
 */
export async function openCalendly(url: string, opts: { prefill?: Prefill; onScheduled?: (inviteeUuid: string | null) => void } = {}): Promise<boolean> {
  let api: CalendlyApi;
  try {
    api = await loadCalendly();
  } catch {
    return false;
  }
  listen();
  onScheduled = opts.onScheduled ?? null;
  const prefill = opts.prefill && (opts.prefill.name || opts.prefill.email) ? opts.prefill : undefined;
  try {
    api.initPopupWidget({ url: embedUrl(url), prefill });
    return true;
  } catch {
    return false;
  }
}
