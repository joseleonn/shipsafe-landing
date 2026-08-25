/**
 * SIN USO — se puede borrar.
 *
 * Este módulo creaba tareas en HubSpot para la cola de setting. No se usa:
 * **HubSpot no expone los scopes `crm.objects.tasks.read/write` a las private
 * apps.** No aparecen en la interfaz, y en su comunidad el propio soporte
 * confirmó que scopes equivalentes (el de notas) directamente no existen. No es
 * una limitación del plan Free.
 *
 * La cola de setting se resuelve sin el objeto Tarea: el cron escribe en el
 * contacto `ss_setting_encolado` y `ss_setting_mensaje`, y el trabajo se ve
 * desde una vista filtrada de contactos. Ver docs/embudo-meta-ads.md.
 *
 * Sale mejor así: el mensaje personalizado queda en el registro del contacto,
 * a la vista, en vez de en una tarea aparte.
 */
export {};
