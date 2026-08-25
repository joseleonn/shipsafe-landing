import type { Metricas } from "@/lib/dashboard/metricas";

/**
 * Leads por día y gasto por día, uno arriba del otro.
 *
 * Dos gráficos separados y NO uno con dos ejes. Un eje doble deja que la
 * escala elegida decida qué línea va arriba, así que se puede contar cualquier
 * historia moviendo un número que el lector no ve. Compartiendo el eje de
 * tiempo se comparan igual de bien y no se puede mentir.
 *
 * Barras y no líneas: son conteos de días sueltos, no una magnitud continua.
 */

const SERIE = "#3987e5";
const GASTO = "#8fa3bf";

function Barras({
  titulo,
  datos,
  formato,
  color,
  vacio,
}: {
  titulo: string;
  datos: { fecha: string; valor: number | null }[];
  formato: (n: number) => string;
  color: string;
  vacio: string;
}) {
  const valores = datos.map((d) => d.valor ?? 0);
  const maximo = Math.max(...valores, 1);
  const hayDatos = datos.some((d) => d.valor !== null && d.valor > 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-medium text-white/80">{titulo}</h3>
        {hayDatos && (
          <span className="text-xs tabular-nums text-white/45">
            máximo {formato(maximo)}
          </span>
        )}
      </div>

      {!hayDatos ? (
        <p className="mt-4 text-sm text-white/40">{vacio}</p>
      ) : (
        <div className="mt-3 flex h-24 items-end gap-[2px]">
          {datos.map((d) => {
            const v = d.valor ?? 0;
            const alto = v > 0 ? Math.max((v / maximo) * 100, 4) : 0;
            return (
              <div
                key={d.fecha}
                className="group relative flex-1 rounded-t-[4px]"
                style={{
                  height: `${alto}%`,
                  minHeight: v > 0 ? 3 : 0,
                  backgroundColor: v > 0 ? color : "transparent",
                }}
                title={`${d.fecha}: ${d.valor === null ? "sin datos" : formato(v)}`}
              >
                <span className="sr-only">
                  {d.fecha}: {d.valor === null ? "sin datos" : formato(v)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SerieDiaria({ metricas }: { metricas: Metricas }) {
  const primera = metricas.serie[0]?.fecha;
  const ultima = metricas.serie[metricas.serie.length - 1]?.fecha;

  return (
    <section className="rounded-xl border border-white/10 bg-[#102542] p-6">
      <h2 className="font-display text-lg font-semibold text-white">Día a día</h2>

      <div className="mt-6 space-y-8">
        <Barras
          titulo="Leads por día"
          datos={metricas.serie.map((d) => ({ fecha: d.fecha, valor: d.leads }))}
          formato={(n) => String(Math.round(n))}
          color={SERIE}
          vacio="Todavía no hay leads en este período."
        />
        <Barras
          titulo="Gasto por día (USD)"
          datos={metricas.serie.map((d) => ({ fecha: d.fecha, valor: d.gastoUsd }))}
          formato={(n) => `USD ${n.toFixed(2)}`}
          color={GASTO}
          vacio="Sin datos de gasto. Falta conectar la cuenta publicitaria, o la campaña todavía no corrió."
        />
      </div>

      {primera && ultima && (
        <div className="mt-4 flex justify-between text-xs tabular-nums text-white/40">
          <span>{primera}</span>
          <span>{ultima}</span>
        </div>
      )}
    </section>
  );
}
