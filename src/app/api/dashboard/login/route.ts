import { NextResponse } from "next/server";
import {
  COOKIE_SESION,
  contrasenaCorrecta,
  emitirSesion,
  configuracionFaltante,
} from "@/lib/dashboard/auth";

/**
 * Intentos por instancia. No es un rate limit serio —en serverless cada
 * instancia tiene su propio contador y Vercel levanta varias— pero corta el
 * script tonto que prueba mil contraseñas contra la misma instancia. Un rate
 * limit real necesitaría Redis, y para una sola contraseña larga no lo vale.
 */
const intentos = new Map<string, { n: number; hasta: number }>();
const MAX_INTENTOS = 8;
const BLOQUEO_MS = 10 * 60 * 1000;

function ipDe(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "desconocida";
}

export async function POST(req: Request) {
  const faltan = configuracionFaltante();
  if (faltan.length > 0) {
    console.error("[dashboard] falta configurar:", faltan.join(", "));
    return NextResponse.json({ ok: false, error: "sin_configurar" }, { status: 503 });
  }

  const ip = ipDe(req);
  const estado = intentos.get(ip);
  if (estado && estado.n >= MAX_INTENTOS && Date.now() < estado.hasta) {
    return NextResponse.json({ ok: false, error: "demasiados_intentos" }, { status: 429 });
  }

  let password = "";
  try {
    const body = (await req.json()) as { password?: string };
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ ok: false, error: "cuerpo_invalido" }, { status: 400 });
  }

  if (!(await contrasenaCorrecta(password))) {
    const n = (estado && Date.now() < estado.hasta ? estado.n : 0) + 1;
    intentos.set(ip, { n, hasta: Date.now() + BLOQUEO_MS });
    // Demora fija: hace mucho más lento probar contraseñas y no le cuesta nada
    // a quien la sabe.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, error: "password_incorrecta" }, { status: 401 });
  }

  intentos.delete(ip);

  const sesion = await emitirSesion();
  if (!sesion) {
    return NextResponse.json({ ok: false, error: "sin_configurar" }, { status: 503 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, sesion.valor, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: sesion.maxAge,
  });
  return res;
}

/** Cerrar sesión: borra la cookie. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESION, "", { path: "/", maxAge: 0 });
  return res;
}
