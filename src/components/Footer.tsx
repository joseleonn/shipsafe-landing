"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { SITE, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Logo + tagline */}
          <ScrollReveal variant="fadeUp" delay={0}>
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/shipsafe-logo.png"
                  alt="SHIPSAFE — Software de seguridad e higiene laboral"
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                <span className="text-lg font-bold text-white">{SITE.name}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {SITE.tagline}. Digitalizá la seguridad de tu planta industrial.
              </p>
            </div>
          </ScrollReveal>

          {/* Producto */}
          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/75">
                Producto
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.producto.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Legal */}
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/75">
                Legal
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.legal.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Contacto */}
          <ScrollReveal variant="fadeUp" delay={0.3}>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/75">
                Contacto
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.contacto.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="scale" delay={0.2}>
          <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/30">
            © 2026 Ship Software Team · shipsoftware.team
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
