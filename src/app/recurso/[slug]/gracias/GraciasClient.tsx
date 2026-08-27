"use client";

import { useMemo, useSyncExternalStore } from "react";
import Script from "next/script";
import { getAttribution } from "@/lib/attribution";
import { CALENDLY_URL, VSL_RECURSO } from "../../_data";

interface Props {
  titulo: string;
  archivo: string;
  archivoListo: boolean;
}

interface LeadGuardado {
  califica: boolean;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

/** El valor no cambia durante la vida de la página: no hace falta suscribirse. */
const suscribir = () => () => {};

export default function GraciasClient({ titulo, archivo, archivoListo }: Props) {
  /**
   * sessionStorage no existe en el render del servidor. useSyncExternalStore
   * nos deja leerlo sin setState dentro de un effect: devuelve el snapshot del
   * servidor (null) durante la hidratación y el real apenas está en el cliente.
   */
  const raw = useSyncExternalStore(
    suscribir,
    () => {
      try {
        return sessionStorage.getItem("ss_lead");
      } catch {
        return null;
      }
    },
    () => null
  );
  const listo = useSyncExternalStore(suscribir, () => true, () => false);

  const lead = useMemo<LeadGuardado | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as LeadGuardado;
    } catch {
      return null;
    }
  }, [raw]);

  /**
   * URL de Calendly con los datos precargados y los UTM reenviados. Los UTM son
   * los que después vuelven por el webhook y le dicen a Meta qué anuncio trajo
   * a esta persona.
   */
  const calendlyUrl = useMemo(() => {
    const url = new URL(CALENDLY_URL);
    const attr = getAttribution();

    if (lead) {
      const nombreCompleto = [lead.nombre, lead.apellido].filter(Boolean).join(" ");
      if (nombreCompleto) url.searchParams.set("name", nombreCompleto);
      if (lead.email) url.searchParams.set("email", lead.email);
    }
    for (const [key, value] of Object.entries(attr)) {
      if (key.startsWith("utm_") && value) url.searchParams.set(key, value);
    }
    url.searchParams.set("hide_gdpr_banner", "1");
    url.searchParams.set("background_color", "0B1F3B");
    url.searchParams.set("text_color", "ffffff");
    url.searchParams.set("primary_color", "2563EB");
    return url.toString();
  }, [lead]);

  const califica = lead?.califica === true;

  return (
    <main className="min-h-screen bg-primary">
      {/* La entrega va acá arriba, en una franja, y no en un botón grande en el
          medio de la página. Si el botón de descarga es lo más prominente, la
          persona lo aprieta y se va: ya consiguió lo que vino a buscar y el
          resto de la página no existe. Achicándolo se entrega igual —el archivo
          se baja en el momento— pero la atención queda libre para el video. */}
      <div className="border-b border-emerald-400/20 bg-emerald-400/[0.08]">
        <div className="mx-auto flex max-w-3xl flex-wrap items-baseline gap-x-3 gap-y-1 px-6 py-3 text-sm">
          <span className="font-semibold text-emerald-300">Listo, ya es tuyo.</span>
          {archivoListo ? (
            <a
              href={`/recursos/${archivo}`}
              download
              className="text-white/70 underline underline-offset-4 transition hover:text-white"
            >
              Descargar {titulo.toLowerCase()}
            </a>
          ) : (
            <span className="text-white/60">
              Lo estamos terminando de preparar. Te escribimos apenas esté.
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-14 lg:py-20">
        {/* El H1 no es un acuse de recibo: es una promesa nueva. La persona ya
            tiene el archivo, así que repetirle que lo tiene no le mueve nada.
            Lo que la retiene es enterarse de que el problema es otro. */}
        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Cómo hacer que esas inspecciones se hagan de verdad, en los frentes
          donde vos no estás
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-white/70">
          Los checklists te dicen qué mirar. No hacen que alguien los complete a
          200 kilómetros, ni que el «No OK» del martes lo cierre alguien. De eso
          habla este video.
        </p>

        <section className="mt-10">
          {VSL_RECURSO.disponible ? (
            <>
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${VSL_RECURSO.youtubeId}?rel=0`}
                    title={VSL_RECURSO.titulo}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <p className="mt-3 text-sm text-white/45">
                {VSL_RECURSO.duracion} · con subtítulos
              </p>
            </>
          ) : (
            <p className="rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/50">
              Lo estamos grabando. Mientras tanto, abajo va lo mismo escrito.
            </p>
          )}
        </section>

        <hr className="my-12 border-white/10" />

        {!listo ? null : califica ? (
          <section>
            {/* La oferta continúa el recurso, no cambia de tema.
                La versión anterior arrancaba con "ya que estás" y saltaba a
                describir el producto —QR, autoelevador, tableros—. Alguien que
                vino por unos checklists y se encuentra con eso siente el salto,
                porque es un salto. Acá se nombra lo que el PDF no puede
                resolver, que es lo que la persona ya sabe que le pasa, y recién
                después se ofrece la reunión. */}
            <h2 className="font-display text-2xl font-semibold text-white">
              Los checklists son la parte fácil
            </h2>
            <p className="mt-3 text-white/70">
              Los diez que acabás de bajar te resuelven qué mirar. Lo que no
              resuelven es lo que viene después:
            </p>
            <ul className="mt-4 space-y-2 text-white/70">
              {[
                "Juntar las planillas de gente que trabaja en distintos lugares",
                "Saber si el «No OK» del martes lo cerró alguien, y cuándo",
                "Que un vencimiento te avise antes, y no cuando lo ves de casualidad",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 flex-none rounded-full bg-white/40" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-white/70">
              La gestión no se rompe al detectar. Se rompe en el seguimiento: que
              la inspección se cargue donde se hace, que cada desvío quede con
              responsable y plazo, y que vos veas el estado de todos los frentes
              sin llamar a nadie.
            </p>
            <p className="mt-5 text-white/70">
              Si querés, lo miramos sobre tu operación. Elegís el proceso que hoy
              más te cuesta y lo recorremos juntos. Son 30 minutos.
            </p>
            <p className="mt-3 text-sm text-white/50">
              Si es posible, sumá a quien también participa de la decisión.
            </p>

            <div
              className="calendly-inline-widget mt-8 overflow-hidden rounded-2xl border border-white/10"
              data-url={calendlyUrl}
              style={{ minWidth: "320px", height: "700px" }}
            />
            <Script
              src="https://assets.calendly.com/assets/external/widget.js"
              strategy="afterInteractive"
            />
          </section>
        ) : (
          <section>
            {/* Al que no califica no se le dice que no. Se le da valor y se lo
                deja en nurturing: hoy no es cliente, en seis meses puede serlo. */}
            <h2 className="font-display text-2xl font-semibold text-white">
              Una cosa más
            </h2>
            <p className="mt-3 text-white/70">
              En las próximas semanas te vamos a ir mandando material de gestión
              SST: normativa, casos concretos y cómo se resuelven de punta a
              punta. Sin vueltas y sin spam.
            </p>
            <p className="mt-3 text-white/70">
              Si querés escribirnos por algo puntual, estamos en{" "}
              <a
                href="https://wa.me/5493413067158?text=Hola%2C%20descargu%C3%A9%20un%20recurso%20de%20SHIPSAFE%20y%20quiero%20consultar%20algo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4 hover:text-accent/80"
              >
                WhatsApp
              </a>
              .
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
