"use client";

import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { CTAS } from "@/lib/constants";

export default function CTAFinal() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <ScrollReveal variant="blur" duration={0.8}>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Digitalizá la seguridad de tu planta hoy
          </h2>
          <p className="mt-4 text-lg text-white/75">
            Digitalizá la gestión de seguridad e higiene de tu planta en
            minutos. Tu equipo te lo va a agradecer.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} variant="slideUp">
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.a
              href={CTAS.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative">{CTAS.primary.label}</span>
            </motion.a>
            <motion.a
              href={CTAS.secondary.href}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/60 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
            >
              {CTAS.secondary.label}
            </motion.a>
          </div>
          <p className="mt-6 text-sm text-white/65">
            Sin compromiso · Te mostramos todo en 15 minutos · Soporte por
            WhatsApp
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
