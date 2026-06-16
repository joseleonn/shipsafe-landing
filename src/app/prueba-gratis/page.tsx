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
  title: "Probá SHIPSAFE gratis 14 días | Checklists y desvíos",
  description:
    "Hacé checklists con QR, reportá desvíos y tené todo registrado desde el celular. Probá gratis 14 días, sin tarjeta. Pensado para técnicos y consultores.",
  // Landing de tráfico pago: no debe competir con el home por keywords orgánicas.
  robots: { index: false, follow: false },
};

export default function PruebaGratisPage() {
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
