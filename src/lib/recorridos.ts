/**
 * El recorrido de cada módulo: las capturas en orden y la frase que explica
 * cada una. Los nombres de archivo son los de CAPTURAS-V4.md, en
 * public/screenshots/v4/.
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
      label: "La plantilla",
      text: "Las plantillas de la empresa, no un checklist genérico. Las armás desde cero o partís de una lista con su norma: extintores según IRAM 3517, escaleras según Res. SRT 3067/14, vehículos.",
      file: "insp-1-plantillas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Listado de plantillas de checklist activas, cada una con su norma",
    },
    {
      label: "Las preguntas",
      text: "Adentro se ve pregunta por pregunta: qué hay que mirar, cuáles piden foto obligatoria y cuáles piden firma.",
      file: "insp-2-preguntas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Detalle de una plantilla con sus preguntas",
    },
    {
      label: "Asignada al equipo",
      text: "La plantilla queda asignada a los equipos que le corresponden. Cada equipo tiene su código QR y el checklist se abre escaneándolo.",
      file: "insp-3-asignada.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/checklists",
      alt: "Plantilla con los equipos asignados y su código QR",
    },
  ],
  exec: [
    {
      label: "Escanea el QR",
      text: "El operario apunta la cámara al código pegado en el equipo. No instala nada ni crea una cuenta: abre el navegador del teléfono y entra.",
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
      text: "Cada NO OK aparece acá como un desvío, con el equipo, la sucursal, el sector y el checklist que lo originó.",
      file: "desv-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Listado de desvíos con equipo, sucursal, origen y checklist",
    },
    {
      label: "Los filtros",
      text: "Por estado, por sucursal, por prioridad. La pestaña de vencidos es la que se mira primero un lunes.",
      file: "desv-2-filtros.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Filtros de desvíos y pestaña de vencidos",
    },
    {
      label: "Con dueño",
      text: "Se asigna a una persona y se le pone fecha límite. A partir de ahí el desvío tiene alguien que responde por él.",
      file: "desv-3-asignar.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Asignación de un desvío con responsable, prioridad y fecha límite",
    },
  ],
  desvm: [
    {
      label: "Recién abierto",
      text: "El desvío guarda el link a la inspección que lo originó, así que siempre se puede volver a la foto y a quién la sacó.",
      file: "desvm-1-abierto.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Desvío abierto con el link a la ejecución que lo originó",
    },
    {
      label: "Resuelto",
      text: "Mantenimiento carga qué hizo y sube la foto del arreglo. Sin esa evidencia el desvío no se cierra.",
      file: "desvm-2-resolucion.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Resolución de un desvío con la foto del arreglo",
    },
    {
      label: "El historial",
      text: "Quién lo abrió, quién lo tomó, qué campo cambió y cuándo. Si alguien pregunta qué se había hecho, la respuesta tarda diez segundos.",
      file: "desvm-3-historial.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/desvios",
      alt: "Historial de cambios de un desvío",
    },
  ],
  perm: [
    {
      label: "El listado",
      text: "Todos los permisos con su estado a la vista: borrador, aprobado, en ejecución, rechazado.",
      file: "perm-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Listado de permisos de trabajo por tipo y estado",
    },
    {
      label: "Se pide",
      text: "Trabajo en caliente, en altura o en espacio confinado, cada uno con su checklist de condiciones antes de habilitar la tarea.",
      file: "perm-2-nuevo.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Alta de un permiso de trabajo con su checklist de condiciones",
    },
    {
      label: "En ejecución",
      text: "Con solicitante, ejecutante y autorizante, la sucursal y las fechas. Queda el registro de que la tarea se hizo con permiso.",
      file: "perm-3-ejecucion.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso de trabajo en ejecución",
    },
  ],
  firm: [
    {
      label: "Esperando",
      text: "El permiso queda pedido y aparece en la pantalla del que autoriza, esté donde esté.",
      file: "firm-1-solicitud.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso de trabajo esperando autorización",
    },
    {
      label: "Se firma",
      text: "Solicitante, ejecutante y autorizante firman desde donde están. Nadie viaja a otra sucursal para poner una firma.",
      file: "firm-2-firmas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Firmas de solicitante, ejecutante y autorizante",
    },
    {
      label: "Aprobado",
      text: "Aprobado, con el historial de estados y la hora de cada uno. La tarea arranca sin esperar a que alguien vuelva a la oficina.",
      file: "firm-3-aprobado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/permisos-trabajo",
      alt: "Permiso aprobado con su historial de estados",
    },
  ],

  // ---------- Personas y recursos ----------
  epp: [
    {
      label: "Las entregas",
      text: "Cada entrega de EPP con su fecha y su estado de firma. El filtro de pendientes de firma dice qué falta cerrar.",
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
      label: "Firma y conformidad",
      text: "El trabajador firma y deja su conformidad: conforme, firma con observaciones, o no firma. Ese campo es el que pide la normativa.",
      file: "epp-3-firma.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Firma de una entrega de EPP con el campo de conformidad",
    },
    {
      label: "El pañol",
      text: "Catálogo, convenios y stock en la misma pantalla, así el pañol y las entregas no viven en dos planillas distintas.",
      file: "epp-4-stock.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/epp",
      alt: "Catálogo y stock de EPP",
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
      text: "Queda la constancia con la fecha, el ítem y la firma, lista para descargar en PDF.",
      file: "eppm-3-constancia.jpg",
      kind: "phone",
      alt: "Constancia de entrega de EPP emitida",
    },
  ],
  cap: [
    {
      label: "El listado",
      text: "Cada capacitación con su duración, su fecha límite y si es de las legales. Las vencidas quedan a la vista.",
      file: "cap-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Listado de capacitaciones con límite, duración y etiqueta legal",
    },
    {
      label: "El programa anual",
      text: "El plan del año armado, que es lo que pide una auditoría cuando pregunta por capacitación.",
      file: "cap-2-programa.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Programa anual de capacitaciones",
    },
    {
      label: "Asistencia y examen",
      text: "Quién asistió y quién aprobó el examen. Sin esa lista, la capacitación no se puede demostrar.",
      file: "cap-3-asistencia.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/capacitaciones",
      alt: "Asistencia y examen de una capacitación",
    },
  ],
  equ: [
    {
      label: "El inventario",
      text: "Los equipos con su código, tipo, sucursal, sector, estado y vencimiento. Andamios, extintores, herramientas, equipos de medición.",
      file: "equ-1-inventario.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Inventario de equipos con código, estado y vencimiento",
    },
    {
      label: "Los QR",
      text: "Se exportan todos juntos, se imprimen y se pegan en cada equipo. Desde ahí se abre su checklist.",
      file: "equ-2-qr.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Exportación de los códigos QR de los equipos",
    },
    {
      label: "Los vencimientos",
      text: "Lo que ya venció y lo que está por vencer, filtrado. Avisa antes, no cuando alguien se acuerda.",
      file: "equ-3-vencidos.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/equipamiento",
      alt: "Equipos con vencimiento expirado",
    },
  ],

  // ---------- Cumplimiento ----------
  med: [
    {
      label: "Cada una con su norma",
      text: "Puesta a tierra en ohm según Res. SRT 900/2015, ruido en dB(A) según la 85/2012, iluminación en lux según la 84/2012, carga térmica en TGBH. Cada medición trae su resolución, su unidad y su límite.",
      file: "med-1-catalogo.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Mediciones reglamentarias con norma, unidad y límite",
    },
    {
      label: "Se carga",
      text: "El valor medido, dónde y cuándo, con el protocolo adjunto.",
      file: "med-2-carga.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Carga de una medición reglamentaria",
    },
    {
      label: "Contra el límite",
      text: "El resultado se compara solo con el límite legal, así que no hay que ir a buscar la resolución para saber si pasa.",
      file: "med-3-resultado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mediciones",
      alt: "Resultado de una medición comparado con su límite legal",
    },
  ],
  acc: [
    {
      label: "El registro",
      text: "Accidentes y enfermedades con su gravedad y su tipo, y el aviso de los plazos de denuncia a la ART antes de que se pasen.",
      file: "acc-1-listado.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Registro de accidentes con gravedad, estado y alerta de denuncia ART",
    },
    {
      label: "El caso",
      text: "Qué pasó, cuándo, dónde y en qué estado está la investigación, con las imágenes cargadas.",
      file: "acc-2-detalle.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Detalle de un accidente con su estado de investigación",
    },
    {
      label: "La causa raíz",
      text: "El análisis de por qué pasó, que es lo que después evita el segundo accidente igual.",
      file: "acc-3-causa.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Análisis de causa raíz de un accidente",
    },
    {
      label: "El informe",
      text: "El informe sale de acá, sin rearmarlo a mano cada vez que lo piden.",
      file: "acc-4-informe.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/accidentes",
      alt: "Informe de accidente listo para exportar",
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
      text: "Abrís una caja y ves qué falta, por sector y por responsable. Ahí se ve la distancia entre lo que la matriz exige y lo que la empresa hizo.",
      file: "mapa-3-detalle.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/mapa",
      alt: "Detalle de una exigencia del mapa con lo que falta",
    },
  ],

  // ---------- Gestión ----------
  dash: [
    {
      label: "El resumen",
      text: "Desvíos activos, vencidos, checklists pendientes, equipos a revisar y permisos esperando autorización. Lo primero que se abre a la mañana.",
      file: "dash-1-tarjetas.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/dashboard",
      alt: "Tablero con desvíos activos, vencidos, checklists pendientes y equipos a revisar",
    },
    {
      label: "Y se completa",
      text: "Lo vencido, lo sin completar y lo próximo, cada uno con el botón para resolverlo desde ahí mismo.",
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
      label: "Accidentes",
      text: "El mapa de lesiones y la estadística de accidentes, que es lo que se presenta a la gerencia y a la aseguradora.",
      file: "kpi-3-accidentes.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Estadísticas de accidentes y mapa de lesiones",
    },
    {
      label: "EPP",
      text: "Entregas, firmas pendientes y consumo, sin armar la planilla a mano.",
      file: "kpi-4-epp.jpg",
      kind: "browser",
      url: "app.shipsafe.lat/analytics",
      alt: "Indicadores de entregas de EPP",
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
      text: "Los desvíos abiertos y vencidos, con la foto, sin volver a la oficina a mirar la computadora.",
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
  ],
};
