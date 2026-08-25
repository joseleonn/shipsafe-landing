import type { FilaCreativo } from "@/lib/dashboard/metricas";

/**
 * Qué trajo cada creativo.
 *
 * Es el informe que responde la única pregunta que importa a los 60 días: qué
 * anuncio trae los clientes que cierran, no cuál trae más leads baratos.
 *
 * Las filas que aparecen de un solo lado NO se ocultan. Un anuncio que gasta y
 * no tiene ni un lead atribuido es justamente lo que hay que ver: o no
 * convierte, o el utm_content del enlace no coincide con el nombre del anuncio.
 */

const SERIE = "#3987e5";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });

function usd(n: number | null): string {
  return n === null ? "—" : `USD ${nf.format(n)}`;
}

export default function TablaCreativos({ filas }: { filas: FilaCreativo[] }) {
  const maxGasto = Math.max(...filas.map((f) => f.gastoUsd ?? 0), 1);

  return (
    <section className="rounded-xl border border-white/10 bg-[#102542] p-6">
      <h2 className="font-display text-lg font-semibold text-white">Por creativo</h2>
      <p className="mt-1 text-sm text-white/50">
        Cruza el nombre del anuncio en Meta con el <code className="text-white/70">utm_content</code>{" "}
        que quedó guardado en HubSpot.
      </p>

      {filas.length === 0 ? (
        <p className="mt-8 text-sm text-white/40">
          Todavía no hay anuncios con gasto ni leads con ángulo identificado.
        </p>
      ) : (
        <div className="mt-6 -mx-6 overflow-x-auto px-6">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wide text-white/45">
                <th className="pb-3 pr-4 font-medium">Creativo</th>
                <th className="pb-3 pr-4 text-right font-medium">Gasto</th>
                <th className="pb-3 pr-4 text-right font-medium">Leads</th>
                <th className="pb-3 pr-4 text-right font-medium">Califican</th>
                <th className="pb-3 pr-4 text-right font-medium">Agendas</th>
                <th className="pb-3 pr-4 text-right font-medium">Clientes</th>
                <th className="pb-3 text-right font-medium">CPL</th>
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.nombre} className="border-b border-white/[0.06] last:border-0">
                  <td className="py-3 pr-4">
                    <span className="text-white/85">{f.nombre}</span>
                    <div className="mt-1.5 h-1.5 w-32 overflow-hidden rounded-sm bg-white/[0.06]">
                      <div
                        className="h-full rounded-r-[4px]"
                        style={{
                          width: `${((f.gastoUsd ?? 0) / maxGasto) * 100}%`,
                          backgroundColor: SERIE,
                        }}
                      />
                    </div>
                    {f.soloUnLado && (
                      <p className="mt-1.5 text-xs text-white/45">
                        {f.soloUnLado === "meta"
                          ? "Gasta en Meta y no tiene leads atribuidos. Revisá que el utm_content del enlace sea igual al nombre del anuncio."
                          : "Trae leads pero no aparece en Meta con ese nombre."}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap py-3 pr-4 text-right tabular-nums text-white/80">{usd(f.gastoUsd)}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-white/80">{f.leads}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-white/80">{f.calificados}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-white/80">{f.agendadas}</td>
                  <td className="py-3 pr-4 text-right tabular-nums text-white">{f.ganados}</td>
                  <td className="whitespace-nowrap py-3 text-right tabular-nums text-white/80">{usd(f.cplUsd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
