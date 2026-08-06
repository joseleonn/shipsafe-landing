import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SITE } from "@/lib/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "software de seguridad e higiene",
    "software seguridad e higiene laboral",
    "software seguridad e higiene laboral argentina",
    "software seguridad industrial",
    "software SRT",
    "sistema de gestión seguridad e higiene",
    "sistema de gestión SyH",
    "software SyH",
    "gestión SRT",
    "inspecciones de seguridad",
    "desvíos de seguridad",
    "cumplimiento normativo SRT",
    "software inspecciones planta",
    "digitalizar seguridad e higiene",
    "ley 19587",
    "decreto 351/79",
    "app de seguridad industrial",
    "software de seguridad e higiene laboral",
    "gestión de seguridad e higiene",
    "software para profesionales de seguridad e higiene",
  ],
  authors: [{ name: "Ship Software Team" }],
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    siteName: SITE.name,
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SHIPSAFE — Software de Seguridad e Higiene Laboral",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.description,
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-icon-180.png",
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
  // Piso público de la línea Profesional. Actualizar junto con PRICING en
  // constants.ts en cada ajuste semestral.
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "ARS",
    lowPrice: "90000",
    offerCount: "3",
    url: `${SITE.url}/precios`,
  },
  publisher: {
    "@type": "Organization",
    name: "Ship Software Team",
    url: "https://shipsoftware.team",
  },
};

// El FAQPage vive en la home (src/app/page.tsx), no acá: Google exige que el
// structured data de FAQ corresponda a contenido visible en esa misma página,
// y las FAQs solo se renderizan en la home.
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
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareAppSchema),
          }}
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
