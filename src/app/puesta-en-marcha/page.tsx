import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import { CASE } from "@/lib/home-content";
import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import Reveal from "@/components/site/Reveal";
import Image from "next/image";
import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Landing de la campaña de Meta Ads.
 *
 * La oferta: no se descarga nada y no se recorre un menú. Media hora y la
 * persona se va con UN proceso andando, cargado con datos suyos.
 *
 * Por qué "un proceso" y no "tu cuenta": la promesa tiene que ser verdadera a
 * cualquier tamaño. Un proceso se puede dejar funcionando en media hora en una
 * empresa de sesenta y en una de dos mil; lo que cambia es cuántos siguen
 * después. Ver ship-it/manifiesto-shipsafe.md.
 *
 * El botón no lleva a otra página: abre el DemoModal (las preguntas) y después
 * Calendly encima. Es el mismo camino que el resto del sitio, así no hay dos
 * formas de agendar.
 *
 * Barra y pie en modo mínimo (SiteShell minimal): solo el logo y el botón
 * arriba, lo legal abajo. Es tráfico pago: la única salida es agendar. En
 * mobile, la barra flotante con el mismo botón.
 *
 * `robots: noindex` a propósito: es tráfico pago, no la queremos compitiendo
 * en Google con las páginas de SEO.
 */
export const metadata: Metadata = {
  title: `Te dejamos un proceso andando en media hora | ${SITE.name}`,
  description:
    "Media hora con nosotros y te vas con un proceso de seguridad e higiene funcionando: tus checklists, un frente real cargado y quince días para usarlo con tu gente.",
  alternates: { canonical: "/puesta-en-marcha" },
  robots: { index: false, follow: false },
};

const LLEVAS = [
  {
    icon: "check",
    title: "Tu cuenta, con tus checklists",
    text: "No los nuestros. Si ya tenés los tuyos armados, esos son los que cargamos.",
  },
  {
    icon: "zap",
    title: "El proceso que hoy más te cuesta",
    text: "Uno solo, configurado con tus datos reales. El que elijas vos.",
  },
  {
    icon: "user",
    title: "Un frente tuyo, andando",
    text: "Un vehículo, un sector o una sucursal de verdad. No un ejemplo.",
  },
  {
    icon: "calendar",
    title: "Quince días para usarlo",
    text: "Con tu gente, en tu operación, antes de decidir nada.",
  },
];

/**
 * Quién atiende la reunión. La oferta entera es el uno a uno, y la página
 * decía "media hora con nosotros" sin decir con quién. Además la persona vino
 * de un anuncio donde vio esta cara: si la landing no la tiene, se corta la
 * continuidad justo cuando hay que decidir.
 *
 * La foto es opcional. Si el archivo no está, el bloque sale igual con el
 * nombre; en cuanto aparezca en public/equipo/, se muestra sola.
 */
/**
 * Los años van acá y no sueltos en el texto. Ojo que no son del mismo rubro:
 * los de Walter son de higiene y seguridad, los míos de software. Meterlos en
 * la misma frase daría a entender que los dos venimos de lo mismo, que no es
 * cierto y encima desaprovecha que sean cosas distintas.
 */
const ANIOS = { jose: 6, walter: 13 };

const ANFITRION = {
  nombre: "José Cáceres Musso",
  rol: `Fundador de SHIPSAFE · +${ANIOS.jose} años desarrollando software`,
  texto:
    "La media hora la doy yo. No es una demo grabada ni un vendedor leyendo un guion: nos sentamos, me contás cómo registran hoy, y lo dejamos armado.",
  foto: "/equipo/jose.jpg",
  // El socio no está en todas las reuniones, así que no va como segundo
  // anfitrión: va como refuerzo, que es lo que realmente pasa.
  suma: `Si tu caso lo pide se suma Walter Rodríguez, mi socio: licenciado en higiene y seguridad, +${ANIOS.walter} años en el rubro.`,
};

const PASOS = [
  {
    n: "1",
    title: "Nos contás qué proceso te duele",
    text: "Lo ponés al reservar, así llegamos con la cuenta ya preparada y no gastamos la media hora en presentaciones.",
  },
  {
    n: "2",
    title: "Lo configuramos juntos, en vivo",
    text: "Compartís pantalla o mirás mientras lo armamos. No hay nada que preparar de tu lado.",
  },
  {
    n: "3",
    title: "Hacés una inspección desde tu celular",
    text: "La misma que va a hacer tu gente en el frente. Ahí se ve si sirve o no.",
  },
  {
    n: "4",
    title: "Te queda andando",
    text: "Con tus usuarios cargados, listo para que lo use el equipo al día siguiente.",
  },
];

const FAQS = [
  {
    q: "¿Tengo que usar los checklists de ustedes?",
    a: "No. Los que vienen cargados son un punto de partida. SW Petrol, nuestro cliente, no usa ninguno: se armó los suyos y usa esos. Un sistema que te obliga a trabajar distinto para poder usarlo se abandona en el segundo mes.",
  },
  {
    q: "Nosotros ya tenemos un ERP. ¿Esto no es más de lo mismo?",
    a: "No lo reemplazamos. El ERP es donde vive el dato corporativo y va a seguir estando. El problema es otro: un técnico parado al lado de una caldera no entra al ERP desde el celular, y por eso las mediciones terminan en un Drive y los indicadores se arman a mano. Somos la capa rápida que falta entre el ERP y el celular del técnico.",
  },
  {
    q: "¿Mi gente lo va a usar? Tienen cincuenta y pico y no usan apps.",
    a: "La comparación no es la app contra nada: es la app contra la planilla de papel. Escanear un QR y tildar es menos trabajo que escribir a mano, buscar la lapicera y hacer llegar el papel desde un frente. El problema de adopción lo tiene el papel.",
  },
  {
    q: "¿Cuánto sale?",
    a: "Se cobra por mes y por empresa, no por usuario: no pagás más por sumar gente al frente. Lo que mueve el número es cuántos establecimientos tenés y cuántos módulos vas a usar. Hay una línea para consultores y PyMEs chicas y otra para empresas con operación. El número que te corresponde te lo damos en la media hora, con tu caso adelante, no una lista de precios genérica.",
  },
  {
    q: "¿Quién carga todo la primera semana?",
    a: "Arrancamos con un proceso, no con todos. Ese se pone a andar en la media hora, se ve funcionando, y recién después se suma el segundo. Si algo lleva dos semanas, te decimos dos semanas.",
  },
];

export default function Page() {
  // Se resuelve al construir el sitio: si la foto todavía no está, el bloque
  // sale sin ella en vez de pedir una imagen que no existe.
  const hayFoto = existsSync(join(process.cwd(), "public", ANFITRION.foto.replace(/^\//, "")));

  return (
    <SiteShell minimal ctaLabel="Reservá tu media hora" ctaSection="puesta-nav">
      <main id="main">
        <section className="page-hero center" id="top">
          <div className="wrap">
            <div className="eyebrow">Para quien tiene la seguridad a cargo</div>
            <h1>
              Te dejamos un proceso <em>andando en media hora.</em>
            </h1>
            <p className="lede">
              No hay nada que descargar y no vamos a recorrer menús. Nos sentamos
              media hora, configuramos el proceso que hoy más te cuesta con tus
              datos, y te vas con eso funcionando.
            </p>
            <div className="hero-cta">
              <DemoLink section="puesta-hero" className="btn btn-primary btn-lg">
                Reservá tu media hora
              </DemoLink>
            </div>
            <p className="fine">
              30 minutos · No hace falta que prepares nada
            </p>
          </div>
        </section>

        <section id="que-llevas">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>01</span>Qué te llevás</div>
              <h2>
                Media hora después, <em>tenés esto andando.</em>
              </h2>
            </div>
            <ol className="steps compact">
              {LLEVAS.map((item, i) => (
                <Reveal as="li" key={item.title} delay={i * 0.08}>
                  <span className="who">
                    <Icon name={item.icon} />
                  </span>
                  <b>{item.title}</b>
                  <p>{item.text}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        <section id="como-es" className="flow">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>02</span>Cómo es la reunión</div>
              <h2>
                Cuatro pasos <em>y ya está funcionando.</em>
              </h2>
            </div>
            <ol className="steps compact">
              {PASOS.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 0.08}>
                  <span className="who">
                    <Icon name="check" />
                    Paso {p.n}
                  </span>
                  <b>{p.title}</b>
                  <p>{p.text}</p>
                </Reveal>
              ))}
            </ol>
            <div className="anfitrion">
              {hayFoto && (
                <Image src={ANFITRION.foto} alt={ANFITRION.nombre} width={112} height={112} />
              )}
              <div>
                <p>{ANFITRION.texto}</p>
                <b>{ANFITRION.nombre}</b>
                <span>{ANFITRION.rol}</span>
                <small>{ANFITRION.suma}</small>
              </div>
            </div>
            <p className="fine">
              Si de esto decide alguien más, sumalo a la llamada. Con quince
              minutos que pueda estar, alcanza.
            </p>
          </div>
        </section>

        <section id="caso">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>03</span>Un caso real</div>
              <h2>
                {CASE.name}, <em>{CASE.size}.</em>
              </h2>
            </div>
            {/* El logo del cliente antes del Antes/Hoy: una marca real pesa más
                que la empresa afirmando cosas sobre sí misma. `unoptimized`
                porque es un PNG chico con transparencia y el optimizador le
                come el fondo. */}
            {CASE.logo && (
              <div className="caso-logo">
                <Image
                  src={CASE.logo}
                  alt={`Logo de ${CASE.legal}`}
                  width={245}
                  height={124}
                  unoptimized
                />
                <span>
                  {CASE.sector} · {CASE.where}
                </span>
              </div>
            )}
            <ul className="quotes">
              <Reveal as="li" className="quote-card">
                <p>
                  <b>Antes.</b> {CASE.before}
                </p>
              </Reveal>
              <Reveal as="li" className="quote-card" delay={0.06}>
                <p>
                  <b>Hoy.</b> {CASE.today}
                </p>
              </Reveal>
            </ul>
            <p className="fine">
              <a href={CASE.url} target="_blank" rel="noopener noreferrer">
                {CASE.legal}
              </a>
            </p>
          </div>
        </section>

        <section id="preguntas">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>04</span>Lo que nos preguntan</div>
              <h2>
                Las dudas <em>antes de reservar.</em>
              </h2>
            </div>
            <ul className="quotes">
              {FAQS.map((f, i) => (
                <Reveal as="li" key={f.q} className="quote-card" delay={i * 0.06}>
                  <b>{f.q}</b>
                  <p>{f.a}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section id="cierre" className="close">
          <div className="wrap center">
            <h2>
              Media hora, <em>y te vas con algo funcionando.</em>
            </h2>
            <p className="lede">
              Elegís el proceso que más te cuesta y lo dejamos andando con tu
              operación cargada.
            </p>
            <div className="hero-cta">
              <DemoLink section="puesta-cierre" className="btn btn-primary btn-lg">
                Reservá tu media hora
              </DemoLink>
            </div>
          </div>
        </section>
      </main>
      <StickyBar heroId="top" closeId="cierre" section="puesta-sticky" label="Reservá tu media hora" />
    </SiteShell>
  );
}
