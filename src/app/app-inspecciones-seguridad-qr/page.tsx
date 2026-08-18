import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const article = ARTICLES.find(
  (a) => a.slug === "app-inspecciones-seguridad-qr",
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
    <ArticleLayout slug="app-inspecciones-seguridad-qr">
      <h2>El problema de las inspecciones en papel</h2>
      <p>
        En la mayoría de las plantas, las inspecciones de seguridad todavía se
        completan en papel o en planillas que después alguien tiene que cargar a
        una computadora. Ese doble trabajo genera errores, demoras y, sobre todo,
        registros que no sirven como evidencia cuando llega la ART. Una{" "}
        <strong>app de inspecciones de seguridad con QR</strong> elimina ese paso
        intermedio: el registro se hace en el momento, directamente desde el
        celular.
      </p>

      <h2>Cómo funciona el QR en planta</h2>
      <ol>
        <li>
          <strong>Cada equipo o sector tiene su código QR</strong>: matafuegos,
          tableros eléctricos, máquinas, puestos de trabajo. Se imprime y se pega
          una sola vez.
        </li>
        <li>
          <strong>El operario escanea con la cámara del celular</strong>: sin
          instalar ninguna app, se abre directamente la inspección de ese equipo
          en el navegador.
        </li>
        <li>
          <strong>Completa el checklist en el momento</strong>: responde el
          cuestionario, saca fotos y, si detecta algo, reporta el desvío al
          instante.
        </li>
        <li>
          <strong>Todo queda registrado con fecha, hora y usuario</strong>: sin
          recargar nada después. La trazabilidad es automática.
        </li>
      </ol>

      <h2>Por qué el QR cambia la adopción</h2>
      <p>
        La razón por la que muchas inspecciones digitales fracasan es la
        fricción: si el operario tiene que descargar una app, crear un usuario y
        buscar el equipo en una lista, no lo va a usar. Con QR, el equipo correcto
        se abre solo al escanear. No hay que buscar nada ni equivocarse de
        formulario. Esa simplicidad es lo que hace que la herramienta se use de
        verdad en la recorrida diaria.
      </p>

      <h2>De la inspección al cierre</h2>
      <p>
        Una inspección sin seguimiento no sirve de mucho. Lo valioso es lo que
        pasa después: si el operario detecta un matafuego vencido o una protección
        faltante, queda registrado como desvío, se asigna a un responsable y se
        sigue hasta el cierre. Así funciona la{" "}
        <Link href="/gestion-desvios-seguridad-industrial">
          gestión de desvíos
        </Link>{" "}
        integrada con las inspecciones.
      </p>
      <p>
        Si querés ver el proceso completo de pasar del papel a un sistema digital,
        leé{" "}
        <Link href="/como-digitalizar-inspecciones-planta">
          cómo digitalizar las inspecciones de tu planta
        </Link>
        . SHIPSAFE incluye inspecciones con QR de fábrica, accesibles desde
        cualquier celular sin instalación. <Link href="/#contacto">Agendá una demo</Link>{" "}
        y lo probás con tus propios equipos.
      </p>
    </ArticleLayout>
  );
}
