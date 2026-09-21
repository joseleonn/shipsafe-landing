"use client";

import { openDemoModal } from "@/lib/demo-modal";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { loadCalendly } from "@/lib/calendly-embed";

/**
 * Los procesos del hero, tocables. El título dice "Elegí el proceso que más te
 * duele": antes los chips eran texto y la elección no se podía hacer. Ahora
 * cada uno abre el modal de la demo con ese proceso ya elegido, y el proceso
 * viaja a Calendly como respuesta a la primera pregunta.
 *
 * El section es siempre "puesta-chip" (así el modal habla el idioma de la
 * campaña); el proceso va aparte, para medir cuál tocan más.
 */
const PROCESOS = ["Preuso de vehículos", "Matafuegos", "Desvíos", "Entregas de EPP", "Capacitaciones"];

export default function ProcesoChips() {
  const warm = () => {
    loadCalendly().catch(() => {});
  };
  return (
    <ul className="chips-row chips-pick" aria-label="Procesos con los que podés empezar">
      {PROCESOS.map((p) => (
        <li key={p}>
          <button
            type="button"
            onClick={() => {
              trackEvent(EVENTS.DEMO_CLICK, { section: "puesta-chip", source: "home", step: "open", proceso: p });
              trackEvent("proceso_elegido", { proceso: p });
              openDemoModal("puesta-chip", p);
            }}
            onMouseEnter={warm}
            onTouchStart={warm}
          >
            {p}
          </button>
        </li>
      ))}
    </ul>
  );
}
