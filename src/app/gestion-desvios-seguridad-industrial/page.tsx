import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const SLUG = "gestion-desvios-seguridad-industrial";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Reescrita el 17/11/2026: posición 3,6 en Google con CTR de 1,4 % (Search
 * Console 17/8 a 15/11). Se cambió el título para prometer lo que la página
 * da (los estados y la planilla) y se sumó la plantilla de registro.
 * Sin normas citadas. Se sacaron afirmaciones que no estaban verificadas
 * (alertas de escalamiento, "obligación implícita" de la Ley 19.587).
 * Los seis estados son los del producto.
 */
const FAQS = [
  {
    question: "¿Qué es un desvío de seguridad?",
    answer:
      "Una condición o un comportamiento que se aparta de lo que la empresa definió como seguro y que podría terminar en un incidente o un accidente: un extintor sin acceso, una guarda retirada, alguien trabajando sin el EPP que corresponde.",
  },
  {
    question: "¿Quién tiene que cerrar un desvío?",
    answer:
      "Alguien distinto de quien lo resolvió, normalmente el área de seguridad e higiene, después de ver la evidencia de cómo quedó. Si el mismo que lo arregla lo cierra, el cierre no verifica nada.",
  },
  {
    question: "¿Qué indicadores sirven para seguir los desvíos?",
    answer:
      "El tiempo promedio hasta el cierre, los desvíos vencidos sin cerrar, los cerrados contra los abiertos del período y si el mismo desvío vuelve a aparecer en el mismo lugar. La cantidad de desvíos detectados sola no alcanza: puede bajar porque se corrigió o porque se dejó de mirar.",
  },
];

export const metadata: Metadata = {
  title: `${article.seoTitle ?? article.title} | ${SITE.name}`,
  description: article.description,
  alternates: { canonical: `/${SLUG}` },
  openGraph: {
    title: article.title,
    description: article.description,
    url: `${SITE.url}/${SLUG}`,
    type: "article",
    locale: "es_AR",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} faqs={FAQS}>
      <p>
        Detectar un desvío es la parte fácil. Lo difícil es que termine en una acción
        verificada: que tenga responsable, fecha, que alguien lo resuelva y que otra persona
        confirme que quedó bien. Acá está el ciclo completo, los indicadores que conviene mirar
        y una{" "}
        <a href="/recursos/registro-de-desvios-shipsafe.xlsx">
          planilla de registro de desvíos en Excel
        </a>{" "}
        con los seis estados y los indicadores ya armados.
      </p>

      <h2>Qué es un desvío de seguridad</h2>
      <p>
        Una condición o un comportamiento que se aparta de lo que la empresa definió como seguro
        y que podría terminar en un incidente o un accidente. Algunos ejemplos:
      </p>
      <ul>
        <li>Un operario trabajando sin el EPP que pide la tarea.</li>
        <li>Un extintor sin carga o con el acceso bloqueado.</li>
        <li>Una guarda de máquina retirada o dañada.</li>
        <li>Un derrame sin contener.</li>
        <li>Una salida de emergencia obstruida.</li>
      </ul>

      <h2>Los seis estados de un desvío</h2>
      <p>
        Una planilla con dos estados, abierto y cerrado, no deja ver en qué parte del camino se
        trabó cada uno. Estos son los seis que usa la planilla:
      </p>
      <ol>
        <li>
          <strong>Abierto.</strong> Se detectó y se cargó, con foto si se pudo, lugar y quién lo
          detectó.
        </li>
        <li>
          <strong>Asignado.</strong> Tiene un responsable y una fecha límite.
        </li>
        <li>
          <strong>En proceso.</strong> El responsable lo está resolviendo.
        </li>
        <li>
          <strong>Resuelto.</strong> El responsable cargó cómo quedó, con foto. Todavía no está
          cerrado.
        </li>
        <li>
          <strong>Cerrado.</strong> Seguridad e higiene fue, verificó y lo dio por cerrado.
        </li>
        <li>
          <strong>Reabierto.</strong> Al verificar, la resolución no alcanzaba. Vuelve al
          responsable.
        </li>
      </ol>

      <h2>El que lo arregla no lo cierra</h2>
      <p>
        Si la misma persona resuelve y cierra, &quot;cerrado&quot; quiere decir &quot;yo digo
        que está bien&quot;. Separar el resuelto del cerrado es lo que hace que el registro sirva
        en una auditoría: queda quién lo arregló, cómo, y quién verificó que quedó bien.
      </p>

      <h2>Dónde se traba en la práctica</h2>
      <ul>
        <li>
          <strong>Se detecta y no se carga.</strong> Queda en un mensaje de WhatsApp o en la
          libreta de la recorrida, y alguien lo pasa cuando puede.
        </li>
        <li>
          <strong>Se carga sin responsable.</strong> Todos lo vieron y nadie lo tiene asignado.
        </li>
        <li>
          <strong>Se resuelve y nadie verifica.</strong> El sector dice que lo arregló y queda
          así.
        </li>
        <li>
          <strong>No se puede analizar.</strong> Sin sector, tipo y fecha en un solo lugar, no se
          ve dónde se repite el mismo problema.
        </li>
      </ul>

      <h2>Qué medir</h2>
      <ul>
        <li>Tiempo promedio desde que se detecta hasta que se cierra.</li>
        <li>Desvíos vencidos: pasó la fecha límite y no están cerrados.</li>
        <li>Cerrados contra abiertos en el período.</li>
        <li>Reincidencia: el mismo desvío en el mismo lugar en la recorrida siguiente.</li>
      </ul>
      <p>
        La cantidad de desvíos detectados, sola, engaña. Si baja, puede ser porque se corrigió lo
        que había o porque se dejó de inspeccionar. Por eso conviene mirarla junto con las
        inspecciones hechas sobre las programadas.
      </p>

      <h2>La planilla de registro de desvíos</h2>
      <p>
        La{" "}
        <a href="/recursos/registro-de-desvios-shipsafe.xlsx">plantilla en Excel</a> tiene una
        fila por desvío con fecha, sector, descripción, tipo, gravedad, foto, responsable, fecha
        límite, estado (con los seis de arriba), cómo se resolvió, quién verificó y fecha de
        cierre. Calcula sola los días abiertos y una hoja de indicadores: abiertos, cerrados,
        reabiertos, vencidos, promedio de días hasta el cierre y desvíos sin responsable.
      </p>
      <p>
        Funciona mientras una persona la mantiene al día. El límite aparece cuando los desvíos
        se detectan en varios lugares a la vez y alguien tiene que juntarlos.
      </p>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        El desvío se carga en el lugar desde el celular, con foto, o sale solo cuando una
        inspección marca algo que no está bien. Se asigna a un responsable con fecha, el
        responsable carga la foto de cómo quedó y solo seguridad e higiene lo puede cerrar; si no
        alcanza, lo reabre. Los indicadores de arriba se calculan sobre esos datos, por sector y
        por sitio. Mirá cómo empieza el flujo en la{" "}
        <Link href="/app-inspecciones-seguridad-qr">app de inspecciones con QR</Link>.
      </p>

      <h2>Preguntas frecuentes</h2>
      {FAQS.map((f) => (
        <div key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}
    </ArticleLayout>
  );
}
