"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@/components/site/Icon";
import { useReduce } from "@/components/site/useReduce";
import { ShotFrame } from "@/components/site/Frames";
import { MODULE_GROUPS, MODULE_CHIPS } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const PASO = 4200; // ms que se queda cada captura en pantalla
const pad = (n: number) => String(n).padStart(2, "0");

/** Grupos con numeración corrida (01 a 16), calculada una sola vez fuera del render. */
const NUMBERED = (() => {
  let c = 0;
  return MODULE_GROUPS.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, n: ++c })) }));
})();

/**
 * Explorador de la plataforma: la lista de módulos a la izquierda y, a la
 * derecha, el recorrido del módulo elegido.
 *
 * Cada módulo es una demo corta: varias capturas en orden, y arriba de cada
 * una la frase que explica qué está pasando en esa pantalla. Se avanza solo,
 * con las flechas, con el riel de pasos, con las flechas del teclado o
 * deslizando en el celular. Los módulos que son una sola pantalla (los de
 * configuración) traen un paso único y ahí no aparece ningún control.
 *
 * El encabezado de la sección dice que las piezas están encadenadas, pero no
 * dibuja el recorrido completo: eso lo hace la sección 03 (Flow). Tenerlo dos
 * veces se leía como la misma cosa repetida.
 */
export default function Explorer() {
  const flat = useMemo(() => MODULE_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.name }))), []);

  // Módulo y paso viven en un solo estado: al cambiar de módulo el paso vuelve
  // a cero en el mismo render, sin un efecto que lo corrija después.
  const [pos, setPos] = useState({ id: flat[0].id, step: 0 });
  const active = flat.find((m) => m.id === pos.id) ?? flat[0];
  const activeIndex = flat.indexOf(active);
  const pasos = active.steps;
  const step = pasos[Math.min(pos.step, pasos.length - 1)];
  const conRecorrido = pasos.length > 1;

  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce();

  // Avance automático mientras la lista está en pantalla y el visitante
  // todavía no tocó nada. Recorre los pasos del módulo y sigue con el
  // siguiente. Se detiene para siempre al primer click o tecla, y se pausa con
  // el mouse encima. En mobile no avanza solo.
  const [auto, setAuto] = useState(false);
  const touched = useRef(false);
  const hovering = useRef(false);
  useEffect(() => {
    const el = listRef.current;
    if (!el || reduce || window.matchMedia("(max-width: 900px)").matches) return;
    const io = new IntersectionObserver(([e]) => setAuto(e.isIntersecting && !touched.current), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);
  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      if (hovering.current || touched.current) return;
      setPos((p) => {
        const i = flat.findIndex((m) => m.id === p.id);
        const mod = flat[i] ?? flat[0];
        if (p.step < mod.steps.length - 1) return { id: p.id, step: p.step + 1 };
        return { id: flat[(i + 1) % flat.length].id, step: 0 };
      });
    }, PASO);
    return () => clearInterval(t);
  }, [auto, flat]);

  const detener = () => {
    touched.current = true;
    setAuto(false);
  };

  const select = (id: string) => {
    detener();
    setPos({ id, step: 0 });
    trackEvent(EVENTS.MODULE_VIEW, { module: id });
    if (window.matchMedia("(max-width: 900px)").matches) {
      const r = previewRef.current?.getBoundingClientRect();
      if (r && (r.top < 70 || r.bottom > window.innerHeight)) previewRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  const irA = (n: number) => {
    detener();
    setPos((p) => ({ id: p.id, step: (n + pasos.length) % pasos.length }));
  };

  // Deslizar en el celular. 45 px de umbral para no robarle el scroll vertical.
  const swipe = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => { swipe.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    const d = e.changedTouches[0].clientX - swipe.current;
    if (conRecorrido && Math.abs(d) > 45) irA(pos.step + (d < 0 ? 1 : -1));
  };

  return (
    <section className="modules" id="plataforma">
      <span id="funcionalidades" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>02</span>Plataforma</div>
          <h2>
            Todo lo que pasa en SST <em>queda conectado.</em>
          </h2>
          <p className="lede">Lo que se carga en un módulo aparece en el resto. Una inspección con un NO OK deja un desvío con responsable y fecha. Una capacitación que se vence aparece en el tablero del supervisor sin que nadie la copie a ningún lado.</p>
        </div>

        <p className="ex-intro">Dieciséis módulos, uno por cada cosa que hoy vive en una planilla distinta. Elegí uno y mirá el recorrido por dentro.</p>
        <div className="explorer">
          <div
            ref={listRef}
            className="ex-list"
            role="tablist"
            aria-label="Módulos de la plataforma"
            aria-orientation="vertical"
            onMouseEnter={() => { hovering.current = true; }}
            onMouseLeave={() => { hovering.current = false; }}
          >
            {NUMBERED.map((g) => (
              <div className="ex-group" key={g.name}>
                <div className="ex-gh">
                  <span>{g.name}</span>
                  <span className="n">{g.items.length} módulos</span>
                </div>
                {g.items.map((it) => {
                  const on = it.id === pos.id;
                  return (
                    <button
                      key={it.id}
                      className={`ex-item ${on ? "is-active" : ""}`}
                      role="tab"
                      aria-selected={on}
                      aria-controls={`ex-${it.id}`}
                      id={`tab-${it.id}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => select(it.id)}
                      onKeyDown={(e) => {
                        const i = flat.findIndex((m) => m.id === it.id);
                        const nxt = e.key === "ArrowDown" ? (i + 1) % flat.length : e.key === "ArrowUp" ? (i - 1 + flat.length) % flat.length : e.key === "Home" ? 0 : e.key === "End" ? flat.length - 1 : -1;
                        if (nxt >= 0) { e.preventDefault(); select(flat[nxt].id); document.getElementById(`tab-${flat[nxt].id}`)?.focus(); }
                      }}
                    >
                      <span className="i">{pad(it.n)}</span>
                      <span className="t">{it.title}</span>
                      {it.steps.length > 1 && <span className="ex-n" aria-label={`${it.steps.length} pantallas`}>{it.steps.length}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          <div
            className="ex-preview"
            ref={previewRef}
            id={`ex-${active.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${active.id}`}
            onMouseEnter={() => { hovering.current = true; }}
            onMouseLeave={() => { hovering.current = false; }}
          >
            {/* El texto va arriba de la captura: primero qué está pasando,
                después la pantalla donde pasa. */}
            <div className="ex-copy">
              <div className="k">{pad(activeIndex + 1)} · {active.group}</div>
              <h3>{active.title}</h3>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`${active.id}-${pos.step}`}
                  initial={reduce ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.24, ease: EASE }}
                >
                  {step.text}
                </motion.p>
              </AnimatePresence>
            </div>

            {conRecorrido && (
              <div className="ex-pasos">
                <button type="button" className="ex-arrow" aria-label="Paso anterior" onClick={() => irA(pos.step - 1)}>
                  <Icon name="left" />
                </button>
                <ol className="ex-rail">
                  {pasos.map((s, i) => (
                    <li key={s.label || i}>
                      <button
                        type="button"
                        className={i === pos.step ? "is-active" : i < pos.step ? "is-done" : ""}
                        aria-current={i === pos.step}
                        onClick={() => irA(i)}
                        onKeyDown={(e) => {
                          const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
                          if (d) { e.preventDefault(); irA(pos.step + d); }
                        }}
                      >
                        <span className="i">{i + 1}</span>
                        <span className="t">{s.label}</span>
                      </button>
                    </li>
                  ))}
                </ol>
                <button type="button" className="ex-arrow" aria-label="Paso siguiente" onClick={() => irA(pos.step + 1)}>
                  <Icon name="right" />
                </button>
              </div>
            )}

            <div className="ex-frame" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`${active.id}-${pos.step}`}
                  className="ex-shot"
                  initial={reduce ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -4 }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  <ShotFrame shot={step.shot} sizes="(max-width: 900px) 100vw, 640px" />
                </motion.div>
              </AnimatePresence>
              {conRecorrido && (
                <span className="ex-cuenta" aria-hidden="true">
                  {pos.step + 1} / {pasos.length}
                </span>
              )}
            </div>
          </div>
        </div>
        <ul className="chips-row" aria-label="También incluye">
          {MODULE_CHIPS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
