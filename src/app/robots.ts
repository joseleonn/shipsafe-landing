import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El dashboard y las landings de campaña no se indexan. El middleware ya
      // las protege; esto evita además que aparezcan en Google.
      disallow: ["/dashboard", "/dashboard/", "/recurso/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
