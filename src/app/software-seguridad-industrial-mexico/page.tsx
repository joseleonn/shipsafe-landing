import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";
import AvisoNormativa from "@/components/AvisoNormativa";

const SLUG = "software-seguridad-industrial-mexico";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página de México (13/11/2026). Verificado en el DOF el 13/11:
 * NOM-030-STPS-2009 numerales 2, 4.1, 4.3, 4.4, 4.5 y 4.6;
 * NOM-019-STPS-2011 numerales 2, 5.1, 7.4, 9.5, 9.11 y 9.12 (gob.mx).
 * NOM-002-STPS-2010 (7.2, 7.3, 13.6) verificada el 09/11.
 */
const FAQS = [
  {
    question: "¿Qué hace un software de seguridad e higiene en México?",
    answer:
      "Ordena lo que piden la NOM-030 y la NOM-019 en el piso: recorridos de verificación, condiciones inseguras con responsable y fecha, entregas de EPP con firma, capacitaciones y accidentes, en todos los centros de trabajo. Es el mismo tipo de herramienta que en otras empresas se llama software de seguridad industrial o software EHS.",
  },
  {
    question: "¿La NOM-030 aplica a todas las empresas?",
    answer:
      "Sí. Según su numeral 2, rige en todo el territorio nacional y aplica en todos los centros de trabajo.",
  },
  {
    question: "¿Cada cuánto se hacen los recorridos de verificación de la comisión?",
    answer:
      "La NOM-019-STPS-2011 pide que los recorridos del programa anual se hagan al menos con una periodicidad trimestral (numeral 9.5), y que de cada recorrido quede un acta con los datos del numeral 9.12.",
  },
  {
    question: "¿Los registros pueden ser digitales?",
    answer:
      "La NOM-002-STPS-2010, por ejemplo, permite exhibir los registros impresos o en medios magnéticos y pide conservarlos tres años (numeral 13.6). Conviene revisar lo que dice cada norma que aplica a tu centro de trabajo.",
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
    locale: "es_MX",
    siteName: SITE.name,
    images: [OG_IMAGE],
  },
};

export default function Page() {
  return (
    <ArticleLayout slug={SLUG} eyebrow="México" faqs={FAQS}>
      <p>
        En México, la base de la gestión de seguridad industrial en un centro de trabajo son
        la <strong>NOM-030-STPS-2009</strong> (servicios preventivos de seguridad y salud en el
        trabajo) y la <strong>NOM-019-STPS-2011</strong> (comisiones de seguridad e higiene).
        Sobre esas dos se apoyan las normas por tema, como la NOM-002 de incendios o la NOM-035
        de factores de riesgo psicosocial. Esta página es para empresas con varios centros de
        trabajo, flota o contratistas, donde lo que se revisa en piso tiene que llegar al
        programa sin pasar por una hoja de cálculo.
      </p>

      <h2>Qué pide la NOM-030-STPS-2009</h2>
      <table>
        <thead>
          <tr>
            <th>Numeral</th>
            <th>Obligación del patrón</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>4.1</td>
            <td>Designar a un responsable de seguridad y salud en el trabajo, interno o externo.</td>
          </tr>
          <tr>
            <td>4.3</td>
            <td>Contar con un diagnóstico integral o por área de las condiciones de seguridad y salud.</td>
          </tr>
          <tr>
            <td>4.4</td>
            <td>Contar con un programa de seguridad y salud elaborado con base en el diagnóstico, actualizado al menos una vez al año.</td>
          </tr>
          <tr>
            <td>4.5</td>
            <td>Comunicar el diagnóstico y el programa a la comisión de seguridad e higiene o a los trabajadores, según aplique.</td>
          </tr>
          <tr>
            <td>4.6</td>
            <td>Contar con los reportes de seguimiento de los avances del programa.</td>
          </tr>
        </tbody>
      </table>
      <p>
        El numeral 4.6 es el que más trabajo da en una operación con varios centros: el avance
        del programa sale de lo que se inspecciona, se detecta y se corrige en cada uno.
      </p>

      <h2>Qué pide la NOM-019-STPS-2011</h2>
      <ul>
        <li>
          Constituir e integrar al menos una comisión de seguridad e higiene en el centro de
          trabajo (numeral 5.1), con un acta de constitución con los datos del numeral 7.4.
        </li>
        <li>
          Hacer los recorridos de verificación del programa anual al menos con una periodicidad
          trimestral (numeral 9.5) y dar seguimiento trimestral a las medidas propuestas
          (numeral 9.11).
        </li>
        <li>
          Levantar un acta de cada recorrido (numeral 9.12) con los datos del centro
          de trabajo, las fechas, las áreas recorridas, los peligros encontrados, las causas de
          los accidentes, las medidas propuestas y sus prioridades, el seguimiento de las
          anteriores y las firmas de quienes participaron.
        </li>
      </ul>

      <h2>Dónde se traba en la práctica</h2>
      <p>
        El diagnóstico y el programa se arman en la oficina. Lo que los mantiene al día pasa en
        piso: la revisión mensual de cada extintor, la inspección del montacargas antes del
        turno, la condición insegura que alguien detecta en un recorrido. Cuando eso se anota en
        papel y después se pasa a una hoja de cálculo, el seguimiento del 4.6 y las actas del
        9.12 se arman a mano, cada centro lo registra distinto y lo que se detectó sin cerrar
        aparece recién en el siguiente recorrido.
      </p>
      <p>
        Un ejemplo concreto es la revisión mensual de extintores de la NOM-002-STPS-2010: el
        registro tiene que incluir las anomalías y su seguimiento. Lo explicamos en la guía de{" "}
        <Link href="/blog/revision-mensual-extintores-nom-002-stps">
          revisión mensual de extintores
        </Link>
        . Para los factores psicosociales, ver{" "}
        <Link href="/blog/nom-035-stps-2018-que-pide-segun-trabajadores">
          qué pide la NOM-035 según la cantidad de trabajadores
        </Link>
        .
      </p>

      <h2>Qué tiene que resolver un software de seguridad industrial</h2>
      <ul>
        <li>
          <strong>Revisiones en el lugar.</strong> Que se registren desde el celular en el
          momento, con fecha, revisor y fotos.
        </li>
        <li>
          <strong>Anomalías con seguimiento.</strong> Que cada condición no cumplida tenga
          responsable, fecha y verificación del cierre: es lo que piden el registro de la
          NOM-002 y las actas de la NOM-019.
        </li>
        <li>
          <strong>El mismo estándar en todos los centros.</strong> Las mismas listas de
          verificación en cada planta o sucursal.
        </li>
        <li>
          <strong>Firmas de quien no tiene usuario.</strong> El operario firma entregas de EPP
          o capacitaciones sin correo corporativo.
        </li>
        <li>
          <strong>Avance del programa.</strong> Reportes por centro con los datos ya cargados.
        </li>
      </ul>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada extintor, equipo, vehículo o área tiene un QR. Se escanea, se completa la revisión
        desde el celular y cada condición no cumplida queda como una anomalía con responsable y
        fecha, que solo cierra el área de seguridad después de ver la evidencia. La plataforma
        también lleva entregas de EPP con firma, permisos de trabajo, análisis de seguridad en
        el trabajo, matriz de riesgos, accidentes y capacitaciones. Somos un proveedor
        latinoamericano, con plataforma, soporte e implementación en español, y en México
        trabajamos con un partner local.
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
