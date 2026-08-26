import type { Metadata } from "next";
import { Suspense } from "react";
import AgendadoClient from "./AgendadoClient";
import { NURTURING } from "./_data";

export const metadata: Metadata = {
  title: "Reunión confirmada | SHIPSAFE",
  robots: { index: false, follow: false },
};

/**
 * Página de gracias posterior a agendar.
 *
 * Se configura en Calendly: evento de 30 min → Confirmation Page → Redirect to
 * an external site → https://www.shipsafe.lat/demo/agendado, con "Pass event
 * details to your redirected page" activado.
 *
 * Para qué sirve, además de agradecer: el video de nurturing hace la mitad de
 * la demo antes de la demo. Es lo que acorta el ciclo de venta y lo que baja
 * el no-show, porque el que ya invirtió tres minutos en mirar algo aparece.
 */
export default function AgendadoPage() {
  return (
    <main className="min-h-screen bg-primary">
      <Suspense fallback={null}>
        <AgendadoClient />
      </Suspense>

      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <p className="mb-4 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
          Reunión confirmada
        </p>

        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Listo. Te llega la invitación por mail.
        </h1>

        <p className="mt-4 text-lg text-white/70">
          Antes de que nos veamos, dos cosas que hacen que los 30 minutos rindan.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold text-white">
            1. Mirá esto antes de la reunión
          </h2>
          <p className="mb-6 mt-2 text-white/60">
            Son {NURTURING.duracion}. Así llegamos con contexto y usamos el
            tiempo en tu operación, no en explicarte qué es SHIPSAFE.
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

        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-white">
            2. Si podés, sumá a quien decide
          </h2>
          <p className="mt-2 text-white/70">
            No para venderle. Al revés: nos ahorra a los dos una reunión entera
            de repetir todo. Reenviale la invitación que te llegó y listo.
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">
            Qué vamos a hacer en los 30 minutos
          </h2>
          <ul className="mt-4 space-y-3 text-white/70">
            {[
              "Entender cómo se gestiona hoy la seguridad en tu operación, de punta a punta",
              "Recorrer el proceso que más te esté costando, con la plataforma abierta",
              "Ver cómo entra el resto de la gestión: matrices, capacitaciones, EPP, permisos, mediciones",
              "Definir si tiene sentido avanzar con una Prueba Guiada sobre tu operación",
            ].map((item) => (
              <li key={item} className="flex gap-3">
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
        </section>

        <p className="mt-10 text-sm text-white/40">
          ¿Te surgió algo antes de la reunión?{" "}
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
