"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackEvent, EVENTS } from "@/lib/analytics";

/**
 * Dispara el evento Schedule del pixel con el MISMO event_id que usa el webhook
 * de Calendly del lado del servidor.
 *
 * Cómo se logra que coincidan: Calendly manda `invitee_uuid` en la URL de
 * redirección, y el webhook arma su id con el último segmento del URI del
 * invitado, que es ese mismo uuid. Los dos llegan a `schedule-<uuid>` y Meta
 * los deduplica.
 *
 * Requiere tener activado "Pass event details to your redirected page" en la
 * configuración del evento en Calendly.
 */
export default function AgendadoClient() {
  const params = useSearchParams();
  const disparado = useRef(false);

  useEffect(() => {
    if (disparado.current) return;
    disparado.current = true;

    const uuid = params.get("invitee_uuid");
    const eventId = uuid ? `schedule-${uuid}` : `schedule-sin-uuid-${Date.now()}`;

    trackMetaEvent("Schedule", eventId, { content_name: "demo-30min" });
    trackEvent(EVENTS.GENERATE_LEAD, { source: "calendly", section: "agendado" });
  }, [params]);

  return null;
}
