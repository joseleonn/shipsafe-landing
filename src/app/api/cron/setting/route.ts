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
 * Y les crea una tarea de llamado en HubSpot, con el contexto que hace falta
 * para escribirle sin tener que ir a buscar nada.
 *
 * Reemplaza a un workflow de HubSpot, que en el plan Free no existe. Las tareas
 * sí existen en Free, así que el resultado para vos es el mismo: te aparece en
 * tu lista de tareas.
 */
import { NextResponse } from "next/server";
import { createHash, timingSafeEqual } from "crypto";
import { candidatosASetting, tieneNegocio, upsertContact } from "@/lib/hubspot";
import { crearTarea } from "@/lib/hubspot-tasks";
import { RUBRO_OPCIONES, EMPLEADOS_OPCIONES } from "@/lib/calificacion";

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
 * El cuerpo de la tarea trae el mensaje ya escrito y personalizado, para que
 * escribirle sea copiar y pegar. Es el Mensaje 1 de la sección 1.1 de
 * operacion-comercial-shipsafe.md.
 */
function cuerpoTarea(c: {
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
    `Lead calificado que descargó el recurso y no agendó en 24 h.`,
    ``,
    `Empresa: ${c.empresa || "—"}`,
    `Rubro: ${c.rubro ? etiqueta(RUBRO_OPCIONES, c.rubro) : "—"}`,
    `Empleados: ${c.empleados ? etiqueta(EMPLEADOS_OPCIONES, c.empleados) : "—"}`,
    `Vino del anuncio: ${c.utmContent || "—"}`,
    `Email: ${c.email}`,
    ``,
    `── Mensaje sugerido (WhatsApp) ──`,
    ``,
    `Hola ${primerNombre}, soy José de ShipSafe. Vi que bajaste el recurso.`,
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

    const tarea = await crearTarea({
      contactId: c.contactId,
      titulo: `Setting: ${c.empresa || c.nombre || c.email}`,
      cuerpo: cuerpoTarea(c),
      prioridad: "HIGH",
      tipo: "CALL",
    });

    if (!tarea.ok) {
      fallidos.push({ email: c.email, motivo: tarea.error ?? "error" });
      continue;
    }

    await upsertContact({
      email: c.email,
      ss_setting_encolado: new Date().toISOString(),
    });
    encolados.push(c.email);
  }

  console.log(
    `[cron-setting] ${candidatos.length} revisados, ${encolados.length} tareas creadas, ${yaAgendaron.length} ya habían agendado`
  );

  return NextResponse.json({
    ok: true,
    revisados: candidatos.length,
    encolados,
    yaAgendaron,
    fallidos,
  });
}
