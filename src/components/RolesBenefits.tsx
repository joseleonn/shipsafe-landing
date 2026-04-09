"use client";

import { motion } from "framer-motion";
import { Check, HardHat, BarChart3, ShieldCheck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { BENEFITS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  HardHat,
  BarChart3,
  ShieldCheck,
};

export default function RolesBenefits() {
  return (
    <section id="beneficios" className="relative overflow-hidden py-20 lg:py-28">
      {/* Background ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/4 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-1/4 h-[300px] w-[300px] rounded-full bg-accent/5 blur-[80px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Una plataforma, múltiples perspectivas
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/70">
            SHIPSAFE se adapta a lo que cada equipo necesita, sin importar el
            rol o la estructura de tu organización.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <ScrollReveal key={benefit.title} delay={i * 0.15} variant="slideUp">
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group h-full rounded-2xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-accent/10"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-all duration-300 group-hover:bg-accent group-hover:shadow-lg group-hover:shadow-accent/25">
                    {Icon && (
                      <Icon className="h-6 w-6 text-accent transition-colors duration-300 group-hover:text-white" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {benefit.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {benefit.subtitle}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {benefit.benefits.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.08, duration: 0.4 }}
                        className="flex items-start gap-3"
                      >
                        <Check className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
                        <span className="text-sm text-white/75">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
