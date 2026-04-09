import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE, FAQS } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "software seguridad e higiene laboral argentina",
    "seguridad e higiene laboral",
    "gestión SRT",
    "inspecciones de seguridad",
    "desvíos de seguridad",
    "cumplimiento normativo SRT",
    "ley 19587",
    "decreto 351/79",
  ],
  authors: [{ name: "Ship Software Team" }],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description: SITE.description,
  url: SITE.url,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "ARS",
    description: "Prueba gratuita de 30 días",
  },
  publisher: {
    "@type": "Organization",
    name: "Ship Software Team",
    url: "https://shipsoftware.team",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ship Software Team",
  url: "https://shipsoftware.team",
  brand: {
    "@type": "Brand",
    name: SITE.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body className="min-h-full">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
