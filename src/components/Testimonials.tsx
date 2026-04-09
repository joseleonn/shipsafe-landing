"use client";

// TODO: Replace placeholder testimonials with real customer quotes

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { TESTIMONIALS } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Lo que dicen nuestros clientes
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.15} variant="slideUp">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="group h-full rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/10"
              >
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-600 text-sm font-bold text-white shadow-md shadow-accent/20">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-white/70">
                      {t.role} — {t.company}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <span className="absolute -left-1 -top-2 text-3xl leading-none text-accent/30">&ldquo;</span>
                  <p className="pl-4 text-sm leading-relaxed text-white/75 italic">
                    {t.quote}
                  </p>
                  <span className="ml-1 text-3xl leading-none text-accent/30">&rdquo;</span>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
