import type { Metadata } from "next";
import Link from "next/link";
import { SITE, PRICING_FAQS } from "@/lib/constants";
import SiteShell from "@/components/site/SiteShell";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import PricingSection from "@/components/home/PricingSection";
import Faq from "@/components/home/Faq";
import CloseSection from "@/components/home/CloseSection";

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

const faqItems = PRICING_FAQS.map((f) => ({ q: f.question, a: f.answer }));

export default function Page() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main id="main">
        <section className="page-hero center" id="top">
          <div className="wrap">
            <div className="eyebrow">Precios</div>
            <h1>
              Precios claros, <em>según tu operación.</em>
            </h1>
            <p className="lede">
              Suscripción mensual, sin permanencia mínima y con prueba guiada de 7 días usando tus equipos reales. Contanos cómo es tu operación y te pasamos una propuesta concreta el mismo día de la demo.
            </p>
            <div className="hero-cta">
              <DemoLink section="precios-hero" />
              <Link href="#planes" className="btn btn-secondary">
                Ver los planes <Icon name="chevron" />
              </Link>
            </div>
          </div>
        </section>

        <PricingSection
          num={null}
          more={false}
          id="planes"
          label="Los planes"
          title={<>Tres líneas, <em>un valor de partida para cada una.</em></>}
          lede="Profesional para técnicos y consultores con sus propios clientes; Empresa para la operación de una PyME industrial; Enterprise para holdings y requisitos corporativos. Precios orientativos en ARS."
        />

        <Faq items={faqItems} num={null} title={<>Preguntas frecuentes <em>sobre precios.</em></>} />

        <CloseSection num={null} source="precios" />
      </main>
    </SiteShell>
  );
}
