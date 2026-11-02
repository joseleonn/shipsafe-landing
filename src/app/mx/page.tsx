import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { HOME5 } from "@/lib/home-v5";
import { MX, UTM_DEFAULTS } from "@/lib/mx";
import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import MotionCues from "@/components/site/MotionCues";
import UtmDefaults from "@/components/site/UtmDefaults";
import { Caso, Cierre, Hero, Nosotros } from "@/components/home-v5/HomeV5";
import Confianza from "@/components/home-v5/Confianza";
import PlataformaSpot from "@/components/home-v5/PlataformaSpot";
import Procesos from "@/components/home-v5/Procesos";
import HashScroll from "@/components/home-v5/HashScroll";
import { ScrollProgress } from "@/components/home-v5/Motion5";
import { MxContacto } from "@/components/home-v5/Mx";

/**
 * /mx (2/11/2026): la página que comparte Hugo Ayón, partner en México.
 * Es la home con un rótulo de México, el bloque de Hugo arriba y los UTM de
 * Hugo por defecto (ver lib/mx.ts). No se indexa: es destino de los links que
 * comparte él, no compite con la home en buscadores.
 */
export const metadata: Metadata = {
  title: MX.meta.title,
  description: MX.meta.description,
  alternates: { canonical: "/mx" },
  robots: { index: false, follow: true },
  openGraph: {
    title: MX.meta.title,
    description: MX.meta.description,
    url: `${SITE.url}/mx`,
    type: "website",
    locale: "es_MX",
    siteName: SITE.name,
  },
};

export default function Page() {
  return (
    <>
      <UtmDefaults params={UTM_DEFAULTS} />
      <SiteShell className="ss-home ss-home5" ctaLabel={HOME5.cta} ctaSection="mx-nav">
        <ScrollProgress />
        <HashScroll />
        <main id="main">
          <Hero eyebrow={MX.hero.eyebrow} lede={MX.hero.lede} secondary={MX.hero.secondary} />
          <Confianza />
          <MxContacto />
          <PlataformaSpot />
          <Procesos />
          <Caso />
          <Nosotros partners={false} />
          <Cierre source="mx" />
        </main>
        <StickyBar label={HOME5.cta} />
        <MotionCues />
      </SiteShell>
    </>
  );
}
