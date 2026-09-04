import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import SiteShell from "@/components/site/SiteShell";
import Icon from "@/components/site/Icon";
import ArrepentimientoForm from "@/components/ArrepentimientoForm";

export const metadata: Metadata = {
  title: `Botón de arrepentimiento | ${SITE.name}`,
  description:
    "Revocá la contratación de SHIPSAFE dentro de los 10 días corridos, sin costo y sin tener que justificar el motivo. Disposición 954/2025.",
  alternates: { canonical: "/arrepentimiento" },
};

export default function Arrepentimiento() {
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
            <span className="here">Botón de arrepentimiento</span>
          </nav>

          <header className="doc-head">
            <div className="eyebrow">Legal</div>
            <h1>Botón de arrepentimiento</h1>
            <p className="lede">
              Si contrataste SHIPSAFE y te arrepentiste, podés dar marcha atrás desde acá. No tenés que explicar por qué, no tiene costo y no necesitás registrarte para hacerlo.
            </p>
          </header>

          <div className="prose">
            <section>
              <h2>Cómo funciona</h2>
              <ul>
                <li>
                  Tenés <strong>10 días corridos</strong> desde la contratación, o desde que empezaste a usar el servicio, lo que haya pasado último.
                </li>
                <li>
                  Completás el formulario y en el momento te damos un <strong>código de identificación</strong> de la revocación.
                </li>
                <li>Si ya habías pagado, la devolución sale por el mismo medio con el que pagaste.</li>
                <li>
                  No hace falta que uses este formulario: también vale avisarnos por mail o por WhatsApp. Está acá para que sea simple, no para ponerte un trámite.
                </li>
              </ul>
            </section>

            <section id="formulario">
              <h2>Revocar la contratación</h2>
              <ArrepentimientoForm />
            </section>

            <section>
              <h2>De dónde sale este derecho</h2>
              <p>
                Del artículo 34 de la <strong>Ley 24.240</strong> de Defensa del Consumidor y de la <strong>Disposición 954/2025</strong> de la Subsecretaría de Defensa del Consumidor y Lealtad Comercial, que obliga a que este botón esté a la vista y a un clic, sin registración previa.
              </p>
            </section>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
