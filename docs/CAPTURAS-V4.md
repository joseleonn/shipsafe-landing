# Capturas v4: el recorrido de cada módulo

Lista armada recorriendo app.shipsafe.lat el 8/9/2026 con la organización
SHIPSAFE Demo SyH. Cada fila es una captura.

## Cómo sacarlas

**Pantallas de escritorio.** Ventana de Chrome a **1440 px de ancho**. En
DevTools: `Cmd+Shift+P` → *Capture screenshot* (la del viewport, no la de
página completa). Sale a 2x sola.

**Pantallas de celular.** Modo dispositivo de Chrome, **390 × 844, DPR 2**, y
la misma captura de viewport. Salen a 780 × 1688 y yo las normalizo a
720 × 1560, que es la medida del marco de la landing.

**Dónde.** `public/screenshots/v4/` con el nombre exacto de la columna
"archivo", en `.jpg`. Yo las optimizo y las cableo.

**Antes de disparar:** en Checklists filtrá o sacá las filas `[E2E Test]` y
`E2E — NO TOCAR`, y en Accidentes las filas `Test` / `Tat Test`. En Analytics
aparece un `Test Sector` en riesgo por sector.

---

## Operación

### 01 · Inspecciones y checklists con QR — `/checklists`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `insp-1-plantillas.jpg` | El listado de plantillas con el filtro **Activos**. Que se vean las de norma real (extintores IRAM 3517, vehículos, escaleras SRT 3067/14). |
| 2 | `insp-2-preguntas.jpg` | Una plantilla abierta con sus preguntas. Sirve la de extintores. |
| 3 | `insp-3-asignada.jpg` | La plantilla con los equipos asignados ("2 equipos asignados") y el QR. |

### 02 · Ejecución desde el celular — celular

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `exec-1-escaneo.jpg` | La pantalla de escaneo (botón **Escanear** de la barra de abajo). |
| 2 | `exec-2-checklist.jpg` | El checklist en ejecución con OK / NO OK / N/A. |
| 3 | `exec-3-foto.jpg` | Un ítem en **NO OK** con la foto adjunta y la observación. |
| 4 | `exec-4-firma.jpg` | La firma y el botón de enviar. |

### 03 · Desvíos con dueño y fecha — `/desvios`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `desv-1-listado.jpg` | La tabla con título, identificador, tipo de equipo, sucursal, origen, sector y checklist. |
| 2 | `desv-2-filtros.jpg` | El panel **Filtros** abierto, o `/desvios?isOverdue=true` con la pestaña Vencidos. |
| 3 | `desv-3-asignar.jpg` | Un desvío asignándose a un responsable, con prioridad y fecha límite. |

### 04 · Seguimiento hasta el cierre — `/desvios/{id}`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `desvm-1-abierto.jpg` | El desvío recién abierto, con el link a la ejecución que lo originó. |
| 2 | `desvm-2-resolucion.jpg` | La resolución cargada con la foto del arreglo. |
| 3 | `desvm-3-historial.jpg` | El historial de cambios: quién, cuándo, qué campo. |

### 05 · Permisos de trabajo — `/permisos-trabajo`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `perm-1-listado.jpg` | La tabla con los cuatro estados a la vista: Borrador, Aprobado, En Ejecución, Rechazado. |
| 2 | `perm-2-nuevo.jpg` | **Nuevo Permiso**: el tipo (caliente / altura / espacio confinado) y el checklist de condiciones. |
| 3 | `perm-3-ejecucion.jpg` | Un permiso en ejecución, con fechas y sucursal. |

### 06 · Firmas y aprobaciones a distancia — `/permisos-trabajo/{id}`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `firm-1-solicitud.jpg` | El permiso pedido, esperando autorización. |
| 2 | `firm-2-firmas.jpg` | Las firmas de solicitante, ejecutante y autorizante. |
| 3 | `firm-3-aprobado.jpg` | Aprobado, con el historial de estados. |

## Personas y recursos

### 07 · Entregas de EPP con firma — `/epp`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `epp-1-entregas.jpg` | Pestaña **Entregas**, filtro *Pendientes de firma*. |
| 2 | `epp-2-nueva.jpg` | **Nueva entrega** (o *Entrega masiva*), con el catálogo. |
| 3 | `epp-3-firma.jpg` | La firma con el campo de conformidad (conforme / con observaciones / no firma). |
| 4 | `epp-4-stock.jpg` | Pestaña **Stock** o **Catálogo**, para que se vea que el pañol vive ahí. |

### 08 · El pañol en el celular — celular

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `eppm-1-entrega.jpg` | La entrega desde el teléfono del pañolero. |
| 2 | `eppm-2-firma.jpg` | El operario firmando en el momento. |
| 3 | `eppm-3-constancia.jpg` | La constancia ya emitida. |

### 09 · Capacitaciones — `/capacitaciones`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `cap-1-listado.jpg` | El listado con las etiquetas **Legal**, **Con examen**, límite y duración. |
| 2 | `cap-2-programa.jpg` | **Programa Anual**. |
| 3 | `cap-3-asistencia.jpg` | Asistencia y examen de una capacitación. |

### 10 · Equipamiento con QR y vencimientos — `/equipamiento`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `equ-1-inventario.jpg` | La tabla con código, tipo, sucursal, sector, estado y vencimiento. |
| 2 | `equ-2-qr.jpg` | **Exportar QRs**. |
| 3 | `equ-3-vencidos.jpg` | El filtro por vencimiento expirado. |

## Cumplimiento

### 11 · Mediciones reglamentarias — `/mediciones`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `med-1-catalogo.jpg` | Las mediciones con su resolución, unidad y límite (puesta a tierra Ω, ruido dB(A), iluminación lux, carga térmica TGBH). |
| 2 | `med-2-carga.jpg` | Cargar una medición. |
| 3 | `med-3-resultado.jpg` | El resultado contra el límite legal. |

### 12 · Accidentes e investigación — `/accidentes`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `acc-1-listado.jpg` | El listado con la gravedad y el aviso **Denuncia ART pendiente (+48hs)**. |
| 2 | `acc-2-detalle.jpg` | Un accidente con tipo, gravedad y estado de la investigación. |
| 3 | `acc-3-causa.jpg` | El análisis de causa raíz. |
| 4 | `acc-4-informe.jpg` | El informe / la exportación. |

### 13 · Matrices y mapa de la organización — `/matrices` y `/mapa`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `mapa-1-matrices.jpg` | La portada de Matrices: matriz de riesgos y plan de acción. |
| 2 | `mapa-2-arbol.jpg` | El mapa con una matriz vigente elegida. **Cerrá antes el cartel de ayuda** (botón *Entendido*). |
| 3 | `mapa-3-detalle.jpg` | Una caja abierta, con lo que falta y por responsable. |

## Gestión

### 14 · Lo que requiere atención, hoy — `/dashboard`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `dash-1-tarjetas.jpg` | Las cinco tarjetas: desvíos activos, vencidos, checklists pendientes, equipos a revisar, permisos pendientes. |
| 2 | `dash-2-pendientes.jpg` | Las pestañas Vencidos / Sin completar / Próximos con el botón **Completar**. |

### 15 · Tableros para la gerencia — `/analytics`

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `kpi-1-resumen.jpg` | Conformidad de inspecciones, desvíos abiertos, incidentes del período y riesgo por sector. |
| 2 | `kpi-2-desvios.jpg` | Pestaña **Desvíos**. |
| 3 | `kpi-3-accidentes.jpg` | Pestaña **Accidentes**, con el mapa de lesiones. |
| 4 | `kpi-4-epp.jpg` | Pestaña **EPP**. |

### 16 · Todo también en el celular — celular

| # | archivo | qué tiene que estar en pantalla |
|---|---|---|
| 1 | `mob-1-dashboard.jpg` | El tablero en el teléfono. |
| 2 | `mob-2-desvios.jpg` | Los desvíos en el teléfono. |
| 3 | `mob-3-permisos.jpg` | Los permisos en el teléfono. |

---

**Total: 47 capturas.** 38 de escritorio, 9 de celular.

No hace falta que salgan todas juntas. Cada módulo que llegue completo lo
cableo y queda andando; los que falten siguen mostrando la captura vieja.
