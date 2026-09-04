"use client";

import { useState } from "react";
import Icon from "@/components/site/Icon";
import { WEB3FORMS_KEY, PROVEEDOR } from "@/lib/constants";

type FormStatus = "idle" | "sending" | "success" | "error";

/**
 * Código de identificación de la revocación.
 *
 * La Disposición 954/2025 obliga a informarlo dentro de las 24 horas. Se genera
 * en el momento del envío y se muestra en pantalla enseguida, que es más
 * exigente que el plazo de la norma y no depende de que alguien conteste un
 * mail a tiempo. Va también en el correo que recibe la empresa, así que las dos
 * puntas quedan con el mismo código.
 *
 * Sin ambigüedad tipográfica: no entran I, O, 1 ni 0, porque este código se
 * dicta por teléfono y se copia a mano.
 */
function generarCodigo(): string {
  const alfabeto = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const azar = Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
  const hoy = new Date();
  const fecha =
    hoy.getFullYear().toString() +
    String(hoy.getMonth() + 1).padStart(2, "0") +
    String(hoy.getDate()).padStart(2, "0");
  return `ARR-${fecha}-${azar}`;
}

export default function ArrepentimientoForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [codigo, setCodigo] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("sending");
    setErrorMsg("");

    const data = new FormData(form);
    const nuevoCodigo = generarCodigo();

    data.append("access_key", WEB3FORMS_KEY);
    data.append("subject", `[ARREPENTIMIENTO] Revocación ${nuevoCodigo}`);
    data.append("from_name", "SHIPSAFE Landing");
    data.append("form_source", "arrepentimiento");
    data.append("codigo_de_identificacion", nuevoCodigo);
    data.append("recibido_el", new Date().toISOString());

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const json = await res.json();

      if (json.success) {
        setCodigo(nuevoCodigo);
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(json.message || "No se pudo enviar. Probá de nuevo.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Error de conexión. Probá de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="form-ok" role="status">
        <div className="ic"><Icon name="check" /></div>
        <h3>Recibimos tu pedido de revocación</h3>
        <p>Este es el código de identificación de tu trámite. Guardalo: con él podés reclamar el estado de la revocación sin tener que explicar todo de nuevo.</p>
        <p className="code" style={{ userSelect: "all" }}>{codigo}</p>
        <p>
          Si hubo un pago, la devolución se hace por el mismo medio con el que pagaste. Cualquier duda, escribinos a{" "}
          <a href={`mailto:${PROVEEDOR.emailLegal}`} className="link">{PROVEEDOR.emailLegal}</a>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form-card" noValidate>
      <div className="field">
        <label htmlFor="arr-nombre">Nombre y apellido</label>
        <input id="arr-nombre" name="nombre" type="text" required autoComplete="name" placeholder="Como figura en la contratación" />
      </div>
      <div className="field">
        <label htmlFor="arr-email">Email</label>
        <input id="arr-email" name="email" type="email" required autoComplete="email" placeholder="El que usaste para contratar, si lo recordás" />
      </div>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="arr-telefono">
            Teléfono <span className="opt">(opcional)</span>
          </label>
          <input id="arr-telefono" name="telefono" type="tel" autoComplete="tel" placeholder="Por si necesitamos ubicarte" />
        </div>
        <div className="field">
          <label htmlFor="arr-referencia">
            Empresa o número de factura <span className="opt">(opcional)</span>
          </label>
          <input id="arr-referencia" name="referencia" type="text" placeholder="Ayuda a encontrar la contratación" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="arr-motivo">
          Motivo <span className="opt">(opcional)</span>
        </label>
        <textarea id="arr-motivo" name="motivo" rows={3} placeholder="No hace falta que lo justifiques. Si querés contarnos, nos sirve." />
      </div>

      {status === "error" && (
        <div className="alert error" role="alert">
          <Icon name="alert" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
        <Icon name="back" />
        {status === "sending" ? "Enviando…" : "Revocar la contratación"}
      </button>
      <p className="form-fine">No hace falta registrarse ni iniciar sesión para usar este formulario.</p>
    </form>
  );
}
