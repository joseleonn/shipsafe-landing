import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/constants";
import { cuerpoConFaqs, listarPublicados, obtenerPublicado } from "@/lib/blog";
import ArticleLayout from "@/components/ArticleLayout";
import { AJUSTES_SEO } from "@/lib/blog-seo";

// Se regenera sola cada hora, y al instante cuando se publica desde /interno/blog.
export const revalidate = 3600; // literal obligatorio en Next; igual a REVALIDAR_BLOG de lib/blog

// Los publicados se generan en el build. Uno publicado después del deploy se
// genera la primera vez que alguien lo visita (dynamicParams queda en true).
export async function generateStaticParams() {
  const publicados = await listarPublicados();
  return publicados.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await obtenerPublicado(slug);
  if (!a) return { title: `No encontrado | ${SITE.name}`, robots: { index: false } };
  return {
    title: `${AJUSTES_SEO[a.slug]?.tituloSeo ?? a.titulo} | ${SITE.name}`,
    description: a.descripcion,
    keywords: a.palabra_clave ? [a.palabra_clave] : undefined,
    alternates: { canonical: `/blog/${a.slug}` },
    openGraph: {
      title: a.titulo,
      description: a.descripcion,
      url: `${SITE.url}/blog/${a.slug}`,
      type: "article",
      locale: "es_AR",
      siteName: SITE.name,
      publishedTime: a.fecha_publicacion ?? undefined,
      modifiedTime: a.actualizado,
      // El openGraph de la página reemplaza al del layout entero, así que la
      // imagen se repite acá; sin esto LinkedIn y WhatsApp lo muestran sin foto.
      images: [{ ...(AJUSTES_SEO[a.slug]?.imagen ?? { url: "/og-image.png", width: 1200, height: 630 }), alt: a.titulo }],
    },
    twitter: {
      card: "summary_large_image",
      title: a.titulo,
      description: a.descripcion,
      images: [AJUSTES_SEO[a.slug]?.imagen?.url ?? "/og-image.png"],
    },
  };
}

export default async function ArticuloBlog({ params }: Props) {
  const { slug } = await params;
  const a = await obtenerPublicado(slug);
  if (!a) notFound();

  const ajuste = AJUSTES_SEO[a.slug];
  const otros = ajuste?.blog?.length ? await listarPublicados() : [];
  const relatedBlog = (ajuste?.blog ?? [])
    .map((s) => otros.find((o) => o.slug === s))
    .filter((o): o is NonNullable<typeof o> => Boolean(o))
    .map((o) => ({ slug: o.slug, title: o.titulo, description: o.descripcion }));

  return (
    <ArticleLayout
      meta={{
        slug: a.slug,
        title: a.titulo,
        description: a.descripcion,
        datePublished: a.fecha_publicacion ?? a.creado,
        dateModified: a.actualizado,
        relatedSlugs: ajuste?.recursos,
      }}
      path={`/blog/${a.slug}`}
      parent={{ label: "Blog", href: "/blog" }}
      eyebrow="Blog"
      html={cuerpoConFaqs(a)}
      faqs={a.faqs.map((f) => ({ question: f.pregunta, answer: f.respuesta }))}
      relatedBlog={relatedBlog}
    />
  );
}
