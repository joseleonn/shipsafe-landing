/**
 * Borradores que se cargan solos en la base la primera vez que el blog se
 * conecta (en la creación de la tabla). Entran como 'borrador' y no pisan nada
 * que ya exista con el mismo slug, así que una vez revisados o publicados en
 * /interno/blog, lo que diga este archivo no los vuelve a tocar.
 *
 * Sirve para los primeros artículos; los siguientes entran por
 * POST /api/blog/borradores.
 */

import type { BorradorEntrante } from "./blog";

export const SEMILLAS: BorradorEntrante[] = [
  {
    "slug": "constancia-entrega-epp-res-srt-299-11",
    "titulo": "Constancia de entrega de EPP: qué exige la Res. SRT 299/11 y cómo llevarla en digital",
    "descripcion": "Qué datos tiene que tener la constancia de entrega de EPP según la Res. SRT 299/11 y qué piden las Disposiciones GP 2/2021 y 3/2022 para llevarla en digital.",
    "contenido_html": "<p>La constancia de entrega de EPP es el formulario que creó la <strong>Resolución SRT 299/11</strong> para registrar, trabajador por trabajador, qué ropa de trabajo y qué elementos de protección personal le entregó la empresa, cuándo, de qué marca y modelo, si estaban certificados y con la firma de quien los recibió. Es obligatoria para todos los empleadores, y desde 2021 la SRT permite llevarla con un sistema informático en lugar de papel.</p>\n\n<h2>Qué exige la Resolución SRT 299/11</h2>\n<p>La resolución tiene tres obligaciones de fondo:</p>\n<ul>\n<li><strong>EPP certificado.</strong> Los elementos que se entregan tienen que contar con la certificación de producto (por marca de conformidad o por lote) cuando ese producto tiene certificación obligatoria.</li>\n<li><strong>Un formulario único.</strong> Crea la \"Constancia de Entrega de Ropa de Trabajo y Elementos de Protección Personal\", con un instructivo de cómo completar cada campo.</li>\n<li><strong>Una constancia por trabajador.</strong> El empleador tiene que usar ese formulario para cada trabajador y registrar ahí cada entrega.</li>\n</ul>\n\n<h2>Qué datos tiene que tener la constancia</h2>\n<p>El instructivo del formulario numera 18 campos. Agrupados, son estos:</p>\n<ol>\n<li><strong>De la empresa:</strong> razón social, CUIT, dirección del establecimiento donde se hace la tarea, localidad, código postal y provincia.</li>\n<li><strong>Del trabajador:</strong> nombre y apellido, DNI y una descripción breve del puesto o los puestos de trabajo.</li>\n<li><strong>Los EPP necesarios para ese puesto</strong>, según lo que determine el servicio de higiene y seguridad (o la ART, si la empresa está exceptuada de tener servicio).</li>\n<li><strong>De cada entrega:</strong> producto, tipo o modelo, marca, si tiene certificación obligatoria (sí o no), cantidad y fecha de entrega.</li>\n<li><strong>La firma del trabajador.</strong></li>\n<li><strong>Un espacio libre</strong> para otros datos que se consideren importantes.</li>\n</ol>\n\n<h3>Los campos que más conviene revisar</h3>\n<p><strong>Los EPP necesarios para el puesto.</strong> No es una lista de lo que se entregó: es lo que el puesto requiere. Si ese campo está vacío o es igual para todos los puestos, la constancia deja de mostrar si a la persona le dieron lo que necesitaba para su tarea.</p>\n<p><strong>Marca, modelo y certificación.</strong> \"Guantes\" o \"botines\" sin marca ni modelo no permiten saber si el elemento estaba certificado. Es el dato que conecta la constancia con la obligación del artículo 1.</p>\n<p><strong>La fecha de cada entrega.</strong> Una sola constancia acumula todas las entregas del trabajador. Sin fecha por línea, no hay forma de reconstruir cuándo se repuso cada elemento.</p>\n\n<h2>¿Se puede llevar la constancia en digital?</h2>\n<p>Sí. Hay dos disposiciones de la Gerencia de Prevención de la SRT que lo habilitan.</p>\n<p>La <strong>Disposición GP 2/2021</strong> (Boletín Oficial del 27 de abril de 2021) permite que los empleadores usen aplicaciones informáticas para completar la constancia, con carácter de declaración jurada. Pone dos condiciones:</p>\n<ul>\n<li>El sistema tiene que permitirle al trabajador <strong>no firmar</strong> si no recibió lo que figura, o <strong>firmar con observaciones</strong> si lo recibió de forma insuficiente o deficiente.</li>\n<li>Los registros valen solo si el sistema asegura la seguridad e integridad de los datos y tiene un mecanismo adecuado para <strong>identificar y autenticar</strong> a los usuarios que cargan la información.</li>\n</ul>\n<p>La <strong>Disposición GP 3/2022</strong> (Boletín Oficial del 5 de diciembre de 2022) aprueba los estándares técnicos para la constancia digital. Su anexo ordena el tema en cuatro partes:</p>\n<ul>\n<li><strong>Registro:</strong> los mismos datos del formulario en papel, más la conformidad del trabajador. Como opcionales menciona la validación de identidad, la geolocalización, la lectura de códigos de barras o QR del EPP y la firma por token.</li>\n<li><strong>Almacenamiento:</strong> el empleador tiene que conservar las constancias durante el plazo legal, con copias de resguardo.</li>\n<li><strong>Accesibilidad:</strong> la herramienta tiene que poder ser auditada por los órganos de control, y la ART tiene que tener acceso a los datos para asesorar sobre la selección de EPP.</li>\n<li><strong>Desarrollo:</strong> la herramienta puede ser propia o de un proveedor, siempre que proteja la confidencialidad, la integridad y la conservación de la información.</li>\n</ul>\n\n<h3>La conformidad del trabajador</h3>\n<p>Es el punto que más cambia respecto del papel. En una planilla, la firma solo dice \"recibí\". En la constancia digital que pide la Disposición GP 2/2021, el trabajador tiene tres respuestas posibles: firmar conforme, firmar con observaciones o no firmar. Esa tercera opción es la que le da valor a las otras dos, porque muestra que firmar no era la única salida.</p>\n\n<h2>Lo que la norma no dice</h2>\n<ul>\n<li><strong>El plazo de conservación.</strong> La Disposición GP 3/2022 habla del \"plazo legal\" pero no fija un número. Conviene definirlo con el profesional de higiene y seguridad y el asesoramiento legal de la empresa.</li>\n<li><strong>Un tipo de firma en particular.</strong> Ni la Disposición GP 2/2021 ni el anexo de la 3/2022 exigen firma digital certificada. Lo que exigen es identificar y autenticar a quien carga y asegurar que el dato no se altere después.</li>\n<li><strong>Cada cuánto renovar cada elemento.</strong> Eso depende del puesto, del uso y de lo que indique el fabricante, y lo define el servicio de higiene y seguridad.</li>\n</ul>\n\n<h2>Qué preguntar antes de elegir una herramienta digital</h2>\n<ol>\n<li>¿El trabajador puede firmar con observaciones o no firmar, además de firmar conforme?</li>\n<li>¿Cómo se identifica a quien firma y a quien carga la entrega?</li>\n<li>¿Queda registro de cada cambio, con usuario y fecha, o se puede editar una entrega sin que quede rastro?</li>\n<li>¿Puedo sacar la constancia de un trabajador, con todas sus entregas, en el momento en que me la piden?</li>\n<li>¿Qué pasa con mis datos si mañana dejo de usar el sistema? ¿Los puedo exportar?</li>\n</ol>\n<p>En SHIPSAFE la entrega se registra desde el celular, el trabajador firma en el momento con las tres opciones de conformidad y la constancia queda disponible en PDF, con el historial completo de cada persona.</p>\n\n<p><em>Esta nota resume el texto de la Resolución SRT 299/11 y de las Disposiciones GP 2/2021 y 3/2022 con fines informativos. La aplicación a cada caso concreto corresponde al profesional de higiene y seguridad y al asesoramiento legal de la empresa.</em></p>\n",
    "palabra_clave": "constancia de entrega de epp",
    "faqs": [
      {
        "pregunta": "¿La constancia de entrega de EPP es obligatoria?",
        "respuesta": "Sí. La Resolución SRT 299/11 obliga a todos los empleadores a usar el formulario de constancia de entrega de ropa de trabajo y elementos de protección personal, completando uno por cada trabajador y registrando ahí cada entrega."
      },
      {
        "pregunta": "¿Vale una constancia de entrega de EPP digital?",
        "respuesta": "Sí. La Disposición GP 2/2021 de la SRT permite completarla con aplicaciones informáticas, con carácter de declaración jurada, siempre que el sistema asegure la integridad de los datos e identifique y autentique a los usuarios. La Disposición GP 3/2022 fija los estándares técnicos de registro, almacenamiento y accesibilidad."
      },
      {
        "pregunta": "¿La constancia digital necesita firma digital certificada?",
        "respuesta": "Ni la Disposición GP 2/2021 ni el anexo de la Disposición GP 3/2022 exigen firma digital certificada. Piden identificar y autenticar a quien carga la información, registrar la conformidad del trabajador y asegurar que los datos no se alteren."
      },
      {
        "pregunta": "¿Qué pasa si el trabajador no recibió lo que figura en la constancia?",
        "respuesta": "La Disposición GP 2/2021 exige que el sistema digital le permita no firmar si no recibió el elemento, o firmar con observaciones si lo recibió de forma insuficiente o deficiente."
      }
    ],
    "fuentes": [
      {
        "titulo": "Resolución SRT 299/2011 (texto y formulario)",
        "url": "https://www.fio.unicen.edu.ar/extension/seh/images/pdf/cap19/res299-11.pdf"
      },
      {
        "titulo": "Disposición GP 2/2021 SRT",
        "url": "https://redproteger.com.ar/safetyblog/wp-content/uploads/2021/04/Disposicion-SRT-GP-2-202-Registros-Informaticos-EEP-y-Capacitaciones.pdf"
      },
      {
        "titulo": "Disposición GP 3/2022 SRT (Boletín Oficial)",
        "url": "https://www.boletinoficial.gob.ar/detalleAviso/primera/277246/20221205"
      },
      {
        "titulo": "Anexo de la Disposición GP 3/2022 (estándares)",
        "url": "https://contadoresenred.com/wp-content/uploads/2022/12/anexo_6758322_1.pdf"
      },
      {
        "titulo": "Digesto Prevención 4.0 (SRT)",
        "url": "https://www.argentina.gob.ar/prevencion-40-digesto"
      }
    ],
    "notas_revision": "[verificar] Que la Disp. GP 2/2021 siga vigente: la 3/2022 la cita como antecedente y no la deroga, pero no lo confirmé en el texto oficial. [verificar] El plazo de conservación: no lo fija ninguna de las tres normas. Ideal que Walter lea la sección 'Los campos que más conviene revisar' (es criterio de oficio, no normativa)."
  },
];
