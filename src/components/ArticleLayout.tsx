import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import SiteShell from "@/components/site/SiteShell";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";

interface ArticleLayoutProps {
  slug: string;
  children: React.ReactNode;
  /**
   * FAQs del artículo, para emitir structured data FAQPage. Pasarlas SOLO si
   * las mismas preguntas y respuestas están visibles en el cuerpo del
   * artículo: Google exige que el structured data corresponda a contenido
   * visible en la página.
   */
  faqs?: { question: string; answer: string }[];
}

/**
 * Plantilla de los artículos (recursos SEO) con el sistema visual v3:
 * migas, cabecera de documento, prosa (.prose) y cierre con CTA a la demo.
 * El cuerpo de cada artículo es HTML semántico sin clases; .prose lo estiliza.
 */
export default function ArticleLayout({ slug, children, faqs }: ArticleLayoutProps) {
  const article = ARTICLES.find((a) => a.slug === slug)!;
  const related = ARTICLES.filter((a) => article.relatedSlugs.includes(a.slug));

  const faqSchema = faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { "@type": "Organization", name: "Ship Software Team", url: "https://shipsoftware.team" },
    publisher: { "@type": "Organization", name: "Ship Software Team", url: "https://shipsoftware.team" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/${article.slug}` },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE.url },
      { "@type": "ListItem", position: 2, name: article.title, item: `${SITE.url}/${article.slug}` },
    ],
  };

  const published = new Date(article.datePublished).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      <main id="main" className="page">
        <div className="narrow">
          <nav className="crumbs" aria-label="Migas de pan">
            <Link href="/">
              <Icon name="back" />
              Inicio
            </Link>
            <span className="sep">/</span>
            <span className="here">{article.title}</span>
          </nav>

          <header className="doc-head">
            <div className="eyebrow">Recurso</div>
            <h1>{article.title}</h1>
            <p className="lede">{article.description}</p>
            <div className="doc-meta">
              <span>
                Publicado el <b><time dateTime={article.datePublished}>{published}</time></b>
              </span>
              <span>
                Por <b>Ship Software Team</b>
              </span>
            </div>
          </header>

          <article className="prose">{children}</article>

          <aside className="article-cta">
            <div className="eyebrow">Siguiente paso</div>
            <h2>
              Mirá cómo queda esto <em>en tu operación.</em>
            </h2>
            <p>Treinta minutos con tus frentes, tu flota y tus vencimientos. Te mostramos el flujo completo con un caso tuyo y te vas con el número.</p>
            <div className="hero-cta">
              <DemoLink section={`articulo-${article.slug}`} className="btn btn-primary" />
              <Link href="/#plataforma" className="btn btn-secondary">
                Ver la plataforma
              </Link>
            </div>
          </aside>

          {related.length > 0 && (
            <section className="related" aria-labelledby="related-h">
              <h2 id="related-h">Artículos relacionados</h2>
              <div className="cards">
                {related.map((r) => (
                  <Link key={r.slug} href={`/${r.slug}`} className="card">
                    <div className="k">Recurso</div>
                    <h3>{r.title}</h3>
                    <p>{r.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </SiteShell>
  );
}
