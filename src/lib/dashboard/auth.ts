/**
 * Autenticación del dashboard.
 *
 * Una sola contraseña compartida, sin base de datos y sin usuarios. Es
 * deliberado: el dashboard no muestra datos de terceros, muestra los números
 * del propio negocio, y montar un sistema de cuentas para dos personas cuesta
 * más de lo que protege.
 *
 * Todo acá usa Web Crypto (crypto.subtle) y NO el módulo `crypto` de Node,
 * porque el middleware corre en el runtime Edge y ahí `crypto` no existe.
 * Si algún día movés esto a un route handler de Node, sigue funcionando igual:
 * Web Crypto está en los dos runtimes. Al revés no.
 */

export const COOKIE_SESION = "ss_dash";

/** Días que dura la sesión antes de volver a pedir la contraseña. */
const VIGENCIA_DIAS = 7;

const enc = new TextEncoder();

function claveDeFirma(): string | null {
  const s = process.env.DASHBOARD_SECRET;
  // Menos de 32 caracteres no es un secreto, es una contraseña. Preferimos
  // fallar cerrado: sin secreto válido, nadie entra.
  return s && s.length >= 32 ? s : null;
}

async function hmacHex(mensaje: string, clave: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(clave),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const firma = await crypto.subtle.sign("HMAC", key, enc.encode(mensaje));
  return Array.from(new Uint8Array(firma))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Comparación en tiempo constante.
 *
 * Con `===` el tiempo de respuesta depende de cuántos caracteres coinciden, y
 * eso alcanza para adivinar una firma byte por byte. Acá siempre recorremos
 * todo.
 */
function igualSeguro(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let dif = 0;
  for (let i = 0; i < a.length; i++) dif |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return dif === 0;
}

/** Valor de la cookie para una sesión que arranca ahora. */
export async function emitirSesion(): Promise<{ valor: string; maxAge: number } | null> {
  const clave = claveDeFirma();
  if (!clave) return null;

  const maxAge = VIGENCIA_DIAS * 24 * 60 * 60;
  const expira = Date.now() + maxAge * 1000;
  const firma = await hmacHex(`v1:${expira}`, clave);
  return { valor: `${expira}.${firma}`, maxAge };
}

/** ¿La cookie es nuestra y todavía no venció? */
export async function sesionValida(cookie: string | undefined): Promise<boolean> {
  const clave = claveDeFirma();
  if (!clave || !cookie) return false;

  const [expiraTexto, firma] = cookie.split(".");
  if (!expiraTexto || !firma) return false;

  const expira = Number(expiraTexto);
  if (!Number.isFinite(expira) || expira < Date.now()) return false;

  // La firma se verifica SIEMPRE, incluso si la fecha ya falló arriba por otra
  // vía, para no filtrar por tiempo de respuesta si la cookie era válida.
  const esperada = await hmacHex(`v1:${expira}`, clave);
  return igualSeguro(firma, esperada);
}

/** ¿La contraseña que mandaron es la configurada? */
export async function contrasenaCorrecta(intento: string): Promise<boolean> {
  const real = process.env.DASHBOARD_PASSWORD;
  if (!real || real.length < 8) return false;

  // Comparamos los hashes y no los textos: así el tiempo no depende de cuántos
  // caracteres acertaron, sin importar los largos.
  const clave = claveDeFirma();
  if (!clave) return false;
  const [a, b] = await Promise.all([hmacHex(intento, clave), hmacHex(real, clave)]);
  return igualSeguro(a, b);
}

/** Si falta configuración, el dashboard no arranca. Lo decimos claro. */
export function configuracionFaltante(): string[] {
  const faltan: string[] = [];
  if (!process.env.DASHBOARD_PASSWORD) faltan.push("DASHBOARD_PASSWORD");
  if (!claveDeFirma()) faltan.push("DASHBOARD_SECRET (32 caracteres o más)");
  return faltan;
}
