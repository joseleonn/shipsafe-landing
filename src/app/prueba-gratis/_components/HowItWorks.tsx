"use client";

import ScrollReveal from "@/components/ScrollReveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import CtaButton from "./CtaButton";
import { STEPS } from "../_data";

export default function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Empezar es más simple de lo que pensás
          </AnimatedHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            En tres pasos tenés tu primera inspección registrada.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.1} variant="fadeUp" className="h-full">
              <SpotlightCard className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm">
                <span className="font-display text-4xl font-bold text-accent/40">
                  {step.number}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  {step.description}
                </p>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal variant="fadeUp" delay={0.1} className="mt-12 flex justify-center">
          <CtaButton section="how-it-works" size="md" />
        </ScrollReveal>
      </div>
    </section>
  );
}
