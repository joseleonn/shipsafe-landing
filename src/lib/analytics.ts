type EventParams = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export const EVENTS = {
  GENERATE_LEAD: "generate_lead",
  WHATSAPP_CLICK: "whatsapp_click",
  PRICING_TIER_CLICK: "pricing_tier_click",
} as const;

export function trackEvent(name: string, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
  window.clarity?.("event", name);
  if (typeof params.lead_segment === "string") {
    window.clarity?.("set", "segment", params.lead_segment);
  }
}
