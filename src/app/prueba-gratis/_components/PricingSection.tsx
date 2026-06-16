"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedHeading from "@/components/ui/AnimatedHeading";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { cn } from "@/lib/utils";
import CtaButton from "./CtaButton";
import { PLANS } from "../_data";

export default function PricingSection() {
  return (
    <section id="precios" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Precios claros, sin sorpresas
          </AnimatedHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Probás gratis 14 días. Recién después elegís tu plan.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {PLANS.map((plan, i) => (
            <ScrollReveal key={plan.id} delay={i * 0.1} variant="fadeUp" className="h-full">
              <SpotlightCard
                className={cn(
                  "flex h-full flex-col rounded-2xl border p-8 backdrop-blur-sm",
                  plan.highlighted
                    ? "border-accent/40 bg-accent/[0.07]"
                    : "border-white/10 bg-white/[0.05]"
                )}
              >
                {plan.badge && (
                  <span className="mb-4 inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-white/60">{plan.target}</p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/60">{plan.priceDetail}</span>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => {
                    const isPlus = feature.startsWith("Plus — ");
                    const label = isPlus ? feature.replace("Plus — ", "") : feature;
                    return (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-start gap-2.5 text-sm",
                          isPlus ? "text-white" : "text-white/80"
                        )}
                      >
                        {isPlus ? (
                          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                        ) : (
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        )}
                        <span>
                          {isPlus && (
                            <span className="mr-1.5 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
                              Plus
                            </span>
                          )}
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-auto flex flex-col gap-3 pt-8">
                  <CtaButton section={`pricing-${plan.id}`} size="md" fullWidth />
                  <p className="text-center text-xs text-white/55">
                    Cancelás cuando quieras · Sin permanencia
                  </p>
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>

        {/* Link discreto al sitio principal para empresas grandes */}
        <ScrollReveal variant="fadeUp" delay={0.1}>
          <p className="mt-10 text-center text-sm text-white/55">
            ¿Buscás algo para una empresa más grande?{" "}
            <Link href="/precios" className="font-medium text-accent hover:underline">
              Conocé los planes completos
            </Link>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
