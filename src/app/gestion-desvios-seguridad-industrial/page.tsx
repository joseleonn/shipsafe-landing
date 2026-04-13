import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "gestion-desvios-seguridad-industrial",
)!;

export const metadata: Metadata = {
  title: `${article.title} | ${SITE.name}`,
  description: article.description,
  alternates: { canonical: `/${article.slug}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `${SITE.url}/${article.slug}`,
    type: "article",
    locale: "es_AR",
    siteName: SITE.name,
  },
};

export default function Page() {
  return (
    <ArticleLayout slug="gestion-desvios-seguridad-industrial">
      <h2>¿Qué es un desvío de seguridad?</h2>
      <p>
        Un <strong>desvío de seguridad</strong> es cualquier condición o
        comportamiento que se aparta de los estándares de seguridad establecidos
        y que podría derivar en un accidente o incidente. Ejemplos concretos en
        una planta industrial:
      </p>
      <ul>
        <li>Un operario trabajando sin los EPP requeridos</li>
        <li>Un extintor vencido o sin acceso</li>
        <li>Un derrame no contenido en el piso de producción</li>
        <li>Una guarda de máquina retirada o dañada</li>
        <li>Cables eléctricos expuestos</li>
        <li>Señalización faltante o ilegible</li>
        <li>Obstrucción de salidas de emergencia</li>
      </ul>
      <p>
        La gestión de desvíos es uno de los pilares de la prevención: detectar
        condiciones inseguras <strong>antes</strong> de que causen un accidente.
      </p>

      <h2>El problema típico: desvíos que se pierden</h2>
      <p>
        En la mayoría de las plantas, los desvíos se reportan de manera
        informal: un mensaje por WhatsApp al grupo de seguridad, un comentario
        en la reunión de turno, o directamente no se reportan porque "siempre
        fue así". Los problemas de este enfoque:
      </p>
      <ul>
        <li>
          <strong>No hay registro formal</strong> — si no queda anotado, para la
          ART no existió.
        </li>
        <li>
          <strong>No se asignan responsables</strong> — el desvío se reporta
          pero nadie se hace cargo de resolverlo.
        </li>
        <li>
          <strong>No hay seguimiento</strong> — se reporta, se "anota" y queda
          en el limbo.
        </li>
        <li>
          <strong>No hay datos para prevenir</strong> — sin estadísticas, no
          sabés dónde están los problemas recurrentes.
        </li>
        <li>
          <strong>No se puede demostrar acción preventiva</strong> — ante una
          auditoría o un accidente, no hay evidencia de que se actuó.
        </li>
      </ul>

      <h2>Ciclo de gestión de un desvío</h2>
      <p>Un sistema efectivo de gestión de desvíos sigue este ciclo:</p>
      <ol>
        <li>
          <strong>Detección y reporte</strong> — cualquier persona en planta
          identifica el desvío y lo reporta con la mayor información posible
          (descripción, ubicación, evidencia fotográfica).
        </li>
        <li>
          <strong>Clasificación</strong> — se evalúa la gravedad (crítico, alto,
          medio, bajo) y el tipo (condición insegura, acto inseguro, ambiental).
        </li>
        <li>
          <strong>Asignación</strong> — se designa un responsable de resolver el
          desvío con un plazo definido.
        </li>
        <li>
          <strong>Acción correctiva</strong> — el responsable ejecuta la
          corrección y documenta lo que hizo.
        </li>
        <li>
          <strong>Verificación</strong> — se verifica que la corrección fue
          efectiva y se cierra el desvío.
        </li>
        <li>
          <strong>Análisis</strong> — se analizan los datos para identificar
          patrones y actuar preventivamente.
        </li>
      </ol>

      <h2>Cómo implementar la gestión digital de desvíos</h2>

      <h3>Reporte desde el celular</h3>
      <p>
        Con SHIPSAFE, cualquier operario puede reportar un desvío desde el
        celular: saca una foto, marca la ubicación, describe el problema y lo
        envía. El reporte queda registrado con fecha, hora, usuario y evidencia.
        No necesita instalar ninguna app — funciona desde el navegador.
      </p>

      <h3>Asignación y seguimiento automático</h3>
      <p>
        El sistema permite asignar un responsable y un plazo. El responsable
        recibe una notificación y puede actualizar el estado del desvío. Si se
        vence el plazo, se escalan alertas automáticas. Todo queda registrado
        con trazabilidad completa.
      </p>

      <h3>Dashboard de desvíos</h3>
      <p>
        Los supervisores y gerentes ven en tiempo real: cantidad de desvíos
        abiertos, tiempo promedio de resolución, desvíos por sector, por tipo y
        por gravedad. Esto permite identificar áreas problemáticas y tomar
        decisiones basadas en datos.
      </p>

      <h2>La conexión con el cumplimiento normativo</h2>
      <p>
        La gestión de desvíos no es solo una buena práctica — es una obligación
        implícita de la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link> y las
        resoluciones de la{" "}
        <Link href="/que-es-srt-argentina">SRT</Link>. Ante un accidente, una
        de las primeras cosas que se revisa es si la empresa tenía un sistema de
        detección y corrección de condiciones inseguras.
      </p>
      <p>
        Con un registro digital de desvíos podés demostrar que tu empresa
        detecta problemas, los resuelve y trabaja activamente en la prevención.
        Esa evidencia es invaluable en una auditoría o ante un reclamo.
      </p>
      <p>
        Si todavía gestionás la seguridad con planillas, leé nuestra{" "}
        <Link href="/software-seguridad-higiene-vs-excel">
          comparativa entre software y Excel
        </Link>{" "}
        para entender qué cambia al{" "}
        <Link href="/como-digitalizar-inspecciones-planta">
          digitalizar la operación
        </Link>.
      </p>
    </ArticleLayout>
  );
}
