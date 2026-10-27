"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Item, Stagger, Words } from "./Motion5";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import Icon from "@/components/site/Icon";
import { SHOTS } from "@/lib/home-content";
import { HOME5, PROCESOS, SHOW_VIDEO_PLACEHOLDERS } from "@/lib/home-v5";
import Expandable from "./Expandable";

/** Video del proceso: arranca mudo en loop; el botón activa la locución desde el inicio. */
function ProcVideo({ video, label }: { video: NonNullable<(typeof PROCESOS)[number]["video"]>; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [sound, setSound] = useState(false);
  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    const next = !sound;
    v.muted = !next;
    if (next) {
      v.currentTime = 0;
      void v.play();
    }
    setSound(next);
  };
  return (
    <Expandable media={{ kind: "video", src: video.src, webm: video.webm, poster: video.poster, label }}>
    <div className="h5-proc-video">
      <video ref={ref} className="h5-video" poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-label={`${label}: recorrido por la plataforma`}>
        {video.webm && <source src={video.webm} type="video/webm" />}
        <source src={video.src} type="video/mp4" />
      </video>
      <button type="button" className={`h5-sound${sound ? " on" : ""}`} onClick={toggle} aria-pressed={sound} aria-label={sound ? "Silenciar" : "Activar sonido"}>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          {sound ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m22 9-6 6M16 9l6 6" />}
        </svg>
        <span>{sound ? "Silenciar" : "Escuchar"}</span>
      </button>
    </div>
    </Expandable>
  );
}

/**
 * Una pestaña por proceso. Muestra el screen recording del proceso si existe;
 * si no, el recuadro de vista previa (SHOW_VIDEO_PLACEHOLDERS) o las capturas
 * reales. Tres pasos cortos debajo, nada más.
 */
export default function Procesos() {
  const [active, setActive] = useState(PROCESOS[0].id);
  const p = PROCESOS.find((x) => x.id === active) ?? PROCESOS[0];
  const shot = SHOTS[p.shot];
  const phone = p.phone ? SHOTS[p.phone] : null;
  const reduce = useReducedMotion();
  const [m, setM] = useState(0);
  const slider = useRef<HTMLDivElement>(null);
  const mtabs = useRef<HTMLDivElement>(null);
  const onSlide = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const first = el.children[0] as HTMLElement | undefined;
    if (!first) return;
    const n = Math.min(PROCESOS.length - 1, Math.max(0, Math.round(el.scrollLeft / (first.offsetWidth + 14))));
    if (n === m) return;
    setM(n);
    // La pestaña activa queda a la vista en la tira de arriba.
    const tabs = mtabs.current;
    const t = tabs?.children[n] as HTMLElement | undefined;
    if (tabs && t) tabs.scrollTo({ left: t.offsetLeft - 20, behavior: "smooth" });
  };

  return (
    <section className="h5-procesos" id="como-funciona">
      <span id="flujo" />
      <div className="wrap">
        <h2>
          <Words text={HOME5.procesos.h2} accent={HOME5.procesos.h2Accent} />
        </h2>
        <div className="h5-proc-desk">
        <div className="h5-tabs" role="tablist" aria-label="Procesos">
          {PROCESOS.map((x) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={x.id === active}
              aria-controls={`panel-${x.id}`}
              className={x.id === active ? "on" : ""}
              onClick={() => setActive(x.id)}
            >
              {x.id === active && <motion.span layoutId={reduce ? undefined : "h5-tab-pill"} className="h5-tab-pill" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
              <span className="h5-tab-txt">{x.tab}</span>
            </button>
          ))}
        </div>
        <div className="h5-proc-panel" role="tabpanel" id={`panel-${p.id}`} aria-labelledby={`tab-${p.id}`}>
          <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={p.id}
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.985, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -16, scale: 0.99, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
          {p.video ? (
            <ProcVideo key={p.id} video={p.video} label={p.tab} />
          ) : SHOW_VIDEO_PLACEHOLDERS ? (
            <div className="h5-vph" style={{ aspectRatio: "16/8" }} role="img" aria-label={`Lugar reservado: screen recording de ${p.tab}`}>
              <span className="h5-vph-badge">Video pendiente</span>
              <span className="h5-vph-play" aria-hidden="true">
                <Icon name="play" />
              </span>
              <span className="h5-vph-label">Screen recording en loop · {p.tab.toLowerCase()} · 20 a 30 s</span>
            </div>
          ) : (
            <div className="stage">
              <Expandable media={{ kind: "image", src: shot.src, alt: shot.alt, width: shot.width, height: shot.height }}>
                <BrowserFrame shot={shot} sizes="(max-width: 900px) 100vw, 980px" />
              </Expandable>
              {phone && <PhoneFrame shot={phone} sizes="230px" />}
            </div>
          )}
          </motion.div>
          </AnimatePresence>
          <Stagger key={p.id} as="ol" className="h5-steps" gap={0.09}>
            {p.steps.map((s, i) => (
              <Item key={s}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </Item>
            ))}
          </Stagger>
        </div>
        </div>

        {/* Celular: slider horizontal, un proceso por tarjeta. Solo se reproduce
            el video de la tarjeta visible; las demás muestran su portada. */}
        <div className="h5-proc-mobile">
          <div className="h5-tabs" ref={mtabs} role="tablist" aria-label="Procesos">
            {PROCESOS.map((x, k) => (
              <button
                key={x.id}
                type="button"
                role="tab"
                aria-selected={k === m}
                className={k === m ? "on" : ""}
                onClick={() => {
                  const box = slider.current;
                  const el = box?.children[k] as HTMLElement | undefined;
                  if (box && el) box.scrollTo({ left: el.offsetLeft - (box.children[0] as HTMLElement).offsetLeft, behavior: reduce ? "auto" : "smooth" });
                }}
              >
                {k === m && <span className="h5-tab-pill" />}
                <span className="h5-tab-txt">{x.tab}</span>
              </button>
            ))}
          </div>
          <div ref={slider} className="h5-proc-slider" onScroll={onSlide}>
            {PROCESOS.map((x, k) => (
              <div key={x.id} className="h5-proc-slide">
                {x.video ? (
                  k === m ? (
                    <ProcVideo video={x.video} label={x.tab} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="h5-video" src={x.video.poster} alt="" loading="lazy" />
                  )
                ) : (
                  <div className="h5-vph" style={{ aspectRatio: "16/9" }} role="img" aria-label={`Lugar reservado: screen recording de ${x.tab}`}>
                    <span className="h5-vph-badge">Video pendiente</span>
                    <span className="h5-vph-play" aria-hidden="true">
                      <Icon name="play" />
                    </span>
                  </div>
                )}
                <ol className="h5-steps">
                  {x.steps.map((st, i) => (
                    <li key={st}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {st}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
