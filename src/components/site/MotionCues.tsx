"use client";

import { useEffect } from "react";

/**
 * Bloques que suben al entrar en pantalla (motion.css, "reveals de sección").
 * Cada grupo es [selector, escalonado]: con escalonado, los hermanos que
 * matchean el selector entran uno detrás del otro.
 * Lo que ya usa <Reveal> (tiers, caso, ERP) no va acá: se animaría dos veces.
 */
const RISE: [string, boolean][] = [
  [".cs-card", false],
  [".steps li", true],
  [".try-card", false],
  [".std-top, .std-foot", false],
  [".std-sedes li", true],
  [".std-puntos li", true],
  [".roles-ui", false],
  [".ex-intro, .explorer", false],
  [".faq .list > *", true],
  [".close .what li", true],
];

/**
 * Enciende las "pistas" de movimiento del sitio (motion.css):
 * - marca <html class="ss-motion"> solo si el visitante no pidió reducir el
 *   movimiento (sin la clase, todo se ve en su estado final, sin animar);
 * - agrega .in a cada .sec-head y .cmp cuando entra en pantalla, una vez;
 * - a los bloques de RISE que arrancan debajo del pliegue les pone .rv
 *   (estado oculto) y después .in. Lo que ya se ve al cargar nunca se oculta.
 * Un solo IntersectionObserver para todo el sitio.
 */
export default function MotionCues() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const root = document.documentElement;
    root.classList.add("ss-motion");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      // Umbral casi cero: la tabla comparativa en mobile es más alta que la
      // pantalla y con 0.2 nunca llegaba a "entrar" (quedaba vacía).
      { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
    );
    document.querySelectorAll<HTMLElement>(".sec-head, .cmp").forEach((t) => io.observe(t));

    const fold = window.innerHeight;
    const risen: HTMLElement[] = [];
    for (const [sel, stagger] of RISE) {
      const els = document.querySelectorAll<HTMLElement>(sel);
      els.forEach((el) => {
        if (el.getBoundingClientRect().top <= fold) return;
        if (stagger && el.parentElement) {
          const sibs = Array.from(el.parentElement.children).filter((c) => c.matches(sel));
          el.style.setProperty("--ri", String(Math.min(sibs.indexOf(el), 8)));
        }
        el.classList.add("rv");
        risen.push(el);
        io.observe(el);
      });
    }

    return () => {
      io.disconnect();
      root.classList.remove("ss-motion");
      risen.forEach((el) => el.classList.remove("rv", "in"));
    };
  }, []);
  return null;
}
