import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import MotionCues from "@/components/site/MotionCues";
import Hero from "./Hero";
import Roles from "./Roles";
import Explorer from "./Explorer";
import Flow from "./Flow";
import TryIt from "./TryIt";
import VideoSection from "./VideoSection";
import Compare from "./Compare";
import Proofs from "./Proofs";
import PricingSection from "./PricingSection";
import Faq from "./Faq";
import CloseSection from "./CloseSection";

/**
 * Home v3 (4/9/2026). Trece bloques en este orden; los ids viejos
 * (#funcionalidades, #beneficios, #contacto) siguen existiendo como anclas
 * de compatibilidad dentro de cada sección.
 */
export default function Home() {
  return (
    <SiteShell className="ss-home">
      <main id="main">
        <Hero />
        <Roles />
        <Explorer />
        <Flow />
        <TryIt />
        <VideoSection />
        <Compare />
        <Proofs />
        <PricingSection />
        <Faq />
        <CloseSection />
      </main>
      <StickyBar />
      <MotionCues />
    </SiteShell>
  );
}
