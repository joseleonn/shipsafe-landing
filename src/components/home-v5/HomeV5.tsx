import Image from "next/image";
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import LeadForm from "@/components/home/LeadForm";
import { CASE, SHOTS, whatsappUrl } from "@/lib/home-content";
import { HOME5, MEDIA, type Video } from "@/lib/home-v5";

/**
 * Home v5 (24/10/2026). Poco texto, personas y producto real.
 * Orden: qué es → quién lo usa → todo lo que cubre → cómo se cierra un
 * hallazgo → probalo → caso → quiénes somos → agendar.
 *
 * La v4 sigue entera en components/home/ y sus secciones de detalle se
 * reutilizan en /plataforma.
 */
export default function HomeV5() {
  return (
    <SiteShell className="ss-home ss-home5" ctaLabel={HOME5.cta} ctaSection="nav">
      <main id="main">
        <Hero />
        <Clientes />
        <Plataforma />
        <Flujo />
        <Probalo />
        <Caso />
        <Nosotros />
        <Cierre />
      </main>
      <StickyBar label={HOME5.cta} />
    </SiteShell>
  );
}

function VideoPlayer({ video, label, loop = false }: { video: NonNullable<Video>; label: string; loop?: boolean }) {
  return loop ? (
    <video className="h5-video" src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-label={label} />
  ) : (
    <video className="h5-video" src={video.src} poster={video.poster} controls playsInline preload="none" aria-label={label} />
  );
}

function Hero() {
  return (
    <section className="h5-hero" id="top">
      <span id="inicio" />
      <div className="wrap">
        <div className="h5-hero-copy">
          <h1>{HOME5.hero.h1}</h1>
          <p className="lede">{HOME5.hero.lede}</p>
          <div className="h5-cta">
            <DemoLink section="hero" className="btn btn-primary btn-lg">
              {HOME5.cta}
            </DemoLink>
            <a className="btn btn-secondary btn-lg" href="#probalo">
              <Icon name="scan" />
              {HOME5.hero.secondary}
            </a>
          </div>
        </div>
        <div className="h5-hero-media">
          {MEDIA.founderVideo ? (
            <figure>
              <VideoPlayer video={MEDIA.founderVideo} label="Presentación de SHIPSAFE por José Cáceres y Walter Rodríguez" />
              <figcaption>José Cáceres y Walter Rodríguez, fundadores</figcaption>
            </figure>
          ) : (
            <div className="stage">
              <BrowserFrame shot={SHOTS.dashboard} sizes="(max-width: 900px) 100vw, 1040px" priority live />
              <PhoneFrame shot={SHOTS.pChecklist} sizes="250px" priority />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Clientes() {
  return (
    <section className="h5-clientes" aria-label="Clientes">
      <div className="wrap">
        <div className="h5-logos">
          <span>Ya lo usan</span>
          {CASE.logo ? (
            <Image src={CASE.logo} alt={`Logo de ${CASE.name}`} width={245} height={124} unoptimized />
          ) : (
            <b>{CASE.name}</b>
          )}
        </div>
        <p>{HOME5.region}</p>
      </div>
    </section>
  );
}

function Plataforma() {
  return (
    <section className="h5-plataforma" id="plataforma">
      <span id="funcionalidades" />
      <div className="wrap">
        <h2>{HOME5.plataforma.h2}</h2>
        <BrowserFrame shot={SHOTS.dashboardCharts} sizes="(max-width: 1200px) 100vw, 1160px" className="h5-wide" />
        <ul className="h5-chips">
          {HOME5.plataforma.modules.map((m) => (
            <li key={m}>{m}</li>
          ))}
          <li className="more">
            <Link href="/plataforma">
              {HOME5.plataforma.more}
              <Icon name="arrow" />
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

function Flujo() {
  return (
    <section className="h5-flujo" id="como-funciona">
      <span id="flujo" />
      <div className="wrap">
        <h2>{HOME5.flujo.h2}</h2>
        {MEDIA.flowVideo ? (
          <VideoPlayer video={MEDIA.flowVideo} label="Recorrido de un desvío en SHIPSAFE" loop />
        ) : (
          <div className="stage">
            <BrowserFrame shot={SHOTS.desvioDetalle} sizes="(max-width: 900px) 100vw, 980px" />
            <PhoneFrame shot={SHOTS.mDesvioDetalle} sizes="250px" />
          </div>
        )}
        <ol className="h5-steps">
          {HOME5.flujo.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Probalo() {
  return (
    <section className="h5-probalo" id="probalo">
      <div className="wrap">
        <div className="h5-probalo-copy">
          <h2>{HOME5.probalo.h2}</h2>
          <p className="lede">{HOME5.probalo.lede}</p>
          <div className="h5-qr-row">
            <Link className="h5-qr" href="/probalo?utm_source=landing&utm_medium=qr&utm_campaign=probalo" aria-label="Abrir la inspección de prueba">
              <Image src="/qr-probalo.png" alt="Código QR para abrir la inspección de prueba" width={160} height={160} unoptimized />
            </Link>
            <Link className="btn btn-secondary" href="/probalo?utm_source=landing&utm_medium=boton&utm_campaign=probalo">
              <Icon name="phone" />
              {HOME5.probalo.button}
            </Link>
          </div>
        </div>
        <PhoneFrame shot={SHOTS.pChecklist} sizes="260px" />
      </div>
    </section>
  );
}

function Caso() {
  return (
    <section className="h5-caso" id="caso">
      <div className="wrap">
        {MEDIA.testimonialVideo && (
          <VideoPlayer video={MEDIA.testimonialVideo} label={`Testimonio de ${CASE.name}`} />
        )}
        <div className="h5-caso-copy">
          {CASE.logo ? (
            <Image src={CASE.logo} alt={`Logo de ${CASE.name}`} width={245} height={124} unoptimized className="h5-caso-logo" />
          ) : (
            <b>{CASE.name}</b>
          )}
          <p className="h5-claim">{HOME5.caso.claim}</p>
          <p className="h5-meta">
            {HOME5.caso.meta} ·{" "}
            <a className="link" href={CASE.url} target="_blank" rel="noopener noreferrer">
              {CASE.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Nosotros() {
  return (
    <section className="h5-nosotros" id="nosotros">
      <div className="wrap">
        <h2>{HOME5.nosotros.h2}</h2>
        <ul className="h5-team">
          {HOME5.nosotros.team.map((p) => (
            <li key={p.name}>
              {p.photo ? (
                <Image src={p.photo} alt={`Foto de ${p.name}`} width={240} height={300} className="h5-photo" />
              ) : (
                <span className="h5-photo h5-initials" aria-hidden="true">
                  {p.initials}
                </span>
              )}
              <div>
                <h3>{p.name}</h3>
                <span>{p.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Cierre() {
  return (
    <section className="close h5-cierre" id="demo">
      <span id="contacto" />
      <div className="wrap">
        <div className="close-copy">
          <h2>{HOME5.cierre.h2}</h2>
          <p className="lede">{HOME5.cierre.lede}</p>
        </div>
        <div className="panel" id="panel">
          <LeadForm source="home" section="cierre" />
          <div className="wa">
            <a href={whatsappUrl("Hola, quiero agendar una reunión con SHIPSAFE")} target="_blank" rel="noopener noreferrer">
              <Icon name="msg" />
              {HOME5.cierre.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
