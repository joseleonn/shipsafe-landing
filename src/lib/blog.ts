/**
 * Blog de la landing: artículos guardados en Postgres (Neon).
 *
 * Solo servidor. Se conecta con el driver HTTP de Neon usando DATABASE_URL
 * (la carga sola la integración de Neon en Vercel). Nunca importar desde un
 * componente de cliente: la cadena de conexión no puede llegar al navegador.
 *
 * Si falta la configuración o la base no responde, las lecturas devuelven
 * vacío en lugar de romper la página: el sitio sigue andando sin blog. La
 * base se apaga sola cuando no se usa y se vuelve a prender en la primera
 * consulta (medio segundo de espera, nada más).
 */

import { neon } from "@neondatabase/serverless";
import { SEMILLAS } from "./blog-semillas";

export type EstadoArticulo = "borrador" | "publicado" | "descartado";

export interface Faq {
  pregunta: string;
  respuesta: string;
}

export interface Fuente {
  titulo: string;
  url: string;
}

export interface Articulo {
  id: string;
  slug: string;
  titulo: string;
  descripcion: string;
  contenido_html: string;
  faqs: Faq[];
  palabra_clave: string | null;
  fuentes: Fuente[];
  notas_revision: string | null;
  estado: EstadoArticulo;
  fecha_publicacion: string | null;
  creado: string;
  actualizado: string;
}

/** Lo que alcanza para listar: sin el cuerpo. */
export type ArticuloResumen = Pick<
  Articulo,
  "slug" | "titulo" | "descripcion" | "estado" | "fecha_publicacion" | "actualizado" | "palabra_clave"
>;

const CAMPOS_RESUMEN = "slug, titulo, descripcion, estado, fecha_publicacion, actualizado, palabra_clave";

/** Cada cuánto se regenera una página del blog aunque nadie publique nada. */
export const REVALIDAR_BLOG = 3600;

export const SLUG_VALIDO = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * La integración de Neon en Vercel arma los nombres como <prefijo>_DATABASE_URL.
 * Con el prefijo BLOG_DATABASE queda BLOG_DATABASE_DATABASE_URL (la conexión
 * con pooling, la indicada para serverless).
 */
function urlBase(): string | undefined {
  return (
    process.env.BLOG_DATABASE_URL ||
    process.env.BLOG_DATABASE_DATABASE_URL ||
    process.env.BLOG_DATABASE_POSTGRES_URL ||
    process.env.DATABASE_URL
  );
}

export function blogConfigurado(): boolean {
  return Boolean(urlBase());
}

function sql() {
  const url = urlBase();
  if (!url) throw new Error("Falta DATABASE_URL");
  return neon(url);
}

/**
 * La tabla se crea sola la primera vez que la landing habla con la base: no
 * hay que correr nada a mano. Es idempotente (IF NOT EXISTS) y corre una vez
 * por instancia del servidor. Si falla, se reintenta en la próxima consulta.
 * docs/blog-neon.sql tiene el mismo esquema, por si se quiere crear a mano.
 */
let tablaLista: Promise<void> | null = null;

function asegurarTabla(): Promise<void> {
  tablaLista ??= (async () => {
    const q = sql();
    await q.query(`create table if not exists articulos (
      id                uuid primary key default gen_random_uuid(),
      slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
      titulo            text not null,
      descripcion       text not null,
      contenido_html    text not null,
      faqs              jsonb not null default '[]',
      palabra_clave     text,
      fuentes           jsonb not null default '[]',
      notas_revision    text,
      estado            text not null default 'borrador' check (estado in ('borrador', 'publicado', 'descartado')),
      fecha_publicacion timestamptz,
      creado            timestamptz not null default now(),
      actualizado       timestamptz not null default now()
    )`);
    await q.query("create index if not exists articulos_estado_fecha on articulos (estado, fecha_publicacion desc)");
    // Los primeros borradores vienen en el código (blog-semillas.ts). No pisan nada.
    for (const b of SEMILLAS) {
      await q.query(
        `insert into articulos (slug, titulo, descripcion, contenido_html, faqs, palabra_clave, fuentes, notas_revision, estado)
         values ($1, $2, $3, $4, $5::jsonb, $6, $7::jsonb, $8, 'borrador')
         on conflict (slug) do nothing`,
        [
          b.slug,
          b.titulo,
          b.descripcion,
          b.contenido_html,
          JSON.stringify(b.faqs ?? []),
          b.palabra_clave ?? null,
          JSON.stringify(b.fuentes ?? []),
          b.notas_revision ?? null,
        ],
      );
    }
  })().catch((error) => {
    tablaLista = null;
    throw error;
  });
  return tablaLista;
}

/** El driver devuelve las fechas como Date; acá todo viaja como texto ISO. */
function normalizar<T>(fila: Record<string, unknown>): T {
  const salida: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fila)) salida[k] = v instanceof Date ? v.toISOString() : v;
  return salida as T;
}

async function leer<T>(texto: string, params: unknown[] = []): Promise<T[]> {
  if (!blogConfigurado()) return [];
  try {
    await asegurarTabla();
    const filas = (await sql().query(texto, params)) as Record<string, unknown>[];
    return filas.map((f) => normalizar<T>(f));
  } catch (error) {
    console.error("[blog] No se pudo leer de la base", error);
    return [];
  }
}

/** Publicados, el más nuevo primero. Para /blog, el sitemap y llms.txt. */
export async function listarPublicados(): Promise<ArticuloResumen[]> {
  return leer<ArticuloResumen>(
    `select ${CAMPOS_RESUMEN} from articulos where estado = 'publicado' order by fecha_publicacion desc`,
  );
}

export async function obtenerPublicado(slug: string): Promise<Articulo | null> {
  if (!SLUG_VALIDO.test(slug)) return null;
  const [fila] = await leer<Articulo>(
    "select * from articulos where slug = $1 and estado = 'publicado' limit 1",
    [slug],
  );
  return fila ?? null;
}

/** Todos. Solo para /interno/blog. */
export async function listarTodos(): Promise<ArticuloResumen[]> {
  return leer<ArticuloResumen>(`select ${CAMPOS_RESUMEN} from articulos order by creado desc`);
}

/** Cualquier estado. Solo para la vista previa interna y las escrituras. */
export async function obtenerCualquiera(slug: string): Promise<Articulo | null> {
  if (!SLUG_VALIDO.test(slug)) return null;
  const [fila] = await leer<Articulo>("select * from articulos where slug = $1 limit 1", [slug]);
  return fila ?? null;
}

/**
 * Cambia el estado. Al publicar por primera vez se fija la fecha de
 * publicación; si se despublica y se vuelve a publicar, se conserva la
 * original para no mentirle a Google sobre cuándo salió.
 */
export async function cambiarEstado(slug: string, estado: EstadoArticulo): Promise<void> {
  if (!SLUG_VALIDO.test(slug)) throw new Error("Slug inválido");
  await asegurarTabla();
  const filas = (await sql().query(
    `update articulos
        set estado = $2,
            actualizado = now(),
            fecha_publicacion = case when $2 = 'publicado' and fecha_publicacion is null then now() else fecha_publicacion end
      where slug = $1
      returning slug`,
    [slug, estado],
  )) as unknown[];
  if (!filas.length) throw new Error("No existe el artículo");
}

export interface BorradorEntrante {
  slug: string;
  titulo: string;
  descripcion: string;
  contenido_html: string;
  faqs?: Faq[];
  palabra_clave?: string | null;
  fuentes?: Fuente[];
  notas_revision?: string | null;
}

/**
 * Crea o reemplaza un borrador. Si ya existe uno publicado con ese slug, no lo
 * toca: un artículo publicado solo se cambia a mano, después de revisarlo.
 */
export async function guardarBorrador(b: BorradorEntrante): Promise<{ creado: boolean }> {
  await asegurarTabla();
  const filas = (await sql().query(
    `insert into articulos (slug, titulo, descripcion, contenido_html, faqs, palabra_clave, fuentes, notas_revision, estado)
     values ($1, $2, $3, $4, $5::jsonb, $6, $7::jsonb, $8, 'borrador')
     on conflict (slug) do update set
       titulo = excluded.titulo,
       descripcion = excluded.descripcion,
       contenido_html = excluded.contenido_html,
       faqs = excluded.faqs,
       palabra_clave = excluded.palabra_clave,
       fuentes = excluded.fuentes,
       notas_revision = excluded.notas_revision,
       estado = 'borrador',
       actualizado = now()
     where articulos.estado <> 'publicado'
     returning (xmax = 0) as creado`,
    [
      b.slug,
      b.titulo,
      b.descripcion,
      b.contenido_html,
      JSON.stringify(b.faqs ?? []),
      b.palabra_clave ?? null,
      JSON.stringify(b.fuentes ?? []),
      b.notas_revision ?? null,
    ],
  )) as { creado: boolean }[];
  // Sin filas: el conflicto chocó con un artículo publicado y el WHERE lo frenó.
  if (!filas.length) throw new Error("Ya hay un artículo publicado con ese slug");
  return { creado: filas[0].creado };
}

/** Escapa texto plano para meterlo en HTML (las FAQ se escriben como texto). */
export function escaparHtml(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Cuerpo final del artículo: el contenido más la sección de preguntas
 * frecuentes visible. Google exige que el FAQPage del structured data
 * corresponda a contenido que se ve en la página, así que se arman juntos.
 */
export function cuerpoConFaqs(a: Pick<Articulo, "contenido_html" | "faqs">): string {
  if (!a.faqs?.length) return a.contenido_html;
  const faqs = a.faqs
    .map((f) => `<h3>${escaparHtml(f.pregunta)}</h3><p>${escaparHtml(f.respuesta)}</p>`)
    .join("");
  return `${a.contenido_html}<h2>Preguntas frecuentes</h2>${faqs}`;
}
