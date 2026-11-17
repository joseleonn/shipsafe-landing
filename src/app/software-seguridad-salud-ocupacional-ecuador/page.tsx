import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-seguridad-salud-ocupacional-ecuador";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de Ecuador (17/11/2026). Término por Google Trends (12 meses):
 * salud ocupacional 60, seguridad industrial 51 a 60, seguridad ocupacional 47,
 * seguridad y salud en el trabajo 46.
 * Norma leída el 17/11 en el texto del Acuerdo Ministerial MDT-2024-196
 * (9/10/2024), copia publicada en el repositorio de normativa de la UTPL:
 * arts. 3 (remite al Reglamento de SST, Decreto Ejecutivo 255), 4 num. 7, 10 y
 * 33, 18, 19 y 20. Se parafrasea, no se cita textual. El texto del Decreto 255
 * no se leyó: se nombra, sin artículos.
 */
const FAQS = [
  {
    question: "¿Qué norma regula la seguridad y salud en el trabajo en Ecuador?",
    answer:
      "El Reglamento de Seguridad y Salud en el Trabajo, expedido por el Decreto Ejecutivo 255 de 2024, y las normas del Ministerio del Trabajo que lo aplican, como el Acuerdo Ministerial MDT-2024-196 sobre el cumplimiento y control de las obligaciones.",
  },
  {
    question: "¿Cada cuánto se renuevan el plan de prevención y los demás registros?",
    answer:
      "Según el artículo 20 del Acuerdo MDT-2024-196, varios registros tienen vigencia de 12 meses (por ejemplo, el plan de prevención en empresas de hasta 10 trabajadores, el plan anual de capacitación y la vigilancia de la salud en las de más de 10) y el reglamento de higiene y seguridad y los organismos paritarios, de 24 meses.",
  },
  {
    question: "¿El software reemplaza al técnico de seguridad e higiene?",
    answer:
      "No. Ordena el registro y el seguimiento: inspecciones, hallazgos con responsable, entregas de EPP, capacitaciones y accidentes. La evaluación de los riesgos y las decisiones siguen siendo del técnico y del médico ocupacional.",
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
    locale: "es_EC",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Ecuador" faqs={FAQS}>
      <p>
        En Ecuador, la seguridad y salud ocupacional se rige por el{" "}
        <strong>Reglamento de Seguridad y Salud en el Trabajo (Decreto Ejecutivo 255 de 2024)</strong>{" "}
        y por las normas del Ministerio del Trabajo que lo aplican. Una de ellas es el{" "}
        <strong>Acuerdo Ministerial MDT-2024-196</strong>, que ordena cómo se cumplen y se
        controlan las obligaciones. Esta página es para áreas de seguridad industrial y salud
        ocupacional de empresas con varias sedes, flota o personal en campo.
      </p>

      <h2>Qué pide el Acuerdo MDT-2024-196 a la empresa</h2>
      <table>
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Qué dice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4, num. 7</td>
            <td>
              Investigar y analizar los accidentes de trabajo, los incidentes y las enfermedades
              profesionales para encontrar sus causas y tomar acciones correctivas y preventivas.
            </td>
          </tr>
          <tr>
            <td>4, num. 10</td>
            <td>
              Entregar sin costo para el trabajador la ropa de trabajo y los equipos de protección
              personal y colectiva que necesita para su tarea.
            </td>
          </tr>
          <tr>
            <td>4, num. 33</td>
            <td>
              Mantener un archivo con la información que respalda la implementación de la gestión
              de seguridad y salud en el trabajo.
            </td>
          </tr>
          <tr>
            <td>18 y 19</td>
            <td>
              Registrar o reportar en la plataforma del Ministerio las obligaciones que
              correspondan según la cantidad de trabajadores: responsables de seguridad y salud,
              organismos paritarios, plan de prevención o reglamento de higiene y seguridad, plan
              anual de capacitación, vigilancia de la salud, entre otras. El empleador conserva
              los documentos originales firmados.
            </td>
          </tr>
          <tr>
            <td>20</td>
            <td>
              Vigencias: 12 meses para varios registros (entre ellos el plan anual de
              capacitación y la vigilancia de la salud) y 24 meses para el reglamento de higiene
              y seguridad y los organismos paritarios en empresas de más de 10 trabajadores.
            </td>
          </tr>
        </tbody>
      </table>

      <h2>Dónde se traba en una operación con varias sedes</h2>
      <p>
        Lo que respalda ese archivo se genera afuera de la oficina: la inspección del equipo, la
        entrega del EPP en una sede, la condición insegura que alguien detecta en una recorrida,
        el accidente en un frente. Cuando eso queda en papel, cada sede registra a su manera, la
        firma de la entrega queda en una carpeta y la investigación del accidente se arma
        después, juntando lo que se pueda.
      </p>

      <h2>Qué tiene que resolver un software de seguridad y salud ocupacional</h2>
      <ul>
        <li>Inspecciones desde el celular en el momento, con foto, hora y quién la hizo.</li>
        <li>Las mismas listas de inspección en todas las sedes.</li>
        <li>Lo que no está bien, con responsable, fecha y verificación del cierre.</li>
        <li>Entregas de EPP firmadas por el trabajador, sin usuario ni correo.</li>
        <li>Accidentes e incidentes registrados con su análisis de causa y sus acciones.</li>
        <li>Capacitaciones con asistencia y constancia, para el plan anual.</li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo o área tiene un QR. Se escanea, se completa la inspección desde el
        celular y lo que no está bien genera un desvío con responsable y fecha, que solo cierra
        el área de seguridad después de ver la evidencia. Las entregas de EPP se firman en el
        momento y quedan en el historial de cada trabajador, y todo queda en un mismo archivo
        por sede. Somos un proveedor latinoamericano: la plataforma, el soporte y la
        implementación son en español. Mira cómo funciona la{" "}
        <Link href="/gestion-desvios-seguridad-industrial">gestión de desvíos</Link>.
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
