import type { Metadata } from "next";
import { SITE, PRICING_FAQS } from "@/lib/constants";
import GlobalBackground from "@/components/GlobalBackground";
import Navbar from "@/components/Navbar";
import Pricing from "@/components/Pricing";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: `Precios | ${SITE.name}: planes para PyMEs industriales y consultores`,
  description:
    "Planes de SHIPSAFE para empresas, consultores y técnicos de seguridad e higiene en Argentina. Precios orientativos, sin permanencia mínima y con prueba guiada de 7 días.",
  alternates: { canonical: "/precios" },
  openGraph: {
    title: `Precios | ${SITE.name}`,
    description:
      "Planes de SHIPSAFE para empresas, consultores y técnicos de seguridad e higiene en Argentina.",
    url: `${SITE.url}/precios`,
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
        <section className="pt-32 lg:pt-40">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <ScrollReveal variant="blur">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Precios de{" "}
                <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                  SHIPSAFE
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
                Suscripción mensual, sin permanencia mínima y con prueba
                guiada de 7 días usando tus equipos reales. Contanos cómo es
                tu operación y te pasamos una propuesta concreta el mismo día
                de la demo.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <Pricing page="precios" />

        <section className="pb-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal variant="blur">
              <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Preguntas frecuentes sobre precios
              </h2>
            </ScrollReveal>
            <div className="mt-10 space-y-4">
              {PRICING_FAQS.map((faq, i) => (
                <ScrollReveal key={faq.question} delay={i * 0.1} variant="fadeUp">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      {faq.answer}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
