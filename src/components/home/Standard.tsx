import { ESTANDAR } from "@/lib/home-content";

/**
 * Estandarización entre establecimientos.
 *
 * Por qué existe esta sección: una empresa con cinco sucursales puede tener
 * cinco formas de hacer la misma inspección, y eso rompe cualquier intento de
 * comparar. Hasta ahora esto vivía escondido en un chip
 * ("Multi-establecimiento") y en una línea del hero.
 *
 * El diagrama es una plantilla que baja a tres sedes y vuelve a un criterio
 * único. Se arma con CSS (no con una imagen) para que se lea en cualquier
 * tamaño y se pueda cambiar el texto sin rehacer nada.
 */
export default function Standard({ num = "04" }: { num?: string | null }) {
  return (
    <section className="standard dotted" id="estandar">
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num">{num && <span>{num}</span>}Varias sucursales</div>
          <h2>
            Para operaciones que no pasan <em>todas en el mismo lugar.</em>
          </h2>
          <p className="lede">
            Con cinco sucursales, 30 vehículos o cuadrillas en distintos frentes, cada lugar termina
            haciendo la misma inspección a su manera.{" "}
            <b>Acá la plantilla se arma una vez y baja igual a todos, y quien registra, quien supervisa y quien decide miran lo mismo.</b>
          </p>
        </div>

        <div className="std" aria-label="Una plantilla, tres establecimientos, un mismo criterio">
          <div className="std-top">
            <span className="std-tag">Una plantilla</span>
            <b>{ESTANDAR.plantilla}</b>
          </div>
          <div className="std-branch" aria-hidden="true" />
          <ul className="std-sedes">
            {ESTANDAR.sedes.map((s) => (
              <li key={s.name}>
                <b>{s.name}</b>
                <small>{s.meta}</small>
                <span className="std-chk">Mismo checklist</span>
              </li>
            ))}
          </ul>
          <div className="std-join" aria-hidden="true" />
          <div className="std-foot">{ESTANDAR.cierre}</div>
        </div>

        <ol className="std-puntos">
          {ESTANDAR.puntos.map((p) => (
            <li key={p.title}>
              <b>{p.title}.</b> {p.text}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
