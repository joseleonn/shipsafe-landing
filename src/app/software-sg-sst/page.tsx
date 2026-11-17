import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const article = ARTICLES.find((a) => a.slug === "software-sg-sst")!;

/**
 * Página de Colombia (13/11/2026). Normas citadas, ya verificadas en
 * claude/regla-normativa-verificada.md: Res. 0312 de 2019 (arts. 3, 8, 9, 15,
 * 16, 28) y Dec. 1072 de 2015 (art. 2.2.4.6.15). Mismo texto que los
 * artículos publicados del blog sobre 0312 y ATS Colombia.
 */
const FAQS = [
  {
    question: "¿Qué hace un software de SST para una empresa en Colombia?",
    answer:
      "Un software de seguridad y salud en el trabajo ordena el registro y el seguimiento del SG-SST: inspecciones, condiciones inseguras con responsable y fecha, entregas de EPP con firma, capacitaciones, accidentes y la evidencia de cada estándar. La autoevaluación y las decisiones siguen siendo del responsable del SG-SST.",
  },
  {
    question: "¿Qué estándares mínimos le aplican a mi empresa?",
    answer:
      "Depende de la cantidad de trabajadores y la clase de riesgo. Hasta 10 trabajadores en riesgo I, II o III: 7 estándares (artículo 3 de la Resolución 0312 de 2019). De 11 a 50 en riesgo I, II o III: 21 estándares (artículo 9). Más de 50, o cualquier tamaño en riesgo IV o V: 60 estándares (artículos 8, 15 y 16).",
  },
  {
    question: "¿Qué pasa si la autoevaluación da menos de 60 %?",
    answer:
      "Según el artículo 28 de la Resolución 0312, la valoración es crítica: hay que hacer y tener a disposición del Ministerio del Trabajo un plan de mejoramiento de inmediato y enviar a la ARL un reporte de avances en un máximo de tres meses.",
  },
  {
    question: "¿El software reemplaza al responsable del SG-SST?",
    answer:
      "No. El diseño del SG-SST lo hace la persona con la formación y la licencia que pide la Resolución 0312. El software ordena el trabajo diario: inspecciones, hallazgos, responsables, evidencias e indicadores.",
  },
];

export const metadata: Metadata = {
  title: `${article.seoTitle ?? article.title} | ${SITE.name}`,
  description: article.description,
  alternates: { canonical: `/${article.slug}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `${SITE.url}/${article.slug}`,
    type: "article",
    locale: "es_CO",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug="software-sg-sst" eyebrow="Colombia" faqs={FAQS}>
      <p>
        En Colombia, la gestión de seguridad y salud en el trabajo se organiza como un{" "}
        <strong>Sistema de Gestión de Seguridad y Salud en el Trabajo (SG-SST)</strong>. Las
        reglas están en el Decreto 1072 de 2015 y los estándares mínimos que se autoevalúan
        cada año, en la Resolución 0312 de 2019. Esta página es para empresas con operación
        en campo, varias sedes o contratistas que ya tienen el sistema armado y necesitan que
        lo que pasa en cada frente llegue al registro sin pasar por una planilla.
      </p>

      <h2>Qué estándares le aplican a cada empresa</h2>
      <table>
        <thead>
          <tr>
            <th>Empresa</th>
            <th>Estándares</th>
            <th>Resolución 0312</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Hasta 10 trabajadores, riesgo I, II o III</td>
            <td>7</td>
            <td>Artículo 3</td>
          </tr>
          <tr>
            <td>De 11 a 50 trabajadores, riesgo I, II o III</td>
            <td>21</td>
            <td>Artículo 9</td>
          </tr>
          <tr>
            <td>Más de 50 trabajadores, cualquier riesgo</td>
            <td>60</td>
            <td>Artículo 16</td>
          </tr>
          <tr>
            <td>Hasta 50 trabajadores en riesgo IV o V</td>
            <td>60</td>
            <td>Artículos 8 y 15</td>
          </tr>
        </tbody>
      </table>
      <p>
        La empresa hace la autoevaluación de los estándares que le aplican y el resultado
        define si tiene que hacer un plan de mejora (artículo 28). Si el puntaje es menor al
        60 %, la valoración es crítica: hay que hacer y tener a disposición del Ministerio del
        Trabajo un plan de mejoramiento de inmediato y enviar a la ARL un reporte de avances en
        un máximo de tres meses. El detalle está en nuestra guía de{" "}
        <Link href="/blog/estandares-minimos-sg-sst-resolucion-0312">
          estándares mínimos de la Resolución 0312
        </Link>
        .
      </p>

      <h2>Dónde se traba el SG-SST en una operación con varias sedes</h2>
      <p>
        El artículo 2.2.4.6.15 del Decreto 1072 pide aplicar una metodología sistemática para
        identificar peligros y evaluar riesgos en todos los procesos y actividades rutinarias y
        no rutinarias, documentada y actualizada como mínimo de manera anual. La matriz se arma
        en la oficina. Lo que la mantiene viva pasa afuera: la inspección del equipo antes de
        usarlo, el análisis de la tarea antes de subir a una altura, el hallazgo que alguien
        levanta en un frente.
      </p>
      <p>
        Cuando eso se registra en papel y después se transcribe, la evidencia llega tarde, cada
        sede la carga a su manera y el día de la autoevaluación hay que salir a juntarla. Para
        trabajo en alturas, la Resolución 4272 de 2021 nombra el ATS entre las metodologías de
        análisis de peligros por actividad; lo explicamos en la guía de{" "}
        <Link href="/blog/ats-analisis-de-trabajo-seguro-colombia">ATS en Colombia</Link>.
      </p>

      <h2>Qué tiene que resolver un software SG-SST</h2>
      <ul>
        <li>
          <strong>Inspecciones en el lugar.</strong> Que el trabajador registre desde el celular
          en el momento, con fotos, y que quede quién, cuándo y dónde.
        </li>
        <li>
          <strong>Hallazgos con dueño.</strong> Que cada condición no conforme tenga
          responsable, fecha y verificación del cierre, y que se vea qué sigue abierto en cada
          sede.
        </li>
        <li>
          <strong>Firmas sin usuarios.</strong> Que firme el operario que no tiene correo
          corporativo: entrega de EPP, capacitaciones, ATS.
        </li>
        <li>
          <strong>Evidencia ordenada por estándar.</strong> Que lo que se carga todos los días
          sirva para la autoevaluación sin rearmarlo.
        </li>
        <li>
          <strong>Indicadores.</strong> Accidentalidad, cumplimiento de inspecciones y
          hallazgos cerrados por sede, con los datos ya cargados.
        </li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo o área tiene un QR. Se escanea, se completa la inspección desde
        el celular y lo que no está bien genera un hallazgo con responsable y fecha, que solo
        cierra el área de SST después de ver la evidencia. Además de inspecciones, la
        plataforma lleva entregas de EPP con firma, permisos de trabajo, ATS, matriz de
        peligros, accidentes y capacitaciones. Somos un proveedor latinoamericano: la
        plataforma, el soporte y la implementación son en español, y la implementación es
        acompañada sobre tus procesos reales.
      </p>
      <p>
        Si estás comparando opciones, mirá qué preguntas conviene hacerle a cualquier proveedor
        en{" "}
        <Link href="/blog/safetyculture-mitti-alternativas">
          qué revisar en un sistema de seguridad e higiene
        </Link>
        .
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
