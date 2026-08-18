"use client";

import { Building2, BadgeCheck } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { CASE_STUDIES } from "@/lib/constants";

/**
 * Prueba social cerca del CTA. Reutiliza el caso real publicado en el sitio
 * (solo lectura de constants.ts). SOLO datos reales: si no hay quote, se
 * muestran únicamente los hechos del caso.
 *
 * Compartido entre landings de campaña: no depende del _data.ts de ninguna.
 */
export default function SocialProof() {
  const caseStudy = CASE_STUDIES[0];
  if (!caseStudy) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-widest text-accent">
            Caso real
          </p>
          <SpotlightCard className="rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <Building2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">{caseStudy.company}</p>
                  <p className="text-sm text-white/60">{caseStudy.employees}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                <BadgeCheck className="h-3.5 w-3.5" />
                Cliente activo
              </span>
            </div>

            <p className="mt-6 text-base leading-relaxed text-white/80">
              {caseStudy.summary}
            </p>

            {caseStudy.quote && (
              <blockquote className="mt-6 border-l-2 border-accent/40 pl-4 text-base italic leading-relaxed text-white/75">
                &ldquo;{caseStudy.quote}&rdquo;
                <footer className="mt-2 text-sm not-italic text-white/55">
                  {caseStudy.quoteRole}
                </footer>
              </blockquote>
            )}
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
