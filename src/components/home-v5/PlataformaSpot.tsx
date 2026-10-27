"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import Icon from "@/components/site/Icon";
import Image from "next/image";
import { HOME5 } from "@/lib/home-v5";
import Expandable from "./Expandable";
import { Words } from "./Motion5";

/**
 * "Cuando tu cliente te audita": el marco queda fijo y el scroll avanza por
 * los pedidos del auditor. Cada paso cambia a la pantalla real que lo
 * contesta y la ilumina (el resto se oscurece apenas). En celular o con
 * "reducir movimiento" no se fija: cada pedido va con su captura, en lista.
 * Las coordenadas son porcentajes sobre la captura de cada zona.
 */
/** Acerca la captura a la zona y la centra, sin dejar ver bordes vacíos. */
function zoomFor(z: { x: number; y: number; w: number; h: number }) {
  const s = Math.min(1.7, 92 / z.w, 92 / z.h);
  const clamp = (v: number) => Math.min(0, Math.max(100 - 100 * s, v));
  const tx = clamp(50 - s * (z.x + z.w / 2));
  const ty = clamp(50 - s * (z.y + z.h / 2));
  return `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${s.toFixed(3)})`;
}

export default function PlataformaSpot() {
  const P = HOME5.plataforma;
  const zonas = P.zonas;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const n = Math.min(zonas.length - 1, Math.max(0, Math.floor(v * zonas.length * 0.999)));
    setI((prev) => (prev === n ? prev : n));
  });
  const z = zonas[i];
  const [m, setM] = useState(0);
  const slider = useRef<HTMLDivElement>(null);

  return (
    <section className="h5-plataforma" id="plataforma">
      <span id="funcionalidades" />
      <div className="wrap">
        <div className="h5-spot-head">
          <h2>
            <Words text={P.h2} accent={P.h2Accent} />
          </h2>
          <Link className="h5-spot-more" href="/plataforma">
            {P.more}
            <Icon name="arrow" />
          </Link>
        </div>
      </div>

      {/* Escritorio: captura fija con foco que avanza con el scroll */}
      <div ref={ref} className={`h5-spot-track${reduce ? " is-static" : ""}`} style={{ "--n": zonas.length } as React.CSSProperties}>
        <div className="h5-spot-sticky">
          <div className="wrap">
            <Expandable className="h5-spot-frame" media={{ kind: "image", ...z.shot }}>
              <div className="browser h5-wide">
                <div className="chrome">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="url">{z.shot.url}</span>
                </div>
                <div className="h5-spot-imgs">
                  {zonas.map((zz, k) => (
                    <Image
                      key={zz.shot.src}
                      src={zz.shot.src}
                      alt={k === i ? zz.shot.alt : ""}
                      width={zz.shot.width}
                      height={zz.shot.height}
                      sizes="(max-width: 1200px) 100vw, 1160px"
                      loading="eager"
                      className={k === i ? "on" : ""}
                    />
                  ))}
                </div>
              </div>
              <div className="h5-spot-layer" aria-live="polite">
                <motion.span
                  className="h5-spot"
                  initial={false}
                  animate={{ left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%` }}
                  transition={{ type: "spring", stiffness: 170, damping: 26, mass: 0.8 }}
                />
                <motion.div
                  className="h5-spot-tag"
                  initial={false}
                  animate={{ left: `${z.x}%`, top: `${z.y}%` }}
                  transition={{ type: "spring", stiffness: 170, damping: 26, mass: 0.8 }}
                >
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <i>{String(i + 1).padStart(2, "0")}</i>
                    <b>
                      {z.title} <em>{z.accent}</em>
                    </b>
                  </motion.span>
                </motion.div>
              </div>
            </Expandable>
          </div>
        </div>
      </div>

      {/* Celular: slider horizontal, un paso por tarjeta. Cada captura se
          acerca a su zona marcada para que se lea; los números siguen al
          deslizamiento y también sirven para saltar a un paso. */}
      <div className="wrap h5-spot-mobile">
        <div className="h5-mchips" role="tablist" aria-label="Pasos">
          {zonas.map((zz, k) => (
            <button
              key={zz.title}
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
              {String(k + 1).padStart(2, "0")}
            </button>
          ))}
        </div>
        <div
          ref={slider}
          className="h5-mslider"
          onScroll={(e) => {
            const el = e.currentTarget;
            const first = el.children[0] as HTMLElement | undefined;
            if (!first) return;
            const step = first.offsetWidth + 14;
            const n = Math.min(zonas.length - 1, Math.max(0, Math.round(el.scrollLeft / step)));
            setM((v) => (v === n ? v : n));
          }}
        >
          {zonas.map((zz) => (
            <div key={zz.title} className="h5-mslide">
              <p className="h5-mlabel">
                {zz.title} <em>{zz.accent}</em>
              </p>
              <Expandable media={{ kind: "image", ...zz.shot }}>
              <div className="browser h5-mframe">
                <div className="chrome">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="url">{zz.shot.url}</span>
                </div>
                <div className="h5-mview">
                  <div className="h5-mzoom" style={{ transformOrigin: "0 0", transform: zoomFor(zz) }}>
                    <Image src={zz.shot.src} alt={zz.shot.alt} width={zz.shot.width} height={zz.shot.height} sizes="90vw" loading="eager" />
                    <span className="h5-spot h5-mspot" style={{ left: `${zz.x}%`, top: `${zz.y}%`, width: `${zz.w}%`, height: `${zz.h}%` }} />
                  </div>
                </div>
              </div>
              </Expandable>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
