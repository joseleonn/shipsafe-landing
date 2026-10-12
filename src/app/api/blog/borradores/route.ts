import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { guardarBorrador, SLUG_VALIDO, type Faq, type Fuente } from "@/lib/blog";

/**
 * Entrada de borradores del blog: la usa la tarea semanal que escribe los
 * artículos (o un flujo de n8n). Nunca publica: todo entra como 'borrador' y
 * se revisa en /interno/blog.
 *
 *   POST /api/blog/borradores
 *   Authorization: Bearer <BLOG_INGEST_SECRET>
 *   { slug, titulo, descripcion, contenido_html, faqs?, palabra_clave?, fuentes?, notas_revision? }
 */

function autorizado(req: Request): boolean {
  const secreto = process.env.BLOG_INGEST_SECRET;
  if (!secreto) return false;
  const recibido = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const a = Buffer.from(recibido);
  const b = Buffer.from(secreto);
  return a.length === b.length && timingSafeEqual(a, b);
}

const texto = (v: unknown, max: number) => (typeof v === "string" && v.trim() && v.length <= max ? v.trim() : null);

function faqsValidas(v: unknown): Faq[] | null {
  if (v === undefined) return [];
  if (!Array.isArray(v) || v.length > 12) return null;
  const faqs = v.map((f) => ({ pregunta: texto(f?.pregunta, 300), respuesta: texto(f?.respuesta, 1500) }));
  return faqs.every((f) => f.pregunta && f.respuesta) ? (faqs as Faq[]) : null;
}

function fuentesValidas(v: unknown): Fuente[] | null {
  if (v === undefined) return [];
  if (!Array.isArray(v) || v.length > 30) return null;
  const fuentes = v.map((f) => ({ titulo: texto(f?.titulo, 300), url: texto(f?.url, 1000) }));
  return fuentes.every((f) => f.titulo && f.url && /^https?:\/\//.test(f.url)) ? (fuentes as Fuente[]) : null;
}

export async function POST(req: Request) {
  if (!autorizado(req)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug : "";
  const titulo = texto(body.titulo, 140);
  const descripcion = texto(body.descripcion, 300);
  const contenido_html = texto(body.contenido_html, 100_000);
  const faqs = faqsValidas(body.faqs);
  const fuentes = fuentesValidas(body.fuentes);

  const errores = [
    !SLUG_VALIDO.test(slug) && "slug (minúsculas, números y guiones)",
    !titulo && "titulo (hasta 140 caracteres)",
    !descripcion && "descripcion (hasta 300 caracteres)",
    !contenido_html && "contenido_html",
    !faqs && "faqs ([{ pregunta, respuesta }], hasta 12)",
    !fuentes && "fuentes ([{ titulo, url }])",
    /<script/i.test(String(body.contenido_html ?? "")) && "contenido_html no puede tener <script>",
  ].filter(Boolean);
  if (errores.length) return NextResponse.json({ error: "Campos inválidos", campos: errores }, { status: 422 });

  try {
    const { creado } = await guardarBorrador({
      slug,
      titulo: titulo!,
      descripcion: descripcion!,
      contenido_html: contenido_html!,
      faqs: faqs!,
      fuentes: fuentes!,
      palabra_clave: texto(body.palabra_clave, 200),
      notas_revision: texto(body.notas_revision, 4000),
    });
    revalidatePath("/interno/blog");
    return NextResponse.json({ ok: true, creado, revisar: `/interno/blog/${slug}` }, { status: creado ? 201 : 200 });
  } catch (error) {
    const mensaje = error instanceof Error ? error.message : "Error desconocido";
    const status = mensaje.includes("publicado") ? 409 : 500;
    return NextResponse.json({ error: mensaje }, { status });
  }
}
