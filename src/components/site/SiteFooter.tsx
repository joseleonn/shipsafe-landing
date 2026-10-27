import Link from "next/link";
import Wordmark from "./Wordmark";
import { FOOTER, SOCIAL, whatsappUrl } from "@/lib/home-content";
import SocialIcon from "./SocialIcon";
import { PROVEEDOR, PROVEEDOR_IDENTIFICADO } from "@/lib/constants";

export default function SiteFooter({ minimal = false }: { minimal?: boolean }) {
  const year = new Date().getFullYear();

  // Landings de campaña: sin columnas de navegación. Quedan los enlaces
  // legales (hacen falta para publicidad) y la identificación del proveedor.
  if (minimal) {
    return (
      <footer className="footer minimal">
        <div className="wrap">
          <div className="bottom">
            <nav className="legal-links" aria-label="Legal">
              {FOOTER.legal.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
              <a href={`mailto:${PROVEEDOR.email}`}>{PROVEEDOR.email}</a>
            </nav>
            {PROVEEDOR_IDENTIFICADO && (
              <div className="legal">
                Titular: {PROVEEDOR.titular} · CUIT {PROVEEDOR.cuit} · {PROVEEDOR.domicilio} · Canal de contacto y revocación: {PROVEEDOR.emailLegal}
              </div>
            )}
            <div>© {year} SHIPSAFE</div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div className="col brandcol">
            <Link className="brand" href="/">
              <Wordmark />
            </Link>
            <p className="tag">{FOOTER.tag}</p>
            {SOCIAL.some((r) => r.href) && (
              <ul className="social" aria-label="Redes de SHIPSAFE">
                {SOCIAL.filter((r) => r.href).map((r) => (
                  <li key={r.id}>
                    <a href={r.href!} target="_blank" rel="noopener noreferrer" aria-label={`SHIPSAFE en ${r.label}`}>
                      <SocialIcon id={r.id} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="col">
            <h4>Producto</h4>
            <ul>
              {FOOTER.producto.map((l) => (
                <li key={l.href}>
                  <Link href={l.href.startsWith("#") ? `/${l.href}` : l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h4>Recursos</h4>
            <ul>
              {FOOTER.recursos.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h4>Legal</h4>
            <ul>
              {FOOTER.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col">
            <h4>Contacto</h4>
            <ul>
              <li>
                <a href={`mailto:${PROVEEDOR.email}`}>{PROVEEDOR.email}</a>
              </li>
              <li>
                <a href={whatsappUrl("Hola, quiero consultar sobre SHIPSAFE")} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>Argentina</li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          {PROVEEDOR_IDENTIFICADO && (
            <div className="legal">
              Titular: {PROVEEDOR.titular} · CUIT {PROVEEDOR.cuit} · {PROVEEDOR.domicilio} · Canal de contacto y revocación: {PROVEEDOR.emailLegal}
            </div>
          )}
          <div>© {year} SHIPSAFE</div>
        </div>
      </div>
    </footer>
  );
}
