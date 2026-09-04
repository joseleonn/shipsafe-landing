import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import SiteShell from "@/components/site/SiteShell";
import DemoLink from "@/components/site/DemoLink";

export const metadata = {
  title: `Página no encontrada | ${SITE.name}`,
  description: "La página que buscás no existe. Explorá nuestros recursos sobre seguridad e higiene laboral.",
};

export default function NotFound() {
  return (
    <SiteShell>
      <main id="main" className="page">
        <div className="mid nf">
          <div>
            <div className="code">Error 404</div>
            <h1>Esta página no está.</h1>
            <p className="lede">La dirección no existe o fue movida. Lo que sí está: la plataforma, los precios y los recursos.</p>
            <div className="hero-cta">
              <Link href="/" className="btn btn-primary">
                Ir al inicio
              </Link>
              <DemoLink section="404" className="btn btn-secondary" />
            </div>

            <div className="cards">
              {ARTICLES.slice(0, 4).map((article) => (
                <Link key={article.slug} href={`/${article.slug}`} className="card">
                  <div className="k">Recurso</div>
                  <h3>{article.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </SiteShell>
  );
}
