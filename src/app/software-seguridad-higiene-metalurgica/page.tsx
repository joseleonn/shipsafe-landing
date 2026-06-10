import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "software-seguridad-higiene-metalurgica",
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
    <ArticleLayout slug="software-seguridad-higiene-metalurgica">
      <h2>Una de las industrias de mayor riesgo</h2>
      <p>
        La industria metalúrgica concentra algunos de los riesgos más severos de
        la actividad industrial argentina. Un{" "}
        <strong>software de seguridad e higiene</strong> en este sector no es un
        lujo administrativo: es la diferencia entre prevenir un accidente grave y
        enterarse tarde de que un control falló.
      </p>
      <ul>
        <li>
          <strong>Trabajos en caliente</strong> — soldadura, corte y amolado, con
          riesgo de incendio, quemaduras y proyección de partículas.
        </li>
        <li>
          <strong>Exposición a ruido</strong> — niveles que con frecuencia
          superan los límites legales y exigen mediciones periódicas.
        </li>
        <li>
          <strong>Humos metálicos y gases de soldadura</strong> — riesgo
          respiratorio que requiere ventilación y EPP específico.
        </li>
        <li>
          <strong>Máquinas, prensas y autoelevadores</strong> — riesgo de
          atrapamiento, aplastamiento y golpes.
        </li>
        <li>
          <strong>Manipulación de cargas</strong> — puentes grúa, eslingas y
          aparejos que deben inspeccionarse y certificarse.
        </li>
      </ul>

      <h2>Qué tiene que cubrir el software</h2>
      <ul>
        <li>
          <strong>Permisos de trabajo en caliente</strong> y checklists previos a
          tareas críticas, completados en el momento.
        </li>
        <li>
          <strong>Mediciones de ruido, humos e iluminación</strong> registradas y
          comparadas contra los límites de la Res. SRT 3067/14.
        </li>
        <li>
          <strong>Control de EPP</strong> — máscaras de soldar, protección
          auditiva y respiratoria, con entrega registrada y firmada.
        </li>
        <li>
          <strong>Inspección de equipos de izaje</strong> y herramientas con{" "}
          <Link href="/app-inspecciones-seguridad-qr">QR por equipo</Link> y
          alertas de vencimiento.
        </li>
        <li>
          <strong>Gestión de desvíos</strong> de punta a punta — ver{" "}
          <Link href="/gestion-desvios-seguridad-industrial">
            gestión de desvíos en seguridad industrial
          </Link>
          .
        </li>
      </ul>

      <h2>Evidencia que protege a la empresa</h2>
      <p>
        En un sector de alto riesgo, demostrar las acciones preventivas que se
        tomaron es tan importante como tomarlas. Si ocurre un incidente, el
        historial digital de inspecciones, capacitaciones y entregas de EPP es lo
        que respalda a la empresa frente a la{" "}
        <Link href="/que-es-srt-argentina">SRT</Link> y la ART. SHIPSAFE genera esa
        trazabilidad automáticamente, desde el celular del operario y sin frenar
        la operación.
      </p>
      <p>
        Si querés ver cómo se aplica a tu planta metalúrgica,{" "}
        <Link href="/#contacto">agendá una demo</Link> con datos reales.
      </p>
    </ArticleLayout>
  );
}
