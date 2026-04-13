import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PainPoints from "@/components/PainPoints";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import RolesBenefits from "@/components/RolesBenefits";
import Compliance from "@/components/Compliance";
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
        <PainPoints />
        <Features />
        <HowItWorks />
        <RolesBenefits />
        <Compliance />
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
