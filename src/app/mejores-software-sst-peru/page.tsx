import type { Metadata } from "next";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ComparativaPais from "@/components/ComparativaPais";

const SLUG = "mejores-software-sst-peru";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

export const metadata: Metadata = {
  title: `${article.seoTitle ?? article.title} | ${SITE.name}`,
  description: article.description,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `${SITE.url}/${SLUG}`,
    type: "article",
    locale: "es_PE",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return <ComparativaPais slug={SLUG} />;
}
