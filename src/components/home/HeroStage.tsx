"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/site/Icon";
import { HERO, YOUTUBE_ID } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Escenario del hero: el marco de navegador es el reproductor del VSL (póster
 * con la captura real del tablero; al tocar, el video corre ahí mismo). El
 * teléfono y los tres "eventos" que rotan cada 4 s (inspección → desvío →
 * permiso) se apartan mientras el video se reproduce. Entrada animada, pausa
 * con hover y con la pestaña oculta, paralaje sutil con el mouse. Con
 * prefers-reduced-motion: todo quieto, los tres eventos visibles.
 */
export default function HeroStage({ url, poster, phone }: { url: string; poster: ReactNode; phone: ReactNode }) {
  const reduce = useReduce();
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [inView, setInView] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  // Los eventos rotan solo mientras el escenario está en pantalla: en mobile
  // el hero queda arriba y no tiene sentido seguir animando mientras se lee
  // el resto de la página.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || playing || !inView) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const start = () => { stop(); t = setInterval(() => setIdx((i) => (i + 1) % HERO.events.length), 4000); };
    const stop = () => { if (t) clearInterval(t); t = undefined; };
    const onVis = () => (document.visibilityState === "visible" && !paused ? start() : stop());
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => { stop(); document.removeEventListener("visibilitychange", onVis); };
  }, [reduce, paused, playing, inView]);

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
    if (reduce || playing) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    setPaused(false);
    mx.set(0);
    my.set(0);
  };

  const play = () => {
    setPlaying(true);
    mx.set(0);
    my.set(0);
    trackEvent(EVENTS.VSL_PLAY, { source: "hero" });
  };

  return (
    <div ref={stageRef} className={`stage ${playing ? "is-playing" : ""}`} onMouseEnter={() => setPaused(true)} onMouseLeave={onLeave} onMouseMove={onMove}>
      <motion.div initial={reduce ? false : { opacity: 0.6, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
        <motion.div style={{ x: bx, y: by }}>
          <div className={`browser hero-player ${playing ? "is-playing" : ""}`} id="video">
            <div className="chrome">
              <span className="dots"><i /><i /><i /></span>
              <span className="url">{url}</span>
              <span className="live">Producto real</span>
            </div>
            {playing ? (
              <div className="video-box">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
                  title="SHIPSAFE por dentro, en 90 segundos"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <button type="button" className="poster" onClick={play} aria-label="Reproducir el video: la plataforma en 90 segundos">
                {poster}
                <span className="shade" aria-hidden="true" />
                <span className="play" aria-hidden="true"><Icon name="play" filled /></span>
                <span className="cap" aria-hidden="true">Ver la plataforma en 90 s</span>
                <span className="dur" aria-hidden="true">{HERO.videoDuration}</span>
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {!playing && (
          <motion.div
            key="phone"
            className="stage-phone"
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE, delay: playing ? 0 : 0.12 }}
          >
            <motion.div style={{ x: px, y: py }}>{phone}</motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En mobile la ranura tiene alto fijo (site.css): el chip rota sin
          mover el resto de la página. En desktop no genera caja. */}
      {!playing && (
        <div className="chip-slot">
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
                aria-hidden="true"
              >
                <Chip e={events[idx]} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </div>
  );
}

function Chip({ e, pos = "" }: { e: (typeof HERO.events)[number]; pos?: string }) {
  return (
    <div className={`chip ${pos}`} aria-hidden="true">
      <span className={`dot ${e.tone}`} />
      <b>{e.title}</b>
      <small>{e.meta}</small>
    </div>
  );
}
