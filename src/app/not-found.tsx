import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata = {
  title: `Página no encontrada | ${SITE.name}`,
  description: "La página que buscás no existe. Explorá nuestros recursos sobre seguridad e higiene laboral.",
};

export default function NotFound() {
  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10 flex min-h-[60vh] flex-col items-center justify-center px-4 pt-28 pb-20 text-center">
        <h1 className="text-6xl font-bold text-white">404</h1>
        <p className="mt-4 text-xl text-white/70">
          La página que buscás no existe o fue movida.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-accent px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/25"
          >
            Ir al inicio
          </Link>
          <Link
            href="/#contacto"
            className="inline-flex items-center justify-center rounded-lg border border-white/30 px-6 py-3.5 text-base font-semibold text-white transition-all duration-300 hover:border-white/60 hover:bg-white/10"
          >
            Contactanos
          </Link>
        </div>

        <div className="mt-16 w-full max-w-2xl">
          <h2 className="mb-6 text-lg font-semibold text-white">
            Recursos de seguridad e higiene laboral
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ARTICLES.slice(0, 4).map((article) => (
              <Link
                key={article.slug}
                href={`/${article.slug}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <h3 className="text-sm font-semibold text-white">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
