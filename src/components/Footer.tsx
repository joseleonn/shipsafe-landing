"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import Link from "next/link";
import {
  SITE,
  FOOTER_LINKS,
  PROVEEDOR,
  PROVEEDOR_IDENTIFICADO,
} from "@/lib/constants";
import { trackEvent, EVENTS } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-6">
          {/* Logo + tagline */}
          <ScrollReveal variant="fadeUp" delay={0}>
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/shipsafe-logo.png"
                  alt="SHIPSAFE, software de seguridad e higiene laboral"
                  width={28}
                  height={28}
                  className="shrink-0"
                />
                <span className="text-lg font-bold text-white">{SITE.name}</span>
              </Link>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                {SITE.tagline}. Digitalizá la seguridad de tu empresa.
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

          {/* Recursos */}
          <ScrollReveal variant="fadeUp" delay={0.15}>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/75">
                Recursos
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.recursos.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Sectores */}
          <ScrollReveal variant="fadeUp" delay={0.18}>
            <div>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/75">
                Sectores
              </h4>
              <ul className="space-y-2">
                {FOOTER_LINKS.sectores.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 transition-colors duration-200 hover:text-white"
                    >
                      {link.label}
                    </Link>
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
                      onClick={
                        link.label === "WhatsApp"
                          ? () =>
                              trackEvent(EVENTS.WHATSAPP_CLICK, {
                                location: "footer",
                              })
                          : undefined
                      }
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
            {/* Identificación del proveedor. Sólo se dibuja con datos reales
                cargados: ver el comentario de PROVEEDOR en constants.ts. */}
            {PROVEEDOR_IDENTIFICADO && (
              <p className="mb-3 text-white/40">
                {PROVEEDOR.titular} · CUIT {PROVEEDOR.cuit}
                {PROVEEDOR.domicilio ? ` · ${PROVEEDOR.domicilio}` : ""}
              </p>
            )}
            © 2026 Ship Software Team · shipsoftware.team
          </div>
        </ScrollReveal>
      </div>
    </footer>
  );
}
