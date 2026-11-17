import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-seguridad-ocupacional-guatemala";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de Guatemala (13/11/2026). Verificado el 13/11 en el texto del
 * Acuerdo Gubernativo 229-2014 publicado por el IGSS: arts. 3, 4, 5 a) e) g),
 * 133, 231, 397 y 434. Art. 10 en la versión con reformas publicada por el
 * IGSS (reformado por el Ac. Gub. 57-2022). El reglamento tiene reformas
 * (33-2016, 57-2022): no se citan artículos que no se leyeron en su versión
 * vigente (por ejemplo, el 302 del plan de SSO).
 */
const FAQS = [
  {
    question: "¿Toda empresa necesita un comité bipartito?",
    answer:
      "Según el artículo 10 del Acuerdo Gubernativo 229-2014 (reformado por el Acuerdo Gubernativo 57-2022), todo lugar de trabajo con diez o más trabajadores debe contar con un comité bipartito de salud y seguridad ocupacional, y los que tienen menos de diez, con un monitor.",
  },
  {
    question: "¿Hay que dejar registro de la entrega de equipo de protección personal?",
    answer:
      "Sí. El artículo 231 dice que debe existir un registro de entrega del equipo de protección personal, incluyendo fecha y nombre del trabajador.",
  },
  {
    question: "¿Cada cuánto se revisan los extintores?",
    answer:
      "El artículo 133 dice que deben ser revisados periódicamente y recargados después de usarlos. La frecuencia concreta conviene definirla con el profesional de seguridad de la empresa y el proveedor del servicio.",
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
    locale: "es_GT",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="Guatemala" faqs={FAQS}>
      <p>
        En Guatemala, las condiciones mínimas de salud y seguridad ocupacional están en el{" "}
        <strong>Reglamento de Salud y Seguridad Ocupacional, Acuerdo Gubernativo 229-2014</strong>
        , que tuvo reformas posteriores (entre ellas, los Acuerdos Gubernativos 33-2016 y
        57-2022). Según su artículo 3, es de observancia general en toda la República. Esta
        página es para áreas de seguridad industrial y ocupacional de empresas con varias sedes, flota o personal en campo que necesitan que
        lo que se revisa en cada lugar quede registrado en el momento.
      </p>

      <h2>Qué pide el reglamento en el día a día</h2>
      <table>
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Qué dice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4</td>
            <td>
              El patrono tiene que adoptar y poner en práctica medidas de salud y seguridad
              ocupacional sobre las operaciones y procesos de trabajo, el suministro, uso y
              mantenimiento del equipo de protección personal, las instalaciones y los sistemas
              de emergencia.
            </td>
          </tr>
          <tr>
            <td>5 a)</td>
            <td>Mantener en buen estado de conservación, funcionamiento y uso la maquinaria.</td>
          </tr>
          <tr>
            <td>10</td>
            <td>
              Comité bipartito en lugares de trabajo con diez o más trabajadores; monitor en los
              de menos de diez (texto reformado por el Ac. Gub. 57-2022).
            </td>
          </tr>
          <tr>
            <td>133</td>
            <td>Los extintores deben ser revisados periódicamente y recargados después de usarlos.</td>
          </tr>
          <tr>
            <td>231</td>
            <td>
              Debe existir un registro de entrega del equipo de protección personal, con fecha y
              nombre del trabajador.
            </td>
          </tr>
          <tr>
            <td>397</td>
            <td>En andamios, los reconocimientos se repiten diariamente.</td>
          </tr>
          <tr>
            <td>434</td>
            <td>Las máquinas se inspeccionan periódicamente y se mantienen en perfecto estado de funcionamiento.</td>
          </tr>
        </tbody>
      </table>

      <h2>Dónde se traba en la práctica</h2>
      <p>
        Casi todo lo de la tabla se hace afuera de la oficina: la revisión del extintor, la
        inspección de la máquina o del andamio, la entrega del equipo de protección en una
        sede. Cuando se anota en papel, la firma de la entrega queda en una carpeta, lo que se
        detecta en una revisión depende de que alguien lo pase y avise, y con varias sedes cada
        una registra a su manera.
      </p>

      <h2>Qué tiene que resolver un software de seguridad ocupacional</h2>
      <ul>
        <li>
          <strong>Registro de entrega de EPP con firma.</strong> Fecha, trabajador y lo
          entregado, firmado en el celular por alguien que no necesita usuario ni correo.
        </li>
        <li>
          <strong>Revisiones en el lugar.</strong> Extintores, máquinas, andamios y vehículos
          revisados con la misma lista en todas las sedes, con foto y hora.
        </li>
        <li>
          <strong>Hallazgos con seguimiento.</strong> Lo que no está bien queda con responsable
          y fecha, y se ve qué sigue abierto.
        </li>
        <li>
          <strong>Información para el comité.</strong> Lo revisado, lo detectado y lo resuelto
          por sede, sin armarlo a mano para cada reunión.
        </li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo, vehículo o área tiene un QR. Se escanea, se completa la revisión desde el
        celular y lo que no está bien genera un hallazgo con responsable y fecha, que solo
        cierra el área de seguridad después de ver la evidencia. Las entregas de equipo de
        protección se firman en el momento y quedan en el historial de cada trabajador. Somos
        un proveedor latinoamericano: la plataforma, el soporte y la implementación son en
        español, y la implementación es acompañada sobre tus procesos.
      </p>
      <p>
        Para ver cómo funciona el registro de entregas, mirá la guía de{" "}
        <Link href="/blog/constancia-entrega-epp-res-srt-299-11">constancia de entrega de EPP</Link>{" "}
        (escrita para Argentina, con el mismo flujo de firma) y la de{" "}
        <Link href="/gestion-desvios-seguridad-industrial">gestión de desvíos</Link>.
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
