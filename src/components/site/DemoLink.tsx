"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { buildDemoUrl } from "@/app/demo/_data";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { loadCalendly } from "@/lib/calendly-embed";
import { openDemoModal } from "@/lib/demo-modal";

/**
 * El único verbo de la página: "Agendá una demo" → el modal con las tres
 * preguntas (DemoModal) → Calendly ya cargado, todo sobre la página. Es el
 * mismo camino que el formulario del cierre, así no hay dos formas de
 * agendar. El href sigue siendo la URL real de Calendly: sin JavaScript o
 * con clic del medio / cmd+clic se abre en otra pestaña, como antes.
 *
 * Reenvía los UTM/click-id con los que llegó el visitante (buildDemoUrl) y
 * agrega utm_content con la sección de origen, para saber qué CTA convierte.
 */
export default function DemoLink({
  section,
  className = "btn btn-primary",
  children = "Agendá una demo",
}: {
  section: string;
  className?: string;
  children?: ReactNode;
}) {
  const [href, setHref] = useState(() => withContent(buildDemoUrl(), section));
  useEffect(() => {
    setHref(withContent(buildDemoUrl(window.location.search), section));
  }, [section]);

  // Traer el widget de Calendly cuando hay intención (mouse encima, foco,
  // dedo) para que, después de las tres preguntas, la agenda abra al instante.
  const warm = () => {
    loadCalendly().catch(() => {});
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(EVENTS.DEMO_CLICK, { section, source: "home", step: "open" });
    // Clic del medio, cmd/ctrl+clic, shift+clic: que el navegador haga lo suyo.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    openDemoModal(section);
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cta={section}
      onClick={onClick}
      onMouseEnter={warm}
      onFocus={warm}
      onTouchStart={warm}
    >
      {children}
    </a>
  );
}

function withContent(url: string, section: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.get("utm_content")) u.searchParams.set("utm_content", section);
    return u.toString();
  } catch {
    return url;
  }
}
