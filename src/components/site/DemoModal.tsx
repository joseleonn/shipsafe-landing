"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import LeadForm from "@/components/home/LeadForm";
import { useScrollLock } from "./useScrollLock";
import { onDemoModal } from "@/lib/demo-modal";
import { whatsappUrl } from "@/lib/home-content";

/**
 * El modal de la demo: las mismas tres preguntas del cierre y, al enviarlas,
 * Calendly encima (su propio modal) con nombre y email cargados. Si la
 * persona cierra Calendly sin elegir horario, vuelve a ver este modal con el
 * botón para reabrirlo y el aviso de que le escribimos igual.
 *
 * Se monta una sola vez (SiteShell) y lo abre cualquier DemoLink por evento.
 * En celular es una hoja desde abajo; en desktop, una tarjeta centrada.
 */
export default function DemoModal() {
  const [section, setSection] = useState<string | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  const open = section !== null;

  useEffect(() => onDemoModal((s) => {
    opener.current = document.activeElement as HTMLElement | null;
    setSection(s);
  }), []);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSection(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setSection(null);
    opener.current?.focus?.();
  };

  if (!open) return null;

  // La campaña de Meta ofrece una puesta en marcha, no una demo de producto.
  // Si el visitante viene de ahí, el modal habla el mismo idioma que el
  // anuncio y que la landing; desde el resto del sitio, el de siempre.
  // `section` llega sin prefijo ("puesta-hero", "puesta-nav"…); el "modal-"
  // se agrega recién al pasárselo al formulario.
  const campana = section.startsWith("puesta");
  const titulo = campana ? "Reservá tu media hora" : "Agendá una demo";
  const sub = campana ? "30 min · te queda un proceso andando" : "30 min · sin compromiso";

  return (
    <div className="dm-backdrop" onClick={close}>
      <div className="dm" role="dialog" aria-modal="true" aria-labelledby="dm-title" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="dm-close" aria-label="Cerrar" onClick={close}>
          <Icon name="x" />
        </button>
        <div className="panel-head">
          <b id="dm-title">{titulo}</b>
          <span>{sub}</span>
        </div>
        <p className="dm-lede">Unos datos y se abre la agenda con tu nombre y email ya cargados.</p>
        <LeadForm source="home" section={`modal-${section}`} autoFocus />
        <div className="wa">
          ¿Preferís WhatsApp?{" "}
          <a href={whatsappUrl("Hola, quiero agendar una demo de SHIPSAFE")} target="_blank" rel="noopener noreferrer">
            <Icon name="msg" />
            Escribinos
          </a>
        </div>
      </div>
    </div>
  );
}
