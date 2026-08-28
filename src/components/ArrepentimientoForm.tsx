"use client";

import { useState } from "react";
import { CheckCircle, AlertCircle, Loader2, Undo2 } from "lucide-react";
import { WEB3FORMS_KEY, PROVEEDOR } from "@/lib/constants";

type FormStatus = "idle" | "sending" | "success" | "error";

const inputClasses =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 transition-colors focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50";

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
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
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
      <div className="rounded-xl border border-accent/30 bg-accent/5 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recibimos tu pedido de revocación
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Este es el código de identificación de tu trámite. Guardalo: con
              él podés reclamar el estado de la revocación sin tener que
              explicar todo de nuevo.
            </p>
          </div>
        </div>

        <p className="mt-6 select-all rounded-lg border border-white/10 bg-primary/60 px-4 py-4 text-center font-mono text-xl tracking-widest text-white">
          {codigo}
        </p>

        <p className="mt-6 text-sm leading-relaxed text-white/60">
          Si hubo un pago, la devolución se hace por el mismo medio con el que
          pagaste. Cualquier duda, escribinos a{" "}
          <a
            href={`mailto:${PROVEEDOR.emailLegal}`}
            className="text-accent underline underline-offset-2"
          >
            {PROVEEDOR.emailLegal}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="arr-nombre" className="mb-1.5 block text-sm text-white/70">
          Nombre y apellido
        </label>
        <input
          id="arr-nombre"
          name="nombre"
          type="text"
          required
          autoComplete="name"
          className={inputClasses}
          placeholder="Como figura en la contratación"
        />
      </div>

      <div>
        <label htmlFor="arr-email" className="mb-1.5 block text-sm text-white/70">
          Email
        </label>
        <input
          id="arr-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClasses}
          placeholder="El que usaste para contratar, si lo recordás"
        />
      </div>

      <div>
        <label htmlFor="arr-telefono" className="mb-1.5 block text-sm text-white/70">
          Teléfono <span className="text-white/40">(opcional)</span>
        </label>
        <input
          id="arr-telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          className={inputClasses}
          placeholder="Por si necesitamos ubicarte"
        />
      </div>

      <div>
        <label htmlFor="arr-referencia" className="mb-1.5 block text-sm text-white/70">
          Empresa o número de factura{" "}
          <span className="text-white/40">(opcional)</span>
        </label>
        <input
          id="arr-referencia"
          name="referencia"
          type="text"
          className={inputClasses}
          placeholder="Ayuda a encontrar la contratación más rápido"
        />
      </div>

      <div>
        <label htmlFor="arr-motivo" className="mb-1.5 block text-sm text-white/70">
          Motivo <span className="text-white/40">(opcional)</span>
        </label>
        <textarea
          id="arr-motivo"
          name="motivo"
          rows={3}
          className={inputClasses}
          placeholder="No hace falta que lo justifiques. Si querés contarnos, nos sirve."
        />
      </div>

      {status === "error" && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-primary transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando
          </>
        ) : (
          <>
            <Undo2 className="h-4 w-4" />
            Revocar la contratación
          </>
        )}
      </button>

      <p className="text-center text-xs text-white/40">
        No hace falta registrarse ni iniciar sesión para usar este formulario.
      </p>
    </form>
  );
}
