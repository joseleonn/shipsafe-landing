import { Fragment, type CSSProperties } from "react";
import Image from "next/image";
import SocialIcon from "@/components/site/SocialIcon";
import Confianza from "./Confianza";
import PlataformaSpot from "./PlataformaSpot";
import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import MotionCues from "@/components/site/MotionCues";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import { BrowserFrame, PhoneFrame } from "@/components/site/Frames";
import LeadForm from "@/components/home/LeadForm";
import { CASE, SHOTS, whatsappUrl } from "@/lib/home-content";
import Procesos from "./Procesos";
import Expandable from "./Expandable";
import HashScroll from "./HashScroll";
import { HeroTilt, Item, Parallax, Rise, ScrollProgress, Stagger, Tilt, Words } from "./Motion5";
import { HOME5, MEDIA, SHOW_VIDEO_PLACEHOLDERS, TESTIMONIOS, type Video } from "@/lib/home-v5";

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
      <ScrollProgress />
      <HashScroll />
      <main id="main">
        <Hero />
        <Confianza />
        <PlataformaSpot />
        <Procesos />
        <Probalo />
        <Caso />
        <Testimonios />
        <Nosotros />
        <Cierre />
      </main>
      <StickyBar label={HOME5.cta} />
      <MotionCues />
    </SiteShell>
  );
}

function VideoPlayer(props: { video: NonNullable<Video>; label: string; loop?: boolean }) {
  return (
    <Expandable media={{ kind: "video", src: props.video.src, webm: props.video.webm, poster: props.video.poster, label: props.label }}>
      <VideoTag {...props} />
    </Expandable>
  );
}

function VideoTag({ video, label, loop = false }: { video: NonNullable<Video>; label: string; loop?: boolean }) {
  return loop ? (
    <video className="h5-video" src={video.src} poster={video.poster} autoPlay muted loop playsInline preload="metadata" aria-label={label} />
  ) : (
    <video className="h5-video" poster={video.poster} controls playsInline preload="none" aria-label={label}>
      {video.webm && <source src={video.webm} type="video/webm" />}
      <source src={video.src} type="video/mp4" />
    </video>
  );
}

/** Recuadro de vista previa para un video que todavía no existe. */
export function VideoPlaceholder({ label, ratio = "16/9", dark = false }: { label: string; ratio?: string; dark?: boolean }) {
  return (
    <div className={`h5-vph ${dark ? "dark" : ""}`} style={{ aspectRatio: ratio }} role="img" aria-label={`Lugar reservado: ${label}`}>
      <span className="h5-vph-badge">Video pendiente</span>
      <span className="h5-vph-play" aria-hidden="true">
        <Icon name="play" />
      </span>
      <span className="h5-vph-label">{label}</span>
    </div>
  );
}

/** Palabras del h1 con entrada escalonada por CSS (no depende de JavaScript). */
function HeroWords({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <Fragment key={i}>
          <span className="hw" style={{ "--i": i + offset } as CSSProperties}>
            {w}
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

function Hero() {
  return (
    <section className="h5-hero" id="top">
      <span id="inicio" />
      <div className="hero-bg" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="wrap">
        <div className="h5-hero-copy">
          <h1>
            <HeroWords text={HOME5.hero.h1} />
            <em>
              <HeroWords text={HOME5.hero.h1Accent} offset={HOME5.hero.h1.split(" ").length} />
            </em>
          </h1>
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
          <HeroTilt>
          {MEDIA.founderVideo || SHOW_VIDEO_PLACEHOLDERS ? (
            <figure>
              {MEDIA.founderVideo ? (
                <VideoPlayer video={MEDIA.founderVideo} label="Video de SHIPSAFE: lo que pide el auditor del cliente y cómo tenerlo a mano" />
              ) : (
                <VideoPlaceholder label="José y Walter a cámara · 60 a 90 s · con subtítulos" dark />
              )}
              <figcaption>Lo que pide el auditor, y cómo tenerlo a mano · 1:33</figcaption>
            </figure>
          ) : (
            <div className="stage">
              <Expandable media={{ kind: "image", src: SHOTS.dashboard.src, alt: SHOTS.dashboard.alt, width: SHOTS.dashboard.width, height: SHOTS.dashboard.height }}><BrowserFrame shot={SHOTS.dashboard} sizes="(max-width: 900px) 100vw, 1040px" priority live /></Expandable>
              <PhoneFrame shot={SHOTS.pChecklist} sizes="250px" priority />
            </div>
          )}
          </HeroTilt>
        </div>
      </div>
    </section>
  );
}

function Probalo() {
  return (
    <section className="h5-probalo" id="probalo">
      <div className="wrap">
        <div className="h5-probalo-copy">
          <h2>
          <Words text={HOME5.probalo.h2} accent={HOME5.probalo.h2Accent} />
        </h2>
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
        <Parallax className="h5-probalo-phone" speed={70}>
          <PhoneFrame shot={SHOTS.pChecklist} sizes="260px" />
        </Parallax>
      </div>
    </section>
  );
}

function Caso() {
  return (
    <section className="h5-caso" id="caso">
      <div className="wrap">
        <Rise className="h5-caso-card">
          <div className="h5-caso-copy">
            <span className="h5-tag">Caso real</span>
            {CASE.logo ? (
              <Image src={CASE.logo} alt={`Logo de ${CASE.name}`} width={245} height={124} unoptimized className="h5-caso-logo" />
            ) : (
              <b>{CASE.name}</b>
            )}
            <p className="h5-claim">
              De Excel a <em>flota, EPP y accidentes</em> en una misma plataforma.
            </p>
            <Stagger className="h5-caso-facts">
              {CASE.facts.map((f) => (
                <Item key={f}>{f}</Item>
              ))}
            </Stagger>
            <p className="h5-meta">
              {HOME5.caso.meta} ·{" "}
              <a className="link" href={CASE.url} target="_blank" rel="noopener noreferrer">
                {CASE.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </p>
          </div>
          <div className="h5-caso-media">
            {MEDIA.testimonialVideo ? (
              <VideoPlayer video={MEDIA.testimonialVideo} label={`Testimonio de ${CASE.name}`} />
            ) : SHOW_VIDEO_PLACEHOLDERS ? (
              <VideoPlaceholder label="Responsable de HSE de SW Petrol · cómo registraban antes y qué usan hoy · 60 s" dark />
            ) : (
              <div className="stage">
                <Expandable media={{ kind: "image", src: SHOTS.accidentes.src, alt: SHOTS.accidentes.alt, width: SHOTS.accidentes.width, height: SHOTS.accidentes.height }}><BrowserFrame shot={SHOTS.accidentes} sizes="(max-width: 900px) 100vw, 640px" /></Expandable>
                <PhoneFrame shot={SHOTS.mEpp} sizes="200px" />
              </div>
            )}
          </div>
        </Rise>
      </div>
    </section>
  );
}

function Testimonios() {
  const items = SHOW_VIDEO_PLACEHOLDERS ? TESTIMONIOS : TESTIMONIOS.filter((t) => t.video);
  if (items.length === 0) return null;
  return (
    <section className="h5-testimonios" id="testimonios">
      <div className="wrap">
        <h2>
          <Words text={HOME5.testimonios.h2} accent={HOME5.testimonios.h2Accent} />
        </h2>
        <Stagger className="h5-testi-grid" gap={0.12}>
          {items.map((t, i) => (
            <Item key={i} className="h5-testi">
              {t.video ? (
                <VideoPlayer video={t.video} label={`Testimonio de ${t.name}, ${t.company}`} />
              ) : (
                <VideoPlaceholder label={`${t.company} · 40 a 60 s`} ratio="4/5" dark />
              )}
              <blockquote>{t.quote}</blockquote>
              <div className="h5-testi-who">
                <b>{t.name}</b>
                <span>
                  {t.role} · {t.company}
                </span>
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Nosotros() {
  return (
    <section className="h5-nosotros" id="nosotros">
      <div className="wrap">
        <h2>
          <Words text={HOME5.nosotros.h2} accent={HOME5.nosotros.h2Accent} />
        </h2>
        <Stagger className="h5-team" gap={0.15}>
          {HOME5.nosotros.team.map((p) => (
            <Item key={p.name}>
              {p.photo ? (
                <Image src={p.photo} alt={`Foto de ${p.name}`} width={240} height={240} className="h5-photo" />
              ) : (
                <span className="h5-photo h5-initials" aria-hidden="true">
                  {p.initials}
                </span>
              )}
              <div>
                <h3>{p.name}</h3>
                <span>{p.role}</span>
                <b className="h5-bio">{p.bio}</b>
                {p.linkedin && (
                  <a className="h5-in" href={p.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn de ${p.name}`}>
                    <SocialIcon id="linkedin" size={16} />
                    LinkedIn
                  </a>
                )}
              </div>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function Cierre() {
  return (
    <section className="close h5-cierre" id="demo">
      <span id="contacto" />
      <div className="wrap">
        <div className="close-copy">
          <h2>
          <Words text={HOME5.cierre.h2} accent={HOME5.cierre.h2Accent} />
        </h2>
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
