"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NOMBRE_PAIS, type PaisBlog } from "@/lib/blog-seo";

export interface ItemBlog {
  slug: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  pais: PaisBlog;
}

const FILTROS: (PaisBlog | "TODOS")[] = ["TODOS", "AR", "MX", "CO"];
const CONOCIDOS = new Set<string>(["AR", "MX", "CO"]);

/**
 * Lista de /blog con filtro por país.
 *
 * El HTML del servidor trae todos los artículos en orden de fecha (es lo que
 * ve Google). En el navegador se pregunta el país por IP a /api/pais y, si es
 * uno de los que tienen artículos propios, se ponen primero los de ese país y
 * después los generales. Elegir un país en el filtro muestra los de ese país
 * más los que sirven para cualquiera.
 */
export default function BlogLista({ items }: { items: ItemBlog[] }) {
  const [filtro, setFiltro] = useState<PaisBlog | "TODOS">("TODOS");
  const [visitante, setVisitante] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch("/api/pais")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (vivo && d?.pais && CONOCIDOS.has(d.pais)) setVisitante(d.pais);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  const lista = useMemo(() => {
    const filtrados =
      filtro === "TODOS" ? items : items.filter((a) => a.pais === filtro || a.pais === "LATAM");
    if (!visitante || filtro !== "TODOS") return filtrados;
    const peso = (a: ItemBlog) => (a.pais === visitante ? 0 : a.pais === "LATAM" ? 1 : 2);
    return [...filtrados].sort((a, b) => peso(a) - peso(b)); // sort estable: dentro de cada grupo queda el orden por fecha
  }, [items, filtro, visitante]);

  return (
    <>
      <div className="blog-filtro" role="group" aria-label="Filtrar por país">
        {FILTROS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filtro === f}
            onClick={() => setFiltro(f)}
          >
            {f === "TODOS" ? "Todos" : NOMBRE_PAIS[f]}
          </button>
        ))}
      </div>
      <div className="cards">
        {lista.map((a) => (
          <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
            <div className="k">
              {NOMBRE_PAIS[a.pais]}
              {a.fecha ? ` · ${a.fecha}` : ""}
            </div>
            <h3>{a.titulo}</h3>
            <p>{a.descripcion}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
