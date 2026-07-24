"use client";

import ScrollReveal from "@/components/ScrollReveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import CtaButton from "./CtaButton";
import { MICRO_TRUST } from "../_data";

export default function FinalCta() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="scale">
          <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-accent/[0.07] px-6 py-16 text-center backdrop-blur-sm sm:px-12">
            <div aria-hidden="true" className="absolute -inset-x-10 -top-20 h-40 bg-accent/20 blur-[80px]" />
            <div className="relative">
              <AnimatedHeading className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Agendá tu demo y ordená las inspecciones de toda tu empresa.
              </AnimatedHeading>

              <div className="mt-8 flex justify-center">
                <CtaButton section="final" size="lg" />
              </div>

              <p className="mt-4 text-sm text-white/65">{MICRO_TRUST}</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
