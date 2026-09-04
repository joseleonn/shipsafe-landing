type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    ttq?: {
      page: (...args: unknown[]) => void;
      track: (event: string, params?: Record<string, unknown>) => void;
      [key: string]: unknown;
    };
  }
}

export const EVENTS = {
  GENERATE_LEAD: "generate_lead",
  WHATSAPP_CLICK: "whatsapp_click",
  PRICING_TIER_CLICK: "pricing_tier_click",
  // Home v3: cada CTA manda la sección de origen en `section`.
  DEMO_CLICK: "demo_click",
  VSL_PLAY: "vsl_play",
  ROLE_TAB: "role_tab",
  MODULE_VIEW: "module_view",
  PROBALO_START: "probalo_start",
  PROBALO_COMPLETE: "probalo_complete",
} as const;

// Mapeo de nuestros eventos internos a los "standard events" de TikTok.
// Solo se disparan en /prueba-gratis, donde está montado el pixel.
const TIKTOK_EVENTS: Record<string, string> = {
  [EVENTS.GENERATE_LEAD]: "SubmitForm",
  [EVENTS.WHATSAPP_CLICK]: "Contact",
  [EVENTS.PRICING_TIER_CLICK]: "ClickButton",
};

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.clarity?.("event", name);
  if (typeof params.lead_segment === "string") {
    window.clarity?.("set", "segment", params.lead_segment);
  }
  const ttEvent = TIKTOK_EVENTS[name];
  if (ttEvent) window.ttq?.track(ttEvent, params);
}
