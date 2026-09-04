import Image from "next/image";
import DemoLink from "@/components/site/DemoLink";
import Icon from "@/components/site/Icon";
import { HERO, SHOTS } from "@/lib/home-content";
import HeroStage from "./HeroStage";

export default function Hero() {
  return (
    <section className="hero" id="top">
      {/* anclas de compatibilidad con links viejos */}
      <span id="inicio" />
      <div className="hero-bg" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="wrap">
        <div className="hero-copy">
          <div className="eyebrow">{HERO.eyebrow}</div>
          <h1>
            {HERO.h1} <em>{HERO.h1Accent}</em>
          </h1>
          <p className="lede pain">{HERO.pain}</p>
          <p className="lede platform">{HERO.platform}</p>
          <div className="hero-cta">
            <DemoLink section="hero" className="btn btn-primary btn-lg" />
            <a className="btn btn-secondary btn-lg" href="#video">
              <Icon name="play" filled />
              {HERO.secondary}
            </a>
          </div>
        </div>
        <HeroStage
          browser={
            <div className="browser">
              <div className="chrome">
                <span className="dots"><i /><i /><i /></span>
                <span className="url">{SHOTS.dashboard.url}</span>
                <span className="live">Producto real</span>
              </div>
              <Image src={SHOTS.dashboard.src} alt="" width={SHOTS.dashboard.width} height={SHOTS.dashboard.height} sizes="(max-width: 900px) 100vw, 1040px" priority />
            </div>
          }
          phone={
            <div className="phone">
              <div className="screen">
                <Image src={SHOTS.pChecklist.src} alt="" width={SHOTS.pChecklist.width} height={SHOTS.pChecklist.height} sizes="260px" priority />
              </div>
            </div>
          }
        />
        <ul className="proof">
          {HERO.proof.map((p) => (
            <li key={p}>
              <Icon name="check" />
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
