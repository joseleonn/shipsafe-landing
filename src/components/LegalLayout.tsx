import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import Icon from "@/components/site/Icon";

/** Los tres documentos legales, para cruzarlos entre sí al pie de cada uno. */
export const DOCUMENTOS_LEGALES = [
  { slug: "/terminos", label: "Términos y condiciones" },
  { slug: "/politica-privacidad", label: "Política de privacidad" },
  { slug: "/tratamiento-de-datos", label: "Anexo de tratamiento de datos" },
];

interface Props {
  title: string;
  /** Se muestra tal cual. Ej: "Versión 1.0". */
  version: string;
  /**
   * Marca el documento como borrador sin revisión legal. Cuando el abogado
   * apruebe el texto, se pasa a `false` y desaparece el cartel: es un booleano
   * y no un borrado de texto justamente para que el cambio sea de una línea.
   */
  borrador?: boolean;
  /** Ruta de este documento, para no autoenlazarse en el cruce del pie. */
  slug: string;
  children: React.ReactNode;
}

/** Plantilla de los documentos legales con el sistema visual v3 (prosa clara). */
export default function LegalLayout({ title, version, borrador = false, slug, children }: Props) {
  const otros = DOCUMENTOS_LEGALES.filter((d) => d.slug !== slug);

  return (
    <SiteShell>
      <main id="main" className="page">
        <div className="narrow">
          <nav className="crumbs" aria-label="Migas de pan">
            <Link href="/">
              <Icon name="back" />
              Inicio
            </Link>
            <span className="sep">/</span>
            <span className="here">{title}</span>
          </nav>

          <header className="doc-head">
            <div className="eyebrow">Legal</div>
            <h1>{title}</h1>
            <div className="doc-meta">
              <span>
                <b>{version}</b>
              </span>
            </div>
          </header>

          {borrador && (
            <div className="notice" role="note">
              <Icon name="alert" />
              <p>
                <b>Borrador pendiente de revisión legal.</b> El texto describe con exactitud cómo funciona el sistema, pero todavía no fue revisado por un abogado. Si vas a contratar y algo de acá te resulta determinante, escribinos antes.
              </p>
            </div>
          )}

          <div className="prose legal">{children}</div>

          <footer className="docs">
            <div className="k">Los otros documentos</div>
            <ul>
              {otros.map((d) => (
                <li key={d.slug}>
                  <Link href={d.slug}>{d.label}</Link>
                </li>
              ))}
            </ul>
          </footer>
        </div>
      </main>
    </SiteShell>
  );
}
