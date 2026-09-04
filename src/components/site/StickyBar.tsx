"use client";

import { useEffect, useState } from "react";
import DemoLink from "./DemoLink";
import Icon from "./Icon";
import { whatsappUrl } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

/** Barra de CTA en mobile: aparece después del hero y se esconde en el cierre. */
export default function StickyBar({ heroId = "top", closeId = "demo" }: { heroId?: string; closeId?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById(heroId);
    const close = document.getElementById(closeId);
    if (!hero || !close || !("IntersectionObserver" in window)) return;
    let heroVisible = true;
    let closeVisible = false;
    const upd = () => setShow(!heroVisible && !closeVisible);
    const a = new IntersectionObserver((es) => { heroVisible = es[0].isIntersecting; upd(); }, { threshold: 0.05 });
    const b = new IntersectionObserver((es) => { closeVisible = es[0].isIntersecting; upd(); }, { threshold: 0.2 });
    a.observe(hero);
    b.observe(close);
    return () => { a.disconnect(); b.disconnect(); };
  }, [heroId, closeId]);
  return (
    <div className={`stickybar ${show ? "show" : ""}`} aria-hidden={!show}>
      <DemoLink section="sticky" className="btn btn-primary" />
      <a
        className="wa"
        href={whatsappUrl("Hola, quiero agendar una demo de SHIPSAFE")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribinos por WhatsApp"
        onClick={() => trackEvent(EVENTS.WHATSAPP_CLICK, { section: "sticky" })}
      >
        <Icon name="msg" />
      </a>
    </div>
  );
}
