"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import AnimatedHeading from "./ui/AnimatedHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { cn } from "@/lib/utils";
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

// Layout bento: la primera feature (QR) es la celda héroe, el resto fluye en celdas de 2 columnas
const BENTO_SPANS: Record<number, { span: string; large: boolean }> = {
  0: { span: "sm:col-span-2 lg:col-span-4 lg:row-span-2", large: true },
};

export default function Features() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? FEATURES : FEATURES.slice(0, 6);

  return (
    <section id="funcionalidades" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Todo lo que necesitás para gestionar la seguridad
          </AnimatedHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Una plataforma completa que reemplaza planillas, carpetas y grupos
            de WhatsApp.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {visible.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            const bento = BENTO_SPANS[i] ?? { span: "lg:col-span-2", large: false };
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: i < 6 ? i * 0.08 : (i - 6) * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className={bento.span}
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.01 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="group h-full"
                >
                  <SpotlightCard
                    className={cn(
                      "h-full rounded-xl border border-white/10 bg-white/[0.05] backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-accent/10",
                      bento.large ? "p-8 lg:p-10" : "p-6"
                    )}
                  >
                    {bento.large && Icon && (
                      <Icon
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 text-white opacity-[0.05] transition-opacity duration-500 group-hover:opacity-[0.09]"
                      />
                    )}
                    <div
                      className={cn(
                        "mb-4 flex items-center justify-center rounded-xl bg-accent/10 transition-colors duration-300 group-hover:bg-accent",
                        bento.large ? "h-14 w-14" : "h-12 w-12"
                      )}
                    >
                      {Icon && (
                        <Icon
                          className={cn(
                            "text-accent transition-colors duration-300 group-hover:text-white",
                            bento.large ? "h-7 w-7" : "h-6 w-6"
                          )}
                        />
                      )}
                    </div>
                    <h3
                      className={cn(
                        "mb-2 font-semibold text-white",
                        bento.large ? "text-2xl" : "text-lg"
                      )}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={cn(
                        "leading-relaxed text-white/70",
                        bento.large ? "max-w-md text-base" : "text-sm"
                      )}
                    >
                      {feature.description}
                    </p>
                  </SpotlightCard>
                </motion.div>
              </motion.div>
            );
          })}
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
