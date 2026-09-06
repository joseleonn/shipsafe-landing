"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Wordmark from "./Wordmark";
import Icon from "./Icon";
import DemoLink from "./DemoLink";
import { NAV, APP_URL } from "@/lib/home-content";

/**
 * Barra del sitio (v3): en desktop con fondo desde el primer píxel y sombra
 * sutil al scrollear; en mobile transparente arriba del todo y blanca en
 * cuanto se scrollea (site.css). Los anclas van con "/" adelante para que
 * funcionen desde cualquier página.
 *
 * El menú mobile es una capa a pantalla completa con su propia barra (logo y
 * cruz) y con el scroll de la página bloqueado de verdad. Antes dependía de
 * la barra pegajosa de abajo, y en iOS bastaba con deslizar con el menú
 * abierto para que la cruz se fuera con la página: no se podía cerrar.
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
    // Bloqueo de scroll que iOS respeta: el body queda fijo en la posición
    // actual y se la devolvemos al cerrar (sin el scroll suave del html).
    const html = document.documentElement;
    const body = document.body;
    const y = window.scrollY;
    const prev = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width, overflow: html.style.overflow, behavior: html.style.scrollBehavior };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    html.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      html.style.overflow = prev.overflow;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev.behavior;
    };
  }, [open]);

  const close = () => setOpen(false);

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
            <button className="burger" aria-expanded={open} aria-controls="mobile-menu" aria-label="Abrir menú" onClick={() => setOpen(true)}>
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>
      <div className={`mobile-menu ${open ? "open" : ""}`} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menú" aria-hidden={!open}>
        <div className="wrap">
          <div className="mm-top">
            <Link className="brand" href="/" aria-label="SHIPSAFE, inicio" onClick={close}>
              <Wordmark />
            </Link>
            <button className="burger" aria-label="Cerrar menú" onClick={close}>
              <Icon name="x" />
            </button>
          </div>
          <nav className="mm-links" aria-label="Menú">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href.startsWith("#") ? `/${l.href}` : l.href} className={"quiet" in l && l.quiet ? "quiet" : undefined} onClick={close}>
                {l.label}
              </Link>
            ))}
            <Link href="/#probalo" onClick={close}>
              Probalo
            </Link>
            <Link href="/#faq" onClick={close}>
              Preguntas frecuentes
            </Link>
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
