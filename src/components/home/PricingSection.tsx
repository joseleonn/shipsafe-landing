import Link from "next/link";
import Icon from "@/components/site/Icon";
import DemoLink from "@/components/site/DemoLink";
import Reveal from "@/components/site/Reveal";
import { TIERS, PRICE_NOTES, whatsappUrl } from "@/lib/home-content";

export default function PricingSection({
  num = "08",
  more = true,
  id = "precios",
  title,
  label = "Precios",
  lede = "Depende de cuántos establecimientos tenés, cuántos equipos querés controlar y cuánta gente lo va a usar. Estos son los valores de partida de cada línea; la propuesta concreta la recibís el mismo día de la demo.",
}: {
  num?: string | null;
  more?: boolean;
  id?: string;
  title?: React.ReactNode;
  label?: string;
  lede?: string;
}) {
  return (
    <section className="pricing" id={id}>
      <div className="glow tr" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num">{num && <span>{num}</span>}{label}</div>
          <h2>
            {title ?? (
              <>
                Un precio claro <em>para cada operación.</em>
              </>
            )}
          </h2>
          <p className="lede">{lede}</p>
        </div>
        <div className="tiers">
          {TIERS.map((t, i) => (
            <Reveal key={t.name} className={`tier ${t.hi ? "hi" : ""}`} delay={i * 0.06}>
              {t.hi && <span className="badge">Más elegido</span>}
              <div className="name">{t.name}</div>
              <div className="from">{t.from}</div>
              <div className="price">
                {t.price}
                {t.unit && <small>{t.unit}</small>}
              </div>
              <p className="who">{t.who}</p>
              <ul className="inc">
                {t.inc.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              {t.cta.kind === "demo" && <DemoLink section="precios" className="btn btn-primary" />}
              {t.cta.kind === "link" && (
                <Link className="link" href={t.cta.href}>
                  {t.cta.label} <Icon name="arrow" />
                </Link>
              )}
              {t.cta.kind === "whatsapp" && (
                <a className="link" href={whatsappUrl(t.cta.message)} target="_blank" rel="noopener noreferrer">
                  {t.cta.label} <Icon name="arrow" />
                </a>
              )}
            </Reveal>
          ))}
        </div>
        <ul className="price-note">
          {PRICE_NOTES.map((n) => (
            <li key={n}>
              <Icon name="check" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
        {more && (
          <p className="price-more">
            Detalle de cada línea en <Link className="link" href="/precios">la página de precios <Icon name="arrow" /></Link>
          </p>
        )}
      </div>
    </section>
  );
}
