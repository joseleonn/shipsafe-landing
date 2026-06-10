import type { Metadata } from "next";
import { SITE, CONSULTORES } from "@/lib/constants";
import GlobalBackground from "@/components/GlobalBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";
import ConsultoresForm from "@/components/consultores/ConsultoresForm";

export const metadata: Metadata = {
  title: `Programa de Consultores | ${SITE.name} — Gestioná todos tus clientes desde una cuenta`,
  description:
    "Programa de SHIPSAFE para consultores de seguridad e higiene en Argentina: gestioná todas tus empresas-cliente desde una sola cuenta, con datos separados y reportes listos para la ART. Pagás por empresa gestionada.",
  alternates: { canonical: "/consultores" },
  openGraph: {
    title: `Programa de Consultores | ${SITE.name}`,
    description:
      "Gestioná todas tus empresas-cliente desde una sola cuenta. Pagás por empresa gestionada.",
    url: `${SITE.url}/consultores`,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
  },
};

export default function Page() {
  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10">
        {/* Hero */}
        <section className="pt-32 lg:pt-44">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <ScrollReveal variant="blur">
              <p className="mx-auto mb-5 inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent backdrop-blur-sm">
                {CONSULTORES.hero.badge}
              </p>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                Gestioná{" "}
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  todos tus clientes
                </span>{" "}
                desde una sola cuenta
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                {CONSULTORES.hero.description}
              </p>
              <div className="mt-8">
                <a
                  href="#aplicar"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.98]"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <span className="relative">{CONSULTORES.hero.cta}</span>
                </a>
              </div>
              <p className="mt-4 text-sm text-white/65">
                Cupos limitados · Te respondemos en menos de 24hs
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Dolores del consultor */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="blur">
              <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Te suena familiar?
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CONSULTORES.pains.map((pain, i) => (
                <ScrollReveal key={i} delay={i * 0.1} variant="fadeUp" className="h-full">
                  <div className="group h-full rounded-xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-accent/10">
                    <div className="mb-3 h-1 w-12 rounded-full bg-accent transition-all duration-300 group-hover:w-20" />
                    <p className="text-sm leading-relaxed text-white/80">
                      <span className="text-lg text-accent/60">&ldquo;</span>
                      {pain}
                      <span className="text-lg text-accent/60">&rdquo;</span>
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Cómo funciona el programa */}
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="blur">
              <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Cómo funciona el programa
              </h2>
            </ScrollReveal>
            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {CONSULTORES.steps.map((step, i) => (
                <ScrollReveal key={step.number} delay={i * 0.2} variant="slideUp">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-blue-600 text-2xl font-bold text-white shadow-lg shadow-accent/25">
                      {step.number}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/70">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing del programa */}
        <section className="py-12">
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="scale">
              <div className="rounded-2xl border border-accent/40 bg-white/[0.07] p-8 text-center backdrop-blur-sm sm:p-10">
                <h2 className="text-xl font-semibold text-white">
                  Plan Consultores
                </h2>
                <div className="mt-4 text-4xl font-bold text-white">
                  {CONSULTORES.pricing.price}
                </div>
                <div className="mt-1 text-sm text-white/60">
                  {CONSULTORES.pricing.priceDetail}
                </div>
                <p className="mt-4 text-sm text-white/70">
                  {CONSULTORES.pricing.note}
                </p>
                <p className="mt-6 border-t border-white/10 pt-6 text-sm leading-relaxed text-white/65">
                  {CONSULTORES.programNote}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <ConsultoresForm />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
