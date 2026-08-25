"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
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
      router.push(volver?.startsWith("/dashboard") ? volver : "/dashboard");
      router.refresh();
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
