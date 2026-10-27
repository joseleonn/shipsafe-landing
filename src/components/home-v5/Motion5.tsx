"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";

/**
 * Animaciones de la home v5. Todo respeta prefers-reduced-motion: con esa
 * preferencia, cada componente renderiza el contenido quieto.
 *
 *  - ScrollProgress: barra fina arriba que avanza con el scroll.
 *  - HeroTilt: el video del hero arranca inclinado en 3D y se endereza a
 *    medida que bajás (los primeros ~520 px de scroll).
 *  - Tilt: lo mismo para cualquier bloque, ligado a su propia posición.
 *  - Words: títulos que aparecen palabra por palabra desde una máscara.
 *  - Stagger / Item: listas que entran en cascada (opacidad, subida y blur).
 *  - Parallax: un bloque que se desplaza más lento que la página.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return <motion.div className="h5-progress" style={{ scaleX }} aria-hidden="true" />;
}

export function HeroTilt({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const rotateX = useTransform(scrollY, [0, 520], [16, 0]);
  const scale = useTransform(scrollY, [0, 520], [0.92, 1]);
  const y = useTransform(scrollY, [0, 520], [0, -40]);
  if (reduce) return <>{children}</>;
  return (
    <div className="h5-persp">
      <motion.div style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}>{children}</motion.div>
    </div>
  );
}

export function Tilt({ children, className, max = 14 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [max, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0.35, 1]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <div ref={ref} className={`h5-persp ${className ?? ""}`}>
      <motion.div style={{ rotateX, scale, opacity, transformOrigin: "50% 0%" }}>{children}</motion.div>
    </div>
  );
}

export function Parallax({ children, className, speed = 60 }: { children: ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

const wordsParent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.055 } } };
const word: Variants = {
  hidden: { y: "105%", rotate: 3, opacity: 0 },
  show: { y: "0%", rotate: 0, opacity: 1, transition: { duration: 0.85, ease: EASE } },
};

/** Título palabra por palabra. `accent` va en el azul de la marca. */
export function Words({ text, accent }: { text: string; accent?: string }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <>
        {text} {accent && <em>{accent}</em>}
      </>
    );
  }
  const list = [
    ...text.split(" ").map((w) => ({ w, a: false })),
    ...(accent ? accent.split(" ").map((w) => ({ w, a: true })) : []),
  ];
  return (
    <motion.span className="h5-words" variants={wordsParent} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {list.map((x, i) => (
        <Fragment key={i}>
          <span className="h5-wmask">
            <motion.span className={x.a ? "h5-w em" : "h5-w"} variants={word}>
              {x.w}
            </motion.span>
          </span>
          {i < list.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </motion.span>
  );
}

const staggerParent = (gap: number): Variants => ({ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: 0.05 } } });
const staggerItem: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: EASE } },
};

export function Stagger({
  children,
  as = "ul",
  className,
  gap = 0.07,
}: {
  children: ReactNode;
  as?: "ul" | "ol" | "div";
  className?: string;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} variants={staggerParent(gap)} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
      {children}
    </Tag>
  );
}

export function Item({ children, as = "li", className }: { children: ReactNode; as?: "li" | "div"; className?: string }) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} variants={staggerItem}>
      {children}
    </Tag>
  );
}

/** Aparición simple de un bloque al entrar en pantalla. */
export function Rise({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Número que cuenta desde 0 cuando entra en pantalla. */
export function CountUp({ to, duration = 1.4 }: { to: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(to);
  const started = useRef(false);
  useEffect(() => {
    if (reduce || !inView || started.current) return;
    started.current = true;
    const c = animate(0, to, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, to, duration]);
  return <span ref={ref}>{n}</span>;
}
