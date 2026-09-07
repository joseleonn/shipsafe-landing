"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";
import Icon from "./Icon";
import DemoLink from "./DemoLink";
import { NAV, APP_URL } from "@/lib/home-content";
import { useScrollLock } from "./useScrollLock";
import { onDemoModal } from "@/lib/demo-modal";

/**
 * Barra del sitio: una isla flotante de vidrio (site.css). No ocupa lugar en
 * el layout —es `position: fixed`—, así que el contenido pasa por debajo y se
 * ve difuminado a través de ella. Al scrollear se vuelve un poco más sólida.
 *
 * En modo `minimal` (landings de campaña) la isla lleva solo el logo y el
 * botón: ninguna salida que no sea agendar.
 *
 * En mobile el botón de menú despliega la isla: un panel de vidrio justo
 * debajo, con el fondo atenuado y el scroll de la página bloqueado
 * (useScrollLock, que es el único bloqueo que iOS respeta). La cruz para
 * cerrar vive en la isla, que siempre está en pantalla: antes vivía en una
 * capa que se iba con el scroll y el menú no se podía cerrar.
 *
 * El panel lleva los mismos ítems que la barra (más "Ingresar"), no una lista
 * más larga: si es una isla que se despliega, tiene que quedar aire alrededor
 * para cerrarla tocando afuera. Probalo y las preguntas frecuentes se
 * descubren scrolleando y están en el pie.
 */
export default function SiteNav({
  minimal = false,
  ctaLabel = "Agendá una demo",
  ctaSection = "nav",
}: {
  /** Landings de campaña: solo logo y botón, sin menú ni "Ingresar". */
  minimal?: boolean;
  ctaLabel?: string;
  ctaSection?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Si desde el menú se toca "Agendá una demo", el menú se cierra y queda el
  // modal de la demo solo.
  useEffect(() => onDemoModal(() => setOpen(false)), []);

  const close = () => setOpen(false);
  const href = (h: string) => (h.startsWith("#") ? `/${h}` : h);

  if (minimal) {
    return (
      <header className={`nav minimal ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="SHIPSAFE, inicio">
            <Wordmark priority />
          </Link>
          <div className="nav-cta">
            <DemoLink section={ctaSection} className="btn btn-primary btn-sm">
              {ctaLabel}
            </DemoLink>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""} ${open ? "open" : ""}`} id="nav">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="SHIPSAFE, inicio" onClick={close}>
            <Wordmark priority />
          </Link>
          <nav className="links" aria-label="Principal">
            {NAV.map((l) => (
              <Link key={l.href} href={href(l.href)} className={"quiet" in l && l.quiet ? "quiet" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav-cta">
            <a className="login" href={APP_URL}>
              Ingresar
            </a>
            <DemoLink section="nav" className="btn btn-primary btn-sm" />
            <button
              className="burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "x" : "menu"} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu ${open ? "open" : ""}`}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        aria-hidden={!open}
        onClick={close}
      >
        <div className="mm-panel" onClick={(e) => e.stopPropagation()}>
          <nav className="mm-links" aria-label="Menú">
            {NAV.map((l) => (
              <Link key={l.href} href={href(l.href)} className={"quiet" in l && l.quiet ? "quiet" : undefined} onClick={close}>
                {l.label}
              </Link>
            ))}
            <a className="quiet" href={APP_URL}>
              Ingresar
            </a>
          </nav>
          <DemoLink section="menu" className="btn btn-primary btn-lg" />
        </div>
      </div>
    </>
  );
}
