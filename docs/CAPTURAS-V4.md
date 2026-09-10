# Capturas v4: el recorrido de cada módulo

Lista armada recorriendo app.shipsafe.lat el 9/9/2026, entrando adentro de cada
módulo y no solo a los listados. Cada fila es una captura.

## Ver el recorrido antes de tener las capturas

    npm run capturas:rellenos
    npm run dev

Eso genera una imagen de relleno por cada captura que falta, con el nombre del
archivo escrito encima, y así se ve el recorrido completo de los dieciséis
módulos: el orden, los textos y cuántos pasos tiene cada uno. **Los rellenos
nunca salen publicados**: el sitio compilado los ignora.

## Cómo sacar las de verdad

Hay un script que las saca solo. Una vez:

    npm i -D playwright && npx playwright install chromium

Y después:

    npm run capturar

Abre una ventana de Chrome, espera a que te loguees vos, y a partir de ahí
navega solo. Las pantallas que se abren con una URL las dispara sin preguntar
(el listado de desvíos, el tablero, las mediciones, Analytics). Las que
necesitan un click (abrir un registro, una pestaña, un modal) las deja a mano,
te dice en la terminal qué tenés que poner en pantalla y espera un Enter.

Guarda cada imagen con el nombre exacto que le toca, en
`public/screenshots/v4/`. Se puede cortar y retomar: saltea las que ya están.

    npm run capturar -- --solo cap                    solo un módulo
    npm run capturar -- --rehacer cap-2-calendario.jpg  volver a sacar una

Cuando termines:

    npm run capturas

Eso arma el inventario y enciende los módulos que quedaron completos.

**Antes de arrancar:** filtrá la basura de test. En Checklists las filas
`[E2E Test]` y `E2E — NO TOCAR`; en Accidentes las filas `Test` y `Tat Test`;
en Analytics aparece un `Test Sector`. Para Accidentes y Permisos usá casos de
prueba: en esas pantallas se ven nombre y documento de personas reales.

---

## Operación

### 01 · Inspecciones y checklists con QR — `/checklists`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `insp-1-plantillas.jpg` | **Las plantillas.** Las plantillas de la empresa, no un checklist genérico. Cada una con su norma: extintores según IRAM 3517, andamios según Decreto 911/96 y Res. SRT 3067/14, escaleras, tableros, vehículos. |
| 2 | `insp-2-preguntas.jpg` | **Las preguntas.** Adentro está pregunta por pregunta: qué hay que mirar, cuáles exigen foto y cuáles exigen firma. Las armás desde cero o partís de una lista ya hecha. |
| 3 | `insp-3-preuso.jpg` | **Preuso y postuso.** Un mismo equipo puede tener una lista antes de usarlo y otra después. La de vehículos viene con las dos. |
| 4 | `insp-4-asignada.jpg` | **Pegada al equipo.** La plantilla queda asignada a los equipos que le corresponden. Cada equipo tiene su QR y el checklist se abre escaneándolo, sin buscar nada. |

### 02 · Ejecución desde el celular — `celular`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `exec-1-escaneo.jpg` | **Escanea el QR.** El operario apunta la cámara al código pegado en el equipo. Sin instalar nada y sin crear una cuenta: abre el navegador del teléfono y entra. |
| 2 | `exec-2-checklist.jpg` | **Responde.** El checklist de ese equipo, con OK, NO OK y N/A. Dos minutos parado al lado de la máquina. |
| 3 | `exec-3-foto.jpg` | **Saca la foto.** Cuando algo da NO OK, la foto y la observación quedan pegadas a esa respuesta. Esa es la evidencia que después nadie tiene que salir a buscar. |
| 4 | `exec-4-firma.jpg` | **Firma.** Firma en la pantalla y envía. Del otro lado el desvío ya existe. |

### 03 · Desvíos con dueño y fecha — `/desvios`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `desv-1-listado.jpg` | **El listado.** Cada NO OK aparece acá como un desvío numerado, con el equipo, la sucursal, el sector y el checklist que lo originó. |
| 2 | `desv-2-filtros.jpg` | **Los filtros.** Por estado, por sucursal, por prioridad. La pestaña de vencidos es la que se mira un lunes a la mañana. |
| 3 | `desv-3-asignado.jpg` | **Nace con dueño.** El desvío se auto-asigna al grupo que le corresponde a ese equipo. El de un extintor va al grupo de extintores, sin que nadie lo derive. |
| 4 | `desv-4-plazo.jpg` | **Con fecha límite.** Prioridad y fecha de vencimiento desde el momento en que nace. A partir de ahí hay alguien que responde por él y un día en que se vence. |

### 04 · Seguimiento hasta el cierre — `/desvios/{id}`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `desvm-1-origen.jpg` | **De dónde salió.** El desvío guarda el link a la inspección que lo originó. Un click y estás viendo la respuesta, la foto y quién la sacó. |
| 2 | `desvm-2-resolucion.jpg` | **La resolución.** Mantenimiento carga qué hizo y sube la foto. El supervisor puede aceptarla o rechazar la solución y devolverlo. |
| 3 | `desvm-3-historial.jpg` | **El recorrido.** Abierto, asignado, en proceso, resuelto, cerrado. Cada cambio con quién lo hizo, cuándo y qué escribió. |
| 4 | `desvm-4-auditoria.jpg` | **La traza.** Y debajo, el registro campo por campo: qué decía antes, qué dice después. Es lo que se muestra cuando alguien pregunta si esto se tocó. |

### 05 · Permisos de trabajo — `/permisos-trabajo`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `perm-1-listado.jpg` | **El listado.** Todos los permisos con su estado a la vista: borrador, pendiente, aprobado, en ejecución, rechazado. |
| 2 | `perm-2-nuevo.jpg` | **Se pide.** Trabajo en caliente, en altura o en espacio confinado, cada uno con su plantilla. Se describe la tarea y se elige la sucursal. |
| 3 | `perm-3-condiciones.jpg` | **Las condiciones.** El checklist de condiciones que hay que verificar antes de habilitar la tarea. |
| 4 | `perm-4-personas.jpg` | **Quién es quién.** Ejecutante, solicitante y autorizante, cada uno con su ficha de empleado. Sin eso el permiso no avanza. |

### 06 · Firmas y aprobaciones a distancia — `/permisos-trabajo/{id}`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `firm-1-pendiente.jpg` | **Esperando.** El permiso queda pendiente y aparece en la pantalla del que autoriza, esté en la obra o en la oficina. |
| 2 | `firm-2-firmas.jpg` | **Se firma.** Cada firma queda con el nombre, el documento y la hora. El ejecutante firma desde donde está. |
| 3 | `firm-3-aprobado.jpg` | **Aprobado.** Borrador, pendiente, aprobado, con la hora de cada paso. Recién ahí se habilita iniciar la ejecución. |
| 4 | `firm-4-pdf.jpg` | **En PDF.** El permiso completo se descarga en PDF, que es lo que pide un cliente o una auditoría. |

## Personas y recursos

### 07 · Entregas de EPP con firma — `/epp`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `epp-1-entregas.jpg` | **Las entregas.** Cada entrega con su fecha y su estado de firma. El filtro de pendientes de firma dice qué falta cerrar. |
| 2 | `epp-2-nueva.jpg` | **Se entrega.** De a uno o por cuadrilla, eligiendo del catálogo. El stock se descuenta en el momento. |
| 3 | `epp-3-firma.jpg` | **Conformidad.** El trabajador firma y deja su conformidad: conforme, firma con observaciones, o no firma. Ese campo es el que pide la normativa. |
| 4 | `epp-4-constancia.jpg` | **La constancia.** Queda la constancia en PDF, con el ítem, la cantidad, la fecha y quién entregó. |
| 5 | `epp-5-stock.jpg` | **El pañol.** Catálogo, convenios y stock en la misma pantalla, para que el pañol y las entregas no vivan en dos planillas. |

### 08 · El pañol en el celular — `celular`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `eppm-1-entrega.jpg` | **El pañolero.** La entrega se carga desde el teléfono, en el pañol, con el trabajador adelante. |
| 2 | `eppm-2-firma.jpg` | **Firma ahí.** El operario firma en la pantalla en el momento. No hay planilla que llevar después a la oficina. |
| 3 | `eppm-3-constancia.jpg` | **La constancia.** Queda emitida y descargable, con la fecha y el ítem. |

### 09 · Capacitaciones — `/capacitaciones`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `cap-1-listado.jpg` | **El listado.** Cada capacitación con su duración, su fecha límite, su tipo y si es de las obligatorias por ley. Las vencidas quedan a la vista. |
| 2 | `cap-2-calendario.jpg` | **El calendario anual.** El año entero mes por mes, con lo dictado, lo vencido y lo planificado. Es el plan anual que pide una auditoría, armado solo. |
| 3 | `cap-3-adentro.jpg` | **Cómo se arma.** Adentro: la descripción con su resolución, la duración, el tipo, si lleva examen y el porcentaje mínimo para aprobar. |
| 4 | `cap-4-contenidos.jpg` | **Los contenidos.** Los videos y los links que el trabajador va a ver, cargados en la misma capacitación. |
| 5 | `cap-5-asignacion.jpg` | **A quién le toca.** Se asignan los empleados y les llega la notificación con el link. La app avisa si falta la fecha de comienzo o los contenidos. |
| 6 | `cap-6-examen.jpg` | **El examen.** Se rinde desde la plataforma, o se registra el resultado de uno que se tomó afuera. |
| 7 | `cap-7-resultados.jpg` | **Quiénes aprobaron.** La lista de participantes con su resultado, y la asistencia en PDF. Eso es lo que se presenta cuando piden constancia de capacitación. |
| 8 | `cap-8-tablero.jpg` | **En números.** Y en los tableros, cuántas se dictaron, cuántas están vencidas y qué porcentaje del personal las tiene al día. |

### 10 · Equipamiento con QR y vencimientos — `/equipamiento`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `equ-1-inventario.jpg` | **El inventario.** Los equipos con su código, tipo, sucursal, sector, estado y vencimiento. Andamios, extintores, herramientas, equipos de medición, botiquines. |
| 2 | `equ-2-alta.jpg` | **Se da de alta.** Un equipo nuevo entra con su código, su sucursal y su sector, y ahí queda listo para que se le asignen checklists. |
| 3 | `equ-3-qr.jpg` | **Los QR.** Se exportan todos juntos, se imprimen y se pegan. Desde ahí se abre el checklist de ese equipo. |
| 4 | `equ-4-vencidos.jpg` | **Los vencimientos.** Lo que ya venció y lo que está por vencer, filtrado. Avisa antes, no cuando alguien se acuerda. |

## Cumplimiento

### 11 · Mediciones reglamentarias — `/mediciones`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `med-1-catalogo.jpg` | **Cada una con su norma.** Puesta a tierra en ohm por la Res. SRT 900/2015, ruido en dB(A) por la 85/2012, iluminación en lux por la 84/2012, carga térmica en TGBH por la 30/2023. Cada medición trae su resolución, su unidad y su límite. |
| 2 | `med-2-carga.jpg` | **Se carga.** El valor medido, dónde, cuándo y con qué equipo, con el protocolo adjunto. |
| 3 | `med-3-resultado.jpg` | **Contra el límite.** El resultado se compara solo contra el límite legal, así que no hay que ir a buscar la resolución para saber si pasa. |
| 4 | `med-4-vencimiento.jpg` | **Cuándo toca la próxima.** Cada medición tiene su periodicidad y avisa cuando se acerca la fecha. |

### 12 · Accidentes e investigación — `/accidentes`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `acc-1-listado.jpg` | **El registro.** Accidentes y enfermedades con su gravedad, su tipo y el estado de la investigación, con el aviso de los plazos de denuncia a la ART antes de que se pasen. |
| 2 | `acc-2-detalle.jpg` | **Qué pasó.** El relato del hecho, la fecha, el sector, los datos del accidentado y su antigüedad, y la denuncia a la ART con su fecha. |
| 3 | `acc-3-causa.jpg` | **Por qué pasó.** La IA propone el análisis: causa inmediata, causas básicas y factores contribuyentes. Vos lo editás, y queda registrado quién lo editó. |
| 4 | `acc-4-supuestos.jpg` | **Qué falta saber.** Cuando el análisis se apoya en supuestos lo dice, y lista qué datos faltan para cerrar la investigación en serio. |
| 5 | `acc-5-acciones.jpg` | **Qué se hace.** Acciones correctivas y preventivas, cada una con su responsable y su plazo. De ahí sale el informe en PDF. |

### 13 · Matrices y mapa de la organización — `/matrices y /mapa`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `mapa-1-matrices.jpg` | **Las matrices.** La matriz de riesgos por establecimiento y el plan de acción con todas las medidas ordenadas por lo que urge. |
| 2 | `mapa-2-arbol.jpg` | **El mapa.** Cada caja es algo que la matriz exige. El color dice cómo está: hecho, vencido, sin completar. |
| 3 | `mapa-3-detalle.jpg` | **Qué falta.** Se abre una caja y aparece qué falta, por sector y por responsable. Ahí se ve la distancia entre lo que la matriz exige y lo que la empresa hizo. |

## Gestión

### 14 · Lo que requiere atención, hoy — `/dashboard`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `dash-1-tarjetas.jpg` | **Lo urgente.** Desvíos activos, vencidos, checklists pendientes, equipos a revisar y permisos esperando autorización. Lo primero que se abre a la mañana. |
| 2 | `dash-2-pendientes.jpg` | **Y se resuelve.** Lo vencido, lo sin completar y lo próximo, cada uno con la norma que lo exige y el botón para completarlo desde ahí mismo. |

### 15 · Tableros para la gerencia — `/analytics`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `kpi-1-resumen.jpg` | **El resumen.** Conformidad de inspecciones, desvíos abiertos, incidentes del período y un score de riesgo por sector, comparado contra el período anterior. |
| 2 | `kpi-2-desvios.jpg` | **Desvíos.** Por estado, por prioridad y por sector, para ver dónde se está juntando el trabajo sin hacer. |
| 3 | `kpi-3-inspecciones.jpg` | **Inspecciones.** Cuántas se hicieron, cuántas dieron NO OK y en qué equipos se repite. |
| 4 | `kpi-4-accidentes.jpg` | **Accidentes.** Las estadísticas y el mapa de lesiones, que es lo que se presenta a la gerencia y a la aseguradora. |
| 5 | `kpi-5-epp.jpg` | **EPP y capacitaciones.** Entregas, firmas pendientes, capacitaciones dictadas y vencidas. Sin armar la planilla a mano. |

### 16 · Todo también en el celular — `celular`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `mob-1-dashboard.jpg` | **El tablero.** El mismo tablero en el teléfono del supervisor, para recorrer la planta con los datos en la mano. |
| 2 | `mob-2-desvios.jpg` | **Los desvíos.** Los desvíos abiertos y vencidos, con la foto, sin volver a la oficina. |
| 3 | `mob-3-permisos.jpg` | **Los permisos.** Un permiso se revisa y se aprueba desde el teléfono, así la tarea no espera. |
| 4 | `mob-4-equipos.jpg` | **Los equipos.** El inventario y los vencimientos, para chequear un equipo parado adelante de él. |

---

**Total: 67 capturas.**
