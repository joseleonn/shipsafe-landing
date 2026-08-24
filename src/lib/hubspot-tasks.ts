/**
 * Tareas en HubSpot.
 *
 * Las tareas SÍ existen en el plan Free, así que son la forma de sustituir a los
 * workflows: en vez de que HubSpot cree la tarea sola, la creamos nosotros desde
 * un cron. Para vos, en la práctica, es lo mismo: te aparece en tu lista.
 *
 * Scopes que hacen falta en la Private App:
 *   crm.objects.tasks.read
 *   crm.objects.tasks.write
 */

const BASE_URL = "https://api.hubapi.com";

/** task → contact en la API de asociaciones de HubSpot */
const ASOC_TAREA_A_CONTACTO = 204;

export interface DatosTarea {
  contactId: string;
  titulo: string;
  cuerpo: string;
  /** Milisegundos. Por defecto, ahora */
  vence?: number;
  prioridad?: "HIGH" | "MEDIUM" | "LOW";
  tipo?: "CALL" | "EMAIL" | "TODO";
}

async function request(path: string, init: RequestInit) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) throw new Error("missing_hubspot_token");
  return fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

export async function crearTarea(
  datos: DatosTarea
): Promise<{ ok: boolean; taskId?: string; error?: string }> {
  try {
    const res = await request("/crm/v3/objects/tasks", {
      method: "POST",
      body: JSON.stringify({
        properties: {
          hs_task_subject: datos.titulo,
          hs_task_body: datos.cuerpo,
          hs_task_status: "NOT_STARTED",
          hs_task_priority: datos.prioridad ?? "HIGH",
          hs_task_type: datos.tipo ?? "CALL",
          hs_timestamp: String(datos.vence ?? Date.now()),
        },
        associations: [
          {
            to: { id: datos.contactId },
            types: [
              {
                associationCategory: "HUBSPOT_DEFINED",
                associationTypeId: ASOC_TAREA_A_CONTACTO,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      const detalle = await res.text();
      console.error("[hubspot-tasks] no se pudo crear", res.status, detalle.slice(0, 300));
      return { ok: false, error: `create_${res.status}` };
    }
    const body = (await res.json()) as { id: string };
    return { ok: true, taskId: body.id };
  } catch (err) {
    console.error("[hubspot-tasks] excepción", err);
    return { ok: false, error: err instanceof Error ? err.message : "unknown" };
  }
}
