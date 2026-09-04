"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/site/Icon";
import { GESTION } from "@/lib/home-content";
import { getAttribution, newEventId, readCookie } from "@/lib/attribution";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/meta-pixel";

type State = "idle" | "sending" | "sent" | "error";

/**
 * Formulario corto del cierre: tres campos, sin "Mensaje" obligatorio.
 * POST /api/lead → HubSpot + Meta CAPI (misma ruta que usa /recurso), con la
 * pregunta de calificación "¿Cómo registran hoy?" (GESTION_OPCIONES).
 */
export default function LeadForm({ source = "home" }: { source?: string }) {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const eventId = newEventId("lead");
    setState("sending");
    try {
      trackMetaEvent("Lead", eventId, { content_name: `${source}-demo` });
    } catch {
      /* el pixel puede no estar */
    }
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: String(data.get("nombre") ?? "").trim(),
          email: String(data.get("email") ?? "").trim(),
          gestion: String(data.get("gestion") ?? ""),
          leadMagnet: `${source}-demo`,
          eventId,
          fbc: readCookie("_fbc") ?? undefined,
          fbp: readCookie("_fbp") ?? undefined,
          attribution: getAttribution(),
          sourceUrl: window.location.href,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackEvent(EVENTS.GENERATE_LEAD, { source, section: "cierre" });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="ok" role="status">
        <div className="ic"><Icon name="check" /></div>
        <b>Listo.</b>
        <p>Te escribimos en menos de 24 h.</p>
      </div>
    );
  }

  return (
    <form id="lead" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="f-name">Nombre</label>
        <input id="f-name" name="nombre" type="text" autoComplete="name" placeholder="Tu nombre" required />
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
      <button className="btn btn-secondary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Enviando…" : "Quiero que me contacten"}
      </button>
      <p className="fine">
        {state === "error" ? "No pudimos enviarlo. Probá de nuevo o escribinos por WhatsApp." : "No hace falta escribir un mensaje: con estos datos podemos contactarte con contexto."}
      </p>
    </form>
  );
}
