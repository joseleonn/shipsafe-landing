/**
 * GET /api/cron/etapas
 *
 * Le cuenta a Meta lo que pasa DESPUÉS del clic: demo realizada, prueba
 * iniciada, cliente ganado. Es la Optimización 3 del embudo.
 *
 * Por qué es un cron y no un webhook de HubSpot: **HubSpot Free no tiene
 * workflows**, y el plan Starter tampoco incluye la acción de enviar webhooks —
 * eso arranca en Professional, que cuesta cientos de dólares por mes. En vez de
 * atar la optimización de las campañas a esa suscripción, damos vuelta la
 * pregunta: cada 15 minutos consultamos qué negocios cambiaron. Para Meta el
 * resultado es idéntico; la única diferencia es una demora de hasta 15 minutos,
 * irrelevante en un ciclo de venta de 60 días.
 *
 * Idempotencia: cada negocio lleva en `ss_meta_eventos` la lista de etapas cuyo
 * evento ya se mandó. Un negocio que va y vuelve entre etapas no vuelve a
 * disparar lo mismo. Y como el event_id es determinístico, aunque se colara un
 * duplicado, Meta lo deduplica.
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import {
  etapasDelPipeline,
  negociosModificados,
  emailDelNegocio,
  marcarEventosEnviados,
} from "@/lib/hubspot-deals";
import { porEtiqueta, enviarEventoDeEtapa } from "@/lib/etapas-meta";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function autorizado(request: Request): boolean {
  const esperado = process.env.WEBHOOK_SHARED_SECRET ?? process.env.CRON_SECRET;
  if (!esperado) return false;
  const header = request.headers.get("authorization") ?? "";
  const recibido = header.startsWith("Bearer ") ? header.slice(7) : header;
  if (!recibido) return false;
  const a = createHash("sha256").update(esperado).digest();
  const b = createHash("sha256").update(recibido).digest();
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  if (!process.env.HUBSPOT_ACCESS_TOKEN || !process.env.HUBSPOT_PIPELINE_ID) {
    return NextResponse.json({
      ok: true,
      estado: "hubspot_no_configurado",
      detalle: "Faltan HUBSPOT_ACCESS_TOKEN o HUBSPOT_PIPELINE_ID",
    });
  }

  const [etapas, negocios] = await Promise.all([
    etapasDelPipeline(),
    negociosModificados(30),
  ]);

  const enviados: { deal: string; etapa: string; evento: string }[] = [];
  const omitidos: { deal: string; motivo: string }[] = [];

  for (const negocio of negocios) {
    const etiqueta = etapas.get(negocio.dealstage);
    if (!etiqueta) continue;

    const etapa = porEtiqueta(etiqueta);
    if (!etapa) continue; // etapa sin evento asociado: normal

    if (negocio.eventosEnviados.includes(etapa.clave)) continue;

    const email = await emailDelNegocio(negocio.id);
    if (!email) {
      omitidos.push({ deal: negocio.id, motivo: "sin_contacto_asociado" });
      continue;
    }

    const resultado = await enviarEventoDeEtapa({
      email,
      etapa,
      valor: negocio.monto ?? undefined,
    });

    if (!resultado.ok) {
      omitidos.push({ deal: negocio.id, motivo: resultado.error ?? "meta_falló" });
      continue;
    }

    await marcarEventosEnviados(negocio.id, [...negocio.eventosEnviados, etapa.clave]);
    enviados.push({ deal: negocio.id, etapa: etapa.etiqueta, evento: etapa.evento });
  }

  console.log(
    `[cron-etapas] ${negocios.length} negocios revisados, ${enviados.length} eventos enviados`
  );

  return NextResponse.json({
    ok: true,
    revisados: negocios.length,
    enviados,
    omitidos,
  });
}
