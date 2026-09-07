"use client";

import { useEffect, useState } from "react";
import DemoLink from "./DemoLink";
import Icon from "./Icon";
import { whatsappUrl } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

/**
 * Barra de CTA en mobile: aparece después del hero y se esconde en cuanto
 * asoma el cierre (que ya tiene el botón y el formulario) o el pie, para no
 * tapar nada de eso. Umbral cero: en mobile esas secciones son más altas que
 * la pantalla y un umbral por porcentaje no se alcanzaba nunca.
 */
export default function StickyBar({
  heroId = "top",
  closeId = "demo",
  section = "sticky",
  label = "Agendá una demo",
}: {
  heroId?: string;
  closeId?: string;
  section?: string;
  label?: string;
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(heroId);
    const close = document.getElementById(closeId);
    const footer = document.querySelector("footer");
    if (!hero || !close || !("IntersectionObserver" in window)) return;
    let heroVisible = true;
    const endVisible = new Map<Element, boolean>();
    const upd = () => setShow(!heroVisible && ![...endVisible.values()].some(Boolean));
    const a = new IntersectionObserver((es) => { heroVisible = es[0].isIntersecting; upd(); }, { threshold: 0.05 });
    const b = new IntersectionObserver((es) => { for (const e of es) endVisible.set(e.target, e.isIntersecting); upd(); }, { threshold: 0 });
    a.observe(hero);
    b.observe(close);
    if (footer) b.observe(footer);
    return () => { a.disconnect(); b.disconnect(); };
  }, [heroId, closeId]);
  return (
    <div className={`stickybar ${show ? "show" : ""}`} aria-hidden={!show}>
      <DemoLink section={section} className="btn btn-primary">
        {label}
      </DemoLink>
      <a
        className="wa"
        href={whatsappUrl("Hola, quiero agendar una demo de SHIPSAFE")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        onClick={() => trackEvent(EVENTS.WHATSAPP_CLICK, { section })}
      >
        <Icon name="msg" />
      </a>
    </div>
  );
}
