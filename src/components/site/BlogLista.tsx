"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { NOMBRE_PAIS, PAISES, esCodigoPais, type CodigoPais, type PaisBlog } from "@/lib/blog-seo";

export interface ItemBlog {
  slug: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  pais: PaisBlog;
}

type Filtro = CodigoPais | "TODOS";

const CODIGOS = Object.keys(PAISES) as CodigoPais[];

/**
 * Lista de /blog con filtro por país.
 *
 * El HTML del servidor trae todos los artículos en orden de fecha (es lo que
 * ve Google). En el navegador se pregunta el país por IP a /api/pais y, si es
 * de Latinoamérica, se elige ese país en el filtro. Un país muestra sus
 * artículos propios más los que sirven para cualquiera; si todavía no tiene
 * propios, lo dice.
 */
export default function BlogLista({ items }: { items: ItemBlog[] }) {
  const [filtro, setFiltro] = useState<Filtro>("TODOS");

  useEffect(() => {
    let vivo = true;
    fetch("/api/pais")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (vivo && esCodigoPais(d?.pais)) setFiltro(d.pais);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  const conArticulos = useMemo(() => new Set(items.map((a) => a.pais)), [items]);

  const { propios, generales } = useMemo(() => {
    if (filtro === "TODOS") return { propios: items, generales: [] as ItemBlog[] };
    return {
      propios: items.filter((a) => a.pais === filtro),
      generales: items.filter((a) => a.pais === "LATAM"),
    };
  }, [items, filtro]);

  const tarjeta = (a: ItemBlog) => (
    <Link key={a.slug} href={`/blog/${a.slug}`} className="card">
      <div className="k">
        {NOMBRE_PAIS[a.pais]}
        {a.fecha ? ` · ${a.fecha}` : ""}
      </div>
      <h3>{a.titulo}</h3>
      <p>{a.descripcion}</p>
    </Link>
  );

  return (
    <>
      <div className="blog-filtro">
        <label htmlFor="blog-pais">País</label>
        <select id="blog-pais" value={filtro} onChange={(e) => setFiltro(e.target.value as Filtro)}>
          <option value="TODOS">Todos los países</option>
          {CODIGOS.map((c) => (
            <option key={c} value={c}>
              {PAISES[c]}
              {conArticulos.has(c) ? "" : " (próximamente)"}
            </option>
          ))}
        </select>
      </div>

      {filtro !== "TODOS" && propios.length === 0 && (
        <p className="blog-pronto">
          Todavía no publicamos artículos sobre la normativa de {PAISES[filtro]}. Estamos preparando los primeros.
          Mientras tanto, estos sirven para cualquier país de la región:
        </p>
      )}

      <div className="cards">
        {propios.map(tarjeta)}
        {generales.map(tarjeta)}
      </div>
    </>
  );
}
