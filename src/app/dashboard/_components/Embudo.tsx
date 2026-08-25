import type { EtapaEmbudo } from "@/lib/dashboard/metricas";

/**
 * El embudo, como barras horizontales.
 *
 * Una sola serie y un solo color a propósito. La rampa azul de 5 pasos que
 * probé primero FALLA la validación (los pasos adyacentes quedan a ΔL 0,046 y
 * son indistinguibles), y además sería redundante: el largo de la barra ya
 * codifica la magnitud. Pintar lo mismo dos veces no agrega información.
 *
 * Cada barra lleva su número escrito. No hace falta medir contra un eje.
 */

const SERIE = "#3987e5";

export default function Embudo({ etapas }: { etapas: EtapaEmbudo[] }) {
  const maximo = Math.max(...etapas.map((e) => e.cantidad), 1);
  const hayDatos = etapas.some((e) => e.cantidad > 0);

  return (
    <section className="rounded-xl border border-white/10 bg-[#102542] p-6">
      <h2 className="font-display text-lg font-semibold text-white">Embudo</h2>
      <p className="mt-1 text-sm text-white/50">
        De la gente que entró en este período, cuántos llegaron hasta cada etapa.
        Un lead de agosto que cierra en octubre sigue contando en agosto.
      </p>
      <p className="mt-2 text-sm text-white/40">
        Los días son la mediana de lo que tarda un negocio en pasar de una etapa a
        la siguiente. La etapa que se estira es la que hay que mirar. El salto de
        Lead a Demo agendada no se mide: cruza de contacto a negocio.
      </p>

      {!hayDatos ? (
        <p className="mt-8 text-sm text-white/40">
          Todavía no entró nadie en este período.
        </p>
      ) : (
        <ol className="mt-6 space-y-3">
          {etapas.map((etapa) => {
            const ancho = (etapa.cantidad / maximo) * 100;
            return (
              <li key={etapa.etiqueta}>
                <div className="flex items-baseline justify-between gap-4 text-sm">
                  <span className="text-white/80">{etapa.etiqueta}</span>
                  <span className="flex flex-wrap items-baseline justify-end gap-x-3 gap-y-1">
                    {etapa.diasDesdeAnterior !== null && (
                      <span className="whitespace-nowrap text-xs tabular-nums text-white/45">
                        {etapa.diasDesdeAnterior.toFixed(0)} días de mediana
                      </span>
                    )}
                    {etapa.desdeAnterior !== null && (
                      <span className="whitespace-nowrap text-xs tabular-nums text-white/45">
                        {etapa.desdeAnterior.toFixed(0)}% de la etapa anterior
                      </span>
                    )}
                    <span className="font-display text-base font-semibold tabular-nums text-white">
                      {etapa.cantidad}
                    </span>
                  </span>
                </div>

                <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-sm bg-white/[0.06]">
                  <div
                    className="h-full rounded-r-[4px]"
                    style={{
                      width: `${Math.max(ancho, etapa.cantidad > 0 ? 1.5 : 0)}%`,
                      backgroundColor: SERIE,
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
