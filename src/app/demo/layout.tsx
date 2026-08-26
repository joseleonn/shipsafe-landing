import type { ReactNode } from "react";
import GlobalBackground from "@/components/GlobalBackground";

/**
 * Layout aislado de la landing de campaña /demo.
 *
 * A propósito NO usa el Navbar ni el Footer del sitio: esta página es destino
 * de tráfico pago con una sola acción (agendar demo), sin menú de navegación
 * que distraiga. Hereda fuentes, estilos y analytics del root layout.
 *
 * El layout NO impone header, footer ni botón flotante: cada página arma su
 * estructura. La landing /demo los usa; /demo/agendado no, porque ahí la
 * persona ya agendó y cualquier elemento de navegación la invita a irse de una
 * página cuyo único trabajo es preparar la reunión.
 *
 * A diferencia de /prueba-gratis, NO monta el pixel de TikTok: esta landing no
 * recibe tráfico de TikTok Ads por ahora. Si en el futuro se lanzan ads de
 * TikTok apuntando acá, montar <TikTokPixel /> igual que en prueba-gratis.
 */
export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <GlobalBackground />
      {children}
    </>
  );
}
