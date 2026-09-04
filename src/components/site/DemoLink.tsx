"use client";

import { useEffect, useState, type ReactNode } from "react";
import { buildDemoUrl } from "@/app/demo/_data";
import { trackEvent, EVENTS } from "@/lib/analytics";

/**
 * El único verbo de la página: "Agendá una demo" → Calendly.
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
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-cta={section}
      onClick={() => trackEvent(EVENTS.DEMO_CLICK, { section, source: "home" })}
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
