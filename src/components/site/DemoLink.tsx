"use client";

import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { buildDemoUrl } from "@/app/demo/_data";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { loadCalendly, openCalendly } from "@/lib/calendly-embed";

/**
 * El único verbo de la página: "Agendá una demo" → Calendly, en un modal
 * sobre la página (nadie se va del sitio). El href sigue siendo la URL real
 * de Calendly: sin JavaScript, con el widget caído o con clic del medio /
 * cmd+clic, se abre en otra pestaña como antes.
 *
 * Reenvía los UTM/click-id con los que llegó el visitante (buildDemoUrl) y
 * agrega utm_content con la sección de origen, para saber qué CTA convierte.
 */
export default function DemoLink({
  section,
  className = "btn btn-primary",
  children = "Agendá una demo",
  prefill,
}: {
  section: string;
  className?: string;
  children?: ReactNode;
  /** Nombre y email ya conocidos (p. ej. recién dejados en el formulario). */
  prefill?: { name?: string; email?: string };
}) {
  const [href, setHref] = useState(() => withContent(buildDemoUrl(), section));
  useEffect(() => {
    setHref(withContent(buildDemoUrl(window.location.search), section));
  }, [section]);

  // Traer el widget cuando hay intención (mouse encima, foco, dedo) para que
  // el modal abra al instante al hacer clic.
  const warm = () => {
    loadCalendly().catch(() => {});
  };

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    trackEvent(EVENTS.DEMO_CLICK, { section, source: "home" });
    // Clic del medio, cmd/ctrl+clic, shift+clic: que el navegador haga lo suyo.
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    void openCalendly(href, {
      prefill,
      onScheduled: () => trackEvent(EVENTS.DEMO_SCHEDULED, { section, source: "home" }),
    }).then((ok) => {
      // Sin widget (bloqueador, red): al link, en la misma pestaña, que no se
      // pierda el clic. Es el camino de antes, solo que como excepción.
      if (!ok) window.location.assign(href);
    });
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
