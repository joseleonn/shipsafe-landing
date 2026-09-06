"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/site/Icon";
import { GESTION } from "@/lib/home-content";
import { buildDemoUrl } from "@/app/demo/_data";
import { getAttribution, newEventId, readCookie } from "@/lib/attribution";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { loadCalendly, openCalendly } from "@/lib/calendly-embed";

type State = "idle" | "sending" | "sent";

/**
 * Un solo camino en el cierre: tres datos → se abre la agenda (Calendly, en
 * un modal sobre la página) con nombre y email ya cargados.
 *
 * Por qué así y no dos botones: el dato entra a HubSpot antes de la reunión
 * (con la calificación "¿Cómo registran hoy?" que Meta usa para optimizar), la
 * persona no elige entre "agendar" y "que me contacten", y nadie se va del
 * sitio. Si no encuentra horario o cierra la agenda, ya tenemos cómo
 * escribirle. Si /api/lead falla, la agenda se abre igual: el webhook de
 * Calendly crea el contacto de todos modos.
 */
export default function LeadForm({ source = "home" }: { source?: string }) {
  const [state, setState] = useState<State>("idle");
  const [saved, setSaved] = useState(true);
  const [who, setWho] = useState<{ name: string; email: string }>({ name: "", email: "" });

  const warm = () => {
    loadCalendly().catch(() => {});
  };

  const agenda = (prefill: { name: string; email: string }) => {
    // Se arma al momento de abrir: reenvía los UTM con los que llegó la persona.
    const url = withContent(buildDemoUrl(window.location.search), "cierre");
    trackEvent(EVENTS.DEMO_CLICK, { section: "cierre", source: "home" });
    void openCalendly(url, {
      prefill,
      onScheduled: () => trackEvent(EVENTS.DEMO_SCHEDULED, { section: "cierre", source: "home" }),
    }).then((ok) => {
      if (!ok) window.location.assign(url);
    });
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const eventId = newEventId("lead");
    const nombre = String(data.get("nombre") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const prefill = { name: nombre, email };
    setWho(prefill);
    setState("sending");
    try {
      trackMetaEvent("Lead", eventId, { content_name: `${source}-demo` });
    } catch {
      /* el pixel puede no estar */
    }
    let ok = false;
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          gestion: String(data.get("gestion") ?? ""),
          leadMagnet: `${source}-demo`,
          eventId,
          fbc: readCookie("_fbc") ?? undefined,
          fbp: readCookie("_fbp") ?? undefined,
          attribution: getAttribution(),
          sourceUrl: window.location.href,
        }),
      });
      ok = res.ok;
    } catch {
      ok = false;
    }
    if (ok) trackEvent(EVENTS.GENERATE_LEAD, { source, section: "cierre" });
    setSaved(ok);
    setState("sent");
    agenda(prefill);
  }

  if (state === "sent") {
    return (
      <div className="ok" role="status">
        <div className="ic"><Icon name="check" /></div>
        <b>{saved ? "Tus datos quedaron guardados." : "La agenda se abre igual."}</b>
        <p>{saved ? "Si no encontrás un horario, te escribimos en menos de 24 h." : "No pudimos guardar tus datos, pero podés elegir día y horario ahora mismo."}</p>
        <button type="button" className="btn btn-primary" onClick={() => agenda(who)} onMouseEnter={warm}>
          <Icon name="calendar" />
          Elegí día y horario
        </button>
      </div>
    );
  }

  return (
    <form id="lead" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Nombre</label>
        <input id="f-name" name="nombre" type="text" autoComplete="name" placeholder="Tu nombre" required onFocus={warm} />
      </div>
      <div className="field">
        <label htmlFor="f-email">Email laboral</label>
        <input id="f-email" name="email" type="email" autoComplete="email" placeholder="nombre@empresa.com.ar" required />
      </div>
      <div className="field">
        <label htmlFor="f-how">¿Cómo registran hoy?</label>
        <select id="f-how" name="gestion" required defaultValue="">
          <option value="" disabled>Elegí una opción</option>
          {GESTION.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary btn-lg" type="submit" disabled={state === "sending"} onMouseEnter={warm} onTouchStart={warm}>
        <Icon name="calendar" />
        {state === "sending" ? "Abriendo la agenda…" : "Elegí día y horario"}
      </button>
      <p className="fine">Con estos datos se abre la agenda ya cargada. Si no encontrás horario, te escribimos en menos de 24 h.</p>
    </form>
  );
}

function withContent(url: string, section: string) {
  try {
    const u = new URL(url);
    if (!u.searchParams.get("utm_content")) u.searchParams.set("utm_content", section);
    return u.toString();
  } catch {
    return url;
  }
}
