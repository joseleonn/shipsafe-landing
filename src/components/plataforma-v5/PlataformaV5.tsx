import Link from "next/link";
import SiteShell from "@/components/site/SiteShell";
import StickyBar from "@/components/site/StickyBar";
import MotionCues from "@/components/site/MotionCues";
import DemoLink from "@/components/site/DemoLink";
import Icon, { type IconName } from "@/components/site/Icon";
import Explorer from "@/components/home/Explorer";
import Faq from "@/components/home/Faq";
import { Item, Rise, ScrollProgress, Stagger, Words } from "@/components/home-v5/Motion5";
import { whatsappUrl } from "@/lib/home-content";
import { HOME5 } from "@/lib/home-v5";
import { PLAT5 } from "@/lib/plataforma-v5";

/**
 * /plataforma (26/10/2026). Ficha del producto para quien ya está evaluando,
 * no una segunda landing: título corto, el explorador de módulos con
 * capturas reales arriba de todo, integraciones, preguntas y un cierre chico.
 * Lo que ya cuenta la home (video, roles, varias sedes, formulario) no se
 * repite acá.
 */
export default function PlataformaV5() {
  return (
    <SiteShell className="ss-home ss-home5 ss-plat5" ctaLabel={HOME5.cta} ctaSection="nav">
      <ScrollProgress />
      <main id="main">
        <section className="p5-head" id="top">
          <div className="wrap">
            {/* Vuelve a la home justo después de la sección de auditoría, que es
                desde donde se llega acá con "Ver todos los módulos". */}
            <Link className="p5-back" href="/#como-funciona">
              <Icon name="arrow" />
              Volver al inicio
            </Link>
            <h1>
              {PLAT5.hero.h1} <em>{PLAT5.hero.h1Accent}</em>
            </h1>
            <p className="lede">{PLAT5.hero.lede}</p>
          </div>
        </section>
        <Explorer head={false} />
        <Integra />
        <Faq num={null} title={<Words text={PLAT5.faq.h2} accent={PLAT5.faq.h2Accent} />} />
        <Banda />
      </main>
      <StickyBar label={HOME5.cta} />
      <MotionCues />
    </SiteShell>
  );
}

function Banda() {
  return (
    <section className="p5-banda" id="demo">
      <div className="wrap">
        <Rise className="p5-banda-card">
          <h2>
            {PLAT5.banda.h2} <em>{PLAT5.banda.h2Accent}</em>
          </h2>
          <div className="p5-banda-cta">
            <DemoLink section="plataforma-banda" className="btn btn-primary btn-lg">
              {HOME5.cta}
            </DemoLink>
            <Link className="p5-banda-wa" href="/#como-funciona">
              Seguir en el inicio
            </Link>
            <a className="p5-banda-wa" href={whatsappUrl("Hola, quiero ver SHIPSAFE con mi operación")} target="_blank" rel="noopener noreferrer">
              <Icon name="msg" />
              {HOME5.cierre.whatsapp}
            </a>
          </div>
        </Rise>
      </div>
    </section>
  );
}

function Integra() {
  return (
    <section className="p5-integra" id="integraciones">
      <div className="wrap">
        <h2>
          <Words text={PLAT5.integra.h2} accent={PLAT5.integra.h2Accent} />
        </h2>
        <Stagger className="p5-integra-grid" gap={0.08}>
          {PLAT5.integra.items.map((x) => (
            <Item key={x.t} className="p5-int">
              <span className="p5-int-ico">
                <Icon name={x.icon as IconName} />
              </span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </Item>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
