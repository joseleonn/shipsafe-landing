"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CTAS, STATS } from "@/lib/constants";
import NumberTicker from "./ui/NumberTicker";
import Magnetic from "./ui/Magnetic";
import PhoneDemo from "./PhoneDemo";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const blurIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const logoReveal = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(12px)" },
  show: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1,
      ease: [0.25, 0.1, 0.25, 1] as const,
      delay: 0.3,
    },
  },
};

const floatingAnimation = {
  y: [0, -8, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative min-h-svh overflow-x-clip">
      {/* Blueprint grid + film grain, detrás del contenido */}
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />

      {/* Content: text left + logo right */}
      <div className="relative z-10 mx-auto flex min-h-svh max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid w-full gap-8 py-24 lg:grid-cols-5 lg:gap-12 lg:py-0"
        >
          {/* Text — left */}
          <div className="flex flex-col justify-center lg:col-span-3">
            <motion.p
              variants={blurIn}
              className="mb-5 inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-sm"
            >
              Para empresas, consultores y técnicos
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Software de seguridad e higiene:{" "}
              <span className="bg-gradient-to-r from-blue-400 via-accent to-blue-400 bg-clip-text text-transparent">
                toda tu gestión ordenada
              </span>{" "}
              en un solo lugar.
            </motion.h1>

            <motion.p
              variants={blurIn}
              className="mt-6 max-w-xl text-lg leading-relaxed text-white/75"
            >
              Inspecciones, desvíos, capacitaciones y mediciones en un solo
              lugar. Tu equipo carga todo desde el celular y vos lo ves al
              instante, sin andar persiguiendo planillas.
            </motion.p>

            <motion.div
              variants={blurIn}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Magnetic className="w-fit">
                <a
                  href={CTAS.primary.href}
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">{CTAS.primary.label}</span>
                </a>
              </Magnetic>
            </motion.div>

            <motion.p
              variants={blurIn}
              className="mt-4 text-sm text-white/65"
            >
              Sin compromiso · Te respondemos en menos de 24hs
            </motion.p>

            <motion.div
              variants={blurIn}
              className="mt-10 flex w-fit divide-x divide-white/10"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="px-5 first:pl-0 last:pr-0">
                  <NumberTicker
                    value={stat.value}
                    suffix={stat.suffix}
                    className="font-display text-2xl font-bold text-white sm:text-3xl"
                  />
                  <p className="mt-1 max-w-[10rem] text-xs leading-snug text-white/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Phone demo — right */}
          <motion.div
            variants={logoReveal}
            className="flex items-center justify-center lg:col-span-2"
          >
            <motion.div
              animate={prefersReducedMotion ? {} : floatingAnimation}
              className="relative w-full max-w-[280px] lg:max-w-[300px]"
              aria-hidden="true"
            >
              {/* Layered glow behind phone */}
              <div className="absolute -inset-16 rounded-full bg-accent/[0.07] blur-[80px]" />
              <div className="absolute -inset-10 rounded-full bg-accent/10 blur-[50px]" />
              <div className="absolute -inset-4 rounded-full bg-accent/[0.06] blur-2xl" />

              <div className="relative">
                <PhoneDemo />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
