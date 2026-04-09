"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { STEPS, CTAS } from "@/lib/constants";

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Empezar es más simple de lo que pensás
          </h2>
        </ScrollReveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.2} variant="slideUp">
              <div className="relative text-center">
                {/* Connector line (desktop only) */}
                {i < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute right-0 top-8 hidden h-0.5 w-[calc(50%-2rem)] translate-x-full lg:block">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                      className="h-full origin-left bg-gradient-to-r from-accent/40 to-accent/10"
                    />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-600 text-2xl font-bold text-white shadow-lg shadow-accent/25"
                >
                  {step.number}
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/70">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4} variant="scale">
          <div className="mt-12 text-center">
            <motion.a
              href={CTAS.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/30"
            >
              Agendá una demo
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
