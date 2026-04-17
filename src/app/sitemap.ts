import type { MetadataRoute } from "next";
import { SITE, ARTICLES } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
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
      url: `${SITE.url}/politica-privacidad`,
      lastModified: new Date("2026-04-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE.url}/terminos`,
      lastModified: new Date("2026-04-17"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
