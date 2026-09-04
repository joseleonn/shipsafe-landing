import Home from "@/components/home/Home";
import { HOME_FAQS } from "@/lib/home-content";

// Solo acá: <Faq /> renderiza estas mismas preguntas, y Google exige que el
// structured data corresponda a contenido visible en la página.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Home />
    </>
  );
}
