import Link from "next/link";
import ArticleLayout from "@/components/ArticleLayout";
import { COMPARATIVAS } from "@/lib/comparativas";

/**
 * Cuerpo de las comparativas "mejores software" por país. Los datos y las
 * reglas de qué se puede decir de cada competidor están en lib/comparativas.ts.
 */
export default function ComparativaPais({ slug }: { slug: string }) {
  const c = COMPARATIVAS[slug];
  return (
    <ArticleLayout slug={slug} eyebrow={c.pais} faqs={c.faqs}>
      <p>
        <strong>Respuesta corta:</strong> {c.intro}
      </p>

      <h2>Comparativa rápida</h2>
      <table>
        <thead>
          <tr>
            <th>Software</th>
            <th>Origen</th>
            <th>Mejor para</th>
            <th>Precio público</th>
          </tr>
        </thead>
        <tbody>
          {c.softwares.map((s) => (
            <tr key={s.nombre}>
              <td>
                <strong>{s.nombre}</strong>
              </td>
              <td>{s.origen}</td>
              <td>{s.mejorPara}</td>
              <td>{s.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Los {c.softwares.length} en detalle</h2>
      {c.softwares.map((s, i) => (
        <div key={s.nombre}>
          <h3>
            {i + 1}. {s.nombre}
          </h3>
          <p>{s.detalle}</p>
          <p>
            <strong>A tener en cuenta:</strong> {s.aTener}
          </p>
          {s.nombre.startsWith("SafetyCulture") && (
            <p>
              Más detalle en{" "}
              <Link href="/blog/safetyculture-mitti-alternativas">SafetyCulture ahora es Mitti</Link>.
            </p>
          )}
        </div>
      ))}

      <h2>Qué mirar para elegir</h2>
      <ol>
        <li>
          <strong>Registro en el lugar.</strong> ¿El que inspecciona puede registrar desde el
          celular, en el momento, sin instalar nada ni tener cuenta propia? Si no, el dato se
          sigue pasando a una planilla.
        </li>
        <li>
          <strong>Seguimiento de lo que se detecta.</strong> Cada hallazgo con responsable,
          fecha y verificación del cierre por el área de seguridad. Ver{" "}
          <Link href="/gestion-desvios-seguridad-industrial">gestión de desvíos</Link>.
        </li>
        <li>
          <strong>La norma de {c.pais}.</strong> {c.criterioNorma} Lo explicamos en{" "}
          <Link href={c.paginaPais.href}>{c.paginaPais.label}</Link>.
        </li>
        <li>
          <strong>Varias sedes.</strong> Las mismas listas en todos los lugares y una vista
          que junte todo para la gerencia.
        </li>
        <li>
          <strong>Implementación y soporte en tu idioma.</strong> Quién configura, en cuánto
          tiempo y quién responde cuando algo no funciona.
        </li>
      </ol>

      <h2>Cuál elegir según tu caso</h2>
      <ul>
        {c.eleccion.map((e) => (
          <li key={e.caso}>
            <strong>{e.caso}:</strong> {e.respuesta}
          </li>
        ))}
      </ul>

      <h2>Preguntas frecuentes</h2>
      {c.faqs.map((f) => (
        <div key={f.question}>
          <h3>{f.question}</h3>
          <p>{f.answer}</p>
        </div>
      ))}

      <p>
        <em>
          Los datos de cada software salen de su propio sitio o de su ficha en directorios, leídos en
          noviembre de 2026. Los productos y los precios cambian: confírmalos con cada proveedor.
        </em>
      </p>
    </ArticleLayout>
  );
}
