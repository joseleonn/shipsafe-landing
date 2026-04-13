import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "ley-19587-guia-completa",
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
    <ArticleLayout slug="ley-19587-guia-completa">
      <h2>¿Qué es la Ley 19.587?</h2>
      <p>
        La <strong>Ley 19.587 de Higiene y Seguridad en el Trabajo</strong> es
        el marco legal fundamental que regula las condiciones de seguridad e
        higiene en todos los establecimientos y explotaciones donde se realicen
        tareas laborales en Argentina. Fue sancionada en 1972 y sigue vigente
        como base de toda la normativa de seguridad laboral del país.
      </p>
      <p>
        Su objetivo principal es proteger la vida, preservar la integridad
        psicofísica de los trabajadores, prevenir accidentes y enfermedades
        profesionales, y promover la capacitación del personal en materia de
        higiene y seguridad.
      </p>

      <h2>¿A quién aplica?</h2>
      <p>
        A <strong>todos los establecimientos</strong> donde se desarrollen
        actividades laborales, sin importar el tamaño, rubro o cantidad de
        empleados. Esto incluye fábricas, oficinas, comercios, obras de
        construcción y cualquier lugar de trabajo.
      </p>

      <h2>Obligaciones principales del empleador</h2>
      <p>La ley establece que el empleador debe:</p>
      <ul>
        <li>
          <strong>Adoptar medidas de seguridad</strong> para proteger la vida y
          la integridad de los trabajadores.
        </li>
        <li>
          <strong>Mantener en buen estado</strong> las instalaciones, equipos y
          útiles de trabajo.
        </li>
        <li>
          <strong>Capacitar al personal</strong> sobre los riesgos específicos
          de su puesto de trabajo.
        </li>
        <li>
          <strong>Proveer elementos de protección personal (EPP)</strong>{" "}
          adecuados al riesgo, sin costo para el trabajador.
        </li>
        <li>
          <strong>Realizar exámenes médicos</strong> preocupacionales,
          periódicos y de egreso.
        </li>
        <li>
          <strong>Denunciar accidentes y enfermedades profesionales</strong>{" "}
          ante las autoridades competentes.
        </li>
        <li>
          <strong>Llevar registros</strong> de todas las acciones de seguridad e
          higiene realizadas.
        </li>
      </ul>

      <h2>El Decreto 351/79: la reglamentación</h2>
      <p>
        El <strong>Decreto 351/79</strong> reglamenta la Ley 19.587 y establece
        los requisitos técnicos específicos que los empleadores deben cumplir.
        Abarca temas como:
      </p>
      <ul>
        <li>Condiciones de higiene en los ambientes de trabajo</li>
        <li>Contaminantes químicos y biológicos</li>
        <li>Ventilación, iluminación y ruido</li>
        <li>Protección contra incendios</li>
        <li>Instalaciones eléctricas</li>
        <li>Máquinas y herramientas</li>
        <li>Ergonomía y carga térmica</li>
      </ul>

      <h2>Resoluciones SRT complementarias</h2>
      <p>
        Además de la ley y su decreto, la{" "}
        <Link href="/que-es-srt-argentina">
          Superintendencia de Riesgos del Trabajo (SRT)
        </Link>{" "}
        emite resoluciones que actualizan y amplían los requisitos. Las más
        relevantes para la operación diaria son:
      </p>
      <ul>
        <li>
          <strong>Res. SRT 299/11</strong> — Obligatoriedad del registro de
          entrega de elementos de protección personal con firma del trabajador.
        </li>
        <li>
          <strong>Res. SRT 3067/14</strong> — Relevamiento de agentes de riesgo
          y mediciones ambientales obligatorias.
        </li>
        <li>
          <strong>Res. SRT 905/15</strong> — Régimen de autoseguro y
          requerimientos de documentación.
        </li>
      </ul>

      <h2>¿Qué pasa si no cumplís?</h2>
      <p>El incumplimiento puede derivar en:</p>
      <ul>
        <li>
          <strong>Multas económicas</strong> de la SRT proporcionales a la
          gravedad de la infracción.
        </li>
        <li>
          <strong>Clausura del establecimiento</strong> en casos de riesgo
          grave e inminente.
        </li>
        <li>
          <strong>Responsabilidad civil y penal</strong> en caso de accidentes
          laborales donde se demuestre negligencia.
        </li>
        <li>
          <strong>Incremento de la alícuota de la ART</strong> por alta
          siniestralidad.
        </li>
      </ul>

      <h2>Cómo facilitar el cumplimiento</h2>
      <p>
        El mayor desafío no es conocer la ley sino{" "}
        <strong>demostrar que se cumple</strong>. Eso requiere registros,
        trazabilidad y documentación accesible. Un{" "}
        <Link href="/software-seguridad-higiene-vs-excel">
          software de seguridad e higiene
        </Link>{" "}
        permite:
      </p>
      <ul>
        <li>Registrar inspecciones con evidencia fotográfica y timestamp</li>
        <li>Documentar entregas de EPP con firma digital del trabajador</li>
        <li>
          Programar y registrar capacitaciones con asistencia verificable
        </li>
        <li>
          Llevar mediciones ambientales comparadas contra los límites legales
        </li>
        <li>Generar reportes listos para presentar ante la ART o auditorías</li>
        <li>
          Gestionar{" "}
          <Link href="/gestion-desvios-seguridad-industrial">desvíos</Link> con
          seguimiento hasta el cierre
        </li>
      </ul>
      <p>
        La clave es que los datos se generen directamente desde la operación
        diaria — no que alguien los cargue después en una planilla. Así el
        cumplimiento es un subproducto del trabajo, no una tarea extra.
      </p>
    </ArticleLayout>
  );
}
