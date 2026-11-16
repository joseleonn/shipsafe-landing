import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-sst-peru";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de Perú (16/11/2026). Usa solo lo ya verificado el 09/11 para el blog:
 * reglamento de la Ley 29783 art. 77 (IPERC, actualización sin exceder un año),
 * DS 024-2016-EM arts. 7, 36 y 44 y Anexo 11, DS 011-2019-TR art. 5.
 */
const FAQS = [
  {
    question: "¿Cada cuánto se actualiza el IPERC?",
    answer:
      "Según el artículo 77 del reglamento de la Ley 29783, la evaluación se elabora y actualiza periódicamente, sin exceder el plazo de un año, en cada puesto de trabajo.",
  },
  {
    question: "¿Dónde está definido el ATS en Perú?",
    answer:
      "En minería, el DS 024-2016-EM lo define en su artículo 7 y trae el formato en el Anexo N° 11. En construcción, el DS 011-2019-TR lo define en su artículo 5.",
  },
  {
    question: "¿El software reemplaza al supervisor de SST?",
    answer:
      "No. El software ordena el registro y el seguimiento: inspecciones, desvíos, responsables y evidencia. La evaluación y las decisiones siguen siendo del profesional de seguridad.",
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
    locale: "es_PE",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Perú" faqs={FAQS}>
      <p>
        En Perú, la base de la seguridad y salud en el trabajo es la{" "}
        <strong>Ley 29783</strong> y su reglamento, con reglamentos propios para minería (DS
        024-2016-EM) y construcción (DS 011-2019-TR). Esta página es para empresas con varias
        sedes, proyectos o unidades, donde el IPERC, el ATS y las inspecciones se hacen en campo y
        después alguien los tiene que pasar.
      </p>

      <h2>Qué piden las normas</h2>
      <table>
        <thead>
          <tr>
            <th>Norma</th>
            <th>Qué dice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Reglamento de la Ley 29783, art. 77</td>
            <td>
              La evaluación de riesgos (IPERC) se elabora y actualiza periódicamente, sin exceder el
              plazo de un año, en cada puesto de trabajo.
            </td>
          </tr>
          <tr>
            <td>DS 024-2016-EM, art. 7 y Anexo N° 11</td>
            <td>
              Define el ATS como una herramienta de gestión que permite determinar el procedimiento
              de trabajo seguro; el Anexo N° 11 es su formato.
            </td>
          </tr>
          <tr>
            <td>DS 024-2016-EM, arts. 36 y 44</td>
            <td>
              Los trabajos de alto riesgo cuentan con su PETAR, y los trabajadores cumplen las
              medidas de control de los PETS, PETAR y ATS.
            </td>
          </tr>
          <tr>
            <td>DS 011-2019-TR, art. 5</td>
            <td>Define el ATS como herramienta para identificar peligros y evaluar los riesgos de la tarea.</td>
          </tr>
        </tbody>
      </table>
      <p>
        El detalle está en las guías de{" "}
        <Link href="/blog/ats-analisis-de-trabajo-seguro-peru">ATS en Perú</Link> y de{" "}
        <Link href="/blog/matriz-de-riesgos-iperc-plantilla-excel">matriz IPERC</Link>, con
        plantilla en Excel.
      </p>

      <h2>Dónde se traba en una operación con varias unidades</h2>
      <p>
        El ATS se llena en papel antes de la tarea, el PETAR se firma en el frente y las
        inspecciones quedan en un cuaderno. Después alguien los transcribe, cada unidad lo hace
        a su manera y lo que se detectó en una inspección depende de que alguien avise. El día
        que piden la evidencia, hay que salir a juntarla.
      </p>

      <h2>Qué tiene que resolver un software de SST</h2>
      <ul>
        <li>ATS y permisos firmados en el celular en el frente, por quien hace la tarea.</li>
        <li>Inspecciones con QR, foto y hora, con las mismas listas en todas las unidades.</li>
        <li>Lo que no está bien, con responsable, fecha y verificación del cierre.</li>
        <li>IPERC por puesto, actualizable con lo que pasa en campo.</li>
        <li>Accidentes e incidentes registrados con su investigación.</li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo o área tiene un QR. Se escanea, se completa la inspección o el ATS
        desde el celular y lo que no está bien genera un desvío con responsable y fecha, que solo
        cierra el área de seguridad después de ver la evidencia. La plataforma también lleva matriz
        IPERC, permisos de trabajo, entregas de EPP con firma, accidentes y capacitaciones. Somos un
        proveedor latinoamericano, con plataforma, soporte e implementación en español.
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
