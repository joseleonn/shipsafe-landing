# WhatsApp — confirmaciones y recordatorios automáticos

Automatiza el playbook de asistencia. Ataca la métrica más cara del embudo: la
diferencia entre **demos agendadas** y **demos realizadas**.

Sin recordatorios, el no-show en B2B argentino con agenda a 3–5 días vista está
entre 30% y 50%. Con la secuencia puesta baja a 10–20%. No toca el presupuesto
de ads: son las mismas agendas, mejor aprovechadas.

---

## ⚠️ Antes que nada: la decisión del número

**Un número que conectás a la Cloud API deja de funcionar en la app de WhatsApp
Business del celular.** No hay vuelta atrás sin dar de baja y volver a
registrar, con días de por medio.

Tu número actual **341 306-7158** está en toda la comunicación de ShipSafe: la
web, los anuncios, la firma. Y hoy lo usás para conversaciones a mano.

| Camino | Qué pasa |
|---|---|
| **Línea nueva dedicada** *(recomendado)* | Los automáticos salen de un número nuevo. El 341 306-7158 sigue intacto para hablar a mano. Cuesta una línea prepaga |
| **Migrar el número actual** | Todo sale del número que la gente ya conoce, que es mejor para la tasa de respuesta. Pero perdés la app en el celular: toda conversación pasa a ser por API o por la bandeja de Business Manager |

> No arranques el paso 1 sin decidir esto. Es lo único de todo el sistema que no se puede deshacer con un clic.

### De dónde sacar el número

Meta pide que el número sea tuyo, que tenga código de país y de área, y que
pueda **recibir un SMS o una llamada de voz** para el código de verificación.
Nada más. No hace falta que sea un celular, ni que la SIM viva en un teléfono
después: la verificación se hace una sola vez y de ahí en más todo corre en la
nube de Meta.

| Opción | Cómo | Costo | Veredicto |
|---|---|---|---|
| **SIM prepaga** (Personal, Claro, Movistar) | Local de la operadora o kiosco. Se registra con DNI | Bajo, pago único | ✅ **La más simple** |
| **El fijo de la oficina** | Verificación por llamada de voz | Gratis si ya lo tenés | ✅ Buena para B2B: un fijo de Rosario da imagen de empresa establecida |
| **Número VoIP** (Twilio, Zadarma) | Verificación **por voz**, no por SMS | Mensual | ⚠️ Solo si necesitás un número de otro país. Meta desaconseja el SMS en VoIP |
| **Número de prueba de Meta** | Se genera solo al crear la app | Gratis | 🔧 Solo para QA: envía a un puñado de números que autorizás a mano |

**Tres condiciones que no se pueden saltear:**

1. **El número no puede tener una cuenta de WhatsApp activa.** Si la tiene, hay
   que borrarla desde la app antes de registrarlo (Ajustes → Cuenta → Eliminar
   mi cuenta). Una SIM nueva ya viene limpia.
2. **Durante la verificación, desactivá desvío de llamadas e IVR** si usás un
   fijo. El código llega por llamada y tiene que atender la línea, no un menú.
3. **Mantené la línea activa.** Meta puede pedir re-verificar. Una prepaga que
   se da de baja por falta de uso es un número perdido.

### El orden que ahorra plata y dolores de cabeza

1. Creá la app en Meta y usá **el número de prueba** para validar el circuito
   completo: que salgan los mensajes, que los botones vuelvan a HubSpot, que el
   cron no duplique.
2. Recién cuando eso funcione, conseguí el número definitivo y registralo.

Así, si algo del código o de la configuración falla, te enterás antes de haber
comprado nada.

### Verificá el negocio, o vas a aparecer como un número desconocido

Configuración del negocio → Centro de seguridad → **Verificación del negocio**.

Sin eso, tus mensajes llegan desde un número que la persona no tiene agendado y
sin nombre. Con la verificación aprobada, en el chat aparece **ShipSafe**.

Es la diferencia entre "quién me escribe" y "ah, la reunión que agendé". Cuando
el número es nuevo y nadie lo tiene en la agenda, esto pasa de ser un detalle
estético a ser lo que define si el mensaje se lee o se ignora. **Hacelo antes de
mandar el primer recordatorio.**

---

## 1. Crear la app en Meta

`developers.facebook.com` → Mis apps → Crear app → tipo **Negocio**.

Dentro de la app: Agregar producto → **WhatsApp** → Configurar.

Ahí mismo:

1. **Agregar número de teléfono.** Verificación por SMS o llamada.
2. **Copiar el "Identificador del número de teléfono"** (no el número, el ID):

```
WHATSAPP_PHONE_NUMBER_ID=<el id>
```

> El token temporal que muestra esa pantalla dura 24 horas. Sirve para probar, no para producción. El permanente sale en el paso siguiente.

---

## 2. Token permanente

Configuración del negocio → Usuarios → **Usuarios del sistema** → Agregar.

- Nombre: `ShipSafe API` · Rol: Administrador
- Agregar activos → tu app de WhatsApp → control total
- Generar nuevo token → seleccioná la app → permisos:

```
whatsapp_business_messaging
whatsapp_business_management
```

- Vencimiento: **Nunca**

```
WHATSAPP_ACCESS_TOKEN=<el token>
```

---

## 3. Webhook

En la app → WhatsApp → Configuración → Webhooks → Editar.

| Campo | Valor |
|---|---|
| URL de devolución de llamada | `https://shipsafe.lat/api/whatsapp/webhook` |
| Token de verificación | Uno que inventes vos |

```
WHATSAPP_VERIFY_TOKEN=<el mismo que pusiste ahí>
```

Verificar y guardar → después **Administrar** → suscribite al campo `messages`.

> Cargá primero la variable en Vercel y deployá. Si el endpoint no está publicado con el token correcto, la verificación falla.

---

## 4. Las cinco plantillas

**Por qué hacen falta.** WhatsApp solo deja escribirle libremente a alguien
dentro de las 24 h posteriores a *su* último mensaje. Fuera de esa ventana, solo
plantillas aprobadas por Meta. Todos los recordatorios caen fuera. Por eso el
texto tiene que estar aprobado **antes** de poder usarse.

Administrador de WhatsApp → Herramientas de la cuenta → **Plantillas de mensajes** → Crear.

Para las cinco: idioma **Español (ARG)**, categoría **Utilidad**.

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

Está en `vercel.json`, cada 15 minutos:

```json
{ "crons": [{ "path": "/api/cron/recordatorios", "schedule": "*/15 * * * *" }] }
```

**Si tu plan de Vercel no permite esa frecuencia**, el endpoint funciona igual
desde cualquier cron externo. En `cron-job.org` (gratis):

- URL: `https://shipsafe.lat/api/cron/recordatorios`
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

- [ ] Las cinco plantillas figuran **Aprobadas** en el Administrador de WhatsApp
- [ ] Variables cargadas en Vercel y deploy hecho
- [ ] Agendar una reunión de prueba con tu propio número
- [ ] Llega `demo_confirmada` con tu nombre y la fecha bien formateada, en hora argentina
- [ ] Tocar **Confirmo** → en HubSpot el contacto queda con `ss_wa_respuesta = confirmo`
- [ ] Llamar al cron a mano y ver que responde `{"ok":true,...}`:

```bash
curl -s https://shipsafe.lat/api/cron/recordatorios \
  -H "Authorization: Bearer $WEBHOOK_SHARED_SECRET" | jq
```

- [ ] Agendar otra prueba para dentro de ~20 minutos → en el ciclo siguiente llega `demo_por_empezar`
- [ ] Cancelar una reunión de prueba → llega `demo_reagendar`
- [ ] Confirmar que un segundo ciclo del cron **no** vuelve a mandar lo mismo

**Si algo no sale:** Vercel → Logs, filtrá por `[whatsapp]`, `[cron]` o `[calendly]`. Un error de plantilla no aprobada aparece con el nombre exacto de la plantilla.

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

- **No contesta preguntas.** Si alguien escribe algo que no es confirmar o reagendar, queda en el log y lo atendés vos. Es a propósito: un bot contestando dudas comerciales de un SaaS B2B hace más daño que bien.
- **No hace el setting del lead que no agendó.** Eso sigue siendo tarea manual desde HubSpot, con los mensajes de `operacion-comercial-shipsafe.md`. Automatizar el primer contacto en frío tiene otro riesgo: te bloquean el número.
- **No manda el mensaje de T–10 min si la reunión se agendó hace 5 minutos.** El cron solo mira reuniones futuras dentro de su ventana.
- **No cancela reuniones por su cuenta.** Solo cancela cuando la persona tocó "Necesito reagendar". Ver la sección de arriba.
