/**
 * El recorrido de cada módulo: las capturas en orden y la frase que explica
 * cada una. Los nombres de archivo son los de docs/CAPTURAS-V4.md, en
 * public/screenshots/v4/.
 *
 * Escrito recorriendo la app el 9/9/2026, entrando adentro de cada módulo (no
 * solo a los listados): el detalle de un desvío, el de un permiso, el de un
 * accidente con su análisis de causa raíz, y una capacitación con sus
 * contenidos, su examen y el calendario anual.
 *
 * Cómo se activa: home-content.ts arma los pasos de un módulo con este
 * recorrido solo cuando están TODAS sus capturas en el inventario
 * (capturas-v4.ts, que genera `node scripts/capturas.mjs`). Si falta una, ese
 * módulo sigue mostrando su captura vieja de v3 y no se rompe nada. Por eso
 * las capturas se pueden subir de a tandas: cada módulo se enciende solo
 * cuando está completo.
 *
 * Los textos describen lo que se ve en la pantalla, sin prometer nada que la
 * captura no muestre.
 */

export interface PasoDef {
  /** Nombre corto para el riel de pasos. Tres palabras como mucho. */
  label: string;
  /** Qué está pasando en esta pantalla. */
  text: string;
  /** Archivo en public/screenshots/v4/. */
  file: string;
  kind: "browser" | "phone";
  /** Barra de direcciones del marco, solo para las de escritorio. */
  url?: string;
  alt: string;
}


export const RECORRIDOS: Record<string, PasoDef[]> = {

  // ---------- Operación ----------
  insp: [
    {
      label: "Las plantillas",
      text: "Las plantillas de la empresa, no un checklist genérico. Cada una con su norma: extintores según IRAM 3517, andamios según Decreto 911/96 y Res. SRT 3067/14, escaleras, tableros, vehículos.",
      file: "insp-1-plantillas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Listado de plantillas de checklist activas, cada una con su norma",
    },
    {
      label: "Las preguntas",
      text: "Adentro está pregunta por pregunta: qué hay que mirar, cuáles exigen foto y cuáles exigen firma. Las armás desde cero o partís de una lista ya hecha.",
      file: "insp-2-preguntas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Preguntas de una plantilla de checklist",
    },
    {
      label: "Preuso y postuso",
      text: "Un mismo equipo puede tener una lista antes de usarlo y otra después. La de vehículos viene con las dos.",
      file: "insp-3-preuso.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Checklist con preuso y postuso",
    },
    {
      label: "Pegada al equipo",
      text: "La plantilla queda asignada a los equipos que le corresponden. Cada equipo tiene su QR y el checklist se abre escaneándolo, sin buscar nada.",
      file: "insp-4-asignada.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Plantilla asignada a equipos con su código QR",
    },
  ],
  exec: [
    {
      label: "Escanea el QR",
      text: "El operario apunta la cámara al código pegado en el equipo. Sin instalar nada y sin crear una cuenta: abre el navegador del teléfono y entra.",
      file: "exec-1-escaneo.jpg",
      kind: "phone",
      alt: "Pantalla de escaneo de código QR en el celular",
    },
    {
      label: "Responde",
      text: "El checklist de ese equipo, con OK, NO OK y N/A. Dos minutos parado al lado de la máquina.",
      file: "exec-2-checklist.jpg",
      kind: "phone",
      alt: "Checklist en ejecución desde el celular",
    },
    {
      label: "Saca la foto",
      text: "Cuando algo da NO OK, la foto y la observación quedan pegadas a esa respuesta. Esa es la evidencia que después nadie tiene que salir a buscar.",
      file: "exec-3-foto.jpg",
      kind: "phone",
      alt: "Ítem en NO OK con foto y observación",
    },
    {
      label: "Firma",
      text: "Firma en la pantalla y envía. Del otro lado el desvío ya existe.",
      file: "exec-4-firma.jpg",
      kind: "phone",
      alt: "Firma del operario antes de enviar la inspección",
    },
  ],
  desv: [
    {
      label: "El listado",
      text: "Cada NO OK aparece acá como un desvío numerado, con el equipo, la sucursal, el sector y el checklist que lo originó.",
      file: "desv-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Listado de desvíos con equipo, sucursal, origen y checklist",
    },
    {
      label: "Los filtros",
      text: "Por estado, por sucursal, por prioridad. La pestaña de vencidos es la que se mira un lunes a la mañana.",
      file: "desv-2-filtros.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Filtros de desvíos y pestaña de vencidos",
    },
    {
      label: "Nace con dueño",
      text: "El desvío se auto-asigna al grupo que le corresponde a ese equipo. El de un extintor va al grupo de extintores, sin que nadie lo derive.",
      file: "desv-3-asignado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Desvío auto-asignado a un grupo de trabajo desde el equipo",
    },
    {
      label: "Con fecha límite",
      text: "Prioridad y fecha de vencimiento desde el momento en que nace. A partir de ahí hay alguien que responde por él y un día en que se vence.",
      file: "desv-4-plazo.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Desvío con prioridad y fecha límite",
    },
  ],
  desvm: [
    {
      label: "De dónde salió",
      text: "El desvío guarda el link a la inspección que lo originó. Un click y estás viendo la respuesta, la foto y quién la sacó.",
      file: "desvm-1-origen.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Desvío con el origen y el link a la ejecución del checklist",
    },
    {
      label: "La resolución",
      text: "Mantenimiento carga qué hizo y sube la foto. El supervisor puede aceptarla o rechazar la solución y devolverlo.",
      file: "desvm-2-resolucion.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Resolución de un desvío con la solución aplicada",
    },
    {
      label: "El recorrido",
      text: "Abierto, asignado, en proceso, resuelto, cerrado. Cada cambio con quién lo hizo, cuándo y qué escribió.",
      file: "desvm-3-historial.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Historial de estados de un desvío",
    },
    {
      label: "La traza",
      text: "Y debajo, el registro campo por campo: qué decía antes, qué dice después. Es lo que se muestra cuando alguien pregunta si esto se tocó.",
      file: "desvm-4-auditoria.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Traza de auditoría de un desvío campo por campo",
    },
  ],
  perm: [
    {
      label: "El listado",
      text: "Todos los permisos con su estado a la vista: borrador, pendiente, aprobado, en ejecución, rechazado.",
      file: "perm-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Listado de permisos de trabajo por tipo y estado",
    },
    {
      label: "Se pide",
      text: "Trabajo en caliente, en altura o en espacio confinado, cada uno con su plantilla. Se describe la tarea y se elige la sucursal.",
      file: "perm-2-nuevo.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Alta de un permiso de trabajo con su plantilla",
    },
    {
      label: "Las condiciones",
      text: "El checklist de condiciones que hay que verificar antes de habilitar la tarea.",
      file: "perm-3-condiciones.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Checklist de condiciones de un permiso de trabajo",
    },
    {
      label: "Quién es quién",
      text: "Ejecutante, solicitante y autorizante, cada uno con su ficha de empleado. Sin eso el permiso no avanza.",
      file: "perm-4-personas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Ejecutante, solicitante y autorizante de un permiso",
    },
  ],
  firm: [
    {
      label: "Esperando",
      text: "El permiso queda pendiente y aparece en la pantalla del que autoriza, esté en la obra o en la oficina.",
      file: "firm-1-pendiente.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso de trabajo esperando autorización",
    },
    {
      label: "Se firma",
      text: "Cada firma queda con el nombre, el documento y la hora. El ejecutante firma desde donde está.",
      file: "firm-2-firmas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Firmas de un permiso con nombre, documento y hora",
    },
    {
      label: "Aprobado",
      text: "Borrador, pendiente, aprobado, con la hora de cada paso. Recién ahí se habilita iniciar la ejecución.",
      file: "firm-3-aprobado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso aprobado con su historial de estados",
    },
    {
      label: "En PDF",
      text: "El permiso completo se descarga en PDF, que es lo que pide un cliente o una auditoría.",
      file: "firm-4-pdf.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso de trabajo exportado en PDF",
    },
  ],

  // ---------- Personas y recursos ----------
  epp: [
    {
      label: "Las entregas",
      text: "Cada entrega con su fecha y su estado de firma. El filtro de pendientes de firma dice qué falta cerrar.",
      file: "epp-1-entregas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Entregas de EPP con estado de firma",
    },
    {
      label: "Se entrega",
      text: "De a uno o por cuadrilla, eligiendo del catálogo. El stock se descuenta en el momento.",
      file: "epp-2-nueva.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Alta de una entrega de EPP desde el catálogo",
    },
    {
      label: "Conformidad",
      text: "El trabajador firma y deja su conformidad: conforme, firma con observaciones, o no firma. Ese campo es el que pide la normativa.",
      file: "epp-3-firma.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Firma de una entrega de EPP con el campo de conformidad",
    },
    {
      label: "La constancia",
      text: "Queda la constancia en PDF, con el ítem, la cantidad, la fecha y quién entregó.",
      file: "epp-4-constancia.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Constancia de entrega de EPP en PDF",
    },
    {
      label: "El pañol",
      text: "Catálogo, convenios y stock en la misma pantalla, para que el pañol y las entregas no vivan en dos planillas.",
      file: "epp-5-stock.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Catálogo, convenios y stock de EPP",
    },
  ],
  eppm: [
    {
      label: "El pañolero",
      text: "La entrega se carga desde el teléfono, en el pañol, con el trabajador adelante.",
      file: "eppm-1-entrega.jpg",
      kind: "phone",
      alt: "Entrega de EPP desde el celular del pañolero",
    },
    {
      label: "Firma ahí",
      text: "El operario firma en la pantalla en el momento. No hay planilla que llevar después a la oficina.",
      file: "eppm-2-firma.jpg",
      kind: "phone",
      alt: "Operario firmando la entrega en el celular",
    },
    {
      label: "La constancia",
      text: "Queda emitida y descargable, con la fecha y el ítem.",
      file: "eppm-3-constancia.jpg",
      kind: "phone",
      alt: "Constancia de entrega de EPP en el celular",
    },
  ],
  cap: [
    {
      label: "El listado",
      text: "Cada capacitación con su duración, su fecha límite, su tipo y si es de las obligatorias por ley. Las vencidas quedan a la vista.",
      file: "cap-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Listado de capacitaciones con límite, duración y etiqueta legal",
    },
    {
      label: "El calendario anual",
      text: "El año entero mes por mes, con lo dictado, lo vencido y lo planificado. Es el plan anual que pide una auditoría, armado solo.",
      file: "cap-2-calendario.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Calendario anual de capacitaciones por mes con su estado",
    },
    {
      label: "Cómo se arma",
      text: "Adentro: la descripción con su resolución, la duración, el tipo, si lleva examen y el porcentaje mínimo para aprobar.",
      file: "cap-3-adentro.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Detalle de una capacitación con duración, tipo y porcentaje mínimo",
    },
    {
      label: "Los contenidos",
      text: "Los videos y los links que el trabajador va a ver, cargados en la misma capacitación.",
      file: "cap-4-contenidos.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Contenidos de una capacitación: videos y links",
    },
    {
      label: "A quién le toca",
      text: "Se asignan los empleados y les llega la notificación con el link. La app avisa si falta la fecha de comienzo o los contenidos.",
      file: "cap-5-asignacion.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Empleados asignados a una capacitación y su notificación",
    },
    {
      label: "El examen",
      text: "Se rinde desde la plataforma, o se registra el resultado de uno que se tomó afuera. Y la asistencia sale en PDF.",
      file: "cap-6-examen.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Examen de una capacitación y registro de examen externo",
    },
  ],
  equ: [
    {
      label: "El inventario",
      text: "Los equipos con su código, tipo, sucursal, sector, estado y vencimiento. Andamios, extintores, herramientas, equipos de medición, botiquines.",
      file: "equ-1-inventario.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Inventario de equipos con código, estado y vencimiento",
    },
    {
      label: "Se da de alta",
      text: "Un equipo nuevo entra con su código, su sucursal y su sector, y ahí queda listo para que se le asignen checklists.",
      file: "equ-2-alta.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Alta de un equipo en el inventario",
    },
    {
      label: "Los QR",
      text: "Se exportan todos juntos, se imprimen y se pegan. Desde ahí se abre el checklist de ese equipo.",
      file: "equ-3-qr.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Exportación de los códigos QR de los equipos",
    },
    {
      label: "Los vencimientos",
      text: "Lo que ya venció y lo que está por vencer, filtrado. Avisa antes, no cuando alguien se acuerda.",
      file: "equ-4-vencidos.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Equipos con vencimiento expirado",
    },
  ],

  // ---------- Cumplimiento ----------
  med: [
    {
      label: "Cada una con su norma",
      text: "Puesta a tierra en ohm por la Res. SRT 900/2015, ruido en dB(A) por la 85/2012, iluminación en lux por la 84/2012, carga térmica en TGBH por la 30/2023. Cada medición trae su resolución, su unidad y su límite.",
      file: "med-1-catalogo.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Mediciones reglamentarias con norma, unidad y límite",
    },
    {
      label: "Se carga",
      text: "El valor medido, dónde, cuándo y con qué equipo, con el protocolo adjunto.",
      file: "med-2-carga.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Carga de una medición reglamentaria",
    },
    {
      label: "Contra el límite",
      text: "El resultado se compara solo contra el límite legal, así que no hay que ir a buscar la resolución para saber si pasa.",
      file: "med-3-resultado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Resultado de una medición comparado con su límite legal",
    },
    {
      label: "Cuándo toca la próxima",
      text: "Cada medición tiene su periodicidad y avisa cuando se acerca la fecha.",
      file: "med-4-vencimiento.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Periodicidad y vencimiento de las mediciones",
    },
  ],
  acc: [
    {
      label: "El registro",
      text: "Accidentes y enfermedades con su gravedad, su tipo y el estado de la investigación, con el aviso de los plazos de denuncia a la ART antes de que se pasen.",
      file: "acc-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Registro de accidentes con gravedad, estado y alerta de denuncia ART",
    },
    {
      label: "Qué pasó",
      text: "El relato del hecho, la fecha, el sector, los datos del accidentado y su antigüedad, y la denuncia a la ART con su fecha.",
      file: "acc-2-detalle.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Detalle de un accidente con el relato y la denuncia ART",
    },
    {
      label: "Por qué pasó",
      text: "La IA propone el análisis: causa inmediata, causas básicas y factores contribuyentes. Vos lo editás, y queda registrado quién lo editó.",
      file: "acc-3-causa.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Análisis de causa raíz de un accidente",
    },
    {
      label: "Qué falta saber",
      text: "Cuando el análisis se apoya en supuestos lo dice, y lista qué datos faltan para cerrar la investigación en serio.",
      file: "acc-4-supuestos.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Supuestos y datos faltantes del análisis de causa raíz",
    },
    {
      label: "Qué se hace",
      text: "Acciones correctivas y preventivas, cada una con su responsable y su plazo. De ahí sale el informe en PDF.",
      file: "acc-5-acciones.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Acciones correctivas y preventivas con responsable y plazo",
    },
  ],
  mapa: [
    {
      label: "Las matrices",
      text: "La matriz de riesgos por establecimiento y el plan de acción con todas las medidas ordenadas por lo que urge.",
      file: "mapa-1-matrices.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/matrices",
      alt: "Matrices de riesgo y plan de acción de la organización",
    },
    {
      label: "El mapa",
      text: "Cada caja es algo que la matriz exige. El color dice cómo está: hecho, vencido, sin completar.",
      file: "mapa-2-arbol.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mapa",
      alt: "Mapa de la organización con el estado de cada exigencia",
    },
    {
      label: "Qué falta",
      text: "Se abre una caja y aparece qué falta, por sector y por responsable. Ahí se ve la distancia entre lo que la matriz exige y lo que la empresa hizo.",
      file: "mapa-3-detalle.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mapa",
      alt: "Detalle de una exigencia del mapa con lo que falta",
    },
  ],

  // ---------- Gestión ----------
  dash: [
    {
      label: "Lo urgente",
      text: "Desvíos activos, vencidos, checklists pendientes, equipos a revisar y permisos esperando autorización. Lo primero que se abre a la mañana.",
      file: "dash-1-tarjetas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/dashboard",
      alt: "Tablero con desvíos activos, vencidos, checklists pendientes y equipos a revisar",
    },
    {
      label: "Y se resuelve",
      text: "Lo vencido, lo sin completar y lo próximo, cada uno con la norma que lo exige y el botón para completarlo desde ahí mismo.",
      file: "dash-2-pendientes.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/dashboard",
      alt: "Pendientes del tablero con el botón para completar",
    },
  ],
  kpi: [
    {
      label: "El resumen",
      text: "Conformidad de inspecciones, desvíos abiertos, incidentes del período y un score de riesgo por sector, comparado contra el período anterior.",
      file: "kpi-1-resumen.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Resumen de indicadores con conformidad, desvíos e incidentes",
    },
    {
      label: "Desvíos",
      text: "Por estado, por prioridad y por sector, para ver dónde se está juntando el trabajo sin hacer.",
      file: "kpi-2-desvios.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Tablero de desvíos por estado, prioridad y sector",
    },
    {
      label: "Inspecciones",
      text: "Cuántas se hicieron, cuántas dieron NO OK y en qué equipos se repite.",
      file: "kpi-3-inspecciones.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Indicadores de inspecciones y tasa de NO OK",
    },
    {
      label: "Accidentes",
      text: "Las estadísticas y el mapa de lesiones, que es lo que se presenta a la gerencia y a la aseguradora.",
      file: "kpi-4-accidentes.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Estadísticas de accidentes y mapa de lesiones",
    },
    {
      label: "EPP y capacitaciones",
      text: "Entregas, firmas pendientes, capacitaciones dictadas y vencidas. Sin armar la planilla a mano.",
      file: "kpi-5-epp.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Indicadores de EPP y capacitaciones",
    },
  ],
  mob: [
    {
      label: "El tablero",
      text: "El mismo tablero en el teléfono del supervisor, para recorrer la planta con los datos en la mano.",
      file: "mob-1-dashboard.jpg",
      kind: "phone",
      alt: "Tablero de SHIPSAFE en el celular",
    },
    {
      label: "Los desvíos",
      text: "Los desvíos abiertos y vencidos, con la foto, sin volver a la oficina.",
      file: "mob-2-desvios.jpg",
      kind: "phone",
      alt: "Desvíos en el celular",
    },
    {
      label: "Los permisos",
      text: "Un permiso se revisa y se aprueba desde el teléfono, así la tarea no espera.",
      file: "mob-3-permisos.jpg",
      kind: "phone",
      alt: "Permisos de trabajo en el celular",
    },
    {
      label: "Los equipos",
      text: "El inventario y los vencimientos, para chequear un equipo parado adelante de él.",
      file: "mob-4-equipos.jpg",
      kind: "phone",
      alt: "Equipamiento en el celular",
    },
  ],
};
