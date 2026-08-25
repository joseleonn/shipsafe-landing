# Dashboard interno (`/dashboard`)

Reemplaza la planilla de KPIs. En vez de cargar los números de cada semana a
mano, lee HubSpot y Meta en vivo y los compara contra las metas del playbook.

Vive en `www.shipsafe.lat/dashboard`, protegido por contraseña. No se indexa
(`robots.ts` lo bloquea y las páginas llevan `noindex`).

---

## 1. Qué muestra y de dónde sale cada número

| Bloque | Fuente | Detalle |
|---|---|---|
| Costo por agenda calificada, CAC, clientes | Meta + HubSpot | Gasto dividido por negocios que llegaron a cada etapa |
| Inversión, CPM, CTR de enlace | Meta Marketing API | Totales de la cuenta publicitaria en el período |
| Conversión de la landing | Meta + HubSpot | Leads sobre clics al enlace |
| Costo por lead, lead a agenda, asistencia, demo a cierre | Meta + HubSpot | Tasas del embudo |
| Embudo | HubSpot | Contactos con recurso descargado + negocios del pipeline |
| Día a día | HubSpot + Meta | Leads por día y gasto por día, en dos gráficos separados |
| Por creativo | Meta + HubSpot | Nombre del anuncio cruzado con `ss_utm_content` |

**Los leads salen de contactos, no de negocios.** Quien descarga el recurso y no
califica nunca genera un negocio: si contáramos leads con negocios nos faltaría
justo la gente que el filtro descarta, que es la mitad del diagnóstico.

**El conteo es por cohorte:** "de la gente que entró en este período, cuántos
llegaron hasta cada etapa". Un lead de agosto que cierra en octubre sigue
contando en agosto. Es lo que sirve para juzgar una campaña.

---

## 2. Qué hay que configurar

Cuatro variables en **Vercel → Settings → Environment Variables**, y las mismas
en `.env.local` si querés probarlo local.

### 2.1 La contraseña

```bash
# Elegí una larga. Es lo único que separa tus números de cualquiera que
# adivine la URL.
DASHBOARD_PASSWORD=...

# Clave con la que se firma la cookie de sesión. Generala así:
#   openssl rand -hex 32
# Si tiene menos de 32 caracteres, el dashboard no deja entrar a nadie.
DASHBOARD_SECRET=...
```

La sesión dura 7 días. Para sacarle el acceso a alguien, cambiá
`DASHBOARD_PASSWORD` en Vercel y volvé a deployar: las sesiones abiertas siguen
vivas hasta que venzan, así que si es urgente cambiá también `DASHBOARD_SECRET`
y todas las sesiones se cortan al instante.

### 2.2 El token de Meta para leer el gasto

> **Postergado — verificado el 25/08/2026.** El Business Manager de SHIPSAFE tiene la
> app, el píxel y el conjunto de datos, pero **ninguna cuenta publicitaria**: la campaña
> todavía no se creó. El píxel y el token de la API de Conversiones salieron de Events
> Manager, que no la necesita. Sin cuenta publicitaria no hay gasto que leer, así que
> este bloque queda para el día que se arme la campaña. El dashboard funciona sin él.
>
> Cuando llegue ese momento, **creá la cuenta publicitaria adentro del Business Manager
> SHIPSAFE**, no desde el perfil personal: moverla después es un trámite que a veces no
> se puede deshacer, y ahí ya está la verificación de negocio y el usuario del sistema.


**No sirve el token de la API de Conversiones.** Ese solo escribe eventos. Para
leer cuánto gastaste hace falta uno con permiso `ads_read`. Son dos tokens
distintos y conviven sin problema.

Usá el **usuario del sistema** de Business Manager, no el Explorador de la API. El
Explorador funciona pero da un token que vence a los 60 días; el del usuario del sistema
se puede generar como no expirable.

En <https://business.facebook.com/>, Configuración del negocio, Usuarios, Usuarios del
sistema:

1. Usá el `Conversions API System User` que ya existe, o creá uno
2. *Agregar activos*, Cuentas publicitarias, elegí la tuya, permiso de **ver rendimiento**
3. *Generar nuevo token*, elegí la app, marcá **`ads_read`**
4. En caducidad elegí **Nunca**
5. Copialo en el momento: no se vuelve a mostrar

```bash
META_ADS_TOKEN=...
META_AD_ACCOUNT_ID=act_1234567890   # el prefijo act_ es opcional
```

Sin estas dos, el dashboard **igual funciona**: muestra el embudo y avisa en
pantalla que faltan. Lo que no vas a ver es CPL, CAC ni retorno.

### 2.3 Opcionales

```bash
DASHBOARD_ARS_POR_USD=1500       # por defecto 1500
DASHBOARD_MESES_RETENCION=24     # por defecto 24, para el LTV:CAC
```

---

## 3. Verificar que quedó bien

**No des nada por hecho porque el deploy pasó.** Estos tres comandos son la
prueba:

```bash
# 1. Sin cookie tiene que rebotar al login (307)
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
  https://www.shipsafe.lat/dashboard

# 2. Una contraseña incorrecta tiene que dar 401
curl -s -w "\n%{http_code}\n" -X POST \
  https://www.shipsafe.lat/api/dashboard/login \
  -H 'Content-Type: application/json' -d '{"password":"cualquiera"}'

# 3. La correcta tiene que dar 200 y devolver la cookie
curl -s -c /tmp/ck.txt -w "\n%{http_code}\n" -X POST \
  https://www.shipsafe.lat/api/dashboard/login \
  -H 'Content-Type: application/json' -d '{"password":"LA-TUYA"}'
grep ss_dash /tmp/ck.txt
```

Después entrá por el navegador. Si arriba aparece un cartel rojo diciendo que no
pudo leer HubSpot, o uno gris diciendo que faltan las variables de Meta, esa es
la respuesta: no hay que adivinar nada.

---

## 4. Las metas

Están todas en `src/lib/dashboard/metas.ts`, en un solo objeto y con el
diagnóstico de qué mirar cuando cada una se rompe. Salen de la tabla de control
del playbook y **son hipótesis de arranque, no promesas**.

A los 14 días de campaña, reemplazalas por los números reales. Es el único
archivo que hay que tocar: el dashboard no tiene ninguna cifra escrita adentro.

---

## 5. Decisiones de diseño que conviene no deshacer

**Un guion largo no es un cero.** Cuando falta el dato para calcular algo, se
muestra `—`. Un cero se lee como "salió mal" y un guion se lee como "todavía no
sé", que durante las dos primeras semanas es la verdad.

**Las insignias de estado llevan símbolo y texto, no solo color.** Sobre este
fondo el rojo de "fuera de techo" y el verde de "en objetivo" quedan a una
distancia de 4,1 con deuteranopía: con color solo, una de cada doce personas ve
dos insignias iguales.

**Leads por día y gasto por día son dos gráficos, no uno con dos ejes.** Un eje
doble deja que la escala elegida decida qué línea va arriba, así que se puede
contar cualquier historia moviendo un número que el lector no ve.

**Las barras del embudo son todas del mismo color.** El largo ya codifica la
magnitud; pintarla otra vez con una rampa no agrega información. Además la
rampa azul de cinco pasos no pasa la validación de contraste sobre este fondo.

**Las filas que aparecen de un solo lado en "Por creativo" no se ocultan.** Un
anuncio que gasta y no tiene ni un lead atribuido es justamente lo que hay que
ver: o no convierte, o el `utm_content` del enlace no coincide con el nombre del
anuncio.

---

## 6. Límites conocidos

- **El rate limit del login es por instancia.** Vercel levanta varias, así que
  ocho intentos por instancia no es lo mismo que ocho en total. Corta el script
  tonto, no un ataque en serio. Con una contraseña larga alcanza.
- **Tope de 1.000 registros por objeto y por período.** Muy por encima de lo que
  este canal va a mover, pero si algún día se pasa, los números quedan cortos
  sin avisar. Está en `MAX_PAGINAS` de `hubspot-metricas.ts`.
- **Las percepciones impositivas de la tarjeta argentina no se ven.** El gasto
  que informa Meta es el de la plataforma; lo que te debita el banco es mayor.
- **El LTV:CAC asume 24 meses de retención.** Con un cliente no hay dato de
  retención: es una hipótesis, no una medición.
