import type { MetadataRoute } from "next";
import { SITE, ARTICLES } from "@/lib/constants";
import { listarPublicados } from "@/lib/blog";

// Los artículos del blog se suman solos al publicarse.
export const revalidate = 3600; // literal obligatorio en Next; igual a REVALIDAR_BLOG de lib/blog

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await listarPublicados();
  return [
    {
      url: SITE.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...ARTICLES.map((article) => ({
      url: `${SITE.url}/${article.slug}`,
      lastModified: new Date(article.dateModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${SITE.url}/blog`,
      lastModified: blog[0] ? new Date(blog[0].actualizado) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blog.map((a) => ({
      url: `${SITE.url}/blog/${a.slug}`,
      lastModified: new Date(a.actualizado),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE.url}/plataforma`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/precios`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/consultores`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE.url}/politica-privacidad`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terminos`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/tratamiento-de-datos`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/arrepentimiento`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
