"use client";

import {
  QrCode,
  AlertTriangle,
  HardHat,
  FileCheck,
  Brain,
  LayoutDashboard,
  type LucideIcon,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { FEATURES } from "../_data";

const iconMap: Record<string, LucideIcon> = {
  QrCode,
  AlertTriangle,
  HardHat,
  FileCheck,
  Brain,
  LayoutDashboard,
};

export default function FeatureBenefits() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Todo lo que tu empresa necesita, en un solo lugar
          </AnimatedHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Pensado para que tu equipo deje de perder tiempo en papeleo y vos ganes visibilidad.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((feature, i) => {
            const Icon = iconMap[feature.icon];
            return (
              <ScrollReveal key={feature.title} variant="fadeUp" delay={i * 0.08} className="h-full">
                <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
                  {Icon && (
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                      <Icon className="h-6 w-6" />
                    </span>
                  )}
                  <h3 className="text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-white/75">
                    {feature.benefit}
                  </p>
                </SpotlightCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
