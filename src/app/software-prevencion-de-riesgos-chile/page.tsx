import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-prevencion-de-riesgos-chile";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de Chile (16/11/2026). Usa solo los artículos del DS 44 ya
 * verificados el 09/11 para el blog (matriz de riesgos y AST Chile): 7, 15 y 18.
 */
const FAQS = [
  {
    question: "¿Cada cuánto se revisa la matriz de peligros según el DS 44?",
    answer:
      "Según su artículo 7, al menos una vez al año y cuando cambian las condiciones de trabajo, después de un accidente del trabajo o de una enfermedad profesional, o ante un riesgo grave e inminente.",
  },
  {
    question: "¿Qué información tiene que recibir el trabajador antes de empezar?",
    answer:
      "El artículo 15 pide informar, antes del inicio de las labores, los riesgos del puesto, las medidas preventivas y los métodos o procedimientos de trabajo correctos, y repetirlo cuando cambian el proceso, las tecnologías o los materiales.",
  },
  {
    question: "¿Desde cuándo rige el DS 44?",
    answer: "Desde el 1 de febrero de 2025. Reemplazó a los decretos supremos 40 y 54 de 1969.",
  },
];

export const metadata: Metadata = {
  title: `${article.seoTitle ?? article.title} | ${SITE.name}`,
  description: article.description,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `${SITE.url}/${SLUG}`,
    type: "article",
    locale: "es_CL",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Chile" faqs={FAQS}>
      <p>
        En Chile, la gestión preventiva de los riesgos laborales se rige desde el 1 de febrero de
        2025 por el <strong>Decreto Supremo 44</strong>, que reemplazó a los decretos 40 y 54 de
        1969. Esta página es para empresas con varias faenas, flota o contratistas, donde lo que
        se revisa en terreno tiene que llegar a la matriz y al registro sin pasar por una planilla.
      </p>

      <h2>Qué pide el DS 44 en el día a día</h2>
      <table>
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Qué dice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>7</td>
            <td>
              Confeccionar una matriz de identificación de peligros y evaluación de los riesgos
              laborales por procesos, tareas y puestos, y revisarla al menos una vez al año y cuando
              cambian las condiciones de trabajo, después de un accidente o enfermedad profesional o
              ante un riesgo grave e inminente.
            </td>
          </tr>
          <tr>
            <td>15</td>
            <td>
              Informar a cada trabajador, antes del inicio de las labores, los riesgos, las medidas
              preventivas y los métodos o procedimientos de trabajo correctos.
            </td>
          </tr>
          <tr>
            <td>18</td>
            <td>
              Los trabajadores pueden interrumpir sus labores ante un riesgo grave e inminente para
              su vida o salud, avisando lo antes posible, sin ser sancionados por eso.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        La matriz completa la explicamos en la{" "}
        <Link href="/blog/matriz-de-riesgos-iperc-plantilla-excel">guía de matriz de riesgos</Link>{" "}
        y el análisis antes de la tarea en la de{" "}
        <Link href="/blog/ast-analisis-seguro-de-trabajo-chile">AST en Chile</Link>.
      </p>

      <h2>Dónde se traba en una operación con varias faenas</h2>
      <p>
        La matriz se arma en la oficina, pero lo que obliga a revisarla pasa en terreno: el
        accidente, el cambio de condiciones, la condición insegura que alguien detecta en una
        inspección. Cuando eso queda en papel, la revisión del artículo 7 llega tarde, cada faena
        registra a su manera y la constancia de que el trabajador recibió la información del
        artículo 15 queda en una carpeta.
      </p>

      <h2>Qué tiene que resolver un software de prevención de riesgos</h2>
      <ul>
        <li>Inspecciones desde el celular en el momento, con foto, hora y quién la hizo.</li>
        <li>Lo que no está bien, con responsable, fecha y verificación del cierre.</li>
        <li>Firma del trabajador al recibir la información o el procedimiento, sin usuario ni correo.</li>
        <li>Las mismas listas de inspección en todas las faenas.</li>
        <li>Accidentes e incidentes registrados para saber cuándo hay que revisar la matriz.</li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo o área tiene un QR. Se escanea, se completa la inspección desde el
        celular y lo que no está bien genera un desvío con responsable y fecha, que solo cierra el
        área de prevención después de ver la evidencia. La plataforma también lleva matriz de
        riesgos, análisis de la tarea, permisos de trabajo, entregas de EPP con firma, accidentes
        y capacitaciones. Somos un proveedor latinoamericano, con plataforma, soporte e
        implementación en español.
      </p>

      <h2>Preguntas frecuentes</h2>
      {FAQS.map((f) => (
        <div key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}

      <AvisoNormativa />
    </ArticleLayout>
  );
}
