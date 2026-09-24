import Image from "next/image";
import { CASE } from "@/lib/home-content";

/**
 * Sección 02: la prueba social apenas termina el hero. El que llega por
 * outbound o por un referido tiene que confirmar enseguida que esto ya corre
 * en una empresa parecida a la suya. El caso completo sigue en #caso.
 *
 * Sin cita textual: hasta tener una frase aprobada por SW Petrol, se cuenta
 * con los hechos del caso y no se inventa un testimonio.
 */
export default function CaseStrip() {
  return (
    <section className="case-strip" id="ya-funciona">
      <div className="wrap">
        <div className="cs-card">
          <div className="cs-head">
            <div className="eyebrow num"><span>02</span>Ya funciona</div>
            <h2>
              En una operación <em>como la tuya.</em>
            </h2>
          </div>
          <div className="cs-client">
            {CASE.logo ? (
              <Image src={CASE.logo} alt={`Logo de ${CASE.name}`} width={245} height={124} className="cs-logo" unoptimized />
            ) : (
              <b className="cs-mark">{CASE.name}</b>
            )}
            <div className="cs-meta">
              <b>{CASE.name}</b>
              <span>{CASE.sector} · {CASE.where}</span>
            </div>
          </div>
          <ul className="cs-facts">
            {CASE.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="cs-sum">
            <b>Antes:</b> {CASE.beforeShort} <b>Hoy:</b> {CASE.todayShort}
          </p>
          <a className="link cs-more" href="#caso">
            Ver cómo lo implementamos
          </a>
        </div>
      </div>
    </section>
  );
}
