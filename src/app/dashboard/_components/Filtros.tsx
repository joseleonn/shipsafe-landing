"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PERIODOS, type ClavePeriodo } from "@/lib/dashboard/metricas";

/** Selector de período. Una fila arriba de todo, como manda cualquier tablero. */
export default function Filtros({ actual }: { actual: ClavePeriodo }) {
  const router = useRouter();
  const params = useSearchParams();

  function cambiar(clave: string) {
    const nuevos = new URLSearchParams(params.toString());
    nuevos.set("periodo", clave);
    router.push(`/dashboard?${nuevos.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(PERIODOS).map(([clave, { label }]) => {
        const activo = clave === actual;
        return (
          <button
            key={clave}
            type="button"
            onClick={() => cambiar(clave)}
            aria-pressed={activo}
            className={
              activo
                ? "rounded-lg bg-accent px-3.5 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-white/15 px-3.5 py-2 text-sm text-white/70 transition-colors hover:border-white/30 hover:text-white"
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
