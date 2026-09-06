"use client";

import { useId, useState, type FormEvent } from "react";
import Icon from "@/components/site/Icon";
import { GESTION } from "@/lib/home-content";
import { EMPLEADOS_OPCIONES, ROL_OPCIONES } from "@/lib/calificacion";
import { buildDemoUrl } from "@/app/demo/_data";
import { getAttribution, newEventId, readCookie } from "@/lib/attribution";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { loadCalendly, openCalendly } from "@/lib/calendly-embed";

type State = "idle" | "sending" | "sent";

/**
 * Un solo camino para agendar: cinco datos → se abre la agenda (Calendly, en
 * un modal sobre la página) con nombre y email ya cargados. Vive en el
 * cierre y dentro del modal de la demo (DemoModal), con la misma lógica.
 *
 * Por qué así y no dos botones: el dato entra a HubSpot antes de la reunión
 * (con rol, tamaño y "¿Cómo registran hoy?", que son los tres criterios de
 * calificación), la
 * persona no elige entre "agendar" y "que me contacten", y nadie se va del
 * sitio. Si no encuentra horario o cierra la agenda, ya tenemos cómo
 * escribirle. Si /api/lead falla, la agenda se abre igual: el webhook de
 * Calendly crea el contacto de todos modos.
 */
export default function LeadForm({ source = "home", section = "cierre", autoFocus = false }: { source?: string; section?: string; autoFocus?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>("idle");
  const [saved, setSaved] = useState(true);
  const [who, setWho] = useState<{ name: string; email: string }>({ name: "", email: "" });

  const warm = () => {
    loadCalendly().catch(() => {});
  };

  const agenda = (prefill: { name: string; email: string }) => {
    // Se arma al momento de abrir: reenvía los UTM con los que llegó la persona.
    const url = withContent(buildDemoUrl(window.location.search), section);
    trackEvent(EVENTS.DEMO_CLICK, { section, source });
    void openCalendly(url, {
      prefill,
      onScheduled: () => trackEvent(EVENTS.DEMO_SCHEDULED, { section, source }),
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
          rol: String(data.get("rol") ?? ""),
          empleados: String(data.get("empleados") ?? ""),
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
    if (ok) trackEvent(EVENTS.GENERATE_LEAD, { source, section });
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
    <form className="lead" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor={`${id}-name`}>Nombre</label>
        <input id={`${id}-name`} name="nombre" type="text" autoComplete="name" placeholder="Tu nombre" required onFocus={warm} autoFocus={autoFocus} />
      </div>
      <div className="field">
        <label htmlFor={`${id}-email`}>Email laboral</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="nombre@empresa.com.ar" required />
      </div>
      <div className="field">
        <label htmlFor={`${id}-rol`}>¿Cuál es tu rol?</label>
        <select id={`${id}-rol`} name="rol" required defaultValue="">
          <option value="" disabled>Elegí una opción</option>
          {ROL_OPCIONES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-emp`}>¿Cuántos son en la empresa?</label>
        <select id={`${id}-emp`} name="empleados" required defaultValue="">
          <option value="" disabled>Elegí una opción</option>
          {EMPLEADOS_OPCIONES.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${id}-how`}>¿Cómo registran hoy?</label>
        <select id={`${id}-how`} name="gestion" required defaultValue="">
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
