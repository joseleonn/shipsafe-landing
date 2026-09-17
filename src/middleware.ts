import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_SESION, sesionValida } from "@/lib/dashboard/auth";

/**
 * Puerta de lo interno: /dashboard y /interno.
 *
 * Corre antes de renderizar. La verificación de la cookie es criptográfica
 * (HMAC), no un "tiene la cookie puesta": una cookie inventada a mano no pasa.
 *
 * /dashboard/login queda afuera por razones obvias, y /api/dashboard/login
 * también, porque es el endpoint que emite la sesión.
 *
 * /interno usa esta misma sesión y no una basic auth aparte: es la misma
 * gente, con una contraseña sola y un solo lugar donde revocarla. Una basic
 * auth manda el usuario y la contraseña en cada pedido, no tiene forma de
 * cerrar sesión, y sumaría un segundo secreto que mantener sincronizado.
 */
export async function middleware(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_SESION)?.value;
  if (await sesionValida(cookie)) return NextResponse.next();

  const login = new URL("/dashboard/login", req.url);
  // Para volver a donde iba después de entrar. Solo rutas internas: si
  // aceptáramos una URL completa, esto sería un redirect abierto.
  const destino = req.nextUrl.pathname + req.nextUrl.search;
  const interna = destino.startsWith("/dashboard") || destino.startsWith("/interno");
  if (interna && !destino.startsWith("//")) {
    login.searchParams.set("volver", destino);
  }
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/dashboard/((?!login).*)", "/dashboard", "/interno/:path*", "/interno"],
};
