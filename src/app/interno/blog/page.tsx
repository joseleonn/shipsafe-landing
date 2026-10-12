import type { Metadata } from "next";
import Link from "next/link";
import { blogConfigurado, listarTodos } from "@/lib/blog";
import SiteShell from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Blog (interno) | SHIPSAFE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const ROTULO = { borrador: "Para revisar", publicado: "Publicado", descartado: "Descartado" } as const;

function fecha(iso: string | null) {
  return iso ? new Date(iso).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }) : "";
}

export default async function BlogInterno() {
  if (!blogConfigurado()) {
    return (
      <SiteShell minimal>
        <main id="main" className="page">
          <div className="narrow prose">
            <h1>Falta configurar el blog</h1>
            <p>
              Falta <code>DATABASE_URL</code> en las variables de entorno de Vercel (la carga la integración de Neon) y
              correr <code>docs/blog-neon.sql</code> en esa base.
            </p>
          </div>
        </main>
      </SiteShell>
    );
  }

  const articulos = await listarTodos();
  const orden = { borrador: 0, publicado: 1, descartado: 2 } as const;
  articulos.sort((a, b) => orden[a.estado] - orden[b.estado]);

  return (
    <SiteShell minimal>
      <main id="main" className="page">
        <div className="narrow">
          <header className="doc-head">
            <div className="eyebrow">Interno</div>
            <h1>Blog</h1>
            <p className="lede">
              Los borradores esperan acá hasta que los revisás. Abrí uno, leelo como va a quedar y publicalo con un botón.
            </p>
          </header>

          {articulos.length === 0 ? (
            <p>Todavía no hay artículos.</p>
          ) : (
            <div className="cards">
              {articulos.map((a) => (
                <Link key={a.slug} href={`/interno/blog/${a.slug}`} className="card">
                  <div className="k">
                    {ROTULO[a.estado]}
                    {a.estado === "publicado" ? ` · ${fecha(a.fecha_publicacion)}` : ` · ${fecha(a.actualizado)}`}
                  </div>
                  <h3>{a.titulo}</h3>
                  <p>{a.palabra_clave ? `Búsqueda: ${a.palabra_clave}` : a.descripcion}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </SiteShell>
  );
}
