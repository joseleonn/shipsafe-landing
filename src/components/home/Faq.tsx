"use client";

import { useState } from "react";
import Icon from "@/components/site/Icon";
import { HOME_FAQS, whatsappUrl } from "@/lib/home-content";

export type FaqItem = { q: string; a: string };

/** Acordeón nativo (details/summary): accesible, indexable, un abierto a la vez. */
export default function Faq({
  items = HOME_FAQS,
  num = "09",
  title,
}: {
  items?: readonly FaqItem[];
  num?: string | null;
  title?: React.ReactNode;
}) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" id="faq">
      <div className="wrap">
        <div className="sec-head">
          <div className="eyebrow num">{num && <span>{num}</span>}Preguntas</div>
          <h2>
            {title ?? (
              <>
                Preguntas <em>frecuentes.</em>
              </>
            )}
          </h2>
          <p className="more">
            ¿Otra cosa?{" "}
            <a className="link" href={whatsappUrl("Hola, tengo una consulta sobre SHIPSAFE")} target="_blank" rel="noopener noreferrer">
              Escribinos por WhatsApp
            </a>
          </p>
        </div>
        <div className="list">
          {items.map((f, i) => (
            <details
              key={f.q}
              open={open === i}
              onToggle={(e) => {
                if ((e.currentTarget as HTMLDetailsElement).open) setOpen(i);
                else if (open === i) setOpen(-1);
              }}
            >
              <summary>
                {f.q}
                <Icon name="chevron" />
              </summary>
              <div className="a">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
