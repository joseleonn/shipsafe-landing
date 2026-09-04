import Link from "next/link";
import Wordmark from "./Wordmark";
import { FOOTER, whatsappUrl } from "@/lib/home-content";
import { PROVEEDOR, PROVEEDOR_IDENTIFICADO } from "@/lib/constants";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div className="col brandcol">
            <Link className="brand" href="/">
              <Wordmark />
            </Link>
            <p className="tag">{FOOTER.tag}</p>
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
              <li>Rosario, Santa Fe</li>
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
