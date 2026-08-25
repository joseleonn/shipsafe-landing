# Los tres crons

El embudo necesita tres tareas periódicas:

| Endpoint | Cada | Qué hace |
|---|---|---|
| `/api/cron/etapas` | 15 min | Le manda a Meta los eventos de las etapas del pipeline |
| `/api/cron/recordatorios` | 15 min | Recordatorios de reunión por WhatsApp |
| `/api/cron/setting` | 1 hora | Crea las tareas de contacto manual del lead que no agendó |

---

## Por qué NO están en vercel.json

**El plan Hobby de Vercel solo permite cron jobs diarios, y una expresión más
frecuente hace fallar el deployment entero.** No es que el cron corra menos
seguido: el deploy se rechaza con

```
Hobby accounts are limited to daily Cron Jobs.
This cron expression would run more than once per day.
```

Un cron diario no sirve para recordar una reunión que es en dos horas. Así que
los crons se disparan desde afuera, contra los mismos endpoints. Funciona igual
y en cualquier plan.

---

> **Usá siempre `www.shipsafe.lat`, nunca el apex.** `shipsafe.lat` devuelve un
> 307 hacia el www, y **ni los crons ni los webhooks siguen redirecciones**. En
> el navegador no se nota porque Chrome la sigue solo; en un cron, la tarea
> "funciona" sin llegar nunca al endpoint.

## Configuración en cron-job.org (gratis)

Creá tres tareas en `cron-job.org`, una por endpoint. Para las tres:

- **Método:** GET
- **Header:** `Authorization` con valor `Bearer <WEBHOOK_SHARED_SECRET>`
- **Tratar como fallo si:** el código de respuesta no es 200

| Título | URL | Intervalo |
|---|---|---|
| SHIPSAFE · etapas a Meta | `https://www.shipsafe.lat/api/cron/etapas` | cada 15 min |
| SHIPSAFE · recordatorios WhatsApp | `https://www.shipsafe.lat/api/cron/recordatorios` | cada 15 min |
| SHIPSAFE · cola de setting | `https://www.shipsafe.lat/api/cron/setting` | cada 1 hora |

El `WEBHOOK_SHARED_SECRET` es el mismo que está en `.env.local` y en Vercel. Sin
el header, los endpoints devuelven 401 — es a propósito: son públicos y sin eso
cualquiera podría dispararlos.

### Probarlos a mano

```bash
source .env.local
for e in etapas recordatorios setting; do
  printf "%-14s " "$e"
  curl -s "https://www.shipsafe.lat/api/cron/$e" \
    -H "Authorization: Bearer $WEBHOOK_SHARED_SECRET" | head -c 120; echo
done
```

Respuestas esperadas con el sistema recién configurado:

- `etapas` → `{"ok":true,"revisados":0,"enviados":[],"omitidos":[]}`
- `recordatorios` → `{"ok":true,"estado":"whatsapp_no_configurado",...}` hasta que hagas el bloque 7
- `setting` → `{"ok":true,"revisados":0,...}`

Un `401` significa que `WEBHOOK_SHARED_SECRET` no coincide entre el cron y Vercel.

---

## Si algún día pasás a Vercel Pro

Restaurás los crons en `vercel.json` y apagás las tareas de cron-job.org:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/cron/etapas",        "schedule": "*/15 * * * *" },
    { "path": "/api/cron/recordatorios", "schedule": "*/15 * * * *" },
    { "path": "/api/cron/setting",       "schedule": "0 * * * *" }
  ]
}
```

Los endpoints aceptan tanto `WEBHOOK_SHARED_SECRET` como la variable `CRON_SECRET`
que Vercel manda sola, así que no hay que tocar código.
