# Embudo de Meta Ads — puesta en marcha

Todo el código está construido. Esto es lo que falta configurar por fuera del repo.
Orden: **Meta → HubSpot → Calendly → QA**. Toma alrededor de dos horas.

Referencia estratégica: `plan-metaads-shipsafe.md` · Proceso comercial: `operacion-comercial-shipsafe.md`

---

## El sistema completo

```
Anuncio (utm_content = ángulo)
   │
   ▼
/recurso/[slug]                        landing de opt-in, sin navbar ni footer
   │  guarda la atribución en localStorage (first touch wins)
   │  POST /api/lead
   │     ├─ evento Lead → Meta                        OPTIMIZACIÓN 1
   │     ├─ contacto → HubSpot con UTM y calificación
   │     └─ devuelve { califica: true | false }
   ▼
/recurso/[slug]/gracias
   ├─ califica    → recurso + Calendly embebido con datos precargados
   └─ no califica → recurso + nurturing. Nunca un "no"
   │
   ▼
Calendly: reunión confirmada
   ├─ webhook invitee.created  →  POST /api/calendly/webhook
   │     ├─ evento Schedule → Meta                    OPTIMIZACIÓN 2
   │     ├─ contacto creado o actualizado
   │     └─ NEGOCIO creado en "Demo agendada"
   └─ redirección               →  /demo/agendado
         └─ video de nurturing + pixel Schedule (mismo event_id, deduplicado)
   │
   ▼
El negocio avanza por el pipeline (8 etapas)
   └─ workflows de HubSpot  →  POST /api/etapa
         ├─ Demo realizada          → CompleteRegistration
         ├─ Prueba guiada en curso  → StartTrial
         └─ Ganado                  → Purchase (con valor)     OPTIMIZACIÓN 3
```

> **Por qué la optimización 3 importa:** Meta busca lo que le contás. Si solo le mandás `Lead`, va a buscar gente que descarga PDFs. Si le mandás `Purchase`, busca gente que paga. Como el ciclo es de 60–75 días y Meta solo acepta eventos con hasta 7 días de atraso, cada evento se manda **el día que la etapa cambia**, nunca acumulado al final.

### Archivos

| Archivo | Qué hace |
|---|---|
| `scripts/setup-hubspot.mjs` | **Crea todo HubSpot solo.** Propiedades, grupo y pipeline con sus 8 etapas |
| `src/lib/meta-capi.ts` | Envío server-side a Meta. Hasheo, teléfonos argentinos, deduplicación |
| `src/lib/meta-pixel.ts` | Disparo del pixel con el `eventID` compartido |
| `src/components/MetaPixel.tsx` | Script del pixel (montado en el layout raíz) |
| `src/lib/attribution.ts` | Captura y persistencia de UTM / fbclid en el navegador |
| `src/lib/hubspot.ts` | Contactos: alta y actualización por email |
| `src/lib/hubspot-deals.ts` | Negocios: creación idempotente asociada al contacto |
| `src/lib/calificacion.ts` | **Los criterios.** Si tocás esto, cambiás lo que Meta busca |
| `src/app/api/lead/route.ts` | Endpoint del opt-in |
| `src/app/api/calendly/webhook/route.ts` | Webhook de Calendly, con verificación de firma |
| `src/app/api/etapa/route.ts` | Endpoint para los workflows de HubSpot |
| `src/app/recurso/_data.ts` | **El lead magnet.** Se cambia editando solo este objeto |
| `src/app/recurso/[slug]/` | Landing de opt-in y página de gracias |
| `src/app/demo/agendado/` | Gracias post-agenda + video de nurturing |

---

## 1. Meta

**Pixel.** Events Manager → tu pixel → Configuración → copiar el ID.
Va en `NEXT_PUBLIC_META_PIXEL_ID` y en `META_PIXEL_ID`.

**Token de la API de Conversiones.** Events Manager → Configuración → API de conversiones → Generar token de acceso → `META_CAPI_ACCESS_TOKEN`. Es secreto: nunca con prefijo `NEXT_PUBLIC_`.

**Eventos que vas a ver:** `PageView` · `Lead` · `Schedule` · `CompleteRegistration` · `StartTrial` · `Purchase`

**Mientras probás:** `META_TEST_EVENT_CODE` con el código de la pestaña "Probar eventos". **Sacalo antes de lanzar** o los eventos no cuentan para la optimización.

**Cómo saber que está bien:** la calidad de coincidencia de `Lead` y `Schedule` arriba de 6/10, y la deduplicación mostrando que navegador y servidor mandan el mismo evento.

---

## 2. HubSpot

### 2.1 Private App

Settings → Integrations → Private Apps → Create. Scopes:

```
crm.objects.contacts.read     crm.objects.contacts.write
crm.objects.deals.read        crm.objects.deals.write
crm.schemas.contacts.write    crm.schemas.deals.read
crm.schemas.deals.write
```

El token va en `HUBSPOT_ACCESS_TOKEN`.

### 2.2 Crear la estructura (automático)

```bash
# Primero mirá qué va a hacer, sin escribir nada
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxx node scripts/setup-hubspot.mjs --dry-run

# Y ahora sí
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxx node scripts/setup-hubspot.mjs
```

Crea 17 propiedades de contacto, 5 de negocio, el grupo "Embudo Meta Ads" y el pipeline **ShipSafe — Ventas** con sus 8 etapas. **Es idempotente**: corrélo las veces que quieras, lo que ya existe no se toca.

Al terminar imprime los IDs. Copialos a `.env.local` y a Vercel:

```
HUBSPOT_PIPELINE_ID=...
HUBSPOT_STAGE_DEMO_AGENDADA=...
```

### 2.3 Las etapas del pipeline

| Etapa | Se marca cuando | Prob. |
|---|---|---|
| Lead | Dejó los datos en la landing | 5% |
| Demo agendada | Confirmó en Calendly *(automático)* | 15% |
| Demo realizada | Se hizo la reunión | 30% |
| Pricing enviado | Le mandaste la propuesta | 40% |
| Prueba guiada en curso | Reunión de arranque hecha, decisión ya agendada | 60% |
| Decisión | Llamada del día 15 | 80% |
| Ganado / Perdido | — | 100% / 0% |

Las fechas de estas etapas son lo que a los 60 días te da el ciclo de venta real y te dice cuál se estira.

### 2.4 Automatización sin workflows

**HubSpot Free no tiene workflows.** Ni uno: no hay disparadores, no hay
secuencias, no hay reglas. Y el plan Starter, aunque trae "automatización
simple", **tampoco incluye la acción de enviar webhooks** — eso arranca en
Professional, del orden de USD 100 por usuario y por mes más onboarding.

Atar la optimización de las campañas a esa suscripción no tiene sentido en esta
etapa. Así que la vuelta es dar vuelta la pregunta: **en vez de que HubSpot nos
avise cuando algo cambia, preguntamos nosotros.**

| Lo que sería un workflow | Cómo se resuelve acá |
|---|---|
| Etapa → evento a Meta | `/api/cron/etapas`, cada 15 min. **Ya construido** |
| Playbook de asistencia | `/api/cron/recordatorios` + WhatsApp. **Ya construido** |
| Entrega del recurso por mail | El recurso se descarga en la página de gracias. La landing ya no promete un mail |
| Cola de setting a las 24 h | ⏳ Pendiente: un tercer cron que cree tareas en HubSpot |
| Nurturing del que no califica | ⏳ Pendiente: necesita un servicio de email |

Para Meta el resultado es idéntico. La única diferencia es una demora de hasta
15 minutos en registrar un cambio de etapa, irrelevante en un ciclo de 60 días.

`/api/etapa` sigue existiendo por si algún día pasás a un plan con workflows: es
más inmediato. Hoy no se usa.

### 2.5 El pipeline en HubSpot Free

Free permite **un solo pipeline de negocios**. Por eso el script no crea uno
nuevo: le agrega al que ya tenés las ocho etapas que faltan.

```bash
node scripts/setup-hubspot.mjs --adaptar-pipeline --escribir-env
```

No borra ni renombra ninguna etapa existente: las suma. Si tenías etapas
propias, siguen ahí.

> **Las etiquetas de las etapas importan.** El cron mapea etapa → evento de Meta
> por el **nombre** de la etapa. Si renombrás "Demo realizada" a otra cosa, ese
> evento deja de salir y no vas a ver ningún error. Si necesitás renombrarlas,
> actualizá también `src/lib/etapas-meta.ts`.

### 2.6 Vistas e informes

**Vista de contactos "Leads de Meta"** — filtro `ss_utm_source = meta`, columnas: Nombre · Empresa · `ss_utm_content` · `ss_calificacion` · `ss_rubro` · `ss_cantidad_empleados` · Fecha de creación.

**El informe que importa:** negocios agrupados por `ss_utm_content`, con conteo y monto. Es el que responde *qué ángulo trajo a los clientes que cerraron* — la única pregunta que no puede contestar el Ads Manager, porque el gasto vive en Meta y el resultado en HubSpot.

> `ss_utm_content` se copia del contacto al negocio al crearlo. Sin esa copia el informe de ingresos por ángulo no existe.

---

## 3. Calendly

> **Requiere plan Standard (USD 10/usuario/mes) o superior.**
> El plan gratuito **no permite webhooks ni redirección a un sitio externo**, y
> las dos cosas son centrales acá: el webhook es lo que crea el negocio y le
> avisa a Meta que alguien agendó, y la redirección es la que lleva a la página
> de nurturing.
>
> Lo que sí funciona en Free es la lectura por API (`GET /scheduled_events`),
> así que un embudo degradado por polling es posible — pero pagar diez dólares
> sale más barato que mantenerlo.

**Por qué la calificación NO usa Routing Forms.** Se hace en nuestro propio formulario: los datos entran a HubSpot desde el minuto cero, el evento `Lead` sale con esos datos adjuntos, y una pieza central del sistema no queda atada al plan de Calendly.

### 3.1 Webhook

```bash
# 1) Tu organización
curl -s https://api.calendly.com/users/me \
  -H "Authorization: Bearer $CALENDLY_TOKEN" | jq -r '.resource.current_organization'

# 2) Registrar
curl -X POST https://api.calendly.com/webhook_subscriptions \
  -H "Authorization: Bearer $CALENDLY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shipsafe.lat/api/calendly/webhook",
    "events": ["invitee.created", "invitee.canceled"],
    "organization": "https://api.calendly.com/organizations/XXXX",
    "scope": "organization",
    "signing_key": "PONE_ACA_UN_SECRETO_LARGO"
  }'
```

El mismo `signing_key` va en `CALENDLY_WEBHOOK_SECRET`. Si no coincide, el endpoint devuelve 401 y no se manda nada — es a propósito.

### 3.2 Redirección a la página de gracias

Evento de 30 min → Confirmation Page → **Redirect to an external site**:

```
https://shipsafe.lat/demo/agendado
```

**Activá "Pass event details to your redirected page".** Sin eso Calendly no manda `invitee_uuid`, el pixel no puede usar el mismo `event_id` que el servidor, y Meta cuenta la agenda dos veces.

### 3.3 Preguntas del evento

Sirven para la llamada, no para filtrar:

- ¿Cuál es el proceso que más te está costando hoy?
- ¿Quién más debería estar en la reunión?

> **Regla que no se negocia:** si agendás una demo a mano por WhatsApp o teléfono, **agendala desde Calendly igual**. Si va directo al calendario, no se dispara el webhook, no se crea el negocio y Meta no aprende. Es la señal más cara que tenés.

---

## 4. Variables de entorno

`.env.example` las lista todas. Copiá a `.env.local` para desarrollo y cargá las mismas en Vercel → Settings → Environment Variables.

| Variable | De dónde sale |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` · `META_PIXEL_ID` | Events Manager |
| `META_CAPI_ACCESS_TOKEN` | Events Manager → API de conversiones |
| `META_TEST_EVENT_CODE` | Solo durante el QA. **Sacar antes de lanzar** |
| `META_VALOR_CLIENTE_ARS` | Valor del evento Purchase. Por defecto 400000 |
| `HUBSPOT_ACCESS_TOKEN` | Private App |
| `HUBSPOT_PIPELINE_ID` · `HUBSPOT_STAGE_DEMO_AGENDADA` | Los imprime `setup-hubspot.mjs` |
| `CALENDLY_WEBHOOK_SECRET` | El `signing_key` del webhook |
| `WEBHOOK_SHARED_SECRET` | `openssl rand -hex 32` |

---

## 5. QA antes de lanzar

Recorré el embudo entero como si fueras un lead, dos veces.

**Pasada 1 — califica** (50-99 empleados, metalúrgica, responsable de SyH):

- [ ] Entrar a `/recurso/carpeta-auditoria?utm_source=meta&utm_medium=paid&utm_campaign=test&utm_content=AUDITORIA-VID-v1&fbclid=test123`
- [ ] En consola: `localStorage.getItem("ss_attribution")` tiene los UTM
- [ ] Enviar el formulario
- [ ] Events Manager → Probar eventos: `Lead` aparece **una sola vez**
- [ ] HubSpot: contacto con `ss_utm_content = AUDITORIA-VID-v1` y `ss_calificacion = califica`
- [ ] La página de gracias muestra el calendario, con nombre y mail cargados
- [ ] Agendar una reunión de prueba
- [ ] Redirige a `/demo/agendado` con `invitee_uuid` en la URL
- [ ] Events Manager: `Schedule` **una sola vez** (si aparece dos, falta el paso 3.2)
- [ ] **HubSpot: se creó el negocio en "Demo agendada", asociado al contacto y con `ss_utm_content`**
- [ ] Mover el negocio a "Demo realizada" → llega `CompleteRegistration`
- [ ] Mover a "Ganado" → llega `Purchase` con valor
- [ ] Volver el negocio a "Demo agendada" y borrar la reunión de prueba

**Pasada 2 — no califica** (10-49 empleados, otro rubro):

- [ ] La página de gracias **no** muestra el calendario
- [ ] HubSpot: `ss_calificacion = no_califica`
- [ ] Entra al workflow de nurturing

**Si falla algo:** los endpoints loguean con prefijo `[meta-capi]`, `[hubspot]`, `[hubspot-deals]` y `[calendly]`. En Vercel → Logs, filtrá por esos strings.

---

## 6. Lo que falta

| Pendiente | Bloquea |
|---|---|
| **Definir el lead magnet con Walter** | Es lo único que frena el lanzamiento |
| Producir el archivo → `public/recursos/` + `archivoListo: true` en `_data.ts` | Entrega del recurso |
| Video de nurturing de Walter → `src/app/demo/agendado/_data.ts` | No bloquea, pero acorta el ciclo |
| Los 5 creativos (guiones en `guiones-creativos-meta.md`) | Lanzamiento |
| Correr `npm run build` en Mac antes de deployar | Verificación final |

**Para cambiar de lead magnet** no se toca ningún componente: se edita el objeto en `src/app/recurso/_data.ts` y se cambia el `utm_content` del anuncio.
