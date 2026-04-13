import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "como-digitalizar-inspecciones-planta",
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
    <ArticleLayout slug="como-digitalizar-inspecciones-planta">
      <h2>El problema con las inspecciones en papel</h2>
      <p>
        En la mayoría de las plantas industriales argentinas, las inspecciones
        de seguridad siguen un proceso que no cambió en décadas: el técnico
        recorre la planta con un formulario impreso, anota lo que encuentra,
        vuelve a la oficina y carga los datos en una planilla de Excel. Si hay
        suerte.
      </p>
      <p>
        Este proceso tiene problemas estructurales que ninguna mejora en el
        formulario puede resolver:
      </p>
      <ul>
        <li>La información se carga horas o días después de la recorrida</li>
        <li>No hay evidencia fotográfica vinculada al registro</li>
        <li>Los datos dependen de la letra y la memoria de una persona</li>
        <li>No hay visibilidad en tiempo real del estado de la planta</li>
        <li>Consolidar datos de múltiples plantas es un trabajo manual</li>
      </ul>

      <h2>¿Qué significa "digitalizar" inspecciones?</h2>
      <p>
        No es escanear el formulario en papel ni pasar la planilla a Google
        Sheets. Digitalizar significa que el dato se captura{" "}
        <strong>en el momento y en el lugar</strong> donde ocurre la inspección,
        directamente desde un dispositivo móvil, y queda disponible al instante
        para todos los que lo necesitan.
      </p>
      <p>En la práctica, esto implica:</p>
      <ol>
        <li>
          El operario o técnico escanea un <strong>código QR</strong> del equipo
          o sector a inspeccionar.
        </li>
        <li>
          Completa el checklist digitalizado desde el <strong>celular</strong>,
          con opciones predefinidas y campos para observaciones.
        </li>
        <li>
          Adjunta <strong>fotos</strong> directamente desde la cámara del
          teléfono.
        </li>
        <li>
          El sistema registra automáticamente <strong>fecha, hora, ubicación
          y usuario</strong>.
        </li>
        <li>
          Los datos están disponibles <strong>al instante</strong> en el
          dashboard para supervisores y gerentes.
        </li>
      </ol>

      <h2>Paso a paso: cómo implementar la transición</h2>

      <h3>1. Relevar los formularios actuales</h3>
      <p>
        Antes de digitalizar, revisá qué formularios se usan hoy. En general
        las plantas tienen checklists de inspección de equipos, formularios de
        recorrida general, registros de EPP y planillas de mediciones
        ambientales. El objetivo es migrar cada uno a un formato digital
        equivalente.
      </p>

      <h3>2. Configurar el sistema</h3>
      <p>
        En SHIPSAFE, esto significa cargar la estructura de tu empresa: plantas,
        sectores, puestos de trabajo y equipos. Si ya tenés estos datos en
        Excel, se pueden importar masivamente. La configuración básica lleva
        menos de un día.
      </p>

      <h3>3. Generar los códigos QR</h3>
      <p>
        Cada equipo o sector recibe un código QR único que se imprime y se pega
        en el lugar físico. El operario lo escanea con la cámara del celular y
        accede directamente al formulario de inspección correspondiente. No
        necesita instalar ninguna app.
      </p>

      <h3>4. Capacitar al equipo</h3>
      <p>
        La capacitación es mínima: escanear un QR y completar un formulario en
        el celular. En nuestra experiencia, los operarios lo adoptan en la
        primera recorrida. La clave es que sea más fácil que el método anterior,
        no más difícil.
      </p>

      <h3>5. Empezar gradualmente</h3>
      <p>
        No hace falta migrar todo de golpe. Podés empezar con un tipo de
        inspección (por ejemplo, extintores o equipos críticos) y expandir
        progresivamente. Mientras tanto, las otras inspecciones siguen como
        antes.
      </p>

      <h2>Resultados que se ven rápido</h2>
      <ul>
        <li>
          <strong>Tiempo de carga reducido un 70-80%</strong> — el dato se
          captura una sola vez, en el momento.
        </li>
        <li>
          <strong>100% de trazabilidad</strong> — cada inspección tiene fecha,
          hora, usuario y evidencia.
        </li>
        <li>
          <strong>Visibilidad inmediata</strong> — el supervisor ve el estado
          actualizado sin esperar.
        </li>
        <li>
          <strong>Reportes automáticos</strong> — la información para la ART se
          genera desde los datos operativos.
        </li>
      </ul>

      <h2>El cumplimiento normativo como subproducto</h2>
      <p>
        Cuando las inspecciones se hacen digitalmente, el cumplimiento con la{" "}
        <Link href="/ley-19587-guia-completa">Ley 19.587</Link> y las
        resoluciones de la{" "}
        <Link href="/que-es-srt-argentina">SRT</Link> deja de ser una tarea
        separada. Los registros se generan automáticamente, con la evidencia que
        las auditorías requieren. No tenés que "preparar" nada para la ART — los
        datos ya están ahí.
      </p>
      <p>
        Si todavía gestionás inspecciones con papel o Excel, podés ver una{" "}
        <Link href="/software-seguridad-higiene-vs-excel">
          comparativa completa
        </Link>{" "}
        de qué cambia al migrar a un software especializado.
      </p>
    </ArticleLayout>
  );
}
