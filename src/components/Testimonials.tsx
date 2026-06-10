"use client";

import { motion } from "framer-motion";
import { Building2, Users, CheckCircle } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { CASE_STUDIES } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Casos reales
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Empresas que ya gestionan su seguridad e higiene con SHIPSAFE.
          </p>
        </ScrollReveal>

        <div className="mx-auto mt-12 max-w-3xl">
          {CASE_STUDIES.map((cs, i) => (
            <ScrollReveal key={cs.company} delay={i * 0.15} variant="slideUp">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className="group rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/10 sm:p-10"
              >
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2 text-white">
                    <Building2 className="h-5 w-5 text-accent" />
                    <span className="font-semibold">{cs.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Users className="h-4 w-4 text-accent/70" />
                    {cs.employees}
                  </div>
                </div>

                <p className="mt-5 leading-relaxed text-white/80">
                  {cs.summary}
                </p>

                {cs.quote && (
                  <div className="relative mt-6 border-l-2 border-accent/40 pl-4">
                    <p className="text-sm italic leading-relaxed text-white/75">
                      &ldquo;{cs.quote}&rdquo;
                    </p>
                    <p className="mt-2 text-xs text-white/50">{cs.quoteRole}</p>
                  </div>
                )}

                <div className="mt-6 flex items-center gap-2 text-sm text-white/60">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  Cliente activo, en producción
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
