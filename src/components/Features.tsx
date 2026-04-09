"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  AlertTriangle,
  BarChart3,
  Gauge,
  GraduationCap,
  HeartPulse,
  Smartphone,
  Building2,
  Download,
  Shield,
  BellRing,
  ClipboardCheck,
  ChevronDown,
} from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { FEATURES } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  QrCode,
  AlertTriangle,
  BarChart3,
  Gauge,
  GraduationCap,
  HeartPulse,
  Smartphone,
  Building2,
  Download,
  Shield,
  BellRing,
  ClipboardCheck,
};

export default function Features() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FEATURES : FEATURES.slice(0, 6);

  return (
    <section id="funcionalidades" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitás para gestionar la seguridad
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Una plataforma completa que reemplaza planillas, carpetas y grupos
            de WhatsApp.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((feature, i) => {
              const Icon = iconMap[feature.icon];
              return (
                <motion.div
                  key={feature.title}
                  layout
                  initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.5,
                    delay: i < 6 ? i * 0.08 : (i - 6) * 0.08,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                >
                  <motion.div
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="group h-full rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/10"
                  >
                    <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 transition-colors duration-300 group-hover:bg-accent">
                      {Icon && (
                        <Icon className="h-6 w-6 text-accent transition-colors duration-300 group-hover:text-white" />
                      )}
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70">
                      {feature.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {!showAll && (
          <ScrollReveal delay={0.3}>
            <div className="mt-8 text-center">
              <motion.button
                onClick={() => setShowAll(true)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10"
              >
                Ver más funcionalidades
                <ChevronDown className="h-4 w-4" />
              </motion.button>
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}
