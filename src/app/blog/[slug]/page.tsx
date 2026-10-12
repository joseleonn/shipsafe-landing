import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/constants";
import { cuerpoConFaqs, listarPublicados, obtenerPublicado } from "@/lib/blog";
import ArticleLayout from "@/components/ArticleLayout";

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
    title: `${a.titulo} | ${SITE.name}`,
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
    },
  };
}

export default async function ArticuloBlog({ params }: Props) {
  const { slug } = await params;
  const a = await obtenerPublicado(slug);
  if (!a) notFound();

  return (
    <ArticleLayout
      meta={{
        slug: a.slug,
        title: a.titulo,
        description: a.descripcion,
        datePublished: a.fecha_publicacion ?? a.creado,
        dateModified: a.actualizado,
      }}
      path={`/blog/${a.slug}`}
      parent={{ label: "Blog", href: "/blog" }}
      eyebrow="Blog"
      html={cuerpoConFaqs(a)}
      faqs={a.faqs.map((f) => ({ question: f.pregunta, answer: f.respuesta }))}
    />
  );
}
