/**
 * Lectura de reuniones agendadas en Calendly.
 *
 * La usa el cron de recordatorios: cada 15 minutos pregunta qué reuniones vienen
 * y decide a quién le toca un mensaje. No guardamos una cola propia a propósito
 * — Calendly ya es la fuente de verdad de quién tiene reunión y cuándo, y una
 * segunda cola sería una segunda cosa que se puede desincronizar.
 */

const BASE = "https://api.calendly.com";

export interface InvitadoProximo {
  /** URI del invitado. Es el identificador de esta reunión para esta persona */
  uri: string;
  email: string;
  nombre: string;
  telefono: string | null;
  /** URI del evento agendado. Hace falta para cancelar */
  eventoUri: string;
  /** ISO del comienzo de la reunión */
  inicio: string;
  linkReunion: string | null;
}

async function api(path: string) {
  const token = process.env.CALENDLY_TOKEN;
  if (!token) throw new Error("missing_calendly_token");
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const detalle = await res.text();
    throw new Error(`calendly_${res.status}: ${detalle.slice(0, 200)}`);
  }
  return res.json();
}

/**
 * Devuelve los invitados de todas las reuniones activas que empiezan entre
 * ahora y `horasAdelante` horas más adelante.
 */
export async function reunionesProximas(horasAdelante = 27): Promise<InvitadoProximo[]> {
  const organizacion = process.env.CALENDLY_ORGANIZATION;
  if (!organizacion) throw new Error("missing_calendly_organization");

  const ahora = new Date();
  const hasta = new Date(ahora.getTime() + horasAdelante * 3600 * 1000);

  const params = new URLSearchParams({
    organization: organizacion,
    status: "active",
    min_start_time: ahora.toISOString(),
    max_start_time: hasta.toISOString(),
    count: "100",
  });

  const eventos = (await api(`/scheduled_events?${params}`)) as {
    collection: { uri: string; start_time: string; location?: { join_url?: string } }[];
  };

  const salida: InvitadoProximo[] = [];

  for (const evento of eventos.collection ?? []) {
    const uuid = evento.uri.split("/").pop();
    if (!uuid) continue;

    try {
      const invitados = (await api(`/scheduled_events/${uuid}/invitees?status=active&count=100`)) as {
        collection: {
          uri: string;
          email: string;
          name?: string;
          text_reminder_number?: string | null;
        }[];
      };

      for (const inv of invitados.collection ?? []) {
        salida.push({
          uri: inv.uri,
          eventoUri: evento.uri,
          email: inv.email.trim().toLowerCase(),
          nombre: (inv.name ?? "").trim(),
          telefono: inv.text_reminder_number ?? null,
          inicio: evento.start_time,
          linkReunion: evento.location?.join_url ?? null,
        });
      }
    } catch (err) {
      // Una reunión que falla no puede tumbar el resto del lote
      console.error("[calendly] no pude leer invitados de", uuid, err);
    }
  }

  return salida;
}

/**
 * Cancela una reunión.
 *
 * Se usa SOLO cuando la persona pidió reagendar explícitamente. Nunca por
 * silencio: ver la nota en docs/whatsapp.md sobre por qué no cancelamos
 * automáticamente al que no contesta.
 */
export async function cancelarReunion(
  eventoUri: string,
  motivo = "La persona pidió reagendar por WhatsApp"
): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.CALENDLY_TOKEN;
  if (!token) return { ok: false, error: "missing_calendly_token" };

  const uuid = eventoUri.split("/").pop();
  if (!uuid) return { ok: false, error: "uri_invalida" };

  try {
    const res = await fetch(`${BASE}/scheduled_events/${uuid}/cancellation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: motivo }),
    });
    if (!res.ok) {
      const detalle = await res.text();
      console.error("[calendly] no se pudo cancelar", res.status, detalle.slice(0, 200));
      return { ok: false, error: `http_${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    console.error("[calendly] cancelación falló", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}

/** Busca la próxima reunión de un email entre las que vienen. */
export async function proximaReunionDe(email: string): Promise<InvitadoProximo | null> {
  const objetivo = email.trim().toLowerCase();
  try {
    const proximas = await reunionesProximas(24 * 14);
    const suyas = proximas
      .filter((i) => i.email === objetivo)
      .sort((a, b) => a.inicio.localeCompare(b.inicio));
    return suyas[0] ?? null;
  } catch (err) {
    console.error("[calendly] no pude buscar la reunión de", objetivo, err);
    return null;
  }
}
