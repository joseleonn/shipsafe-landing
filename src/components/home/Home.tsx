import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import MotionCues from "@/components/site/MotionCues";
import Hero from "./Hero";
import CaseStrip from "./CaseStrip";
import Roles from "./Roles";
import Explorer from "./Explorer";
import Flow from "./Flow";
import Standard from "./Standard";
import TryIt from "./TryIt";
import Compare from "./Compare";
import Proofs from "./Proofs";
import PricingSection from "./PricingSection";
import Faq from "./Faq";
import CloseSection from "./CloseSection";

/**
 * Home v4 (24/9/2026). Orden: problema, resultado, cómo funciona, prueba,
 * producto, precio, demo. El caso real va pegado al hero para que el que llega
 * por outbound confirme rápido que es para una empresa como la suya, y el
 * flujo NO OK hasta el cierre va antes que los módulos. Los ids viejos
 * (#funcionalidades, #beneficios, #contacto) siguen existiendo como anclas
 * de compatibilidad dentro de cada sección.
 */
export default function Home() {
  return (
    <SiteShell className="ss-home">
      <main id="main">
        <Hero />
        <CaseStrip />
        <Compare />
        <Flow />
        <TryIt />
        <Standard num="06" />
        <Roles />
        <Explorer />
        <Proofs />
        <PricingSection num="10" />
        <Faq num="11" />
        <CloseSection num="12" />
      </main>
      <StickyBar />
      <MotionCues />
    </SiteShell>
  );
}
