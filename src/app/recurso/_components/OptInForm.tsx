"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  captureAttribution,
  getAttribution,
  readCookie,
  newEventId,
} from "@/lib/attribution";
import { trackMetaEvent } from "@/lib/meta-pixel";
import { trackEvent, EVENTS } from "@/lib/analytics";
import {
  EMPLEADOS_OPCIONES,
  RUBRO_OPCIONES,
  ROL_OPCIONES,
  GESTION_OPCIONES,
} from "@/lib/calificacion";

interface Props {
  slug: string;
  cta: string;
}

const campoBase =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

export default function OptInForm({ slug, cta }: Props) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Guarda de dónde vino el visitante apenas carga la página, antes de que
  // navegue y pierda los parámetros de la URL.
  useEffect(() => {
    captureAttribution();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    const form = new FormData(e.currentTarget);
    const datos = Object.fromEntries(form.entries()) as Record<string, string>;

    // El mismo id va al pixel y a la API de Conversiones. Sin esto, Meta
    // cuenta el lead dos veces.
    const eventId = newEventId("lead");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...datos,
          leadMagnet: slug,
          eventId,
          fbc: readCookie("_fbc"),
          fbp: readCookie("_fbp"),
          attribution: getAttribution(),
          sourceUrl: window.location.href,
        }),
      });

      const body = (await res.json()) as { ok: boolean; califica?: boolean; error?: string };

      if (!res.ok || !body.ok) {
        setError(
          body.error === "email_invalido"
            ? "Revisá el email, parece que tiene un error."
            : "No pudimos procesar el envío. Probá de nuevo en un momento."
        );
        setEnviando(false);
        return;
      }

      trackMetaEvent("Lead", eventId, { content_name: slug });
      trackEvent(EVENTS.GENERATE_LEAD, { source: "recurso", section: slug });

      // La página de gracias necesita saber si califica para mostrar o no el
      // calendario, y los datos para precargar Calendly.
      try {
        sessionStorage.setItem(
          "ss_lead",
          JSON.stringify({
            califica: body.califica === true,
            nombre: datos.nombre ?? "",
            apellido: datos.apellido ?? "",
            email: datos.email ?? "",
            telefono: datos.telefono ?? "",
          })
        );
      } catch {
        /* storage bloqueado: la página de gracias cae al caso conservador */
      }

      router.push(`/recurso/${slug}/gracias`);
    } catch {
      setError("Se cortó la conexión. Probá de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="nombre" required placeholder="Nombre" className={campoBase} autoComplete="given-name" />
        <input name="apellido" placeholder="Apellido" className={campoBase} autoComplete="family-name" />
      </div>

      <input
        name="email"
        type="email"
        required
        placeholder="Email de trabajo"
        className={campoBase}
        autoComplete="email"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <input name="telefono" type="tel" placeholder="WhatsApp" className={campoBase} autoComplete="tel" />
        <input name="empresa" placeholder="Empresa" className={campoBase} autoComplete="organization" />
      </div>

      <select name="empleados" required defaultValue="" className={campoBase}>
        <option value="" disabled>Cantidad de empleados</option>
        {EMPLEADOS_OPCIONES.map((o) => (
          <option key={o.value} value={o.value} className="bg-primary">{o.label}</option>
        ))}
      </select>

      <select name="rubro" required defaultValue="" className={campoBase}>
        <option value="" disabled>Rubro</option>
        {RUBRO_OPCIONES.map((o) => (
          <option key={o.value} value={o.value} className="bg-primary">{o.label}</option>
        ))}
      </select>

      <select name="rol" required defaultValue="" className={campoBase}>
        <option value="" disabled>Tu rol en la empresa</option>
        {ROL_OPCIONES.map((o) => (
          <option key={o.value} value={o.value} className="bg-primary">{o.label}</option>
        ))}
      </select>

      <select name="gestion" required defaultValue="" className={campoBase}>
        <option value="" disabled>¿Cómo gestionan SST hoy?</option>
        {GESTION_OPCIONES.map((o) => (
          <option key={o.value} value={o.value} className="bg-primary">{o.label}</option>
        ))}
      </select>

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-accent px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Enviando..." : cta}
      </button>

      <p className="text-center text-xs text-white/40">
        Lo descargás en la pantalla siguiente. Sin spam, y te podés dar de baja cuando quieras.
      </p>
    </form>
  );
}
