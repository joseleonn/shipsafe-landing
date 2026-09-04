"use client";

import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * El único reveal del sitio: opacidad + 14 px, 420 ms, una vez.
 * Mejora progresiva de verdad: lo que ya está en pantalla al cargar NUNCA se
 * oculta (se mide al montar), y con prefers-reduced-motion no anima nada.
 * Se aplica a tarjetas, filas y pasos; nunca a títulos ni al primer párrafo.
 *
 * Implementado con motion values (no con estado) para que el HTML del
 * servidor y el del cliente coincidan y no haya re-render al montar.
 */
export default function Reveal({
  children,
  as = "div",
  className,
  delay = 0,
  style,
}: {
  children: ReactNode;
  as?: "div" | "li" | "article" | "section";
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const opacity = useMotionValue(1);
  const y = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Solo lo que está por debajo del pliegue al montar se oculta y luego aparece.
    if (el.getBoundingClientRect().top <= window.innerHeight) return;
    opacity.set(0);
    y.set(14);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        animate(opacity, 1, { duration: 0.42, ease: EASE, delay });
        animate(y, 0, { duration: 0.42, ease: EASE, delay });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [opacity, y, delay]);

  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag ref={ref} className={className} style={{ ...style, opacity, y }}>
      {children}
    </Tag>
  );
}
