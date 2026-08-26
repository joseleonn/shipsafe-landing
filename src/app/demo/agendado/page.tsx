import type { Metadata } from "next";
import { Suspense } from "react";
import AgendadoClient from "./AgendadoClient";
import { NURTURING } from "./_data";

export const metadata: Metadata = {
  title: "Reunión confirmada | SHIPSAFE",
  robots: { index: false, follow: false },
};

/**
 * Página de confirmación posterior a agendar.
 *
 * Se configura en Calendly: evento de 30 min, Confirmation Page, Redirect to an
 * external site, https://www.shipsafe.lat/demo/agendado, con "Pass event details
 * to your redirected page" activado.
 *
 * Criterio de esta página: **acompaña al video, no compite con él.** Todo lo que
 * el video ya explica —que no es una demo genérica, que queremos un problema
 * concreto, que conviene que esté quien decide— acá no se vuelve a desarrollar.
 * La página confirma, presenta el video y resume las dos cosas que hacen falta.
 *
 * Lo que NO va acá, a propósito: funcionalidades, beneficios, testimonios,
 * precios ni otro CTA de demo. La persona ya convirtió. Ahora se prepara la
 * reunión.
 */

const REQUISITOS = [
  {
    n: "01",
    titulo: "Un problema real",
    texto:
      "Traé el problema que hoy más te cuesta resolver en Seguridad e Higiene. Queremos trabajar sobre algo concreto de tu operación.",
  },
  {
    n: "02",
    titulo: "La persona que toma la decisión",
    texto:
      "Si es posible, sumá a quien también participa de la decisión. Así podemos tener la conversación completa desde el principio.",
  },
];

export default function AgendadoPage() {
  return (
    // relative z-10: el layout ya no envuelve en un <main> posicionado, así que
    // sin esto el contenido queda pintado debajo de GlobalBackground.
    <main className="relative z-10 min-h-screen bg-primary">
      <Suspense fallback={null}>
        <AgendadoClient />
      </Suspense>

      <div className="mx-auto max-w-2xl px-6 py-20 lg:py-28">
        {/* ── Confirmación ─────────────────────────────────────────────── */}
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
          Reunión confirmada
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Gracias por agendar.
          <br />
          Nos vemos en la reunión.
        </h1>

        <p className="mt-4 text-white/60">
          Te llega la invitación por mail.
        </p>

        {/* ── El video, que es la pieza central ────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-xl font-semibold text-white">
            Antes de la reunión, mirá este video
          </h2>
          <p className="mb-7 mt-3 leading-relaxed text-white/70">
            Te cuento brevemente cómo vamos a trabajar y qué necesitamos de tu
            lado para aprovechar esos 30 minutos.
          </p>

          {NURTURING.disponible ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  // nocookie: no le deja cookies de seguimiento a alguien que
                  // todavía no es cliente. rel=0 limita los videos sugeridos del
                  // final al propio canal, para que no aparezca la competencia
                  // justo cuando termina de escucharnos.
                  src={`https://www.youtube-nocookie.com/embed/${NURTURING.youtubeId}?rel=0`}
                  title={NURTURING.titulo}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/50">
              Te lo mandamos por mail junto con la invitación.
            </p>
          )}
        </section>

        {/* ── Las dos cosas que hacen falta ────────────────────────────── */}
        <section className="mt-20">
          <h2 className="font-display text-xl font-semibold text-white">
            Para la reunión, solo necesitamos dos cosas
          </h2>

          <ol className="mt-8 space-y-10">
            {REQUISITOS.map((r) => (
              <li key={r.n}>
                <div className="flex gap-5">
                  <span
                    aria-hidden
                    className="font-display text-sm font-semibold tabular-nums text-white/30"
                  >
                    {r.n}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {r.titulo}
                    </h3>
                    <p className="mt-2 leading-relaxed text-white/70">{r.texto}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── La expectativa de los 30 minutos ─────────────────────────── */}
        <p className="mt-20 border-l-2 border-accent/40 pl-6 text-lg leading-relaxed text-white/80">
          No es una demo genérica. La idea es que esos 30 minutos sean sobre tu
          operación: entender un problema concreto y mostrarte cómo podríamos
          resolverlo.
        </p>

        {/* ── Soporte, sin protagonismo ────────────────────────────────── */}
        <p className="mt-20 border-t border-white/10 pt-8 text-sm text-white/45">
          ¿Te quedó alguna pregunta antes de la reunión?{" "}
          <a
            href="https://wa.me/5493413067158?text=Hola%2C%20agend%C3%A9%20una%20demo%20de%20SHIPSAFE%20y%20quer%C3%ADa%20consultar%20algo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 hover:text-accent/80"
          >
            Escribinos por WhatsApp
          </a>
          .
        </p>
      </div>
    </main>
  );
}
