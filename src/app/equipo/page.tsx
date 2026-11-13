import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE, OG_IMAGE } from "@/lib/constants";
import { HOME5 } from "@/lib/home-v5";
import SiteShell from "@/components/site/SiteShell";
import DemoLink from "@/components/site/DemoLink";

/**
 * /equipo (13/11/2026): quién está detrás de SHIPSAFE y de los artículos.
 * Google pide saber quién escribe en temas de seguridad (E-E-A-T). Los datos
 * salen de HOME5.nosotros, lo mismo que ya muestra la home: no agregar
 * credenciales que no estén ahí. Los artículos enlazan acá desde la firma.
 */
export const metadata: Metadata = {
  title: `Quiénes somos | ${SITE.name}`,
  description:
    "El equipo detrás de SHIPSAFE: software y producto desde Rosario, y un licenciado en Seguridad e Higiene con más de trece años en SST a cargo del contenido técnico.",
  alternates: { canonical: "/equipo" },
  openGraph: {
    title: `Quiénes somos | ${SITE.name}`,
    description: "El equipo detrás de SHIPSAFE.",
    url: `${SITE.url}/equipo`,
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

function jsonLd(dato: unknown): string {
  return JSON.stringify(dato).replace(/</g, "\\u003c");
}

export default function Page() {
  const { team, partners, partnerLabel } = HOME5.nosotros;
  const personas = team.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.role.split(" · ")[0],
    description: p.bio,
    ...(p.photo ? { image: `${SITE.url}${p.photo}` } : {}),
    ...(p.linkedin ? { sameAs: [p.linkedin] } : {}),
    worksFor: { "@type": "Organization", name: SITE.name, url: SITE.url },
  }));

  return (
    <SiteShell>
      {personas.map((p) => (
        <script key={p.name} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(p) }} />
      ))}
      <main id="main" className="page">
        <div className="narrow">
          <header className="doc-head">
            <div className="eyebrow">Equipo</div>
            <h1>Quiénes estamos detrás de SHIPSAFE</h1>
            <p className="lede">
              SHIPSAFE es una plataforma de gestión de seguridad y salud en el trabajo de Ship
              Software Team, una empresa de software de Argentina. Detrás hay alguien que hace
              software y alguien que hace seguridad e higiene.
            </p>
          </header>

          <article className="prose">
            {team.map((p) => (
              <section key={p.name}>
                <h2>{p.name}</h2>
                {p.photo && (
                  <Image src={p.photo} alt={p.name} width={160} height={160} style={{ borderRadius: 12 }} />
                )}
                <p>
                  <strong>{p.role}</strong>. {p.bio}.
                </p>
                {p.linkedin && (
                  <p>
                    <a href={p.linkedin} target="_blank" rel="noopener noreferrer">
                      Perfil de LinkedIn
                    </a>
                  </p>
                )}
              </section>
            ))}

            <h2>{partnerLabel}</h2>
            {partners.map((p) => (
              <p key={p.name}>
                <strong>{p.name}</strong>, {p.role}. {p.bio}.
              </p>
            ))}

            <h2>Cómo escribimos los artículos</h2>
            <p>
              Cada artículo que cita una norma se escribe leyendo el texto de esa norma en su
              fuente oficial. Si un requisito no se pudo leer en el texto, no se cita. Todos
              cierran con un aviso para verificar la versión vigente en cada país. Ver los{" "}
              <Link href="/blog">artículos del blog</Link>.
            </p>
          </article>

          <aside className="article-cta">
            <div className="eyebrow">Siguiente paso</div>
            <h2>
              Hablemos de <em>tu operación.</em>
            </h2>
            <div className="hero-cta">
              <DemoLink section="equipo" className="btn btn-primary" />
            </div>
          </aside>
        </div>
      </main>
    </SiteShell>
  );
}
