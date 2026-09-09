"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Icon from "@/components/site/Icon";
import { ShotFrame } from "@/components/site/Frames";
import { useScrollLock } from "@/components/site/useScrollLock";
import type { ModuleStep } from "@/lib/home-content";

/**
 * La captura ampliada. Se abre tocando la pantalla del recorrido y ocupa todo
 * el alto disponible, que es la única forma de leer una tabla de desvíos o un
 * tablero en una captura de 2880 px de ancho.
 *
 * Se cierra con Escape, con la cruz o tocando el fondo, y con las flechas se
 * sigue recorriendo el módulo sin salir. Igual que el menú, queda montado y
 * oculto para que el cierre también se anime; Explorer lo monta recién la
 * primera vez que alguien lo abre, así el resto de las visitas no se baja una
 * imagen grande que nadie va a mirar.
 *
 * Va en un portal, pero al envoltorio `.ss-site`, no al body: las secciones de
 * la home se animan con `transform` al aparecer, y un `position: fixed` dentro
 * de un ancestro transformado queda atrapado en su contexto de apilamiento
 * (sin el portal, la isla de la barra se dibuja ENCIMA del visor por más que
 * tenga z-index 95). Al body tampoco sirve: todo el sistema visual está
 * escrito bajo `.ss-site` y afuera de ese envoltorio el visor sale sin
 * estilos.
 */
export default function ShotLightbox({
  abierto,
  pasos,
  i,
  titulo,
  onIr,
  onCerrar,
}: {
  abierto: boolean;
  pasos: readonly ModuleStep[];
  i: number;
  titulo: string;
  onIr: (n: number) => void;
  onCerrar: () => void;
}) {
  useScrollLock(abierto);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCerrar();
      if (e.key === "ArrowRight") onIr(i + 1);
      if (e.key === "ArrowLeft") onIr(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [abierto, i, onIr, onCerrar]);

  const paso = pasos[Math.min(i, pasos.length - 1)];
  const varios = pasos.length > 1;

  if (typeof document === "undefined") return null;
  const raiz = document.querySelector(".ss-site") ?? document.body;

  return createPortal(
    <div
      className={`lb ${abierto ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={`${titulo}, captura ampliada`}
      aria-hidden={!abierto}
      onClick={onCerrar}
    >
      <button type="button" className="lb-cerrar" aria-label="Cerrar" onClick={onCerrar}>
        <Icon name="x" />
      </button>

      {/* El clic cerrar-tocando-afuera vive en el fondo: solo la captura y el
          pie lo frenan, así que el aire alrededor sigue cerrando. */}
      <figure className="lb-caja">
        <div className={`lb-shot ${paso.shot.kind}`}>
          <div className="lb-marco" onClick={(e) => e.stopPropagation()}>
            <ShotFrame shot={paso.shot} sizes="(max-width: 900px) 1100px, 1400px" />
          </div>
        </div>
        <figcaption className="lb-pie" onClick={(e) => e.stopPropagation()}>
          <span className="lb-txt">
            <b>{titulo}</b>
            {paso.label && <em>{paso.label}</em>}
            <span>{paso.text}</span>
          </span>
          {varios && (
            <span className="lb-nav">
              <button type="button" aria-label="Captura anterior" onClick={() => onIr(i - 1)}>
                <Icon name="left" />
              </button>
              <b>
                {i + 1} / {pasos.length}
              </b>
              <button type="button" aria-label="Captura siguiente" onClick={() => onIr(i + 1)}>
                <Icon name="right" />
              </button>
            </span>
          )}
        </figcaption>
      </figure>
    </div>,
    raiz,
  );
}
