import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "mejores-software-seguridad-higiene-argentina",
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
    <ArticleLayout slug="mejores-software-seguridad-higiene-argentina">
      <h2>Qué hace bueno a un software de seguridad e higiene</h2>
      <p>
        Elegir un <strong>software de seguridad e higiene</strong> en Argentina
        no se trata de buscar el que tenga más funciones, sino el que tu equipo
        de planta realmente va a usar todos los días. Un sistema que el operario
        no abre termina siendo un Excel más caro. Antes de comparar productos,
        conviene tener claros los criterios que de verdad importan.
      </p>

      <h2>Los 7 criterios para comparar</h2>
      <ol>
        <li>
          <strong>Uso en planta sin fricción</strong> — ¿el operario puede
          registrar desde el celular, sin instalar una app ni recordar una
          contraseña? Si requiere capacitación de horas, no se va a adoptar.
        </li>
        <li>
          <strong>Cumplimiento con la normativa argentina</strong> — debe estar
          alineado con la{" "}
          <Link href="/ley-19587-guia-completa">Ley 19.587</Link>, el Decreto
          351/79 y las resoluciones de la{" "}
          <Link href="/que-es-srt-argentina">SRT</Link>. Reportes en formatos
          que la ART acepta.
        </li>
        <li>
          <strong>Inspecciones y checklists configurables</strong> — que puedas
          adaptar los cuestionarios a tus equipos y sectores, no formularios
          rígidos.
        </li>
        <li>
          <strong>Gestión de desvíos de punta a punta</strong> — del reporte con
          foto al cierre con responsable asignado. Ver{" "}
          <Link href="/gestion-desvios-seguridad-industrial">
            gestión de desvíos
          </Link>
          .
        </li>
        <li>
          <strong>Control de vencimientos</strong> — EPP, matafuegos, exámenes
          médicos y mediciones, con alertas automáticas antes de que venzan.
        </li>
        <li>
          <strong>Multi-planta y tableros en tiempo real</strong> — visibilidad
          consolidada si gestionás más de una ubicación.
        </li>
        <li>
          <strong>Migración desde Excel</strong> — que puedas importar tus datos
          actuales sin empezar de cero. Comparativa completa en{" "}
          <Link href="/software-seguridad-higiene-vs-excel">
            software vs Excel
          </Link>
          .
        </li>
      </ol>

      <h2>Tipos de software que vas a encontrar</h2>
      <p>
        En el mercado argentino conviven tres grandes categorías, y cada una
        resuelve un problema distinto:
      </p>
      <ul>
        <li>
          <strong>Suites internacionales de HSE</strong> — muy completas pero
          caras, pensadas para grandes corporaciones y, muchas veces, sin
          adaptación a la normativa local ni a la lógica de la ART.
        </li>
        <li>
          <strong>Software de SG-SST genérico</strong> — orientado a sistemas de
          gestión y certificación ISO 45001. Útil para auditorías, menos ágil
          para la operación diaria en planta. Ver{" "}
          <Link href="/software-sg-sst">qué es un software SG-SST</Link>.
        </li>
        <li>
          <strong>Software local centrado en planta</strong> — diseñado para la
          realidad argentina (ART, SRT, multi-planta PyME), con foco en que el
          operario registre desde el celular. Es la categoría de SHIPSAFE.
        </li>
      </ul>

      <h2>Por qué SHIPSAFE</h2>
      <p>
        SHIPSAFE está pensado específicamente para plantas industriales en
        Argentina. Funciona desde el navegador del celular sin instalar nada: el
        operario escanea un QR y completa la inspección en el momento. Cubre
        inspecciones, desvíos, capacitaciones con firma digital, mediciones
        ambientales y control de vencimientos, y genera reportes listos para la
        ART. La implementación básica lleva menos de un día y se importan los
        datos desde Excel.
      </p>
      <p>
        El mejor software es el que tu equipo usa sin quejarse y que te deja
        tranquilo cuando llega la auditoría. Si querés verlo funcionando con
        datos reales,{" "}
        <Link href="/#contacto">agendá una demo</Link> y lo evaluás contra estos
        siete criterios.
      </p>
    </ArticleLayout>
  );
}
