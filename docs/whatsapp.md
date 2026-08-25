# WhatsApp — confirmaciones y recordatorios automáticos

Automatiza el playbook de asistencia. Ataca la métrica más cara del embudo: la
diferencia entre **demos agendadas** y **demos realizadas**.

Sin recordatorios, el no-show en B2B argentino con agenda a 3–5 días vista está
entre 30% y 50%. Con la secuencia puesta baja a 10–20%. No toca el presupuesto
de ads: son las mismas agendas, mejor aprovechadas.

---

## La decisión del número: resuelta

**Se migra el 341 306-7158 a YCloud.** Un solo número para todo: los
recordatorios salen de ahí y las conversaciones entran ahí.

Esto se puede hacer porque **YCloud tiene bandeja de entrada compartida**. Con
la Cloud API de Meta pelada no habría alcanzado: un número conectado
directamente a la API pierde la app del celular y los mensajes entrantes solo
llegan a un webhook, así que todo lo que la gente escriba desde el sitio
terminaría en un log que nadie mira.

Y el embudo manda gente a escribir a ese número: el botón de WhatsApp está en la
página de gracias del recurso —el único canal humano del que **no** califica— y
en la de post-agenda.

**Lo que cambia en tu día a día:** dejás de contestar desde la app del celular y
pasás a contestar desde la bandeja web de YCloud. Los links `wa.me` del sitio no
se tocan: es el mismo número.

**Por qué YCloud y no otro:** el plan gratuito no tiene cuota de plataforma —solo
se pagan las conversaciones de Meta, igual que yendo directo— e incluye API,
webhooks y bandeja compartida. 360dialog y Wati cobran del orden de USD 50 por
mes por lo mismo.

> **Verificá que sean BSP oficial de Meta** en el directorio de Meta Business
> Partners antes de conectar la cuenta. Lo afirman en su propio material y no
> pude confirmarlo en una fuente independiente. Con tu cuenta publicitaria de
> por medio, no es un detalle menor.

---

## 1. Cuenta y número

1. Creá la cuenta en `ycloud.com`, plan **Free**.
2. **WhatsApp → conectar número.** El alta es guiada: YCloud abre el flujo de
   Meta y te pide confirmar el número. Vas a tener que verificarlo con el código
   que llega por SMS o llamada al 341.

> **El número no puede tener una cuenta de WhatsApp activa.** Si el 341 está hoy
> en la app de WhatsApp Business del celular, hay que **eliminar esa cuenta**
> desde la app antes de migrarlo (Ajustes → Cuenta → Eliminar mi cuenta).
> **Exportá antes las conversaciones que te importen**: se pierden.

3. **Developers → API Key.** Copiala:

```
YCLOUD_API_KEY=<la key>
WHATSAPP_FROM=5493413067158
```

`WHATSAPP_FROM` va en formato internacional, sin el `+`.

---

## 2. Webhook

**Developers → Webhook → crear endpoint:**

| Campo | Valor |
|---|---|
| URL | `https://www.shipsafe.lat/api/whatsapp/webhook` |
| Eventos | mensajes entrantes de WhatsApp |

Copiá el secreto del endpoint:

```
YCLOUD_WEBHOOK_SECRET=<el secreto>
```

El endpoint verifica la firma `YCloud-Signature` con HMAC-SHA256 sobre
`{timestamp}.{cuerpo}`, con tolerancia de 5 minutos. Sin firma válida devuelve
401 y no procesa nada.

---

## 3. Verificación del negocio

**Configuración del negocio de Meta → Centro de seguridad → Verificación del
negocio.** Pide documentación legal de Ship Software Team y **tarda días**.

Sin ella, tus mensajes llegan sin nombre. Con ella, en el chat aparece
**ShipSafe**. Como estás migrando un número que la gente ya tiene agendado, esto
pesa menos que con un número nuevo — pero hacela igual: define si un mensaje se
lee o se ignora cuando el destinatario no te tiene agendado.

**Arrancala hoy**, en paralelo con todo lo demás. No depende de YCloud ni del
número.

---

## 4. Las cinco plantillas

**Por qué hacen falta.** WhatsApp solo deja escribirle libremente a alguien
dentro de las 24 h posteriores a *su* último mensaje. Fuera de esa ventana, solo
plantillas aprobadas por Meta. Todos los recordatorios caen fuera. Por eso el
texto tiene que estar aprobado **antes** de poder usarse.

En YCloud: **WhatsApp → Templates → Create**. YCloud las manda a Meta para
aprobación; el resultado es el mismo que crearlas en la consola de Meta, con
mejor interfaz.

Para las cinco: idioma **Español (ARG)** (`es_AR`), categoría **Utilidad**.

> **La categoría importa.** "Utilidad" es para algo que la persona pidió o agendó — se aprueba rápido y es la tarifa más barata. Si las cargás como "Marketing" tardan más y cuestan más. Un recordatorio de una reunión que la persona agendó es utilidad.

### 4.1 `demo_confirmada`

**Cuerpo:**

```
Hola {{1}}, quedó confirmada tu reunión de ShipSafe para el {{2}}.

Un pedido: si podés, sumá a quien tiene que aprobar una herramienta así. No es
para venderle, es al revés: nos ahorra a los dos una reunión entera de repetir
todo.

Te llegó la invitación con el link por mail.
```

**Botones** → Respuesta rápida, dos:

- `Confirmo`
- `Necesito reagendar`

*Ejemplos para la aprobación:* {{1}} = `Martín`, {{2}} = `martes 2 de septiembre a las 15:30`

> Los botones son la pieza clave. Cuando alguien toca uno, queda en HubSpot en `ss_wa_respuesta` — y además se abre la ventana de 24 h, así que a partir de ahí le podés escribir libre. Un "necesito reagendar" un día antes es un no-show que se convierte en reunión.

### 4.2 `demo_recordatorio_24h`

```
Hola {{1}}, mañana a las {{2}} tenemos la reunión de ShipSafe.

El link está en la invitación que te llegó por mail. Si se te complicó, avisame
por acá y la movemos.
```

**Botones:** `Confirmo` · `Necesito reagendar`

### 4.3 `demo_recordatorio_2h`

```
Hola {{1}}, en un par de horas nos vemos: la reunión es a las {{2}}. El link
está en la invitación por mail.
```

Sin botones.

### 4.4 `demo_por_empezar`

```
Hola {{1}}, estoy entrando a la sala. Te espero.
```

Sin botones.

### 4.5 `demo_reagendar`

```
Hola {{1}}, vi que se canceló la reunión. Ningún problema.

Si querés que la busquemos para otro día, respondé este mensaje y te paso dos
horarios que me sirvan.
```

Sin botones.

> **Regla de nomenclatura:** los nombres tienen que ser **exactamente** esos. El código los busca por nombre; si le cambiás uno, ese mensaje deja de salir y no vas a ver ningún error hasta que mires los logs.

---

## 5. Calendly para el cron

> Los recordatorios solo necesitan **lectura** por API, que funciona en cualquier
> plan de Calendly, incluido el gratuito. Lo que sí requiere Standard es el
> webhook de la confirmación inmediata (ver `docs/embudo-meta-ads.md`).

El cron necesita leer las reuniones que vienen.

```bash
export CALENDLY_TOKEN=<tu personal access token>
curl -s https://api.calendly.com/users/me \
  -H "Authorization: Bearer $CALENDLY_TOKEN" | jq -r '.resource.current_organization'
```

```
CALENDLY_TOKEN=<el token>
CALENDLY_ORGANIZATION=<lo que devolvió el curl>
```

**Además:** en Calendly, agregá al evento la pregunta de teléfono
(**Invitee Questions → Phone number → Required**). Sin teléfono no hay mensaje.
El cron cae al teléfono guardado en HubSpot como respaldo, pero el del evento es
más confiable.

---

## 6. El cron

Corre desde un cron externo, no desde `vercel.json`: el plan Hobby de Vercel
solo admite crons diarios y una expresión más frecuente **hace fallar el
deployment entero**. El detalle completo está en `docs/crons.md`.

En `cron-job.org` (gratis):

- URL: `https://www.shipsafe.lat/api/cron/recordatorios`
- Cada 15 minutos
- Header: `Authorization: Bearer <WEBHOOK_SHARED_SECRET>`

### Cómo decide qué mandar

| Recordatorio | Ventana | Plantilla |
|---|---|---|
| Confirmación | Al agendar *(no usa el cron)* | `demo_confirmada` |
| 24 horas antes | Entre 22 h y 26 h antes | `demo_recordatorio_24h` |
| 2 horas antes | Entre 90 y 150 min antes | `demo_recordatorio_2h` |
| Por empezar | Entre 5 y 25 min antes | `demo_por_empezar` |

Las ventanas son anchas a propósito: con el cron cada 15 minutos, una ventana
angosta se saltea un envío si un ciclo se demora.

**No manda dos veces lo mismo.** Lo enviado queda anotado en el contacto de
HubSpot (`ss_wa_enviados`) junto al identificador de esa reunión. Si la persona
reagenda, cambia el identificador y la secuencia arranca de cero sola.

---

## 7. Costo

Meta cobra por conversación iniciada, no por mensaje, y las de utilidad son la
categoría más barata. Con 15 demos al mes y tres o cuatro mensajes cada una, el
gasto queda en el orden de unos pocos dólares mensuales — mucho menos de lo que
cuesta una sola demo perdida por no-show.

Los precios cambian por país y por categoría: mirá la tabla vigente en la
documentación de precios de WhatsApp Business antes de presupuestar.

---

## 8. QA

- [ ] Las cinco plantillas figuran **Aprobadas** en YCloud
- [ ] Variables cargadas en Vercel y deploy hecho
- [ ] Agendar una reunión de prueba con tu propio número
- [ ] Llega `demo_confirmada` con tu nombre y la fecha bien formateada, en hora argentina
- [ ] Tocar **Confirmo** → en HubSpot el contacto queda con `ss_wa_respuesta = confirmo`
- [ ] Llamar al cron a mano y ver que responde `{"ok":true,...}`:

```bash
curl -s https://www.shipsafe.lat/api/cron/recordatorios \
  -H "Authorization: Bearer $WEBHOOK_SHARED_SECRET" | jq
```

- [ ] Agendar otra prueba para dentro de ~20 minutos → en el ciclo siguiente llega `demo_por_empezar`
- [ ] Cancelar una reunión de prueba → llega `demo_reagendar`
- [ ] Confirmar que un segundo ciclo del cron **no** vuelve a mandar lo mismo

**Si algo no sale:** Vercel → Logs, filtrá por `[whatsapp]`, `[cron]` o `[calendly]`. Un error de plantilla no aprobada aparece con el nombre exacto de la plantilla. YCloud además tiene su propio registro de envíos en Developers → Logs.

---

## Confirmar, reagendar y el que no contesta

### Lo que pasa cuando tocan un botón

| Botón | Qué hace el sistema, solo |
|---|---|
| **Confirmo** | Guarda `ss_wa_respuesta = confirmo` y saca la marca de "no confirmó". Nadie tiene que perseguirlo |
| **Necesito reagendar** | **Cancela la reunión en Calendly**, libera el horario y le manda el link para elegir uno nuevo |

El mensaje con el link va como texto libre, sin plantilla: tocar el botón abrió
la ventana de 24 h, así que ahí ya se puede escribir normal.

### El que no contesta: por qué NO se cancela solo

Es tentador poner "si no confirmás en 24 h, se cancela". **No lo hagas, y el
sistema está construido para que no pase.**

Tres razones, en orden de peso:

1. **En B2B el silencio casi nunca significa "no voy".** Significa que el tipo
   está en una planta, con casco, y el WhatsApp le llegó mientras caminaba. Un
   porcentaje alto de los que nunca contestan igual se conectan a la reunión.
2. **La asimetría es brutal.** Un no-show te cuesta 30 minutos. Una reunión
   cancelada de más te cuesta un cliente potencial, con un LTV de miles de
   dólares y una demo calificada que pagaste entre USD 25 y 50 en anuncios.
3. **Te saca la mejor jugada que tenés:** el mensaje de "estoy entrando a la
   sala" 10 minutos antes recupera una parte importante de los que se
   olvidaron. Si cancelaste la reunión a las 24 h, esa jugada no existe.

### Lo que sí hace con el silencio

Entre 3 y 6 horas antes de la reunión, si la persona todavía no confirmó, el
sistema le pone `ss_wa_sin_confirmar = true` al contacto.

**El silencio se usa como señal para actuar, no para cancelar.** Con esa
propiedad armás en HubSpot lo que quieras:

- Una **vista filtrada** "Sin confirmar hoy", que mirás a la mañana
- Un **workflow** que te crea una tarea de llamado
- Una **notificación** al canal del equipo

Una llamada de 30 segundos a alguien que no contestó el WhatsApp rescata muchas
más reuniones de las que cancela una regla automática. Y si de esa llamada sale
que no puede, ahí lo reagendás vos, con la persona del otro lado.

> **La regla de fondo:** cancelar es una decisión que toma la persona, no el
> sistema. El sistema le hace fácil decidir y te avisa a vos cuando no decidió.

---

## Qué NO hace esto

- **No contesta preguntas.** Si alguien escribe algo que no es confirmar o reagendar, el mensaje queda en la bandeja de YCloud para que lo atienda una persona. Es a propósito: un bot contestando dudas comerciales de un SaaS B2B hace más daño que bien.
- **No hace el setting del lead que no agendó.** Eso sigue siendo tarea manual desde HubSpot, con los mensajes de `operacion-comercial-shipsafe.md`. Automatizar el primer contacto en frío tiene otro riesgo: te bloquean el número.
- **No manda el mensaje de T–10 min si la reunión se agendó hace 5 minutos.** El cron solo mira reuniones futuras dentro de su ventana.
- **No cancela reuniones por su cuenta.** Solo cancela cuando la persona tocó "Necesito reagendar". Ver la sección de arriba.
