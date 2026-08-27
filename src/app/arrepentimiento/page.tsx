import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import ArrepentimientoForm from "@/components/ArrepentimientoForm";

export const metadata: Metadata = {
  title: `Botón de arrepentimiento | ${SITE.name}`,
  description:
    "Revocá la contratación de SHIPSAFE dentro de los 10 días corridos, sin costo y sin tener que justificar el motivo. Disposición 954/2025.",
  alternates: { canonical: "/arrepentimiento" },
};

export default function Arrepentimiento() {
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
            <span className="text-white/70">Botón de arrepentimiento</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Botón de arrepentimiento
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Si contrataste SHIPSAFE y te arrepentiste, podés dar marcha atrás
            desde acá. No tenés que explicar por qué, no tiene costo y no
            necesitás registrarte para hacerlo.
          </p>

          <div className="mt-10 space-y-6 text-white/75 leading-relaxed">
            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">
                Cómo funciona
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  Tenés <strong className="text-white">10 días corridos</strong>{" "}
                  desde la contratación, o desde que empezaste a usar el
                  servicio, lo que haya pasado último.
                </li>
                <li>
                  Completás el formulario y en el momento te damos un{" "}
                  <strong className="text-white">
                    código de identificación
                  </strong>{" "}
                  de la revocación.
                </li>
                <li>
                  Si ya habías pagado, la devolución sale por el mismo medio con
                  el que pagaste.
                </li>
                <li>
                  No hace falta que uses este formulario: también vale avisarnos
                  por mail o por WhatsApp. Está acá para que sea simple, no para
                  ponerte un trámite.
                </li>
              </ul>
            </section>

            <section className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <ArrepentimientoForm />
            </section>

            <section>
              <h2 className="mb-3 text-xl font-semibold text-white">
                De dónde sale este derecho
              </h2>
              <p>
                Del artículo 34 de la{" "}
                <strong className="text-white">Ley 24.240</strong> de Defensa
                del Consumidor y de la{" "}
                <strong className="text-white">Disposición 954/2025</strong> de
                la Subsecretaría de Defensa del Consumidor y Lealtad Comercial,
                que obliga a que este botón esté a la vista y a un clic, sin
                registración previa.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
