"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";
import Icon from "./Icon";
import DemoLink from "./DemoLink";
import { NAV, APP_URL } from "@/lib/home-content";

/**
 * Barra del sitio (v3): fondo presente desde el primer píxel (nada de slide-in),
 * sombra sutil al scrollear, menú mobile a pantalla completa. Los anclas van
 * con "/" adelante para que funcionen desde cualquier página.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "scrolled" : ""}`} id="nav">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="SHIPSAFE, inicio">
            <Wordmark priority />
          </Link>
          <nav className="links" aria-label="Principal">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href.startsWith("#") ? `/${l.href}` : l.href} className={"quiet" in l && l.quiet ? "quiet" : undefined}>
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
      <div className={`mobile-menu ${open ? "open" : ""}`} id="mobile-menu">
        {NAV.map((l) => (
          <Link key={l.href} href={l.href.startsWith("#") ? `/${l.href}` : l.href} className={"quiet" in l && l.quiet ? "quiet" : undefined} onClick={() => setOpen(false)}>
            {l.label}
          </Link>
        ))}
        <Link href="/#probalo" onClick={() => setOpen(false)}>
          Probalo
        </Link>
        <Link href="/#faq" onClick={() => setOpen(false)}>
          Preguntas frecuentes
        </Link>
        <a className="quiet" href={APP_URL}>
          Ingresar
        </a>
        <DemoLink section="menu" className="btn btn-primary" />
      </div>
    </>
  );
}
