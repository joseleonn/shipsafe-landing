import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "que-es-srt-argentina",
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
    <ArticleLayout slug="que-es-srt-argentina">
      <h2>¿Qué es la SRT?</h2>
      <p>
        La <strong>Superintendencia de Riesgos del Trabajo (SRT)</strong> es el
        organismo del Estado argentino encargado de regular y supervisar el
        sistema de riesgos del trabajo. Funciona dentro del ámbito del
        Ministerio de Trabajo, Empleo y Seguridad Social.
      </p>
      <p>Sus funciones principales son:</p>
      <ul>
        <li>
          <strong>Controlar el cumplimiento</strong> de las normas de seguridad
          e higiene en el trabajo.
        </li>
        <li>
          <strong>Supervisar a las ART</strong> (Aseguradoras de Riesgos del
          Trabajo) y garantizar que cumplan con sus obligaciones.
        </li>
        <li>
          <strong>Garantizar las prestaciones</strong> médicas y dinerarias a
          los trabajadores accidentados.
        </li>
        <li>
          <strong>Promover la prevención</strong> de accidentes y enfermedades
          laborales.
        </li>
        <li>
          <strong>Sancionar</strong> a empleadores y ART que incumplan la
          normativa.
        </li>
      </ul>

      <h2>¿Qué son las ART y cómo se relacionan con la SRT?</h2>
      <p>
        Las <strong>Aseguradoras de Riesgos del Trabajo (ART)</strong> son
        empresas privadas que contratan los empleadores para cubrir los riesgos
        laborales de sus trabajadores. La SRT supervisa y regula a las ART.
      </p>
      <p>
        Como empleador, estás obligado a contratar una ART y a cumplir con los
        requisitos de prevención que tanto la SRT como tu ART te exijan. Las ART
        realizan auditorías periódicas donde verifican que tengas la
        documentación de seguridad e higiene al día.
      </p>

      <h2>Resoluciones SRT que más impactan en la operación diaria</h2>

      <h3>Res. SRT 299/11 — Entrega de EPP</h3>
      <p>
        Establece la obligatoriedad de registrar la entrega de elementos de
        protección personal (EPP) con la <strong>firma del trabajador</strong>.
        El registro debe incluir qué elemento se entregó, a quién, cuándo y la
        firma de recepción. Sin este registro, ante un accidente, la empresa no
        puede demostrar que proveyó la protección adecuada.
      </p>

      <h3>Res. SRT 3067/14 — Relevamiento de agentes de riesgo</h3>
      <p>
        Obliga a los empleadores a realizar relevamientos de los agentes de
        riesgo presentes en los puestos de trabajo y a efectuar{" "}
        <strong>mediciones ambientales</strong> (ruido, iluminación,
        contaminantes, carga térmica) para verificar que estén dentro de los
        límites legales establecidos por el Decreto 351/79.
      </p>

      <h3>Res. SRT 905/15 — Autoseguro</h3>
      <p>
        Regula el régimen de autoseguro para empresas grandes que optan por no
        contratar una ART y gestionar los riesgos laborales por cuenta propia.
        Requiere documentación exhaustiva de todas las acciones preventivas.
      </p>

      <h2>¿Qué documentación necesitás tener al día?</h2>
      <p>
        Para cumplir con la SRT y estar preparado para una auditoría de la ART,
        necesitás como mínimo:
      </p>
      <ul>
        <li>Registros de inspecciones de seguridad con fecha y responsable</li>
        <li>Registros de entrega de EPP con firma del trabajador</li>
        <li>Plan de capacitaciones con asistencia y firmas</li>
        <li>Mediciones ambientales actualizadas</li>
        <li>Registro de accidentes e incidentes</li>
        <li>
          Relevamiento de riesgos por puesto de trabajo
        </li>
        <li>Plan de evacuación y registro de simulacros</li>
        <li>Control de vencimientos (extintores, botiquines, etc.)</li>
      </ul>

      <h2>El desafío: generar y mantener toda esa documentación</h2>
      <p>
        La normativa exige mucha documentación y la mayoría de las empresas no
        tienen problema con entender <em>qué</em> tienen que hacer, sino con{" "}
        <strong>mantener los registros actualizados y demostrables</strong>.
      </p>
      <p>
        Acá es donde un{" "}
        <Link href="/software-seguridad-higiene-vs-excel">
          software de seguridad e higiene
        </Link>{" "}
        marca la diferencia: los registros se generan desde la operación diaria,
        con trazabilidad automática. Las{" "}
        <Link href="/como-digitalizar-inspecciones-planta">
          inspecciones digitales
        </Link>{" "}
        incluyen evidencia fotográfica, timestamp y usuario. Los{" "}
        <Link href="/gestion-desvios-seguridad-industrial">desvíos</Link> se
        gestionan con seguimiento hasta el cierre.
      </p>
      <p>
        Todo basado en el marco legal de la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link> y sus
        reglamentaciones.
      </p>
    </ArticleLayout>
  );
}
