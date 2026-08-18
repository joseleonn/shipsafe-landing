"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeading from "./ui/AnimatedHeading";
import SpotlightCard from "./ui/SpotlightCard";
import { PRICING } from "@/lib/constants";
import { trackEvent, EVENTS } from "@/lib/analytics";

/**
 * Bloque de precios de la HOME.
 *
 * Reemplaza a la tabla de 3 planes (<Pricing />), que sigue viva en /precios.
 * Motivo: la home recibe tráfico frío de orgánico que todavía está evaluando la
 * categoría; una tabla con el piso de precio ahí desalienta antes de que se
 * entienda el valor, y duplica el contenido de /precios (que es la página
 * indexada para esa intención).
 *
 * Mantiene el id="precios" porque NAV_LINKS y FOOTER_LINKS apuntan a /#precios.
 */
export default function PricingTeaser() {
  return (
    <section id="precios" className="py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {PRICING.teaser.title}
          </AnimatedHeading>
        </ScrollReveal>

        <ScrollReveal delay={0.15} variant="slideUp">
          <SpotlightCard className="mt-10 rounded-2xl border border-white/10 bg-white/[0.05] p-8 backdrop-blur-sm sm:p-10">
            <p className="text-center text-lg leading-relaxed text-white/80">
              {PRICING.teaser.body}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/precios"
                onClick={() =>
                  trackEvent(EVENTS.PRICING_TIER_CLICK, {
                    tier: "teaser-ver-planes",
                    page: "home",
                  })
                }
                className="inline-flex items-center justify-center rounded-lg bg-accent px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/25 transition-all duration-300 hover:shadow-xl hover:shadow-accent/40 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary"
              >
                Ver los planes
              </Link>

              <a
                href="#contacto"
                onClick={() =>
                  trackEvent(EVENTS.PRICING_TIER_CLICK, {
                    tier: "teaser-propuesta",
                    page: "home",
                  })
                }
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:border-accent/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Pedir una propuesta
              </a>
            </div>

            <p className="mt-6 text-center text-xs text-white/45">
              {PRICING.teaser.note}
            </p>
          </SpotlightCard>
        </ScrollReveal>
      </div>
    </section>
  );
}
