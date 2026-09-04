"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReduce } from "@/components/site/useReduce";
import { ShotFrame } from "@/components/site/Frames";
import { MODULE_GROUPS, MODULE_CHIPS } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

const EASE = [0.2, 0.8, 0.2, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Grupos con numeración corrida (01–16), calculada una sola vez fuera del render. */
const NUMBERED = (() => {
  let c = 0;
  return MODULE_GROUPS.map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, n: ++c })) }));
})();

/**
 * Explorador de la plataforma: lista numerada por categoría (con conteos) y
 * vista previa fija a la derecha con la captura real del módulo elegido.
 * En mobile la vista previa va arriba y la lista abajo.
 */
export default function Explorer() {
  const flat = useMemo(() => MODULE_GROUPS.flatMap((g) => g.items.map((it) => ({ ...it, group: g.name }))), []);
  const [activeId, setActiveId] = useState(flat[0].id);
  const active = flat.find((m) => m.id === activeId) ?? flat[0];
  const activeIndex = flat.indexOf(active);
  const previewRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reduce = useReduce();

  // Rotación automática (5 s por módulo) mientras la lista está en pantalla y
  // el visitante todavía no eligió nada. Se detiene para siempre al primer
  // click o teclado, y se pausa con el mouse encima. En mobile no rota.
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
      setActiveId((id) => {
        const i = flat.findIndex((m) => m.id === id);
        return flat[(i + 1) % flat.length].id;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [auto, flat]);

  const select = (id: string) => {
    touched.current = true;
    setAuto(false);
    setActiveId(id);
    trackEvent(EVENTS.MODULE_VIEW, { module: id });
    if (window.matchMedia("(max-width: 900px)").matches) {
      const r = previewRef.current?.getBoundingClientRect();
      if (r && (r.top < 70 || r.bottom > window.innerHeight)) previewRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  };

  return (
    <section className="modules" id="plataforma">
      <span id="funcionalidades" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>02</span>Plataforma</div>
          <h2>
            Todo lo que hace tu operación, <em>en un solo lugar.</em>
          </h2>
          <p className="lede">Dieciséis módulos conectados entre sí: un NO OK en un checklist genera un desvío; una entrega de EPP descuenta stock; un permiso vencido avisa. Elegí uno para verlo en detalle.</p>
        </div>
        <div className="explorer">
          <div
            ref={listRef}
            className={`ex-list ${auto ? "auto" : ""}`}
            role="tablist"
            aria-label="Módulos de la plataforma"
            aria-orientation="vertical"
            onMouseEnter={() => { hovering.current = true; }}
            onMouseLeave={() => { hovering.current = false; }}
          >
            {NUMBERED.map((g) => (
              <div className="ex-group" key={g.name}>
                <div className="ex-gh"><span className="n">{pad(g.items.length)}</span>{g.name}</div>
                {g.items.map((it) => {
                  const n = it.n;
                  const on = it.id === activeId;
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
                      <span className="i">{pad(n)}</span>
                      <span className="t">{it.title}</span>
                      {on && auto && <span className="ex-progress" aria-hidden="true" key={it.id} />}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="ex-preview" ref={previewRef}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                className="ex-panel is-active"
                id={`ex-${active.id}`}
                role="tabpanel"
                aria-labelledby={`tab-${active.id}`}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -4 }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="ex-frame">
                  <ShotFrame shot={active.shot} sizes="(max-width: 900px) 100vw, 640px" />
                </div>
                <div className="ex-copy">
                  <div className="k">{pad(activeIndex + 1)} · {active.group}</div>
                  <h3>{active.title}</h3>
                  <p>{active.text}</p>
                </div>
              </motion.div>
            </AnimatePresence>
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
