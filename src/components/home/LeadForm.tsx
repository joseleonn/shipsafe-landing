"use client";

import { useId, useState, type FormEvent } from "react";
import Icon from "@/components/site/Icon";
import { GESTION, whatsappUrl } from "@/lib/home-content";
import { EMPLEADOS_OPCIONES, ROL_OPCIONES, calificar } from "@/lib/calificacion";
import { buildDemoUrl } from "@/app/demo/_data";
import { getAttribution, newEventId, readCookie } from "@/lib/attribution";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { loadCalendly, openCalendly } from "@/lib/calendly-embed";

type State = "idle" | "sending" | "sent";

/**
 * Cinco datos y, según lo que contestó, uno de dos finales.
 *
 * El dato entra a HubSpot siempre (con rol, tamaño y "¿Cómo registran hoy?",
 * que son los tres criterios de calificación). Lo que cambia es el cierre:
 *
 *   · Califica     → se abre la agenda (Calendly, en un modal sobre la
 *                    página) con nombre y email ya cargados.
 *   · No califica  → cierre corto y WhatsApp. Nunca se le dice "no
 *                    calificás": se le dice que la media hora no es lo que más
 *                    le sirve hoy, y queda la puerta abierta. No se le promete
 *                    ningún envío de material: hoy no hay nada que lo mande
 *                    (HubSpot Free no tiene workflows y WhatsApp está apagado).
 *
 * POR QUÉ SE AGREGÓ LA BIFURCACIÓN (14/09/2026)
 *
 * Hasta acá la agenda se abría para todo el mundo. `calificar()` corría, el
 * contacto quedaba marcado `no_califica` en HubSpot... y la persona agendaba
 * igual. El filtro etiquetaba sin frenar, justo en la página a la que apuntan
 * los anuncios. La página de gracias del recurso sí cortaba
 * (`califica ? <agenda> : <nurturing>`); esto empareja las dos.
 *
 * Importa ahora porque entra tráfico de comentarios de Instagram vía DM, que
 * es mucho más frío que el que clickea un anuncio, y lo único escaso es la
 * media hora de la reunión.
 *
 * La calificación se calcula acá, en el cliente, con la misma función que usa
 * el servidor. A propósito: si `/api/lead` falla, el corte tiene que seguir
 * funcionando igual. Al que califica la agenda se le abre aunque no se haya
 * podido guardar el dato — el webhook de Calendly crea el contacto de todos
 * modos.
 *
 * El evento `Lead` del pixel se manda en los dos casos, como antes. El filtro
 * no existe para enseñarle al algoritmo (ver `calificacion.ts`): con USD 15
 * por día el volumen no alcanza para que Meta optimice nada.
 */
export default function LeadForm({ source = "home", section = "cierre", autoFocus = false }: { source?: string; section?: string; autoFocus?: boolean }) {
  const id = useId();
  const [state, setState] = useState<State>("idle");
  const [saved, setSaved] = useState(true);
  const [califica, setCalifica] = useState(true);
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
    const rol = String(data.get("rol") ?? "");
    const empleados = String(data.get("empleados") ?? "");
    const gestion = String(data.get("gestion") ?? "");
    const prefill = { name: nombre, email };
    const { califica: pasa } = calificar({ rol, empleados, gestion });
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
          gestion,
          rol,
          empleados,
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
    setCalifica(pasa);
    setState("sent");
    if (pasa) agenda(prefill);
  }

  // Ojo con el diseño de este bloque: comparte la clase `ok` con el cierre del
  // que SÍ agenda, pero NO puede parecerse. Con el tilde verde y un "Listo" la
  // persona lee "reservé el horario" y se va convencida de que tiene reunión.
  // Por eso el modificador `aviso`: ícono neutro, sin tilde, el texto al tamaño
  // del cuerpo y no como letra chica, y una sola acción visible.
  if (state === "sent" && !califica) {
    return (
      <div className="ok aviso" role="status">
        <div className="ic"><Icon name="msg" /></div>
        <b>Gracias, ya tenemos tus datos.</b>
        <p>
          No te pedimos que reserves un horario: por lo que nos contaste, la media
          hora de puesta en marcha no es lo que más te va a servir hoy. Si eso
          cambia, escribinos y la agendamos.
        </p>
        <a
          className="btn btn-secondary"
          href={whatsappUrl("Hola, dejé mis datos en la web de SHIPSAFE y quiero consultar algo")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="msg" />
          Escribinos por WhatsApp
        </a>
      </div>
    );
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
