import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "software-seguridad-higiene-vs-excel",
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
    <ArticleLayout slug="software-seguridad-higiene-vs-excel">
      <h2>La realidad en las plantas argentinas</h2>
      <p>
        La mayoría de las empresas en Argentina todavía gestionan la seguridad e
        higiene laboral con planillas de Excel. Funciona hasta que no funciona:
        datos que se pierden, archivos que se pisan, versiones que no coinciden y
        horas perdidas armando reportes que nadie lee hasta que llega la
        auditoría.
      </p>
      <p>
        Un <strong>software de seguridad e higiene</strong> como SHIPSAFE no es
        simplemente "un Excel más lindo". Es un cambio en cómo se registra, se
        controla y se demuestra el cumplimiento normativo.
      </p>

      <h2>Comparativa punto por punto</h2>
      <table>
        <thead>
          <tr>
            <th>Aspecto</th>
            <th>Excel</th>
            <th>SHIPSAFE</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Inspecciones en planta</td>
            <td>Se completan en papel y después se cargan</td>
            <td>Se completan desde el celular en el momento</td>
          </tr>
          <tr>
            <td>Desvíos de seguridad</td>
            <td>Se reportan por WhatsApp o mail</td>
            <td>Reporte con foto, ubicación y asignación automática</td>
          </tr>
          <tr>
            <td>Vencimientos (EPP, matafuegos, exámenes)</td>
            <td>Hay que revisar la planilla manualmente</td>
            <td>Alertas automáticas antes del vencimiento</td>
          </tr>
          <tr>
            <td>Reportes para la ART</td>
            <td>Horas armando PDFs desde datos dispersos</td>
            <td>Exportación en un clic con formato aceptado</td>
          </tr>
          <tr>
            <td>Multi-planta</td>
            <td>Un archivo por planta, consolidación manual</td>
            <td>Datos consolidados en tiempo real</td>
          </tr>
          <tr>
            <td>Trazabilidad</td>
            <td>Depende de quién guardó qué versión</td>
            <td>Historial completo con fecha, hora y usuario</td>
          </tr>
          <tr>
            <td>Acceso en planta</td>
            <td>Solo desde la PC con el archivo</td>
            <td>Desde cualquier celular con navegador</td>
          </tr>
          <tr>
            <td>Capacitaciones</td>
            <td>Planilla de asistencia en papel</td>
            <td>Firma digital, certificados automáticos</td>
          </tr>
        </tbody>
      </table>

      <h2>Los riesgos reales de seguir con Excel</h2>
      <p>
        No se trata de que Excel sea "malo". Es una herramienta genérica que no
        fue diseñada para gestionar seguridad e higiene. Los riesgos concretos
        son:
      </p>
      <ul>
        <li>
          <strong>Pérdida de datos</strong> — archivos corruptos, borrados
          accidentales, versiones que se sobreescriben. Sin backup automático.
        </li>
        <li>
          <strong>Incumplimiento normativo</strong> — si no podés demostrar
          trazabilidad, para la ART es como si no hubieras hecho nada.
        </li>
        <li>
          <strong>Tiempo perdido</strong> — cargar datos dos veces (papel → Excel),
          armar reportes a mano, buscar información entre 20 archivos.
        </li>
        <li>
          <strong>Cero visibilidad en tiempo real</strong> — el gerente de planta
          no sabe el estado actual hasta que alguien actualice la planilla.
        </li>
        <li>
          <strong>Escalabilidad</strong> — lo que funciona con 1 planta colapsa
          con 3. Cada planta hace las cosas diferente.
        </li>
      </ul>

      <h2>¿Cuándo tiene sentido migrar?</h2>
      <p>Si te identificás con alguna de estas situaciones, es momento:</p>
      <ol>
        <li>
          Tenés más de una planta y consolidar datos es un dolor de cabeza.
        </li>
        <li>Preparar la auditoría de la ART te lleva más de un día.</li>
        <li>
          Los operarios reportan desvíos por WhatsApp y se pierden en el grupo.
        </li>
        <li>No tenés certeza de qué matafuegos, EPP o exámenes están vencidos.</li>
        <li>
          Tuviste un incidente y no pudiste demostrar las acciones preventivas
          que habías tomado.
        </li>
      </ol>

      <h2>La transición no tiene que ser traumática</h2>
      <p>
        Con SHIPSAFE, la implementación básica lleva menos de un día. Podés{" "}
        <Link href="/como-digitalizar-inspecciones-planta">
          digitalizar las inspecciones
        </Link>{" "}
        progresivamente sin frenar la operación. Se importan datos desde Excel,
        se configuran las plantas y sectores, y el equipo empieza a usar el
        sistema desde el celular sin instalar nada.
      </p>
      <p>
        El cumplimiento con la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link> y las
        resoluciones de la{" "}
        <Link href="/que-es-srt-argentina">SRT</Link> deja de ser un problema
        cuando los datos se generan automáticamente desde la operación diaria.
      </p>
    </ArticleLayout>
  );
}
