import type { ReactNode } from "react";
import GlobalBackground from "@/components/GlobalBackground";
import WhatsAppButton from "@/components/WhatsAppButton";
import CampaignHeader from "@/components/campaign/CampaignHeader";
import CampaignFooter from "@/components/campaign/CampaignFooter";

/**
 * Layout aislado de la landing de campaña /demo.
 *
 * A propósito NO usa el Navbar ni el Footer del sitio: esta página es destino
 * de tráfico pago con una sola acción (agendar demo), sin menú de navegación
 * que distraiga. Hereda fuentes, estilos y analytics del root layout.
 *
 * A diferencia de /prueba-gratis, NO monta el pixel de TikTok: esta landing no
 * recibe tráfico de TikTok Ads por ahora. Si en el futuro se lanzan ads de
 * TikTok apuntando acá, montar <TikTokPixel /> igual que en prueba-gratis.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalBackground />
      <CampaignHeader />
      <main className="relative z-10">{children}</main>
      <CampaignFooter />
      <WhatsAppButton />
    </>
  );
}
