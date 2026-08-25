"use client";

export default function CerrarSesion() {
  async function salir() {
    await fetch("/api/dashboard/login", { method: "DELETE" });
    // Igual que en el login: carga completa, para que no quede en caché una
    // versión del dashboard renderizada cuando todavía había sesión.
    window.location.assign("/dashboard/login");
  }

  return (
    <button
      type="button"
      onClick={salir}
      className="rounded-lg border border-white/15 px-3.5 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}
