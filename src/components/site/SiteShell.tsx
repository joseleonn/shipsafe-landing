import type { ReactNode } from "react";
import SiteNav from "./SiteNav";
import SiteFooter from "./SiteFooter";

/**
 * Envoltorio de todas las páginas que usan el sistema visual v3: tokens claros
 * (site.css, bajo .ss-site), barra y pie compartidos.
 */
export default function SiteShell({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`ss-site ${className}`}>
      <a className="skip" href="#main">
        Ir al contenido
      </a>
      <SiteNav />
      {children}
      <SiteFooter />
    </div>
  );
}
