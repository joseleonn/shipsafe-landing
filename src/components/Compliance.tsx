"use client";

import { motion } from "framer-motion";
import {
  Scale,
  FileText,
  HardHat,
  Activity,
  ShieldCheck,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { COMPLIANCE_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Scale,
  FileText,
  HardHat,
  Activity,
  ShieldCheck,
};

export default function Compliance() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cumplimiento normativo sin dolor de cabeza
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            SHIPSAFE te ayuda a cumplir con toda la normativa vigente de
            seguridad e higiene laboral argentina.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COMPLIANCE_ITEMS.map((item, i) => {
            const Icon = iconMap[item.icon];
            return (
              <ScrollReveal
                key={item.title}
                delay={i * 0.08}
                variant={i % 3 === 0 ? "fadeLeft" : i % 3 === 1 ? "fadeUp" : "fadeRight"}
              >
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex h-full items-start gap-4 rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/10"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    {Icon && <Icon className="h-6 w-6 text-accent" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.3} variant="scale">
          <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-white/65">
            Generá toda la documentación que tu ART necesita con un clic.
            Registros de inspecciones, entregas de EPP, capacitaciones y
            mediciones ambientales — todo con trazabilidad completa.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
