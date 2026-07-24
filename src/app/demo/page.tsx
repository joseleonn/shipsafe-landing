import type { Metadata } from "next";
import CampaignHero from "./_components/CampaignHero";
import PainSection from "./_components/PainSection";
import HowItWorks from "./_components/HowItWorks";
import FeatureBenefits from "./_components/FeatureBenefits";
import SocialProof from "./_components/SocialProof";
import PricingSection from "./_components/PricingSection";
import FaqSection from "./_components/FaqSection";
import FinalCta from "./_components/FinalCta";

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
      <CampaignHero />
      <PainSection />
      <HowItWorks />
      <FeatureBenefits />
      <SocialProof />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
