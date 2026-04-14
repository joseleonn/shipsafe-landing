import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE, ARTICLES, CTAS } from "@/lib/constants";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppButton from "./WhatsAppButton";
import GlobalBackground from "./GlobalBackground";

interface ArticleLayoutProps {
  slug: string;
  children: React.ReactNode;
}

export default function ArticleLayout({ slug, children }: ArticleLayoutProps) {
  const article = ARTICLES.find((a) => a.slug === slug)!;
  const related = ARTICLES.filter((a) => article.relatedSlugs.includes(a.slug));

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Organization",
      name: "Ship Software Team",
      url: "https://shipsoftware.team",
    },
    publisher: {
      "@type": "Organization",
      name: "Ship Software Team",
      url: "https://shipsoftware.team",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE.url}/${article.slug}`,
    },
  };

  return (
    <>
      <GlobalBackground />
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="relative z-10 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
            <Link
              href="/"
              className="flex items-center gap-1 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Inicio
            </Link>
            <span>/</span>
            <span className="truncate text-white/70">{article.title}</span>
          </nav>

          {/* Article header */}
          <header className="mb-12">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              {article.description}
            </p>
            <time
              dateTime={article.datePublished}
              className="mt-4 block text-sm text-white/40"
            >
              Publicado el{" "}
              {new Date(article.datePublished).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </header>

          {/* Article content */}
          <article
            className="[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-white [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-white/75 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-white/75 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_ol]:text-white/75 [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-white [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-accent/80 [&_table]:mt-6 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-white/10 [&_th]:bg-white/5 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:text-white [&_td]:border [&_td]:border-white/10 [&_td]:px-4 [&_td]:py-3 [&_td]:text-sm [&_td]:text-white/70"
          >
            {children}
          </article>

          {/* CTA inline */}
          <div className="mt-16 rounded-2xl border border-accent/20 bg-accent/5 px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white">
              ¿Listo para dejar el papel y el Excel?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">
              Dejanos tus datos y te contactamos para mostrarte cómo SHIPSAFE
              puede transformar la gestión de seguridad en tu planta.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/#contacto"
                className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
              >
                Contactanos
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
              >
                Ver funcionalidades
              </Link>
            </div>
          </div>

          {/* Related articles */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-xl font-bold text-white">
                Artículos relacionados
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/${r.slug}`}
                    className="group rounded-xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <h3 className="font-semibold text-white transition-colors group-hover:text-accent">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-white/60">
                      {r.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
