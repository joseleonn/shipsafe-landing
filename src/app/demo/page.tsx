import type { Metadata } from "next";
import CampaignHero from "./_components/CampaignHero";
import PainSection from "./_components/PainSection";
import HowItWorks from "./_components/HowItWorks";
import FeatureBenefits from "./_components/FeatureBenefits";
import SocialProof from "@/components/campaign/SocialProof";
import PricingSection from "./_components/PricingSection";
import FaqSection from "@/components/campaign/FaqSection";
import FinalCta from "./_components/FinalCta";
import WhatsAppButton from "@/components/WhatsAppButton";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignFooter from "@/components/campaign/CampaignFooter";
import { FAQS } from "./_data";

export const metadata: Metadata = {
  title: "Pedí una demo de SHIPSAFE | Inspecciones para empresas",
  description:
    "Centralizá las inspecciones, los desvíos y los reportes de todos tus establecimientos. Agendá una demo de 30 minutos y te lo mostramos con tu propia operación.",
  // Landing de tráfico pago: no debe competir con el home por keywords orgánicas.
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return (
    <>
      <CampaignHeader />
      <main className="relative z-10">
      <CampaignHero />
      <PainSection />
      <HowItWorks />
      <FeatureBenefits />
      <SocialProof />
      <PricingSection />
      <FaqSection faqs={FAQS} />
      <FinalCta />
      </main>
      <CampaignFooter />
      <WhatsAppButton />
    </>
  );
}
