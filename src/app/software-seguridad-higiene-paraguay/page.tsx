import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-seguridad-higiene-paraguay";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de Paraguay (13/11/2026). El 16/11 se sumó la Ley 5.804/17, leída en
 * la Biblioteca y Archivo Central del Congreso (bacn.gov.py): arts. 1, 14, 16,
 * 17, 31 num. 9 y 37. El Decreto 14.390/92 se nombra pero no se cita: su texto
 * oficial no se pudo leer (regla del 09/11).
 */
const FAQS = [
  {
    question: "¿Sirve para una empresa con varias sucursales o acopios?",
    answer:
      "Sí. Cada sucursal tiene sus equipos, vehículos y áreas con QR, las mismas listas de inspección y su propio tablero, y la gerencia ve todas juntas.",
  },
  {
    question: "¿Los operarios necesitan usuario o correo?",
    answer:
      "No. El operario escanea el QR y completa la inspección o firma la entrega de EPP desde el celular, sin cuenta propia.",
  },
  {
    question: "¿La plataforma y el soporte son en español?",
    answer:
      "Sí. SHIPSAFE es un proveedor latinoamericano: la plataforma, el soporte y la implementación son en español.",
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
    locale: "es_PY",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Paraguay" faqs={FAQS}>
      <p>
        Esta página es para empresas paraguayas con operación repartida: sucursales, acopios,
        flota propia, estaciones de servicio o depósitos. En ese tipo de operación la
        seguridad e higiene se juega en cada sede, y el área de seguridad necesita enterarse de
        lo que pasa en todas sin esperar a que alguien pase la planilla.
      </p>
      <p>
        El marco general está en el Código del Trabajo (Ley 213/93), en el Reglamento General
        Técnico de Seguridad, Higiene y Medicina en el Trabajo aprobado por el Decreto 14.390/92 y
        en la <strong>Ley 5.804/17, que establece el Sistema Nacional de Prevención de Riesgos
        Laborales</strong>. Según su artículo 1, esa ley reglamenta la aplicación de lo previsto en
        el Código del Trabajo.
      </p>

      <h2>Qué pide la Ley 5.804 a la empresa</h2>
      <table>
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Qué dice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>14</td>
            <td>La prevención de riesgos profesionales es responsabilidad de los empleadores.</td>
          </tr>
          <tr>
            <td>16</td>
            <td>Todas las empresas tienen que llevar las estadísticas de los accidentes de trabajo y las enfermedades profesionales.</td>
          </tr>
          <tr>
            <td>17</td>
            <td>
              El empleador informa a sus trabajadores los riesgos a los que pueden estar expuestos, y
              todo accidente de trabajo o enfermedad profesional lo informa a la entidad que administra
              los riesgos profesionales, en los plazos que fije la reglamentación.
            </td>
          </tr>
          <tr>
            <td>31, num. 9</td>
            <td>Tiene que haber personal responsable de la seguridad y salud en el trabajo, en la figura del asesor de seguridad.</td>
          </tr>
          <tr>
            <td>37</td>
            <td>
              El empleador elabora y conserva a disposición de la autoridad laboral el plan de
              prevención, las evaluaciones de riesgos con los resultados de los controles periódicos,
              la planificación de la actividad preventiva con las medidas y el equipo de protección,
              los controles de salud y la relación de accidentes y enfermedades profesionales con más
              de un día de incapacidad.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        El artículo 37 es el que más se nota en una operación con sucursales: los controles
        periódicos y la relación de accidentes salen de lo que pasa en cada sede, y tienen que
        estar disponibles cuando la autoridad los pida. Qué le aplica a cada empresa lo define su
        asesor o profesional de seguridad; acá nos concentramos en cómo se registra y se sigue el
        trabajo diario.
      </p>

      <h2>Dónde se traba en una operación con sucursales</h2>
      <ul>
        <li>
          <strong>Cada sucursal registra a su manera.</strong> La misma inspección se hace con
          una planilla en un lugar y con otra en el siguiente, y no se pueden comparar.
        </li>
        <li>
          <strong>El doble trabajo.</strong> Se inspecciona en papel y después alguien lo pasa
          a Excel. Lo que se detectó el lunes llega a la oficina cuando se transcribe.
        </li>
        <li>
          <strong>La flota.</strong> El control antes de salir con el camión queda en una hoja
          que nadie revisa hasta que hay un problema.
        </li>
        <li>
          <strong>Las entregas de EPP.</strong> La firma del trabajador queda en una carpeta de
          la sucursal.
        </li>
        <li>
          <strong>Las auditorías de clientes.</strong> Cuando un cliente pide ver la gestión,
          hay que salir a juntar papeles de cada sede.
        </li>
      </ul>

      <h2>Qué tiene que resolver un software de seguridad e higiene</h2>
      <ul>
        <li>Inspecciones desde el celular en el momento, con foto, hora y quién la hizo.</li>
        <li>Las mismas listas de inspección en todas las sucursales.</li>
        <li>Lo que no está bien, con responsable, fecha y verificación del cierre.</li>
        <li>Firma de entregas de EPP y capacitaciones sin usuario ni correo.</li>
        <li>Un tablero por sucursal y uno general para la gerencia.</li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo, silo o sector tiene un QR. El operario lo escanea, el sistema
        verifica que esté habilitado para usarlo, completa la inspección y arranca. Si
        encuentra algo que no está bien, mantenimiento recibe el desvío con responsable y
        fecha, y solo lo cierra seguridad e higiene después de ver la evidencia. Lo mismo para
        el control de vehículos antes de salir; lo explicamos en el{" "}
        <Link href="/blog/checklist-vehicular-preuso">checklist vehicular de preuso</Link>.
      </p>
      <p>
        Somos un proveedor latinoamericano: la plataforma, el soporte y la implementación son
        en español, y la implementación es acompañada sobre tus procesos reales. Para ver el
        flujo de inspección completo, mirá la{" "}
        <Link href="/app-inspecciones-seguridad-qr">app de inspecciones con QR</Link>.
      </p>

      <h2>Preguntas frecuentes</h2>
      {FAQS.map((f) => (
        <div key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}

      <AvisoNormativa />
    </ArticleLayout>
  );
}
