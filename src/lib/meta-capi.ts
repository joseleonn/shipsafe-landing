/**
 * API de Conversiones de Meta (server-side).
 *
 * Por qué existe: el pixel de navegador se pierde por adblockers, ITP de Safari
 * y iOS. Server-side no. Y sobre todo: los dos eventos que le enseñan a Meta
 * quién es un buen lead (Lead y Schedule) los conocemos en el servidor, no en
 * el browser — el Schedule llega por webhook de Calendly, sin navegador de por
 * medio.
 *
 * Estrategia de deduplicación: cada evento se manda DOS veces, una por pixel y
 * otra por acá, con el mismo `event_id`. Meta las une y cuenta una sola. Si el
 * pixel no llegó, queda la del servidor.
 */
import { createHash } from "crypto";
import { normalizarTelefonoAR } from "./telefono";

const API_VERSION = "v21.0";

export type MetaEventName =
  | "Lead"
  | "Schedule"
  | "CompleteRegistration"
  | "ViewContent"
  // Etapas profundas del embudo. Llegan desde workflows de HubSpot, días o
  // semanas después del clic. Meta acepta eventos con hasta 7 días de atraso,
  // así que estos se mandan el día que la etapa cambia, no el día del cierre.
  | "StartTrial"
  | "Purchase";

export interface MetaUserData {
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  city?: string | null;
  /** Código ISO de 2 letras en minúscula. Default: "ar" */
  country?: string | null;
  /** Cookie _fbc, o se reconstruye desde fbclid */
  fbc?: string | null;
  /** Cookie _fbp */
  fbp?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  /** ID propio y estable del lead (ej. el contact id de HubSpot) */
  externalId?: string | null;
}

export interface MetaEventInput {
  eventName: MetaEventName;
  /** Mismo valor que manda el pixel. Es lo que permite deduplicar. */
  eventId: string;
  /** Unix seconds. Default: ahora. Meta acepta hasta 7 días de atraso. */
  eventTime?: number;
  eventSourceUrl?: string;
  user: MetaUserData;
  /** value, currency, content_name, y los datos de calificación */
  custom?: Record<string, unknown>;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeEmail(value: string): string | null {
  const clean = value.trim().toLowerCase();
  return clean.includes("@") ? clean : null;
}

function normalizeName(value: string): string | null {
  const clean = value.trim().toLowerCase().replace(/\s+/g, " ");
  return clean || null;
}

function buildUserData(user: MetaUserData): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  if (user.email) {
    const email = normalizeEmail(user.email);
    if (email) out.em = [hash(email)];
  }
  if (user.phone) {
    const phone = normalizarTelefonoAR(user.phone);
    if (phone) out.ph = [hash(phone)];
  }
  if (user.firstName) {
    const fn = normalizeName(user.firstName);
    if (fn) out.fn = [hash(fn)];
  }
  if (user.lastName) {
    const ln = normalizeName(user.lastName);
    if (ln) out.ln = [hash(ln)];
  }
  if (user.city) {
    const ct = normalizeName(user.city);
    if (ct) out.ct = [hash(ct.replace(/\s/g, ""))];
  }
  const country = (user.country || "ar").trim().toLowerCase();
  if (country) out.country = [hash(country)];

  if (user.externalId) out.external_id = [hash(user.externalId.trim().toLowerCase())];

  // fbc y fbp NO se hashean: van en texto plano
  if (user.fbc) out.fbc = user.fbc;
  if (user.fbp) out.fbp = user.fbp;
  if (user.clientIp) out.client_ip_address = user.clientIp;
  if (user.userAgent) out.client_user_agent = user.userAgent;

  return out;
}

export interface MetaSendResult {
  ok: boolean;
  status?: number;
  error?: string;
  eventsReceived?: number;
}

/**
 * Manda un evento a Meta. NUNCA lanza: si falla, devuelve ok:false y loguea.
 * El tracking no puede romper el formulario del usuario.
 */
export async function sendMetaEvent(
  input: MetaEventInput
): Promise<MetaSendResult> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken) {
    console.warn("[meta-capi] Falta META_PIXEL_ID o META_CAPI_ACCESS_TOKEN, evento no enviado");
    return { ok: false, error: "missing_credentials" };
  }

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: "website",
        ...(input.eventSourceUrl ? { event_source_url: input.eventSourceUrl } : {}),
        user_data: buildUserData(input.user),
        ...(input.custom ? { custom_data: input.custom } : {}),
      },
    ],
  };

  // Solo en pruebas: hace que el evento aparezca en "Test Events" del Events Manager
  if (process.env.META_TEST_EVENT_CODE) {
    payload.test_event_code = process.env.META_TEST_EVENT_CODE;
  }

  const url = `https://graph.facebook.com/${API_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = (await res.json()) as { events_received?: number; error?: { message?: string } };

    if (!res.ok) {
      console.error("[meta-capi] error", res.status, body?.error?.message);
      return { ok: false, status: res.status, error: body?.error?.message ?? "unknown" };
    }
    return { ok: true, status: res.status, eventsReceived: body?.events_received };
  } catch (err) {
    console.error("[meta-capi] fetch falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "fetch_failed" };
  }
}

/**
 * Reconstruye la cookie _fbc a partir del fbclid de la URL, para el caso en que
 * el pixel todavía no la escribió (primer pageview) o directamente no cargó.
 * Formato: fb.1.<timestamp_ms>.<fbclid>
 */
export function buildFbc(fbclid: string | null | undefined, timestampMs = Date.now()): string | null {
  if (!fbclid) return null;
  return `fb.1.${timestampMs}.${fbclid}`;
}

/** IP real del visitante detrás del proxy de Vercel/Fly. */
export function clientIpFrom(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip");
}
