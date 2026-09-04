import type { Metadata } from "next";
import Link from "next/link";
import { SITE, CONSULTORES } from "@/lib/constants";
import SiteShell from "@/components/site/SiteShell";
import Icon from "@/components/site/Icon";
import Reveal from "@/components/site/Reveal";
import ConsultoresForm from "@/components/consultores/ConsultoresForm";

export const metadata: Metadata = {
  title: `Programa de Consultores | ${SITE.name}: gestioná todos tus clientes desde una cuenta`,
  description:
    "Programa de SHIPSAFE para consultores de seguridad e higiene en Argentina: gestioná todas tus empresas-cliente desde una sola cuenta, con datos separados y reportes listos para la ART. Pagás por empresa gestionada.",
  alternates: { canonical: "/consultores" },
  openGraph: {
    title: `Programa de Consultores | ${SITE.name}`,
    description:
      "Gestioná todas tus empresas-cliente desde una sola cuenta. Pagás por empresa gestionada.",
    url: `${SITE.url}/consultores`,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
  },
};

const INCLUYE = [
  "Hasta 3 empresas-cliente con datos y accesos separados",
  "Checklists con QR, capacitaciones y gestión de desvíos",
  "RGRL completo (161 ítems) y reporte mensual por cliente",
  "Onboarding con video y soporte por email",
];

export default function Page() {
  return (
    <SiteShell>
      <main id="main">
        {/* Hero */}
        <section className="page-hero center" id="top">
          <div className="wrap">
            <div className="eyebrow">{CONSULTORES.hero.badge}</div>
            <h1>
              Todos tus clientes, <em>desde una sola cuenta.</em>
            </h1>
            <p className="lede">{CONSULTORES.hero.description}</p>
            <div className="hero-cta">
              <Link href="#aplicar" className="btn btn-primary btn-lg">
                {CONSULTORES.hero.cta}
              </Link>
              <Link href="/#plataforma" className="btn btn-secondary btn-lg">
                Ver la plataforma
              </Link>
            </div>
            <p className="fine">Cupos limitados · Te respondemos en menos de 24 h</p>
          </div>
        </section>

        {/* Dolores del consultor */}
        <section id="dolores">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>01</span>Te suena</div>
              <h2>
                El techo de un consultor <em>es el tiempo administrativo.</em>
              </h2>
            </div>
            <ul className="quotes">
              {CONSULTORES.pains.map((pain, i) => (
                <Reveal as="li" key={pain} className="quote-card" delay={i * 0.06}>
                  <p>{pain}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* Cómo funciona el programa */}
        <section id="como-funciona" className="flow">
          <div className="wrap">
            <div className="sec-head">
              <div className="eyebrow num"><span>02</span>Cómo funciona</div>
              <h2>
                Tres pasos <em>y ya estás gestionando.</em>
              </h2>
            </div>
            <ol className="steps compact">
              {CONSULTORES.steps.map((step, i) => (
                <Reveal as="li" key={step.number} delay={i * 0.08}>
                  <span className="who">
                    <Icon name={i === 0 ? "user" : i === 1 ? "zap" : "check"} />
                    Paso {step.number}
                  </span>
                  <b>{step.title}</b>
                  <p>{step.description}</p>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* Plan */}
        <section id="plan" className="pricing">
          <div className="wrap">
            <div className="sec-head center">
              <div className="eyebrow num"><span>03</span>El plan</div>
              <h2>
                Una suscripción, <em>todos tus clientes.</em>
              </h2>
            </div>
            <div className="plan">
              <Reveal className="tier hi">
                <span className="badge">Consultores</span>
                <div className="name">Profesional</div>
                <div className="from">Desde</div>
                <div className="price">
                  $90.000<small>/ mes</small>
                </div>
                <p className="who">{CONSULTORES.pricing.priceDetail}</p>
                <ul className="inc">
                  {INCLUYE.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <Link href="#aplicar" className="btn btn-primary">
                  {CONSULTORES.hero.cta}
                </Link>
                <p className="note">{CONSULTORES.pricing.note}</p>
                <p className="note">{CONSULTORES.programNote}</p>
              </Reveal>
            </div>
          </div>
        </section>

        <ConsultoresForm />
      </main>
    </SiteShell>
  );
}
