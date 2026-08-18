"use client";

import { Code2, HardHat, Factory, ExternalLink } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import NumberTicker from "./ui/NumberTicker";
import { STATS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2,
  HardHat,
  Factory,
};

export default function Credibility() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-6 py-12 text-center backdrop-blur-sm sm:px-12">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Desarrollado por{" "}
              <a
                href="https://shipsoftware.team"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent underline decoration-accent/40 underline-offset-4 transition-colors hover:decoration-accent"
              >
                Ship Software Team
                <ExternalLink className="inline h-4 w-4" />
              </a>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75">
              Combinamos años de experiencia en desarrollo de software con
              conocimiento profundo del sector de seguridad e higiene
              en Argentina. Creamos SHIPSAFE porque sabemos que la tecnología
              tiene que adaptarse a tu operación, no al revés.
            </p>

            <div className="mx-auto mt-10 grid max-w-xl gap-8 sm:grid-cols-3">
              {STATS.map((stat, i) => {
                const Icon = iconMap[stat.icon];
                return (
                  <ScrollReveal key={stat.label} delay={0.1 + i * 0.1} variant="fadeUp">
                    <div className="flex flex-col items-center gap-2">
                      {Icon && <Icon className="h-5 w-5 text-accent" />}
                      <NumberTicker
                        value={stat.value}
                        suffix={stat.suffix}
                        className="font-display text-2xl font-bold text-accent"
                      />
                      <span className="text-sm text-white/65">{stat.label}</span>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
