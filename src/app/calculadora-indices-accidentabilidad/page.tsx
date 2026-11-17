import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";
import CalculadoraIndices from "@/components/CalculadoraIndices";

const SLUG = "calculadora-indices-accidentabilidad";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Calculadora de índices (17/11/2026). Fórmulas leídas el 17/11:
 * AR: informe anual de accidentabilidad laboral de la SRT (argentina.gob.ar).
 * CO: Res. 0312 de 2019, art. 30 (texto de la Rama Judicial).
 * PE: RM 050-2013-TR, Anexo 1 (copia con anexos de la UNASAM; El Peruano no publica anexos).
 */
const FAQS = [
  {
    question: "¿Cómo se calcula el índice de frecuencia?",
    answer:
      "Depende del país. En Perú, según el registro de estadísticas de la RM 050-2013-TR, es la cantidad de accidentes incapacitantes por un millón dividida por las horas hombre trabajadas. En Colombia, la Resolución 0312 lo define por mes: accidentes del mes sobre trabajadores del mes, por cien.",
  },
  {
    question: "¿Qué es el índice de incidencia de la SRT?",
    answer:
      "Es la cantidad de accidentes y enfermedades con días de baja o secuela incapacitante cada mil trabajadores cubiertos. Es el indicador que usa la SRT en sus informes de accidentabilidad.",
  },
  {
    question: "¿Que bajen los accidentes registrados es siempre buena señal?",
    answer:
      "No necesariamente. Puede bajar porque se previno o porque se dejó de registrar. Conviene mirarlo junto con indicadores de gestión, como las inspecciones hechas sobre las programadas y el tiempo hasta cerrar lo que se detecta.",
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
    type: "website",
    locale: "es_AR",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Herramienta" faqs={FAQS}>
      <p>
        Calcula los índices de accidentabilidad con la fórmula oficial de tu país: elige el país,
        carga los datos del período y los índices se calculan solos. Por ahora están Argentina,
        Colombia y Perú, cada uno con la fuente de donde sale la fórmula.
      </p>

      <CalculadoraIndices />

      <h2>Qué mide cada índice</h2>
      <h3>Argentina</h3>
      <ul>
        <li>
          <strong>Índice de incidencia:</strong> accidentes y enfermedades con días de baja o
          secuela incapacitante cada mil trabajadores.
        </li>
        <li>
          <strong>Índice de incidencia de fallecidos:</strong> trabajadores fallecidos por
          accidente o enfermedad cada millón de trabajadores.
        </li>
        <li>
          <strong>Índice de pérdida:</strong> jornadas no trabajadas por accidentes y enfermedades
          cada mil trabajadores.
        </li>
        <li>
          <strong>Duración media de las bajas:</strong> jornadas no trabajadas sobre los casos con
          días de baja.
        </li>
      </ul>
      <h3>Colombia</h3>
      <p>
        El artículo 30 de la Resolución 0312 de 2019 pide registrar, entre otros, la frecuencia y
        la severidad de la accidentalidad y el ausentismo por causa médica, todos por mes y
        multiplicados por cien. La severidad suma los días de incapacidad y los días cargados. El
        mismo artículo incluye la proporción de accidentes mortales, y la prevalencia y la
        incidencia de la enfermedad laboral, que se calculan por año.
      </p>
      <h3>Perú</h3>
      <p>
        El registro de estadísticas de la RM 050-2013-TR usa el índice de frecuencia (accidentes
        incapacitantes por millón de horas hombre), el índice de gravedad (días perdidos por
        millón de horas hombre) y el índice de accidentabilidad (frecuencia por gravedad, dividido
        mil).
      </p>

      <h2>Lo que estos números no dicen solos</h2>
      <p>
        Un índice que baja puede querer decir que se previno o que se dejó de registrar. Para leer
        la gestión conviene mirarlo junto con indicadores de lo que se hace: inspecciones hechas
        sobre las programadas, tiempo hasta cerrar lo que se detecta y reincidencia del mismo
        problema. Lo explicamos en{" "}
        <Link href="/gestion-desvios-seguridad-industrial">gestión de desvíos</Link>.
      </p>

      <h2>Cómo lo lleva SHIPSAFE</h2>
      <p>
        Los accidentes, las inspecciones y los desvíos quedan registrados en la plataforma con
        fecha, sede y responsable, y los indicadores se calculan sobre esos datos, por sede y para
        toda la empresa, sin armarlos a mano cada mes.
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
