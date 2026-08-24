/**
 * Helper del lado del cliente para disparar eventos del pixel con un eventID
 * compartido con la API de Conversiones.
 *
 * Regla: SIEMPRE pasar el mismo eventId que se le manda al endpoint del
 * servidor. Si no, Meta cuenta el mismo lead dos veces y todos los costos por
 * conversión que veas van a estar a la mitad de lo real.
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      event: string,
      params?: Record<string, unknown>,
      options?: { eventID?: string }
    ) => void;
  }
}

export function trackMetaEvent(
  eventName: "Lead" | "Schedule" | "CompleteRegistration" | "ViewContent",
  eventId: string,
  params: Record<string, unknown> = {}
): void {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("track", eventName, params, { eventID: eventId });
}
