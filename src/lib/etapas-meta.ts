/**
 * Qué evento de Meta corresponde a cada etapa del pipeline, y el envío en sí.
 *
 * Está separado en su propio módulo porque dos caminos distintos lo necesitan:
 *   - /api/etapa        → si algún día hay workflows de HubSpot que lo llamen
 *   - /api/cron/etapas  → el que se usa hoy, que consulta HubSpot cada 15 min
 *
 * Por qué existe el segundo: HubSpot Free no tiene workflows, y el plan Starter
 * tampoco trae la acción de "enviar webhook". Antes que atar la optimización de
 * las campañas a una suscripción de cientos de dólares por mes, preguntamos
 * nosotros. El resultado para Meta es idéntico.
 */
import { createHash } from "crypto";
import { sendMetaEvent, buildFbc, type MetaEventName } from "./meta-capi";
import { findContactByEmail } from "./hubspot";
import { SITE } from "./constants";

export interface EtapaMeta {
  /** Nombre corto, el que acepta /api/etapa */
  clave: string;
  /** Etiqueta exacta de la etapa en el pipeline de HubSpot */
  etiqueta: string;
  evento: MetaEventName;
  contenido: string;
}

export const ETAPAS_META: EtapaMeta[] = [
  {
    clave: "demo_realizada",
    etiqueta: "Demo realizada",
    evento: "CompleteRegistration",
    contenido: "demo-realizada",
  },
  {
    clave: "prueba_iniciada",
    etiqueta: "Prueba guiada en curso",
    evento: "StartTrial",
    contenido: "prueba-guiada-14-dias",
  },
  {
    clave: "ganado",
    etiqueta: "Ganado",
    evento: "Purchase",
    contenido: "cliente-nuevo",
  },
];

export function porClave(clave: string): EtapaMeta | undefined {
  return ETAPAS_META.find((e) => e.clave === clave);
}

export function porEtiqueta(etiqueta: string): EtapaMeta | undefined {
  const buscada = etiqueta.trim().toLowerCase();
  return ETAPAS_META.find((e) => e.etiqueta.toLowerCase() === buscada);
}

/**
 * Manda el evento de una etapa a Meta, recuperando de HubSpot la atribución que
 * se guardó cuando el lead llegó — dos meses antes, si el ciclo fue normal.
 *
 * El event_id es determinístico (etapa + email): si el mismo cambio se procesa
 * dos veces, Meta lo deduplica en vez de contar dos conversiones.
 */
export async function enviarEventoDeEtapa(opciones: {
  email: string;
  etapa: EtapaMeta;
  /** Valor del negocio en ARS. Si falta, se usa META_VALOR_CLIENTE_ARS */
  valor?: number;
  /** Atribución ya leída, para ahorrarse una consulta */
  atribucion?: Record<string, string | null>;
}): Promise<{ ok: boolean; eventId: string; error?: string }> {
  const { email, etapa } = opciones;

  const guardado =
    opciones.atribucion ??
    (await findContactByEmail(email)).properties ??
    {};

  const eventId = `${etapa.clave}-${createHash("sha256").update(email).digest("hex").slice(0, 16)}`;

  const custom: Record<string, unknown> = {
    content_name: etapa.contenido,
    utm_source: guardado.ss_utm_source ?? undefined,
    utm_campaign: guardado.ss_utm_campaign ?? undefined,
    utm_content: guardado.ss_utm_content ?? undefined,
  };

  if (etapa.evento === "Purchase") {
    const valor = opciones.valor ?? Number(process.env.META_VALOR_CLIENTE_ARS ?? 0);
    if (valor > 0) {
      custom.value = valor;
      custom.currency = "ARS";
    }
  }

  const resultado = await sendMetaEvent({
    eventName: etapa.evento,
    eventId,
    eventSourceUrl: `${SITE.url}/`,
    user: {
      email,
      phone: guardado.phone ?? undefined,
      firstName: guardado.firstname ?? undefined,
      lastName: guardado.lastname ?? undefined,
      country: "ar",
      fbc: buildFbc(guardado.ss_fbclid ?? undefined),
      externalId: email,
    },
    custom,
  });

  return { ok: resultado.ok, eventId, error: resultado.error };
}
