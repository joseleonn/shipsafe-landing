import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import { listarPublicados } from "@/lib/blog";
import SiteShell from "@/components/site/SiteShell";
import Icon from "@/components/site/Icon";
import BlogLista from "@/components/site/BlogLista";
import { AJUSTES_SEO } from "@/lib/blog-seo";

export const revalidate = 3600; // literal obligatorio en Next; igual a REVALIDAR_BLOG de lib/blog

const TITULO = "Blog de seguridad y salud en el trabajo";
const DESCRIPCION =
  "Normativa de seguridad y salud en el trabajo de Argentina, México, Colombia y Latinoamérica, explicada para quien la aplica: EPP, extintores, inspecciones y SG-SST.";

export const metadata: Metadata = {
  title: `${TITULO} | ${SITE.name}`,
  description: DESCRIPCION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: `${SITE.url}/blog`,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
};

function fecha(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage() {
  const articulos = await listarPublicados();

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
            <span className="here">Blog</span>
          </nav>

          <header className="doc-head">
            <div className="eyebrow">Blog</div>
            <h1>{TITULO}</h1>
            <p className="lede">{DESCRIPCION}</p>
          </header>

          {articulos.length > 0 && (
            <section className="related" aria-labelledby="ultimos-h">
              <h2 id="ultimos-h">Últimos artículos</h2>
              <BlogLista
                items={articulos.map((a) => ({
                  slug: a.slug,
                  titulo: a.titulo,
                  descripcion: a.descripcion,
                  fecha: fecha(a.fecha_publicacion),
                  pais: AJUSTES_SEO[a.slug]?.pais ?? "LATAM",
                }))}
              />
            </section>
          )}

          <section className="related" aria-labelledby="guias-h">
            <h2 id="guias-h">Guías</h2>
            <div className="cards">
              {ARTICLES.map((a) => (
                <Link key={a.slug} href={`/${a.slug}`} className="card">
                  <div className="k">Guía</div>
                  <h3>{a.title}</h3>
                  <p>{a.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
