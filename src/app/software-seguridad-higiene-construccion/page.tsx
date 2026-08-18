import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "software-seguridad-higiene-construccion",
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
    <ArticleLayout slug="software-seguridad-higiene-construccion">
      <h2>La obra: un lugar de trabajo que cambia todos los días</h2>
      <p>
        A diferencia de una planta fija, una obra de construcción se transforma
        constantemente: las condiciones de riesgo de hoy no son las de la semana
        que viene. Por eso un <strong>software de seguridad e higiene</strong>{" "}
        para construcción tiene que ser ágil y móvil: el responsable de obra
        necesita registrar y verificar desde el celular, en el lugar, sin volver a
        la oficina a cargar planillas.
      </p>

      <h2>Normativa específica de la construcción</h2>
      <p>
        Además de la <Link href="/ley-19587-guia-completa">Ley 19.587</Link>, la
        construcción se rige por normativa propia: el <strong>Decreto 911/96</strong>{" "}
        (higiene y seguridad para la industria de la construcción) y las
        resoluciones de la <Link href="/que-es-srt-argentina">SRT</Link> 51/97 y
        35/98, que regulan el <strong>Programa de Seguridad</strong> y el aviso de
        obra. Cumplir implica documentación que debe estar disponible y
        actualizada durante toda la obra.
      </p>

      <h2>Riesgos críticos a gestionar</h2>
      <ul>
        <li>
          <strong>Trabajo en altura</strong>: la principal causa de accidentes
          fatales en el sector; exige permisos, arnés y verificación previa.
        </li>
        <li>
          <strong>Excavaciones y derrumbes</strong>: entibado y control de
          taludes.
        </li>
        <li>
          <strong>Riesgo eléctrico</strong>: instalaciones provisorias y
          herramientas en ambientes húmedos.
        </li>
        <li>
          <strong>Caída de objetos y orden y limpieza</strong>: gestión del
          obrador y circulación.
        </li>
      </ul>

      <h2>Qué resuelve el software en obra</h2>
      <ul>
        <li>
          <strong>Análisis de Seguridad en el Trabajo (AST)</strong> y permisos de
          tarea crítica completados desde el celular antes de empezar.
        </li>
        <li>
          <strong>Inspecciones diarias</strong> de andamios, arneses y tableros
          con <Link href="/app-inspecciones-seguridad-qr">QR por equipo</Link>.
        </li>
        <li>
          <strong>Capacitaciones y charlas de seguridad</strong> con firma digital
          de los trabajadores en el momento.
        </li>
        <li>
          <strong>Control de EPP</strong> y entrega registrada por trabajador.
        </li>
        <li>
          <strong>Gestión de desvíos</strong> con foto y ubicación, del reporte al
          cierre. Ver{" "}
          <Link href="/gestion-desvios-seguridad-industrial">
            gestión de desvíos
          </Link>
          .
        </li>
      </ul>

      <h2>Documentación lista cuando la piden</h2>
      <p>
        Cuando llega la inspección de la SRT, del comitente o de la ART, tener el
        legajo técnico y los registros al día deja de ser una corrida. SHIPSAFE
        centraliza toda la evidencia de la obra y la genera automáticamente desde
        la operación diaria, accesible desde cualquier celular sin instalar nada.{" "}
        <Link href="/#contacto">Agendá una demo</Link> y lo evaluás en tu obra.
      </p>
    </ArticleLayout>
  );
}
