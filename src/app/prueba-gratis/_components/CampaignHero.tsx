"use client";

import { motion } from "framer-motion";
import CtaButton from "./CtaButton";
import VideoEmbed from "./VideoEmbed";
import { HERO, MICRO_TRUST } from "../_data";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const blurIn = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function CampaignHero() {
  return (
    <section className="relative overflow-x-clip">
      {/* Blueprint grid + film grain, detrás del contenido */}
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="noise pointer-events-none absolute inset-0 opacity-[0.025]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24 lg:pt-10">
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Frase de venta — arriba, centrada */}
          <div className="flex flex-col items-center text-center">
            <motion.p
              variants={blurIn}
              className="mb-5 inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-sm"
            >
              {HERO.eyebrow}
            </motion.p>

            <motion.h1
              variants={blurIn}
              className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {HERO.headline}
            </motion.h1>

            <motion.p
              variants={blurIn}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75"
            >
              {HERO.subheadline}
            </motion.p>

            <motion.div variants={blurIn} className="mt-8">
              <CtaButton section="hero" size="lg" />
            </motion.div>

            <motion.p variants={blurIn} className="mt-4 text-sm text-white/65">
              {MICRO_TRUST}
            </motion.p>
          </div>

          {/* Video grande, debajo de la frase de venta */}
          <motion.div variants={blurIn} className="mt-12 lg:mt-16">
            <div className="relative mx-auto max-w-4xl">
              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full bg-accent/10 blur-[70px]"
              />
              <div className="relative">
                <VideoEmbed />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
