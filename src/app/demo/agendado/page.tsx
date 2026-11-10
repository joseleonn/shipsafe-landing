import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Wordmark from "@/components/site/Wordmark";
import Icon from "@/components/site/Icon";
import AgendadoClient from "./AgendadoClient";
import { NURTURING } from "./_data";
import { whatsappUrl, CASE } from "@/lib/home-content";
import { MEDIA } from "@/lib/home-v5";

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
 * el video ya explica (que no es una demo genérica, que queremos un problema
 * concreto, que conviene que esté quien decide) acá no se vuelve a desarrollar.
 * La página confirma, presenta el video y resume las dos cosas que hacen falta.
 *
 * Lo que NO va acá, a propósito: funcionalidades, beneficios, precios ni otro
 * CTA de demo. La persona ya convirtió. Ahora se prepara la reunión. Por eso
 * la barra de arriba trae solo el logo, sin menú ni botones.
 *
 * Testimonios (10/11/2026): José decidió sumar prueba de clientes reales,
 * siguiendo la idea de que esta página tiene que dar razones para presentarse.
 * Va después de los requisitos, para no competir con el video. Solo clientes
 * con autorización escrita y frase aprobada por ellos (hoy, Ramiro de SW
 * Petrol). Las frases de otros clientes se suman en TESTIMONIOS cuando las
 * autoricen.
 *
 * Usa el sistema visual del sitio (site.css / pages.css, bajo .ss-site). Vive
 * bajo el layout de /demo, que pinta un fondo oscuro fijo detrás: el
 * envoltorio .ss-site lo tapa (relative, z-index, alto mínimo).
 */

const REQUISITOS = [
  {
    titulo: "Un problema real",
    texto: "Trae el problema que hoy más te cuesta resolver en la gestión SST. Queremos trabajar sobre algo concreto de tu operación.",
  },
  {
    titulo: "La persona que toma la decisión",
    texto: "Si es posible, suma a quien también participa de la decisión. Así podemos tener la conversación completa desde el principio.",
  },
];

export default function AgendadoPage() {
  return (
    <div className="ss-site ss-agendado">
      <Suspense fallback={null}>
        <AgendadoClient />
      </Suspense>

      <header className="ag-top">
        <div className="wrap">
          <Link className="brand" href="/" aria-label="SHIPSAFE, inicio">
            <Wordmark priority />
          </Link>
        </div>
      </header>

      <main className="page" id="main">
        <section className="page-hero center ag-hero">
          <div className="wrap">
            <div className="eyebrow ok">
              <Icon name="check" />
              Reunión confirmada
            </div>
            <h1>
              Gracias por agendar. <em>Nos vemos en la reunión.</em>
            </h1>
            <p className="lede">Te llega la invitación por mail. Antes de la reunión, mira este video de {NURTURING.duracion}: cómo vamos a trabajar y qué necesitamos de tu lado para aprovechar esos 30 minutos.</p>
          </div>
        </section>

        <section className="ag-video">
          <div className="mid">
            {NURTURING.disponible ? (
              <div className="ag-frame">
                <iframe
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
            ) : (
              <p className="ag-pending">Te lo mandamos por mail junto con la invitación.</p>
            )}
          </div>
        </section>

        <section className="ag-req">
          <div className="narrow">
            <h2>Para la reunión, solo necesitamos <em>dos cosas.</em></h2>
            <ol className="what">
              {REQUISITOS.map((r) => (
                <li key={r.titulo}>
                  <b>{r.titulo}.</b> {r.texto}
                </li>
              ))}
            </ol>
            <blockquote className="ag-quote">No es una demo genérica. La idea es que esos 30 minutos sean sobre tu operación: entender un problema concreto y mostrarte cómo podríamos resolverlo.</blockquote>
          </div>
        </section>

        {MEDIA.testimonialVideo && (
          <section className="ag-proof">
            <div className="narrow">
              <h2>
                Lo que cuenta <em>un cliente.</em>
              </h2>
              <p className="ag-proof-lede">
                {CASE.name} hace servicios para la industria petrolera en {CASE.where}. Su responsable de seguridad e higiene cuenta cómo registraban antes y qué usan hoy.
              </p>
              <div className="ag-frame">
                <video poster={MEDIA.testimonialVideo.poster} controls playsInline preload="none" aria-label={`Testimonio de ${CASE.voz.name}, ${CASE.voz.role} de ${CASE.name}`}>
                  {MEDIA.testimonialVideo.webm && <source src={MEDIA.testimonialVideo.webm} type="video/webm" />}
                  <source src={MEDIA.testimonialVideo.src} type="video/mp4" />
                </video>
              </div>
              <p className="ag-proof-voz">
                <b>{CASE.voz.name}</b> · {CASE.voz.role} de {CASE.name}
              </p>
            </div>
          </section>
        )}

        <section className="ag-end">
          <div className="narrow">
            <p className="ag-help">
              ¿Te quedó alguna pregunta antes de la reunión?{" "}
              <a href={whatsappUrl("Hola, agendé una reunión con SHIPSAFE y quería consultar algo")} target="_blank" rel="noopener noreferrer">
                <Icon name="msg" />
                Escríbenos por WhatsApp
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="ag-foot">
        <div className="wrap">
          <span>SHIPSAFE · Un producto de Ship Software Team, Argentina</span>
          <a href="mailto:hello@shipsafe.lat">hello@shipsafe.lat</a>
        </div>
      </footer>
    </div>
  );
}
