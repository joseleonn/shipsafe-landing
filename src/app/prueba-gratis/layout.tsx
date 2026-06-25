import type { ReactNode } from "react";
import GlobalBackground from "@/components/GlobalBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import TikTokPixel from "@/components/TikTokPixel";
import CampaignHeader from "./_components/CampaignHeader";
import CampaignFooter from "./_components/CampaignFooter";

/**
 * Layout aislado de la landing de campaña.
 *
 * A propósito NO usa el Navbar ni el Footer del sitio: esta página es destino
 * de tráfico pago con una sola acción (prueba gratis), sin menú de navegación
 * que distraiga. Hereda fuentes, estilos y analytics del root layout.
 */
export default function PruebaGratisLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <TikTokPixel />
      <GlobalBackground />
      <CampaignHeader />
      <main className="relative z-10">{children}</main>
      <CampaignFooter />
      <WhatsAppButton />
    </>
  );
}
