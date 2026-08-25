/**
 * POST /api/etapa
 *
 * Lo llaman los workflows de HubSpot cuando un negocio cambia de etapa, para
 * que Meta se entere de lo que pasa **después** del clic.
 *
 * Por qué importa: Meta optimiza con lo que le contás. Si solo le mandás
 * `Lead`, va a buscar gente que descarga PDFs. Si le mandás `Schedule`, busca
 * gente que agenda. Si le mandás `Purchase`, busca gente que paga. Cada evento
 * que sumás acá afina la puntería del algoritmo.
 *
 * El ciclo de venta es de 60–75 días y Meta solo acepta eventos con hasta 7
 * días de atraso. Por eso el evento se manda **el día en que la etapa cambia**,
 * no al final. Cada etapa es su propia señal.
 *
 * OJO: HubSpot Free y Starter NO tienen la acción de enviar webhooks, así que
 * hoy este endpoint no se usa — el que hace el trabajo es /api/cron/etapas, que
 * consulta HubSpot cada 15 minutos. Esto queda disponible por si en algún
 * momento pasás a un plan con workflows, que es más inmediato.
 *
 * Configuración en HubSpot (Automation → Workflows, uno por etapa):
 *   Disparador: "Etapa del negocio es igual a [etapa]"
 *   Acción: Send a webhook → POST → https://www.shipsafe.lat/api/etapa
 *   Header: x-shipsafe-secret: <WEBHOOK_SHARED_SECRET>
 *   Body:   { "email": "{{contact.email}}", "etapa": "prueba_iniciada" }
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { porClave, enviarEventoDeEtapa } from "@/lib/etapas-meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function secretoValido(recibido: string | null): boolean {
  const esperado = process.env.WEBHOOK_SHARED_SECRET;
  if (!esperado || !recibido) return false;
  // Se comparan los hashes para que la comparación sea de largo fijo
  const a = createHash("sha256").update(esperado).digest();
  const b = createHash("sha256").update(recibido).digest();
  return timingSafeEqual(a, b);
}

interface Payload {
  email?: string;
  etapa?: string;
  /** Valor del negocio en ARS. Si no viene, se usa META_VALOR_CLIENTE_ARS */
  valor?: number;
}

export async function POST(request: Request) {
  if (!secretoValido(request.headers.get("x-shipsafe-secret"))) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "json_invalido" }, { status: 400 });
  }

  const email = payload.email?.trim().toLowerCase();
  const etapa = payload.etapa?.trim();

  if (!email || !etapa) {
    return NextResponse.json({ ok: false, error: "faltan_datos" }, { status: 400 });
  }

  const config = porClave(etapa);
  if (!config) {
    // Una etapa sin evento asociado no es un error: no todas mandan señal
    return NextResponse.json({ ok: true, handled: "etapa_sin_evento", etapa });
  }

  const resultado = await enviarEventoDeEtapa({
    email,
    etapa: config,
    valor: payload.valor,
  });

  return NextResponse.json({
    ok: true,
    etapa,
    evento: config.evento,
    enviado: resultado.ok,
    eventId: resultado.eventId,
  });
}
