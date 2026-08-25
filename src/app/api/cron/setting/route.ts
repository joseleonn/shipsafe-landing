/**
 * GET /api/cron/setting
 *
 * La cola de setting: entre el 40% y el 60% de los leads calificados no agendan
 * solos, y son exactamente los mismos leads que los que sí agendan. Dejarlos
 * pasar es tirar la mitad de lo que pagaste en anuncios.
 *
 * Corre cada hora. Busca leads que:
 *   - están calificados
 *   - dejaron los datos hace más de 24 h
 *   - NO tienen negocio asociado, o sea que no agendaron
 *   - todavía no fueron encolados
 *
 * Y les escribe en el contacto el mensaje de WhatsApp ya redactado y
 * personalizado, para que contactarlos sea copiar y pegar.
 *
 * Por qué no crea una tarea de HubSpot: **HubSpot no expone los scopes de
 * tareas a las private apps** — no aparecen en la interfaz y no son cosa del
 * plan Free. Así que la cola vive en dos propiedades del contacto y se trabaja
 * desde una vista filtrada.
 *
 * Sale mejor: el mensaje queda en el registro del contacto, a la vista, en vez
 * de en una tarea aparte.
 *
 * LA VISTA QUE HAY QUE CREAR EN HUBSPOT (Contactos → guardar vista):
 *   ss_calificacion    es igual a          califica
 *   ss_setting_encolado  tiene valor
 *   ss_setting_mensaje   tiene valor
 * Columnas: Nombre · Empresa · ss_rubro · ss_cantidad_empleados ·
 *           ss_utm_content · ss_setting_mensaje
 * Nombre sugerido: "Cola de setting"
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { candidatosASetting, tieneNegocio, upsertContact } from "@/lib/hubspot";
import { RUBRO_OPCIONES } from "@/lib/calificacion";

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

const etiqueta = (
  opciones: readonly { value: string; label: string }[],
  valor: string
) => opciones.find((o) => o.value === valor)?.label ?? valor;

/**
 * El mensaje ya escrito y personalizado, para que escribirle sea copiar y
 * pegar. Es el Mensaje 1 de la sección 1.1 de operacion-comercial-shipsafe.md.
 */
function mensajeSugerido(c: {
  nombre: string;
  empresa: string;
  rubro: string;
  empleados: string;
  utmContent: string;
  email: string;
}): string {
  const primerNombre = c.nombre.split(" ")[0] || "";
  const rubroLegible = c.rubro ? etiqueta(RUBRO_OPCIONES, c.rubro).toLowerCase() : "tu rubro";

  return [
    `Hola ${primerNombre}, soy José de SHIPSAFE. Vi que bajaste el recurso.`,
    ``,
    `Te escribo por algo puntual: en ${rubroLegible} lo que más se complica no suele ser armar la documentación, es que quede toda junta cuando la piden. ¿Cómo lo están manejando hoy en ${c.empresa || "tu empresa"}?`,
    ``,
    `(Si no contesta: mensaje 2 a los 3 días, llamada a los 5, cierre de cola a los 8. Están en operacion-comercial-shipsafe.md, sección 1.1.)`,
  ].join("\n");
}

export async function GET(request: Request) {
  if (!autorizado(request)) {
    return NextResponse.json({ ok: false, error: "no_autorizado" }, { status: 401 });
  }

  if (!process.env.HUBSPOT_ACCESS_TOKEN) {
    return NextResponse.json({ ok: true, estado: "hubspot_no_configurado" });
  }

  const candidatos = await candidatosASetting(50);
  const encolados: string[] = [];
  const yaAgendaron: string[] = [];
  const fallidos: { email: string; motivo: string }[] = [];

  for (const c of candidatos) {
    if (!c.email) continue;

    // Si tiene negocio, agendó: no va a la cola de setting
    if (await tieneNegocio(c.contactId)) {
      // Se marca igual para no volver a revisarlo en cada corrida
      await upsertContact({ email: c.email, ss_setting_encolado: "agendó" });
      yaAgendaron.push(c.email);
      continue;
    }

    const guardado = await upsertContact({
      email: c.email,
      ss_setting_encolado: new Date().toISOString(),
      ss_setting_mensaje: mensajeSugerido(c),
    });

    if (!guardado.ok) {
      fallidos.push({ email: c.email, motivo: guardado.error ?? "error" });
      continue;
    }
    encolados.push(c.email);
  }

  console.log(
    `[cron-setting] ${candidatos.length} revisados, ${encolados.length} encolados, ${yaAgendaron.length} ya habían agendado`
  );

  return NextResponse.json({
    ok: true,
    revisados: candidatos.length,
    encolados,
    yaAgendaron,
    fallidos,
  });
}
