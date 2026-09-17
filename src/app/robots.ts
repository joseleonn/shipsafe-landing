import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El dashboard, el cotizador y las landings de campaña no se indexan. El
      // middleware ya protege las dos primeras; esto evita además que la URL
      // aparezca en Google.
      disallow: ["/dashboard", "/dashboard/", "/interno", "/interno/", "/recurso/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
