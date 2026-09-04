"use client";

import { useEffect, useRef, useState } from "react";
import Icon, { type IconName } from "@/components/site/Icon";
import { useReduce } from "@/components/site/useReduce";
import { FLOW_STEPS, FLOW_TODAY } from "@/lib/home-content";

const HOLD = 2600; // ms que se queda encendido cada paso
const REST = 1400; // pausa al final antes de volver a empezar

/**
 * Sección 03. El "marcapasos": un pulso recorre la línea de paso en paso.
 * Arranca cuando la sección entra en pantalla, se pausa con el mouse encima
 * (o al tocar un paso), y con prefers-reduced-motion queda quieto en el paso 1.
 */
export default function Flow() {
  const reduce = useReduce();
  const [active, setActive] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [running, setRunning] = useState(false);
  const paused = useRef(false);
  const ref = useRef<HTMLOListElement>(null);
  const n = FLOW_STEPS.length;

  // Solo late mientras la lista está en pantalla.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  useEffect(() => {
    if (!running || reduce) return;
    const t = setTimeout(
      () => {
        if (paused.current) return; // el próximo tick lo dispara mouseleave
        if (active < n - 1) setActive(active + 1);
        else setResetting(true);
      },
      active === n - 1 ? HOLD + REST : HOLD,
    );
    return () => clearTimeout(t);
  }, [active, running, reduce, n]);

  // Volver al paso 1: se apaga la línea (300 ms) y recién ahí se reinicia.
  useEffect(() => {
    if (!resetting) return;
    const t = setTimeout(() => {
      setActive(0);
      setResetting(false);
    }, 320);
    return () => clearTimeout(t);
  }, [resetting]);

  const resume = () => {
    paused.current = false;
    // reanuda avanzando (o reiniciando) enseguida
    setActive((a) => (a < n - 1 ? a + 1 : a));
  };

  // En mobile la línea es vertical: la altura del trazo se mide sobre el paso activo.
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const li = el.querySelectorAll<HTMLLIElement>("li")[active];
      if (li) setY(li.offsetTop + 15);
    };
    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [active]);

  const progress = n > 1 ? active / (n - 1) : 0;

  return (
    <section className="flow" id="como-funciona">
      <span id="flujo" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>03</span>Cómo funciona</div>
          <h2>
            Un hallazgo recorre toda la operación <em>sin que nadie lo empuje.</em>
          </h2>
          <p className="lede">Así viaja un NO OK desde la camioneta hasta el tablero de gerencia. Cada paso lo hace la persona que corresponde, desde donde está.</p>
        </div>
        <div className="today"><span className="k">Hoy</span><span>{FLOW_TODAY}</span></div>
        <ol
          ref={ref}
          className={`steps pace ${resetting ? "is-reset" : ""} ${reduce ? "is-static" : ""}`}
          style={{ ["--p" as string]: progress, ["--y" as string]: `${y}px` }}
          onMouseEnter={() => { paused.current = true; }}
          onMouseLeave={resume}
        >
          <span className="track" aria-hidden="true" />
          {FLOW_STEPS.map((s, i) => (
            <li
              key={s.title}
              className={i === active ? "is-active" : i < active ? "is-done" : ""}
              onClick={() => { paused.current = true; setActive(i); }}
            >
              <span className={`who ${"sys" in s && s.sys ? "sys" : ""}`}>
                <Icon name={s.icon as IconName} />
                {s.who}
              </span>
              <b>{s.title}</b>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
