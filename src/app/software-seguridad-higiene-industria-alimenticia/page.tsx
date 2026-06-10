import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "software-seguridad-higiene-industria-alimenticia",
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
    <ArticleLayout slug="software-seguridad-higiene-industria-alimenticia">
      <h2>Riesgos específicos de una planta de alimentos</h2>
      <p>
        La industria alimenticia combina los riesgos de seguridad e higiene
        laboral comunes a toda planta industrial con desafíos propios. Un{" "}
        <strong>software de seguridad e higiene</strong> para el sector tiene que
        contemplar esa doble exigencia: la seguridad del operario y la inocuidad
        del producto.
      </p>
      <ul>
        <li>
          <strong>Cámaras de frío</strong> — exposición a bajas temperaturas,
          pisos resbaladizos por condensación y riesgo de atrapamiento.
        </li>
        <li>
          <strong>Limpieza con químicos</strong> — manipulación de productos de
          sanitización que exige EPP específico y registro de uso.
        </li>
        <li>
          <strong>Máquinas de proceso y cintas</strong> — riesgo mecánico, corte
          y atrapamiento en líneas de producción.
        </li>
        <li>
          <strong>Pisos húmedos y caídas</strong> — la causa más frecuente de
          accidentes en el sector.
        </li>
      </ul>

      <h2>Seguridad e inocuidad van juntas</h2>
      <p>
        En alimentos, los controles de seguridad laboral conviven con las{" "}
        <strong>Buenas Prácticas de Manufactura (BPM)</strong> y los sistemas de
        inocuidad como HACCP. Un software que digitaliza inspecciones y checklists
        permite unificar ambos mundos: la misma recorrida puede verificar el
        estado de una protección de máquina y el cumplimiento de una norma de
        higiene, con evidencia fotográfica y trazabilidad.
      </p>

      <h2>Qué resuelve un software de seguridad e higiene en alimentos</h2>
      <ul>
        <li>
          <strong>Checklists de BPM y seguridad</strong> en una sola{" "}
          <Link href="/app-inspecciones-seguridad-qr">
            inspección con QR
          </Link>{" "}
          por sector o línea.
        </li>
        <li>
          <strong>Control de EPP</strong> específico (calzado antideslizante,
          ropa térmica, guantes de corte) con registro de entrega.
        </li>
        <li>
          <strong>Mediciones ambientales</strong> de ruido, temperatura e
          iluminación contra los límites legales.
        </li>
        <li>
          <strong>Gestión de desvíos</strong> con foto y responsable asignado,
          del reporte al cierre.
        </li>
        <li>
          <strong>Reportes para la ART</strong> y documentación lista para
          auditorías de cliente o de certificadora.
        </li>
      </ul>

      <h2>Cumplir con la normativa sin frenar la producción</h2>
      <p>
        Toda planta de alimentos en Argentina debe cumplir con la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link> y las
        resoluciones de la <Link href="/que-es-srt-argentina">SRT</Link>, además
        de las exigencias sanitarias propias del rubro. SHIPSAFE digitaliza esa
        gestión desde el celular, sin instalar nada y sin frenar la línea. Si hoy
        gestionás todo en planillas, mirá la{" "}
        <Link href="/software-seguridad-higiene-vs-excel">
          comparativa de software vs Excel
        </Link>{" "}
        o <Link href="/#contacto">agendá una demo</Link>.
      </p>
    </ArticleLayout>
  );
}
