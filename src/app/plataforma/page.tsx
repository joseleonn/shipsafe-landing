import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HOME_FAQS } from "@/lib/home-content";
import SiteShell from "@/components/site/SiteShell";
import DemoLink from "@/components/site/DemoLink";
import Explorer from "@/components/home/Explorer";
import Flow from "@/components/home/Flow";
import Standard from "@/components/home/Standard";
import Roles from "@/components/home/Roles";
import Compare from "@/components/home/Compare";
import Faq from "@/components/home/Faq";
import CloseSection from "@/components/home/CloseSection";

/**
 * /plataforma (24/10/2026): el detalle que salió de la home v5. Reutiliza
 * tal cual las secciones de la home v4 (módulos con capturas, flujo, varias
 * sedes, roles, comparación) y las preguntas frecuentes, con su FAQPage:
 * Google exige que el structured data corresponda a contenido visible en la
 * misma página, y las preguntas ahora se ven acá y no en la home.
 */
export const metadata: Metadata = {
  title: `Plataforma | ${SITE.name}: todos los módulos de gestión SST`,
  description:
    "Inspecciones con QR, desvíos, EPP, permisos de trabajo, capacitaciones, mediciones, accidentes y reportes en una sola plataforma de seguridad y salud en el trabajo.",
  alternates: { canonical: "/plataforma" },
  openGraph: {
    title: `Plataforma | ${SITE.name}`,
    description: "Todos los módulos de SHIPSAFE, con capturas reales del producto.",
    url: `${SITE.url}/plataforma`,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function Page() {
  return (
    <SiteShell className="ss-home" ctaLabel="Agenda 30 minutos">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <main id="main">
        <section className="page-hero center" id="top">
          <div className="wrap">
            <h1>La plataforma, módulo por módulo.</h1>
            <p className="lede">Capturas reales de cada parte de SHIPSAFE.</p>
            <div className="hero-cta">
              <DemoLink section="plataforma-hero">Agenda 30 minutos</DemoLink>
            </div>
          </div>
        </section>
        <Explorer />
        <Flow />
        <Standard num={null} />
        <Roles />
        <Compare />
        <Faq num={null} />
        <CloseSection num={null} source="plataforma" />
      </main>
    </SiteShell>
  );
}
