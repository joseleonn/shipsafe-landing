"use client";

import { useState, type FormEvent } from "react";
import Icon from "@/components/site/Icon";
import Reveal from "@/components/site/Reveal";
import { WEB3FORMS_KEY, PROVINCIAS } from "@/lib/constants";
import { whatsappUrl } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

type FormStatus = "idle" | "sending" | "success" | "error";

const MATRICULA_OPTIONS = ["Sí", "En trámite", "No"];
// Rangos alineados a los planes Profesional: hasta 3 → Starter Pro,
// hasta 5 → Advanced Pro, más de 5 → conversación a medida.
const CLIENTES_OPTIONS = ["0 (estoy arrancando)", "1-3", "4-5", "Más de 5"];

/**
 * Aplicación al programa de consultores. Sigue enviando por Web3Forms (con el
 * tag [CONSULTOR] en el asunto), ahora con el sistema visual v3.
 */
export default function ConsultoresForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("sending");
    setErrorMsg("");

    const data = new FormData(form);
    const clientes = (data.get("clientes") as string) || "";

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", "[CONSULTOR] Aplicación Programa de Consultores");
    data.append("from_name", "SHIPSAFE Landing");
    data.append("form_source", "consultores");

    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();

      if (json.success) {
        setStatus("success");
        trackEvent(EVENTS.GENERATE_LEAD, {
          lead_segment: "consultor",
          clients_range: clientes,
          form: "consultores",
        });
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || "Error al enviar. Intentá de nuevo.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Intentá de nuevo.");
    }
  }

  return (
    <section id="aplicar" className="close">
      <div className="wrap">
        <div className="close-copy">
          <div className="eyebrow num"><span>04</span>Aplicá</div>
          <h2>
            Aplicá al programa <em>de consultores.</em>
          </h2>
          <p className="lede">Contanos sobre tu consultora y te contactamos en menos de 24 horas para coordinar la puesta en marcha.</p>
          <ol className="what">
            <li><b>Te damos de alta</b> con tu cuenta de consultor y las empresas-cliente que ya gestionás.</li>
            <li><b>Migramos tus planillas</b> a checklists, equipos y sectores de cada cliente, con vos.</li>
            <li><b>Arrancás con tus datos</b>, no con un demo: el primer reporte mensual sale de tu operación real.</li>
          </ol>
        </div>

        <Reveal className="panel form-card">
          {status === "success" ? (
            <div className="form-ok" role="status">
              <div className="ic"><Icon name="check" /></div>
              <h3>Aplicación enviada</h3>
              <p>Te contactamos pronto. Si querés adelantar la charla, escribinos por WhatsApp.</p>
              <a className="btn btn-secondary" href={whatsappUrl("Hola, acabo de aplicar al programa de consultores de SHIPSAFE")} target="_blank" rel="noopener noreferrer">
                <Icon name="msg" /> Escribinos
              </a>
              <button type="button" className="link" onClick={() => setStatus("idle")} style={{ display: "block", margin: "14px auto 0" }}>
                Enviar otra aplicación
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* Honeypot */}
              <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="c-name">Nombre</label>
                  <input type="text" id="c-name" name="name" required placeholder="Tu nombre" autoComplete="name" />
                </div>
                <div className="field">
                  <label htmlFor="c-email">Email</label>
                  <input type="email" id="c-email" name="email" required placeholder="tu@consultora.com" autoComplete="email" />
                </div>
                <div className="field">
                  <label htmlFor="c-tel">WhatsApp / teléfono</label>
                  <input type="tel" id="c-tel" name="telefono" required placeholder="+54 9 ..." autoComplete="tel" />
                </div>
                <div className="field">
                  <label htmlFor="c-prov">Provincia</label>
                  <select id="c-prov" name="provincia" required defaultValue="">
                    <option value="" disabled>Elegí tu provincia</option>
                    {PROVINCIAS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-mat">¿Tenés matrícula habilitante?</label>
                  <select id="c-mat" name="matricula" required defaultValue="">
                    <option value="" disabled>Elegí una opción</option>
                    {MATRICULA_OPTIONS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="c-cli">Empresas-cliente que gestionás hoy</label>
                  <select id="c-cli" name="clientes" required defaultValue="">
                    <option value="" disabled>Elegí un rango</option>
                    {CLIENTES_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="c-msg">
                  Mensaje <span className="opt">(opcional)</span>
                </label>
                <textarea id="c-msg" name="message" rows={3} placeholder="Contanos sobre tus clientes y qué te gustaría resolver con SHIPSAFE" />
              </div>

              {status === "error" && (
                <div className="alert error" role="alert">
                  <Icon name="alert" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
                {status === "sending" ? "Enviando…" : "Aplicar al programa"}
              </button>
              <p className="form-fine">Cupos limitados · Te respondemos en menos de 24 horas</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
