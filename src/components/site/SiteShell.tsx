import type { ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";
import DemoModal from "./DemoModal";

/**
 * Envoltorio de todas las páginas que usan el sistema visual v3: tokens claros
 * (site.css, bajo .ss-site), barra y pie compartidos.
 */
export default function SiteShell({
  children,
  className = "",
  minimal = false,
  ctaLabel,
  ctaSection,
}: {
  children: ReactNode;
  className?: string;
  /** Landings de campaña: barra con solo logo y botón, pie solo con lo legal. */
  minimal?: boolean;
  ctaLabel?: string;
  ctaSection?: string;
}) {
  return (
    <div className={`ss-site ${className}`}>
      <a className="skip" href="#main">
        Ir al contenido
      </a>
      <SiteNav minimal={minimal} ctaLabel={ctaLabel} ctaSection={ctaSection} />
      {children}
      <SiteFooter minimal={minimal} />
      <DemoModal />
    </div>
  );
}
