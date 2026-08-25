"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setEnviando(true);

    const password = new FormData(e.currentTarget).get("password");

    try {
      const res = await fetch("/api/dashboard/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = (await res.json()) as { ok: boolean; error?: string };

      if (!body.ok) {
        setError(
          body.error === "demasiados_intentos"
            ? "Demasiados intentos. Esperá diez minutos."
            : body.error === "sin_configurar"
              ? "El dashboard todavía no tiene configuradas DASHBOARD_PASSWORD y DASHBOARD_SECRET en Vercel."
              : "Contraseña incorrecta."
        );
        setEnviando(false);
        return;
      }

      const volver = params.get("volver");
      const destino = volver?.startsWith("/dashboard") ? volver : "/dashboard";

      // Navegación dura, no router.push().
      //
      // Con router.push() el cliente pide /dashboard por RSC, y esa respuesta
      // puede salir de la caché del router: la que se guardó hace un momento,
      // cuando /dashboard todavía redirigía al login porque no había cookie.
      // Resultado: volvés al formulario sin ningún error, con la cookie ya
      // puesta. El router.refresh() que venía atrás empeoraba la carrera.
      //
      // window.location fuerza una carga completa: el middleware corre en el
      // servidor con la cookie fresca y no hay caché de por medio.
      window.location.assign(destino);
      return;
    } catch {
      setError("Se cortó la conexión. Probá de nuevo.");
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Contraseña"
        className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />

      {error && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={enviando}
        className="w-full rounded-lg bg-accent px-8 py-3.5 font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enviando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
