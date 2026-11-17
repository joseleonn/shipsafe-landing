import type { Metadata } from "next";
import Link from "next/link";
import { SITE, ARTICLES, OG_IMAGE } from "@/lib/constants";
import ArticleLayout from "@/components/ArticleLayout";

const SLUG = "checklist-preuso";
const article = ARTICLES.find((a) => a.slug === SLUG)!;

/**
 * Página general de preuso (17/11/2026). En Search Console "preuso" aparece en
 * posición 4,2 sin una página propia. Junta los checklists de preuso que ya
 * están en el blog y suma una plantilla con vehículo, herramienta eléctrica y
 * equipo genérico. Sin normas citadas: práctica habitual.
 */
const FAQS = [
  {
    question: "¿Qué es el checklist de preuso?",
    answer:
      "Es el control que hace el operador antes de usar un equipo, un vehículo o una herramienta, para confirmar que está en condiciones. Si algo no está bien, el equipo no se usa hasta que se resuelva.",
  },
  {
    question: "¿Quién completa el preuso?",
    answer:
      "Quien va a usar el equipo, al inicio del turno o antes de cada uso. Seguridad e higiene define qué se controla y revisa lo que no está bien.",
  },
  {
    question: "¿Qué se hace con un No OK?",
    answer:
      "Se registra con la observación y, si se puede, una foto. Si deja el equipo fuera de servicio, se avisa antes de usarlo y queda un responsable y una fecha para resolverlo.",
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
        El preuso es el control que hace el operador antes de usar un vehículo, una máquina o
        una herramienta: dos o tres minutos para confirmar que está en condiciones. Acá están los
        checklists de preuso por tipo de equipo y una{" "}
        <a href="/recursos/checklist-preuso-shipsafe.xlsx">plantilla en Excel</a> con vehículo,
        herramienta eléctrica y equipo genérico.
      </p>

      <h2>Checklists de preuso por equipo</h2>
      <ul>
        <li>
          <strong>Vehículos y flota:</strong> luces, frenos, neumáticos, niveles, documentación y
          elementos de emergencia. Ver el{" "}
          <Link href="/blog/checklist-vehicular-preuso">checklist vehicular de preuso</Link>.
        </li>
        <li>
          <strong>Montacargas o autoelevador:</strong> horquillas, cadenas, mástil, frenos,
          bocina, alarma de retroceso y cinturón. Ver el{" "}
          <Link href="/blog/checklist-montacargas-autoelevador-preuso">
            checklist de montacargas
          </Link>
          , con su plantilla.
        </li>
        <li>
          <strong>Herramientas eléctricas portátiles:</strong> cable y ficha, carcasa, guardas,
          interruptor y protección del tomacorriente. Está en la plantilla de esta página.
        </li>
        <li>
          <strong>Cualquier otro equipo:</strong> la hoja genérica de la plantilla trae los
          controles básicos; se completa con los del manual del fabricante.
        </li>
      </ul>

      <h2>Qué tiene que tener un buen preuso</h2>
      <ul>
        <li>Pocos controles, los que de verdad dejan el equipo fuera de servicio si fallan.</li>
        <li>Quién lo hizo, cuándo y sobre qué equipo, identificado por número interno o patente.</li>
        <li>Una respuesta clara: apto o no apto para usar.</li>
        <li>Qué pasa con cada No OK: a quién se avisa, quién lo resuelve y para cuándo.</li>
      </ul>

      <h2>Dónde se traba en la práctica</h2>
      <p>
        El preuso en papel se completa, se guarda en una carpeta y nadie lo lee hasta que pasa
        algo. El No OK que se marcó el lunes llega a mantenimiento cuando alguien junta las
        hojas, y mientras tanto el equipo se siguió usando. Con varias sedes, cada una usa su
        propia planilla y no se puede ver qué equipos están fuera de servicio.
      </p>

      <h2>Cómo lo resuelve SHIPSAFE</h2>
      <p>
        Cada equipo o vehículo tiene un QR. El operador lo escanea, el sistema verifica que esté
        habilitado para usarlo y completa el preuso desde el celular. Lo que marca como No OK se
        convierte en un desvío con su observación y la foto, asignado a mantenimiento con fecha,
        y solo lo cierra seguridad e higiene después de ver la evidencia. Más detalle en la{" "}
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
