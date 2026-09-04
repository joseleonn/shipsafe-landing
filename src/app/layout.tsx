import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./site.css";
import "./pages.css";
import "./motion.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import { SITE } from "@/lib/constants";

// Tipografía del sistema (v3, 4/9/2026): la misma que el producto.
// Geist para el cuerpo, Plus Jakarta Sans para títulos, Geist Mono para
// etiquetas. Autoalojadas (sin pedidos a Google Fonts): src/app/fonts/.
// `--font-inter` y `--font-space-grotesk` se conservan como alias para que
// el resto de las páginas sigan resolviendo sus variables sin tocar código.
const geist = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--font-geist",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const jakarta = localFont({
  src: "./fonts/PlusJakartaSans.woff2",
  variable: "--font-jakarta",
  weight: "200 800",
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
        alt: "SHIPSAFE, software de seguridad e higiene laboral",
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
  // Verificación de dominio de Meta (Business Manager → Seguridad de la marca →
  // Dominios). Hace falta para que Meta pueda atribuir conversiones en iOS.
  // Alternativa más robusta si tenés acceso al DNS: un registro TXT con
  // facebook-domain-verification=<el mismo código>, que cubre también los
  // subdominios y no depende de que esta página se renderice.
  verification: {
    other: {
      "facebook-domain-verification": "m68q3sdlfaq6eejsup5pfltqr4jpmv",
    },
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
    <html lang="es" className={`${geist.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}>
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
        <MetaPixel />
        {children}
      </body>
    </html>
  );
}
