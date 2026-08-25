import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, sesionValida } from "@/lib/dashboard/auth";

/**
 * Puerta del dashboard.
 *
 * Corre antes de renderizar cualquier cosa bajo /dashboard. La verificación de
 * la cookie es criptográfica (HMAC), no un "tiene la cookie puesta": una cookie
 * inventada a mano no pasa.
 *
 * /dashboard/login queda afuera por razones obvias, y /api/dashboard/login
 * también, porque es el endpoint que emite la sesión.
 */
export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_SESION)?.value;
  if (await sesionValida(cookie)) return NextResponse.next();

  const login = new URL("/dashboard/login", req.url);
  // Para volver a donde iba después de entrar. Solo rutas internas: si
  // aceptáramos una URL completa, esto sería un redirect abierto.
  const destino = req.nextUrl.pathname + req.nextUrl.search;
  if (destino.startsWith("/dashboard") && !destino.startsWith("//")) {
    login.searchParams.set("volver", destino);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/((?!login).*)", "/dashboard"],
};
