"use client";

import { useRouter } from "next/navigation";

export default function CerrarSesion() {
  const router = useRouter();

  async function salir() {
    await fetch("/api/dashboard/login", { method: "DELETE" });
    router.push("/dashboard/login");
    router.refresh();
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
