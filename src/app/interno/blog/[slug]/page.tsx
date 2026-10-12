import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cuerpoConFaqs, obtenerCualquiera } from "@/lib/blog";
import { cambiarEstadoArticulo } from "../acciones";
import SiteShell from "@/components/site/SiteShell";

export const metadata: Metadata = {
  title: "Vista previa | SHIPSAFE",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function Boton({ slug, estado, texto, primario = false }: { slug: string; estado: string; texto: string; primario?: boolean }) {
  return (
    <form action={cambiarEstadoArticulo}>
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="estado" value={estado} />
      <button type="submit" className={`btn ${primario ? "btn-primary" : "btn-secondary"}`}>
        {texto}
      </button>
    </form>
  );
}

export default async function VistaPrevia({ params }: Props) {
  const { slug } = await params;
  const a = await obtenerCualquiera(slug);
  if (!a) notFound();

  return (
    <SiteShell minimal>
      <main id="main" className="page">
        <div className="narrow">
          <nav className="crumbs" aria-label="Migas de pan">
            <Link href="/interno/blog">Blog interno</Link>
            <span className="sep">/</span>
            <span className="here">{a.estado}</span>
          </nav>

          <aside className="article-cta" style={{ marginTop: 0, marginBottom: 40 }}>
            <div className="eyebrow">Estado: {a.estado}</div>
            {a.palabra_clave && <p>Búsqueda principal: <b>{a.palabra_clave}</b></p>}
            {a.notas_revision && <p>Para revisar: {a.notas_revision}</p>}
            {a.fuentes.length > 0 && (
              <p>
                Fuentes:{" "}
                {a.fuentes.map((f, i) => (
                  <span key={f.url}>
                    {i > 0 && " · "}
                    <a href={f.url} target="_blank" rel="noopener noreferrer">{f.titulo}</a>
                  </span>
                ))}
              </p>
            )}
            <div className="hero-cta">
              {a.estado !== "publicado" && <Boton slug={a.slug} estado="publicado" texto="Publicar" primario />}
              {a.estado === "publicado" && (
                <>
                  <Link href={`/blog/${a.slug}`} className="btn btn-primary">Ver publicado</Link>
                  <Boton slug={a.slug} estado="borrador" texto="Despublicar" />
                </>
              )}
              {a.estado === "borrador" && <Boton slug={a.slug} estado="descartado" texto="Descartar" />}
              {a.estado === "descartado" && <Boton slug={a.slug} estado="borrador" texto="Volver a borrador" />}
            </div>
          </aside>

          <header className="doc-head">
            <div className="eyebrow">Blog</div>
            <h1>{a.titulo}</h1>
            <p className="lede">{a.descripcion}</p>
          </header>

          <article className="prose" dangerouslySetInnerHTML={{ __html: cuerpoConFaqs(a) }} />
        </div>
      </main>
    </SiteShell>
  );
}
