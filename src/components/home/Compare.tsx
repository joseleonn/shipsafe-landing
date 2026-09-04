import { COMPARE_ROWS } from "@/lib/home-content";

export default function Compare() {
  const last = COMPARE_ROWS.length - 1;
  return (
    <section className="compare" id="vieja-nueva">
      <div className="glow navy c" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>06</span>La vieja forma y la nueva</div>
          <h2>
            No vendemos orden: hacemos que registrar <em>cueste menos que no registrar.</em>
          </h2>
        </div>
        <div className="cmp">
          <div role="table" aria-label="Comparación entre la vieja forma y la nueva">
            <div className="row hd" role="row" style={{ ["--i" as string]: 0 }}>
              <div role="columnheader" />
              <div role="columnheader">La vieja forma</div>
              <div role="columnheader">Con SHIPSAFE</div>
            </div>
            {COMPARE_ROWS.map(([k, old, nu], i) => (
              <div key={k} className={`row ${i === last ? "hi" : ""}`} role="row" style={{ ["--i" as string]: i + 1 }}>
                <div className="k" role="rowheader">{k}</div>
                <div className="old" role="cell">{old}</div>
                <div className="new" role="cell">{nu}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="cmp-note">
          <b>La última fila es la que importa.</b> Todas las demás son consecuencias suyas. No es un problema de disciplina ni de capacitación: es aritmética.
        </p>
      </div>
    </section>
  );
}
