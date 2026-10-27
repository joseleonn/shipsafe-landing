"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { CONFIANZA, HOME5 } from "@/lib/home-v5";

/**
 * Franja de confianza: los que lo usan y el registro de la SRT, pasando en
 * horizontal. Avanza sola, se acelera y se inclina apenas con la velocidad del
 * scroll, cambia de sentido si se scrollea hacia arriba y se frena al pasar el
 * mouse. Con "reducir movimiento" queda quieta y centrada.
 */
const REPEAT = 4;

function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

function Items() {
  return (
    <>
      {CONFIANZA.map((it) => {
        const inner = (
          <>
            {it.logo ? (
              <Image src={it.logo} alt={it.name} width={it.w} height={it.h} className="h5-tr-logo" unoptimized />
            ) : (
              <span className="h5-tr-seal" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 4 6v6c0 4.4 3.4 8.1 8 9 4.6-.9 8-4.6 8-9V6l-8-3z" />
                  <path d="m8.5 12 2.5 2.5 4.5-5" />
                </svg>
                {it.name}
              </span>
            )}
            <span className="h5-tr-note">{it.note}</span>
          </>
        );
        return it.href ? (
          <a key={it.name} className="h5-tr-item" href={it.href} {...(it.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {inner}
          </a>
        ) : (
          <span key={it.name} className="h5-tr-item">
            {inner}
          </span>
        );
      })}
    </>
  );
}

export default function Confianza() {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 0, 2000], [4, 0, -4]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(1);
  const paused = useRef(false);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const speed = paused.current ? 0 : 1.1; // % del ancho por segundo
    baseX.set(baseX.get() - dir.current * (speed + Math.abs(f) * 1.6) * (delta / 1000));
  });

  return (
    <section className="h5-trust" aria-label={HOME5.clientes.label}>
      <p className="h5-tag h5-trust-label">{HOME5.clientes.label}</p>
      {reduce ? (
        <div className="h5-tr-static">
          <Items />
        </div>
      ) : (
        <div className="h5-tr-viewport" onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
          <motion.div className="h5-tr-track" style={{ x, skewX: skew }}>
            {Array.from({ length: REPEAT * 2 }).map((_, i) => (
              <div className="h5-tr-group" key={i} aria-hidden={i > 0 ? true : undefined}>
                <Items />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  );
}
