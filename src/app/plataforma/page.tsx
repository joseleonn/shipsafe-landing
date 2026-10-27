import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HOME_FAQS } from "@/lib/home-content";
import PlataformaV5 from "@/components/plataforma-v5/PlataformaV5";

/**
 * /plataforma (v5, 25/10/2026). El FAQPage vive acá porque las preguntas
 * frecuentes se ven en esta página (Google pide que el structured data
 * corresponda a contenido visible).
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PlataformaV5 />
    </>
  );
}
