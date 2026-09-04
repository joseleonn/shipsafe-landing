import Image from "next/image";
import Icon from "@/components/site/Icon";
import Reveal from "@/components/site/Reveal";
import { CASE } from "@/lib/home-content";

/** Sección 07: el caso de éxito (SW Petrol) y la convivencia con el ERP. */
export default function Proofs() {
  return (
    <section className="proofs" id="caso">
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num"><span>07</span>Por qué creernos</div>
          <h2>
            Ya pasó en una operación real, <em>y convive con lo que ya tenés.</em>
          </h2>
        </div>
        <div className="two">
          <Reveal className="case">
            <div className="k">Caso de éxito</div>
            <div className="client">
              {CASE.logo ? (
                <Image src={CASE.logo} alt={`Logo de ${CASE.name}`} width={195} height={78} className="client-logo" unoptimized />
              ) : (
                <span className="client-mark" aria-label={CASE.legal}>
                  {CASE.name}
                </span>
              )}
              <div className="client-meta">
                <b>{CASE.legal}</b>
                <span>
                  {CASE.sector} · {CASE.where}
                </span>
              </div>
            </div>
            <h3>{CASE.size}</h3>
            <p className="client-what">{CASE.what}</p>
            <div className="ba">
              <div className="b">
                <span className="tag">Antes</span>
                <p>{CASE.before}</p>
              </div>
              <div className="a">
                <span className="tag">Hoy</span>
                <p>{CASE.today}</p>
              </div>
            </div>
            <p className="honest">
              Un caso documentado, con nombre y apellido: preferimos eso a una lista de logos.{" "}
              <a href={CASE.url} target="_blank" rel="noopener noreferrer" className="link">
                Conocé a {CASE.name} <Icon name="arrow" />
              </a>
            </p>
          </Reveal>
          <Reveal className="erp" delay={0.06}>
            <div className="k">Si ya tenés un sistema</div>
            <h3>La capa rápida entre tu ERP y el celular del técnico</h3>
            <p>El sistema corporativo sigue siendo el sistema corporativo. SHIPSAFE resuelve el día a día que ese sistema nunca iba a resolver: la inspección al lado de la caldera, el permiso que se firma desde otra sucursal, el KPI que hoy alguien arma a mano.</p>
            <ul className="ticks">
              <li><Icon name="check" /><span><b>Sucursales.</b> Sabés qué pasa en la otra sin viajar, y qué está por vencer allá.</span></li>
              <li><Icon name="check" /><span><b>Permisos de trabajo.</b> Se revisan, aprueban y firman a distancia. Ni se frena la tarea ni se hace sin permiso.</span></li>
              <li><Icon name="check" /><span><b>Integraciones.</b> SAP, Active Directory y SSO en la línea Enterprise.</span></li>
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
