import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRecurso } from "../_data";
import OptInForm from "../_components/OptInForm";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recurso = getRecurso(slug);
  if (!recurso) return { title: "Recurso no encontrado | SHIPSAFE" };

  return {
    title: recurso.metaTitle,
    description: recurso.metaDescription,
    // Landing de campaña: no la queremos compitiendo en Google con las páginas
    // de SEO ni indexada sin contexto.
    robots: { index: false, follow: false },
  };
}

export default async function RecursoPage({ params }: Props) {
  const { slug } = await params;
  const recurso = getRecurso(slug);
  if (!recurso) notFound();

  return (
    <main className="min-h-screen bg-primary">
      {/* Sin navbar ni footer a propósito: la página pide una sola cosa y no
          le damos al visitante ningún otro lado a donde ir. */}
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-24">
        <section>
          <p className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
            {recurso.kicker}
          </p>

          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {recurso.titulo}
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70">
            {recurso.subtitulo}
          </p>

          <ul className="mt-10 space-y-4">
            {recurso.incluye.map((item) => (
              <li key={item} className="flex gap-3 text-white/80">
                <span
                  aria-hidden
                  className="mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent"
                >
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-10 border-l-2 border-white/15 pl-5 text-sm leading-relaxed text-white/50">
            Lo armamos en SHIPSAFE, la plataforma de gestión de Seguridad y Salud
            en el Trabajo de Ship Software Team. Trabajamos con empresas
            operativas que necesitan control, trazabilidad y respaldo documental.
          </p>
        </section>

        <section className="lg:sticky lg:top-12 lg:self-start">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-8">
            <h2 className="font-display text-xl font-semibold text-white">
              Completá y te lo mandamos
            </h2>
            <p className="mb-6 mt-2 text-sm text-white/50">
              Nos sirve saber con quién estamos hablando para mandarte lo que
              realmente te sirve.
            </p>
            <OptInForm slug={recurso.slug} cta={recurso.cta} />
          </div>
        </section>
      </div>
    </main>
  );
}
