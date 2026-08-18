import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VideoIntro from "@/components/VideoIntro";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RolesBenefits from "@/components/RolesBenefits";
import Compliance from "@/components/Compliance";
import PricingTeaser from "@/components/PricingTeaser";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Credibility from "@/components/Credibility";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalBackground from "@/components/GlobalBackground";
import { FAQS } from "@/lib/constants";

// Solo acá: el componente <FAQ /> renderiza estas mismas preguntas, y Google
// exige que el structured data corresponda a contenido visible en la página.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        {/* VSL corto. Si preferís que primero agite el dolor, moverlo debajo
            de <PainPoints /> es una sola línea. */}
        <VideoIntro />
        <PainPoints />
        <Features />
        <HowItWorks />
        <RolesBenefits />
        <Compliance />
        <PricingTeaser />
        <Testimonials />
        <FAQ />
        <Credibility />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
