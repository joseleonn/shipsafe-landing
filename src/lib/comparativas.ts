/**
 * Comparativas "mejores software" por país (17/11/2026).
 *
 * Por qué: en las búsquedas de compra de cada país ganan los comparadores, y
 * la comparativa de Argentina ya trae clics. El término de cada país sale de
 * Google Trends y del Planificador (ver claude/plan-seo-2026-11-09.md).
 *
 * Reglas: cada dato de un competidor sale de su propio sitio o de su ficha en
 * un directorio, leído el 17/11/2026. Si el sitio no lo dice, no se dice
 * ("no lo indica"). Nunca se habla mal de nadie: "A tener en cuenta" describe
 * para quién no es, no lo que hace mal. Antes de agregar un software, leer su
 * sitio. Revisar cada seis meses: los productos y los precios cambian.
 */

export type Software = {
  nombre: string;
  origen: string;
  mejorPara: string;
  precio: string;
  detalle: string;
  aTener: string;
  url?: string;
};

const SHIPSAFE = (pais: string): Software => ({
  nombre: "SHIPSAFE",
  origen: "Argentina, con clientes en Latinoamérica",
  mejorPara: "Empresas con varias sedes o personal en campo que registran en el momento",
  precio: "Sí, precios orientativos en la web",
  detalle: `Plataforma de gestión de SST pensada para que el registro pase donde pasa el trabajo. Cada equipo, vehículo o área tiene un QR: el operario lo escanea y completa la inspección desde el celular, sin cuenta propia. Lo que no está bien se convierte en un desvío con responsable y fecha, que solo cierra el área de seguridad después de ver la evidencia. Cubre también permisos de trabajo, análisis de la tarea, entregas de EPP con firma, capacitaciones, accidentes con análisis de causa y matriz de riesgos. La plataforma, el soporte y la implementación son en español, y tiene una página con lo que pide la norma de ${pais}.`,
  aTener:
    "Es un proveedor más chico que las suites internacionales. Las integraciones con sistemas corporativos (ERP, directorio de usuarios) se arman en la línea para empresas grandes, no vienen en los planes de entrada.",
});

const ZYGHT: Software = {
  nombre: "ZYGHT",
  origen: "Fuerte presencia en Chile",
  mejorPara: "Operaciones grandes de minería, energía e industria",
  precio: "No, a pedido",
  detalle:
    "Software HSE en la nube que centraliza seguridad, salud ocupacional y medio ambiente. Según su sitio, cubre gestión de riesgos con matrices digitales, incidentes, elementos de protección personal, permisos de trabajo, vigilancia médica, capacitaciones y requisitos legales y auditorías, con apps móviles en Google Play y App Store. Entre sus clientes muestra empresas como Codelco, Copec y Enap.",
  aTener:
    "Está orientado a operaciones de gran escala. Para una empresa mediana conviene preguntar plazos y costo de implementación.",
  url: "https://www.zyght.com",
};

const BUK: Software = {
  nombre: "Buk",
  origen: "Plataforma de RR. HH. con sitios en Chile, Colombia, Perú, México y Brasil",
  mejorPara: "Empresas que ya usan Buk para nómina y quieren sumar los requisitos de SST",
  precio: "Plan gratuito para mipymes; el resto, a pedido",
  detalle:
    "Buk es un software de gestión de personas (nómina, asistencia, desempeño) con un módulo de SST. Según su sitio, permite definir requisitos, asignarlos a la empresa o a cada colaborador, cargar evidencias con alertas de vencimiento y descargarlas en lote, todo conectado con la base de personal.",
  aTener:
    "Su punto de partida es RR. HH. y la documentación. En su sitio de México, las inspecciones en campo con plantillas y fotos figuran como próximamente.",
  url: "https://www.buk.mx/productos/administracion/software-de-seguridad-y-salud-en-el-trabajo-sst",
};

const SAFETYCULTURE: Software = {
  nombre: "SafetyCulture (hoy Mitti)",
  origen: "Internacional",
  mejorPara: "Checklists e inspecciones desde el celular en cualquier rubro",
  precio: "Plan gratuito; el Premium, desde USD 24 por usuario al mes (anual)",
  detalle:
    "App internacional de inspecciones y listas de verificación, con una biblioteca grande de plantillas creadas por usuarios. Es una de las más conocidas para llevar las inspecciones al celular. Explicamos el cambio de nombre en la nota sobre SafetyCulture y Mitti.",
  aTener:
    "Es una herramienta general de inspecciones: la norma de cada país y el seguimiento formal de lo que se detecta los tiene que armar cada empresa.",
};

const VELOCITY: Software = {
  nombre: "VelocityEHS",
  origen: "Internacional",
  mejorPara: "Corporaciones con operaciones en varios países",
  precio: "No, a pedido",
  detalle:
    "Suite internacional de EHS con módulos de seguridad, ergonomía, químicos, riesgo operacional, contratistas y permisos de trabajo, ambiente, sustentabilidad e higiene industrial. Según su sitio, apunta a organizaciones con muchas sedes y operaciones globales.",
  aTener:
    "El costo y el tiempo de implementación están pensados para corporaciones, y la norma local no es su punto de partida.",
};

export type Comparativa = {
  pais: string;
  termino: string;
  paginaPais: { href: string; label: string };
  intro: string;
  softwares: Software[];
  criterioNorma: string;
  eleccion: { caso: string; respuesta: string }[];
  faqs: { question: string; answer: string }[];
};

export const COMPARATIVAS: Record<string, Comparativa> = {
  "mejores-software-seguridad-industrial-mexico": {
    pais: "México",
    termino: "seguridad industrial",
    paginaPais: { href: "/software-seguridad-industrial-mexico", label: "qué piden la NOM-030 y la NOM-019" },
    intro:
      "Las opciones que más aparecen en México para gestionar la seguridad industrial y la seguridad e higiene son SHIPSAFE, Prysmex, ZYGHT, Buk y SafetyCulture (hoy Mitti), y VelocityEHS entre las suites internacionales. La diferencia está en tres cosas: si lo que se revisa en piso queda registrado en el momento, si lo que se detecta tiene responsable y seguimiento, y si el costo tiene sentido para tu cantidad de centros de trabajo.",
    softwares: [
      SHIPSAFE("México"),
      {
        nombre: "Prysmex",
        origen: "No lo indica en su sitio",
        mejorPara: "Empresas que quieren EHS, calidad y mantenimiento en una sola herramienta",
        precio: "Tiene opción para empezar gratis; montos no publicados",
        detalle:
          "Software en la nube que, según su sitio, centraliza EHS, calidad, mantenimiento, riesgos y operaciones. Cubre hallazgos e incidentes con responsables y fechas compromiso, auditorías e inspecciones digitales, recorridos, tareas programadas, permisos de trabajo y cursos.",
        aTener:
          "Es una plataforma amplia que va más allá de seguridad. Conviene definir qué módulos se van a usar primero.",
        url: "https://www.prysmex.com",
      },
      ZYGHT,
      BUK,
      SAFETYCULTURE,
      VELOCITY,
    ],
    criterioNorma:
      "Que las inspecciones, los recorridos de verificación de la comisión de seguridad e higiene y los registros salgan ordenados como piden la NOM-030-STPS-2009 y la NOM-019-STPS-2011.",
    eleccion: [
      { caso: "Tienes varios centros de trabajo y lo que se revisa en piso llega tarde", respuesta: "SHIPSAFE o Prysmex. Prioriza que el registro se haga en el momento y que cada hallazgo tenga responsable." },
      { caso: "Solo necesitas aplicar la encuesta de la NOM-035", respuesta: "Hay herramientas de RR. HH. que cubren eso, como Buk, Factorial o eNOM35 de Edifact. Un software de seguridad industrial resuelve otra cosa." },
      { caso: "Ya usas Buk para la nómina", respuesta: "Su módulo de SST te ordena requisitos y evidencias sin sumar otro proveedor." },
      { caso: "Eres una corporación con operaciones en varios países", respuesta: "VelocityEHS o ZYGHT." },
    ],
    faqs: [
      {
        question: "¿Cuál es el mejor software de seguridad industrial en México?",
        answer:
          "Depende de dónde esté el problema. Si lo que falla es que lo que se revisa en piso llega tarde y nadie lo sigue, conviene uno que registre desde el celular y asigne responsables, como SHIPSAFE o Prysmex. Si es una corporación con operaciones en varios países, VelocityEHS o ZYGHT. Si solo hace falta la NOM-035, alcanza una herramienta de RR. HH.",
      },
      {
        question: "¿Un software de seguridad e higiene sirve para la NOM-035?",
        answer:
          "La NOM-035 se trata de factores de riesgo psicosocial y se resuelve sobre todo con encuestas y RR. HH. Un software de seguridad e higiene ordena las inspecciones, los recorridos, el EPP, los accidentes y los hallazgos. Son herramientas distintas y muchas empresas usan las dos.",
      },
      {
        question: "¿Cuánto cuesta un software de seguridad industrial en México?",
        answer:
          "La mayoría trabaja a pedido, según cantidad de centros de trabajo, usuarios y módulos. SafetyCulture tiene un plan gratuito para empezar y Buk tiene un plan gratuito para mipymes. Antes de comparar precios, conviene comparar qué parte del trabajo resuelve cada uno.",
      },
    ],
  },
  "mejores-software-sg-sst-colombia": {
    pais: "Colombia",
    termino: "SG-SST",
    paginaPais: { href: "/software-sg-sst", label: "qué piden el Decreto 1072 y la Resolución 0312" },
    intro:
      "Las opciones que más aparecen en Colombia para gestionar el SG-SST son SHIPSAFE, Verifty, Kawak, Safetya, Buk y ZYGHT. La diferencia está en tres cosas: si la herramienta ayuda a sostener los estándares mínimos de la Resolución 0312 con evidencia, si lo que pasa en campo queda registrado en el momento y si el costo tiene sentido para el tamaño de tu empresa.",
    softwares: [
      SHIPSAFE("Colombia"),
      {
        nombre: "Verifty",
        origen: "Opera en Colombia, Chile y México",
        mejorPara: "Empresas que trabajan con muchos contratistas",
        precio: "Sí, publicados en su ficha de Comparasoftware",
        detalle:
          "Tiene dos productos: uno para gestionar contratistas, proveedores y visitantes, y otro para el SG-SST, con cumplimiento de la Resolución 0312, matriz GTC 45, inspecciones, accidentes, ausentismo, capacitaciones y EPP. Según su ficha en Comparasoftware, los planes de SST van desde $350.000 COP por mes hasta 25 trabajadores (consultado en noviembre de 2026).",
        aTener:
          "Sus planes se definen por cantidad de trabajadores, así que conviene calcular el costo con tu dotación real.",
        url: "https://www.comparasoftware.com/verifty",
      },
      {
        nombre: "Kawak",
        origen: "Colombia",
        mejorPara: "Empresas que gestionan calidad e ISO y quieren sumar SST",
        precio: "No publicados; se paga según el uso",
        detalle:
          "Suite en la nube para sistemas de gestión de calidad, con un módulo de SST que, según su sitio, cubre reporte de condiciones y actos inseguros, incidentes y accidentes, profesiograma, ausentismo, entrega de EPP y exámenes médicos, con inspecciones desde el celular. Se presenta como apoyo para ISO 45001.",
        aTener: "Su punto de partida es la gestión de calidad; la SST es uno de sus módulos.",
        url: "https://www.kawak.net",
      },
      {
        nombre: "Safetya",
        origen: "Colombia",
        mejorPara: "Responsables del SG-SST que buscan normativa, formación y un apoyo para las evidencias",
        precio: "No, por planes a cotizar",
        detalle:
          "Es una revista virtual de seguridad y salud en el trabajo con membresías para prevencionistas y empresas, alertas legales, cursos de 20 y 50 horas y un software de apoyo para administrar evidencias.",
        aTener: "Su fuerte es el contenido y la formación más que el registro en campo.",
        url: "https://safetya.co",
      },
      BUK,
      ZYGHT,
    ],
    criterioNorma:
      "Que la herramienta ayude a sostener los estándares mínimos de la Resolución 0312 de 2019 y el SG-SST del Decreto 1072 de 2015 con evidencia de lo que se hace, no solo con documentos.",
    eleccion: [
      { caso: "Tienes operación en campo o varias sedes y lo que se detecta no llega", respuesta: "SHIPSAFE. Prioriza que el registro se haga en el celular, en el momento, y que cada hallazgo tenga responsable." },
      { caso: "Trabajas con muchos contratistas", respuesta: "Verifty está construido alrededor de eso." },
      { caso: "Ya gestionas calidad con un sistema ISO", respuesta: "Kawak suma la SST a lo que ya tienes." },
      { caso: "Ya usas Buk para la nómina", respuesta: "Su módulo de SST te ordena requisitos y evidencias en la misma plataforma." },
    ],
    faqs: [
      {
        question: "¿Cuál es el mejor software SG-SST en Colombia?",
        answer:
          "Depende de dónde esté el problema. Si es el registro en campo y el seguimiento de lo que se detecta, SHIPSAFE. Si es la gestión de contratistas, Verifty. Si ya tienes un sistema de calidad ISO, Kawak. Si quieres todo dentro de RR. HH., Buk. El criterio decisivo es cuál va a usar tu gente todos los días.",
      },
      {
        question: "¿Un software reemplaza al responsable del SG-SST?",
        answer:
          "No. Ordena el registro, el seguimiento y la evidencia. La autoevaluación de los estándares mínimos y las decisiones siguen siendo del responsable del SG-SST.",
      },
      {
        question: "¿Cuánto cuesta un software SG-SST?",
        answer:
          "Varía según cantidad de trabajadores, sedes y módulos. Verifty publica planes desde $350.000 COP por mes hasta 25 trabajadores; la mayoría de los demás trabaja a pedido.",
      },
    ],
  },
  "mejores-software-prevencion-de-riesgos-chile": {
    pais: "Chile",
    termino: "prevención de riesgos",
    paginaPais: { href: "/software-prevencion-de-riesgos-chile", label: "qué pide el DS 44" },
    intro:
      "Las opciones que más aparecen en Chile para gestionar la prevención de riesgos y la higiene y seguridad son ZYGHT, SHIPSAFE, Buk, Fivosh y SafetyCulture (hoy Mitti), y VelocityEHS entre las suites internacionales. La diferencia está en tres cosas: si lo que se revisa en terreno llega a la matriz de peligros del DS 44, si lo que se detecta tiene responsable y si el costo tiene sentido para tu cantidad de faenas.",
    softwares: [
      ZYGHT,
      SHIPSAFE("Chile"),
      BUK,
      {
        nombre: "Fivosh",
        origen: "Chile",
        mejorPara: "Gran minería y energía que necesitan controlar la salud del personal en faena",
        precio: "No publicados",
        detalle:
          "Plataforma de salud ocupacional que, según lo publicado sobre la empresa, automatiza la validación de la aptitud laboral de los trabajadores en faena, los vencimientos de exámenes, la vigilancia médica, los protocolos del MINSAL y la gestión de enfermedades profesionales, integrada con mutualidades y prestadores de salud.",
        aTener:
          "Se especializa en salud ocupacional. Las inspecciones y la gestión de condiciones inseguras quedan fuera de su foco.",
        url: "https://fivosh.cl",
      },
      SAFETYCULTURE,
      VELOCITY,
    ],
    criterioNorma:
      "Que lo que se detecta en terreno alimente la matriz de identificación de peligros y evaluación de riesgos que pide el artículo 7 del DS 44, y que la información entregada a cada trabajador quede firmada.",
    eleccion: [
      { caso: "Eres una operación minera o energética grande", respuesta: "ZYGHT, y Fivosh si el foco es la salud del personal en faena." },
      { caso: "Eres una empresa mediana con varias faenas o flota", respuesta: "SHIPSAFE. Prioriza el registro en terreno desde el celular y el seguimiento de cada hallazgo." },
      { caso: "Ya usas Buk para remuneraciones", respuesta: "Su módulo de SST te ordena requisitos y evidencias en la misma plataforma." },
      { caso: "Solo necesitas pasar los checklists al celular", respuesta: "SafetyCulture (hoy Mitti) tiene un plan gratuito para empezar." },
    ],
    faqs: [
      {
        question: "¿Cuál es el mejor software de prevención de riesgos en Chile?",
        answer:
          "Depende del tamaño y del foco. En gran minería y energía, ZYGHT es de los más usados. Para una empresa mediana con varias faenas que necesita registrar en terreno y seguir lo que se detecta, SHIPSAFE. Si el foco es la salud ocupacional del personal, Fivosh.",
      },
      {
        question: "¿Qué cambió con el DS 44 para el software de prevención?",
        answer:
          "El DS 44 rige desde el 1 de febrero de 2025 y pide, entre otras cosas, una matriz de peligros por procesos, tareas y puestos que se revise al menos una vez al año y cuando cambian las condiciones. Un software ayuda si lo que pasa en terreno llega a esa matriz sin pasar por una planilla.",
      },
      {
        question: "¿El software reemplaza al experto en prevención de riesgos?",
        answer:
          "No. Ordena el registro y el seguimiento; la evaluación de los riesgos y las decisiones siguen siendo del experto en prevención.",
      },
    ],
  },
  "mejores-software-sst-peru": {
    pais: "Perú",
    termino: "SST",
    paginaPais: { href: "/software-sst-peru", label: "qué piden la Ley 29783 y sus reglamentos" },
    intro:
      "Las opciones que más aparecen en Perú para gestionar la seguridad y salud en el trabajo son SHIPSAFE, ZYGHT, Buk y SafetyCulture (hoy Mitti), y VelocityEHS entre las suites internacionales. La diferencia está en tres cosas: si el IPERC, el ATS y las inspecciones se registran en campo, si lo que se detecta tiene responsable y si el costo tiene sentido para tu cantidad de unidades o proyectos.",
    softwares: [SHIPSAFE("Perú"), ZYGHT, BUK, SAFETYCULTURE, VELOCITY],
    criterioNorma:
      "Que el IPERC por puesto, el ATS y el PETAR se registren donde se hace el trabajo, como piden el reglamento de la Ley 29783 y los reglamentos de minería (DS 024-2016-EM) y construcción (DS 011-2019-TR).",
    eleccion: [
      { caso: "Tienes varias unidades o proyectos y el ATS se llena en papel", respuesta: "SHIPSAFE. Prioriza que el ATS y los permisos se firmen en el celular en el frente." },
      { caso: "Eres una operación minera grande", respuesta: "ZYGHT o VelocityEHS, según cuánto peso tenga la norma local." },
      { caso: "Ya usas Buk para planillas", respuesta: "Su módulo de SST te ordena requisitos y evidencias en la misma plataforma." },
      { caso: "Solo necesitas pasar los checklists al celular", respuesta: "SafetyCulture (hoy Mitti) tiene un plan gratuito para empezar." },
    ],
    faqs: [
      {
        question: "¿Cuál es el mejor software SST en Perú?",
        answer:
          "Depende de la operación. Para empresas con varias unidades o proyectos que necesitan el ATS, el IPERC y las inspecciones en campo, SHIPSAFE. Para gran minería, ZYGHT o VelocityEHS. Si todo pasa por RR. HH., Buk.",
      },
      {
        question: "¿Un software SST sirve para el IPERC?",
        answer:
          "Sí, si permite llevar el IPERC por puesto y actualizarlo con lo que pasa en campo. El reglamento de la Ley 29783 pide actualizar la evaluación periódicamente, sin exceder un año.",
      },
      {
        question: "¿El software reemplaza al supervisor de SST?",
        answer:
          "No. Ordena el registro y el seguimiento. La evaluación de riesgos y las decisiones siguen siendo del profesional de seguridad.",
      },
    ],
  },
};
