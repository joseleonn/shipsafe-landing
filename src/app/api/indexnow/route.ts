/**
 * GET /api/indexnow (16/11/2026)
 *
 * Avisa a Bing (y a los otros buscadores que usan IndexNow) qué páginas del
 * sitio cambiaron en las últimas 48 horas, leyendo el mismo sitemap que ve
 * Google. Así una página nueva del blog o de un país entra a Bing el mismo
 * día, sin esperar a que pase a rastrear. ChatGPT y Copilot buscan con Bing.
 *
 * Lo dispara el cron diario de vercel.json (Hobby permite uno por día).
 * También se puede llamar a mano con ?todas=1 para mandar el sitemap entero,
 * con el header Authorization: Bearer <WEBHOOK_SHARED_SECRET o CRON_SECRET>.
 *
 * La clave pública de IndexNow está en /public/2bf327fe5bcdd2d4617b63b9bdefdee4.txt: Bing la lee para
 * comprobar que el aviso viene del dueño del sitio. No es un secreto.
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const CLAVE = "2bf327fe5bcdd2d4617b63b9bdefdee4";
const HORAS = 48;

function igual(a: string, b: string): boolean {
  const x = createHash("sha256").update(a).digest();
  const y = createHash("sha256").update(b).digest();
  return timingSafeEqual(x, y);
}

function autorizado(request: Request): boolean {
  // El cron de Vercel manda este user-agent. Si alguien lo imita, lo único que
  // logra es avisarle a Bing de nuestras propias páginas: no hay riesgo.
  if ((request.headers.get("user-agent") ?? "").startsWith("vercel-cron")) return true;
  const header = request.headers.get("authorization") ?? "";
  const recibido = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (!recibido) return false;
  return [process.env.CRON_SECRET, process.env.WEBHOOK_SHARED_SECRET]
    .filter((s): s is string => Boolean(s))
    .some((s) => igual(s, recibido));
}

export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  const todas = new URL(request.url).searchParams.get("todas") === "1";
  const desde = Date.now() - HORAS * 60 * 60 * 1000;
  const entradas = await sitemap();
  const urls = entradas
    .filter((e) => todas || !e.lastModified || new Date(e.lastModified).getTime() >= desde)
    .map((e) => e.url)
    .slice(0, 10000);

  if (urls.length === 0) {
    return NextResponse.json({ ok: true, enviadas: 0 });
  }

  const host = new URL(SITE.url).host;
  const respuesta = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: CLAVE,
      keyLocation: `${SITE.url}/${CLAVE}.txt`,
      urlList: urls,
    }),
  });

  return NextResponse.json({ ok: respuesta.ok, estado: respuesta.status, enviadas: urls.length });
}
