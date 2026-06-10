"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { PRICING } from "@/lib/constants";
import { trackEvent, EVENTS } from "@/lib/analytics";

interface PricingProps {
  page?: "home" | "precios";
}

export default function Pricing({ page = "home" }: PricingProps) {
  return (
    <section id="precios" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Planes pensados para tu operación
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            Sin letra chica: elegí el plan según cómo trabajás y te pasamos una
            propuesta concreta en menos de 24 horas.
          </p>
        </ScrollReveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {PRICING.tiers.map((tier, i) => {
            const isExternal = tier.cta.href.startsWith("http");
            const isPage = tier.cta.href.startsWith("/") && !tier.cta.href.includes("#");
            const onCtaClick = () =>
              trackEvent(EVENTS.PRICING_TIER_CLICK, { tier: tier.id, page });

            const ctaClasses = tier.highlighted
              ? "mt-8 block rounded-lg bg-accent px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:bg-accent/90 hover:shadow-xl hover:shadow-accent/40"
              : "mt-8 block rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:border-accent/40 hover:bg-white/10";

            return (
              <ScrollReveal key={tier.id} delay={i * 0.15} variant="slideUp" className="h-full">
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className={`relative flex h-full flex-col rounded-2xl border p-8 backdrop-blur-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-accent/10 ${
                    tier.highlighted
                      ? "border-accent/40 bg-white/[0.07]"
                      : "border-white/10 bg-white/[0.05]"
                  }`}
                >
                  {tier.badge && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-md shadow-accent/30">
                      {tier.badge}
                    </span>
                  )}

                  <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                  <p className="mt-2 text-sm text-white/65">{tier.target}</p>

                  <div className="mt-6">
                    <div className="text-3xl font-bold text-white">{tier.price}</div>
                    <div className="mt-1 text-sm text-white/60">{tier.priceDetail}</div>
                  </div>

                  <ul className="mt-6 flex-1 space-y-3">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-white/75">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {isPage ? (
                    <Link href={tier.cta.href} onClick={onCtaClick} className={ctaClasses}>
                      {tier.cta.label}
                    </Link>
                  ) : (
                    <a
                      href={tier.cta.href}
                      onClick={onCtaClick}
                      {...(isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={ctaClasses}
                    >
                      {tier.cta.label}
                    </a>
                  )}
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.3} variant="fadeUp">
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/45">
            {PRICING.disclaimer}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
