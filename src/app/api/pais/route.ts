import { NextResponse } from "next/server";

/**
 * País del visitante según la IP, para ordenar /blog en el navegador.
 * Vercel lo manda en el header x-vercel-ip-country. No se guarda nada.
 * La página /blog sigue siendo estática para Google: el orden por país se
 * aplica después, en el cliente.
 */
export const dynamic = "force-dynamic";

export function GET(req: Request) {
  const pais = req.headers.get("x-vercel-ip-country") ?? null;
  return NextResponse.json({ pais }, { headers: { "Cache-Control": "private, no-store" } });
}
