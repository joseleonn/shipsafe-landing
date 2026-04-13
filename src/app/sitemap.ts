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
  ];
}
