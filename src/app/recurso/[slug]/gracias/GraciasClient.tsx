"use client";

import { useMemo, useSyncExternalStore } from "react";
import Script from "next/script";
import { getAttribution } from "@/lib/attribution";
import { CALENDLY_URL } from "../../_data";

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
      <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
        <p className="mb-4 inline-block rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300">
          Listo
        </p>

        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          Acá tenés {titulo.toLowerCase()}
        </h1>

        <p className="mt-4 text-lg text-white/70">
          Descargalo y usalo cuando lo necesites. Guardá esta página en favoritos
          si querés volver.
        </p>

        {archivoListo ? (
          <a
            href={`/recursos/${archivo}`}
            download
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/15"
          >
            Descargarlo ahora
          </a>
        ) : (
          <p className="mt-8 rounded-lg border border-white/10 bg-white/[0.03] px-5 py-4 text-sm text-white/50">
            Lo estamos terminando de preparar. Te escribimos apenas esté listo.
          </p>
        )}

        <hr className="my-12 border-white/10" />

        {!listo ? null : califica ? (
          <section>
            <h2 className="font-display text-2xl font-semibold text-white">
              Ya que estás: ¿lo vemos con tu operación?
            </h2>
            <p className="mt-3 text-white/70">
              Son 30 minutos. No es una demo genérica: recorremos un proceso
              tuyo de verdad. El QR pegado en tu autoelevador, la inspección que
              hace tu gente, el desvío que se abre solo, y cómo lo termina viendo
              tu gerencia.
            </p>
            <p className="mt-3 text-sm text-white/50">
              Si podés, sumá a quien tiene que aprobarlo. Nos ahorra una reunión
              a los dos.
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
