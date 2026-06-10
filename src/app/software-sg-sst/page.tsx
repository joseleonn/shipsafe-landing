import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find((a) => a.slug === "software-sg-sst")!;

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
    <ArticleLayout slug="software-sg-sst">
      <h2>¿Qué significa SG-SST?</h2>
      <p>
        <strong>SG-SST</strong> son las siglas de{" "}
        <strong>Sistema de Gestión de Seguridad y Salud en el Trabajo</strong>.
        Es el conjunto de políticas, procedimientos y registros con los que una
        empresa identifica riesgos, previene accidentes y demuestra que cumple
        con sus obligaciones legales. Un <strong>software SG-SST</strong> es la
        herramienta que digitaliza y centraliza toda esa gestión.
      </p>
      <p>
        La sigla se usa mucho en la región (especialmente en Colombia), pero el
        concepto aplica directamente a la Argentina: lo que acá enmarca la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link>, el Decreto
        351/79 y las resoluciones de la{" "}
        <Link href="/que-es-srt-argentina">SRT</Link> es, en la práctica, un
        sistema de gestión de seguridad y salud en el trabajo.
      </p>

      <h2>SG-SST e ISO 45001</h2>
      <p>
        La norma internacional <strong>ISO 45001</strong> establece los
        requisitos para un sistema de gestión de SST certificable. No es
        obligatoria en Argentina, pero muchas empresas la adoptan para ordenar
        su gestión y para responder a exigencias de clientes o casas matrices. Un
        software SG-SST ayuda a sostener los requisitos de la norma: contexto y
        partes interesadas, identificación de peligros, controles operacionales,
        seguimiento de indicadores y mejora continua.
      </p>

      <h2>Qué funciones necesita un software SG-SST</h2>
      <ul>
        <li>
          <strong>Identificación de peligros y evaluación de riesgos</strong> —
          matrices por puesto y sector, actualizables.
        </li>
        <li>
          <strong>Inspecciones y checklists</strong> — relevamientos planificados
          con evidencia. Ver{" "}
          <Link href="/app-inspecciones-seguridad-qr">
            app de inspecciones con QR
          </Link>
          .
        </li>
        <li>
          <strong>Gestión de incidentes y desvíos</strong> — registro,
          investigación, acciones correctivas y cierre.
        </li>
        <li>
          <strong>Capacitaciones</strong> — planificación, asistencia con firma
          digital y certificados.
        </li>
        <li>
          <strong>Control de EPP y vencimientos</strong> — entrega registrada y
          alertas automáticas.
        </li>
        <li>
          <strong>Indicadores y reportes</strong> — tableros de gestión y
          exportación para auditorías o la ART.
        </li>
      </ul>

      <h2>SG-SST en Argentina: cumplir antes que certificar</h2>
      <p>
        Para la mayoría de las PyMEs industriales argentinas, la prioridad no es
        certificar ISO 45001, sino <strong>cumplir con la normativa SRT</strong>{" "}
        y poder demostrarlo cuando llega la auditoría. Un software SG-SST adaptado
        a la realidad local resuelve eso sin la complejidad de una suite
        corporativa.
      </p>
      <p>
        SHIPSAFE funciona como sistema de gestión de seguridad e higiene pensado
        para plantas en Argentina: el operario registra desde el celular y los
        datos se transforman automáticamente en la evidencia que necesitás. Si
        estás comparando opciones, mirá nuestra guía de{" "}
        <Link href="/mejores-software-seguridad-higiene-argentina">
          mejores software de seguridad e higiene
        </Link>{" "}
        o <Link href="/#contacto">agendá una demo</Link>.
      </p>
    </ArticleLayout>
  );
}
