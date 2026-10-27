"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export type ExpandMedia =
  | { kind: "image"; src: string; alt: string; width: number; height: number }
  | { kind: "video"; src: string; webm?: string; poster?: string; label: string };

/**
 * Envuelve una captura o un video con un botón "Ampliar" arriba a la derecha.
 * Abre el mismo archivo en grande sobre un fondo oscuro; se cierra con la X,
 * tocando afuera o con Escape. El scroll de la página queda trabado mientras
 * está abierto.
 */
export default function Expandable({
  media,
  children,
  className = "",
}: {
  media: ExpandMedia;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`xp-wrap ${className}`}>
      {children}
      <button type="button" className="xp-btn" onClick={() => setOpen(true)} aria-label="Ver en grande">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </button>
      <Lightbox media={media} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

export function Lightbox({ media, open, onClose }: { media: ExpandMedia; open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => onClose(), [onClose]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="xp-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={media.kind === "image" ? media.alt : media.label}
          onClick={close}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.22 }}
        >
          <button type="button" className="xp-close" onClick={close} aria-label="Cerrar" autoFocus>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
          <motion.div
            className="xp-box"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {media.kind === "image" ? (
              // Se usa <img> para mostrar el archivo entero, sin recorte ni tamaño fijo.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={media.src} alt={media.alt} width={media.width} height={media.height} />
            ) : (
              <video poster={media.poster} controls autoPlay playsInline aria-label={media.label}>
                {media.webm && <source src={media.webm} type="video/webm" />}
                <source src={media.src} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
