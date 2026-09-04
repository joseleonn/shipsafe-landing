"use client";

import { useEffect } from "react";

/**
 * Enciende las "pistas" de movimiento del sitio (motion.css):
 * - marca <html class="ss-motion"> solo si el visitante no pidió reducir el
 *   movimiento (sin la clase, todo se ve en su estado final, sin animar);
 * - agrega .in a cada .sec-head y .cmp cuando entra en pantalla, una vez.
 * Un solo IntersectionObserver para todo el sitio.
 */
export default function MotionCues() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const root = document.documentElement;
    root.classList.add("ss-motion");
    const targets = document.querySelectorAll<HTMLElement>(".sec-head, .cmp");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.2 },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      root.classList.remove("ss-motion");
    };
  }, []);
  return null;
}
