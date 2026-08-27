import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

/** Los tres documentos legales, para cruzarlos entre sí al pie de cada uno. */
export const DOCUMENTOS_LEGALES = [
  { slug: "/terminos", label: "Términos y condiciones" },
  { slug: "/politica-privacidad", label: "Política de privacidad" },
  { slug: "/tratamiento-de-datos", label: "Anexo de tratamiento de datos" },
];

interface Props {
  title: string;
  /** Se muestra tal cual. Ej: "Versión 1.0". */
  version: string;
  /**
   * Marca el documento como borrador sin revisión legal. Cuando el abogado
   * apruebe el texto, se pasa a `false` y desaparece el cartel: es un booleano
   * y no un borrado de texto justamente para que el cambio sea de una línea.
   */
  borrador?: boolean;
  /** Ruta de este documento, para no autoenlazarse en el cruce del pie. */
  slug: string;
  children: React.ReactNode;
}

export default function LegalLayout({
  title,
  version,
  borrador = false,
  slug,
  children,
}: Props) {
  const otros = DOCUMENTOS_LEGALES.filter((d) => d.slug !== slug);

  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-white/70">{title}</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/40">{version}</p>

          {borrador && (
            <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-sm leading-relaxed text-amber-100/90">
                <strong className="font-semibold">
                  Borrador pendiente de revisión legal.
                </strong>{" "}
                El texto describe con exactitud cómo funciona el sistema, pero
                todavía no fue revisado por un abogado. Si vas a contratar y
                algo de acá te resulta determinante, escribinos antes.
              </p>
            </div>
          )}

          <div
            className="mt-10 space-y-8 leading-relaxed text-white/75
              [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white
              [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white/90
              [&_p]:mb-3 [&_p:last-child]:mb-0
              [&_strong]:font-semibold [&_strong]:text-white
              [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-6
              [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2"
          >
            {children}
          </div>

          <div className="mt-14 border-t border-white/10 pt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
              Los otros documentos
            </h2>
            <ul className="space-y-2">
              {otros.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={d.slug}
                    className="text-sm text-accent underline underline-offset-2"
                  >
                    {d.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
