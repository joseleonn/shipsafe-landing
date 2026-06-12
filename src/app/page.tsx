import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Marquee from "@/components/ui/Marquee";
import { COMPLIANCE_ITEMS } from "@/lib/constants";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RolesBenefits from "@/components/RolesBenefits";
import Compliance from "@/components/Compliance";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Credibility from "@/components/Credibility";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GlobalBackground from "@/components/GlobalBackground";

export default function Home() {
  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <section aria-label="Normativa argentina de referencia" className="py-10">
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-white/40">
            Basado en la normativa argentina
          </p>
          <Marquee
            items={[
              ...COMPLIANCE_ITEMS.map((item) => item.title),
              "RGRL completo (161 ítems)",
            ]}
          />
        </section>
        <PainPoints />
        <Features />
        <HowItWorks />
        <RolesBenefits />
        <Compliance />
        <Pricing />
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
