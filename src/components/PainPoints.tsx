"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { PAIN_POINTS } from "@/lib/constants";

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -4,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function PainPoints() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ¿Te suena familiar?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Si alguna de estas situaciones te resulta conocida, SHIPSAFE es para
            vos.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PAIN_POINTS.map((pain, i) => (
            <ScrollReveal key={i} delay={i * 0.08} variant={i % 2 === 0 ? "fadeUp" : "scale"} className="h-full">
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHover}
                className="group h-full cursor-default rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/10"
              >
                <div className="mb-3 h-1 w-12 rounded-full bg-accent transition-all duration-300 group-hover:w-20" />
                <p className="text-sm leading-relaxed text-white/80">
                  <span className="text-lg text-accent/60">&ldquo;</span>
                  {pain}
                  <span className="text-lg text-accent/60">&rdquo;</span>
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
