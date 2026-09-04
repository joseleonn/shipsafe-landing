"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { useEffect, useState, type ReactNode } from "react";
import { HERO } from "@/lib/home-content";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Escenario de producto del hero (animación nivel 1 de la especificación):
 * la ventana entra desde opacidad .6 y 16 px; el teléfono 120 ms después; y
 * los tres "eventos" (inspección → desvío → permiso) rotan cada 4 s contando
 * el flujo operario → mantenimiento → supervisor. Pausa con hover y cuando la
 * pestaña no está visible. Con prefers-reduced-motion: todo quieto, los tres
 * eventos visibles.
 */
export default function HeroStage({ browser, phone }: { browser: ReactNode; phone: ReactNode }) {
  const reduce = useReduce();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const start = () => { stop(); t = setInterval(() => setIdx((i) => (i + 1) % HERO.events.length), 4000); };
    const stop = () => { if (t) clearInterval(t); t = undefined; };
    const onVis = () => (document.visibilityState === "visible" && !paused ? start() : stop());
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [reduce, paused]);

  const events = HERO.events;
  const positions = ["chip-1", "chip-2", "chip-3"];

  // Paralaje sutil con el mouse (nivel 3): la ventana se corre unos píxeles en
  // contra y el teléfono a favor, con resorte. Sin mouse (táctil) no pasa nada.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 60, damping: 18, mass: 0.6 };
  const bx = useSpring(useTransform(mx, (v) => v * -8), spring);
  const by = useSpring(useTransform(my, (v) => v * -5), spring);
  const px = useSpring(useTransform(mx, (v) => v * 14), spring);
  const py = useSpring(useTransform(my, (v) => v * 10), spring);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    setPaused(false);
    mx.set(0);
    my.set(0);
  };

  return (
    <div className="stage" aria-hidden="true" onMouseEnter={() => setPaused(true)} onMouseLeave={onLeave} onMouseMove={onMove}>
      <motion.div initial={reduce ? false : { opacity: 0.6, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <motion.div style={{ x: bx, y: by }}>{browser}</motion.div>
      </motion.div>
      <motion.div
        className="stage-phone"
        initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.12 }}
      >
        <motion.div style={{ x: px, y: py }}>{phone}</motion.div>
      </motion.div>
      {reduce ? (
        events.map((e, i) => <Chip key={e.title} e={e} pos={positions[i]} />)
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: EASE }}
            className={`chip-anchor ${positions[idx]}`}
          >
            <Chip e={events[idx]} />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function Chip({ e, pos = "" }: { e: (typeof HERO.events)[number]; pos?: string }) {
  return (
    <div className={`chip ${pos}`}>
      <span className={`dot ${e.tone}`} />
      <b>{e.title}</b>
      <small>{e.meta}</small>
    </div>
  );
}
