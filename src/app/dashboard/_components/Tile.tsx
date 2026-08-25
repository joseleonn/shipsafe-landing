import Estado from "./Estado";
import type { Evaluacion } from "@/lib/dashboard/metas";

interface Props {
  titulo: string;
  /** Ya formateado. `null` se muestra como "—", nunca como 0. */
  valor: string | null;
  /** El rango esperado, en texto. */
  objetivo?: string | null;
  evaluacion?: Evaluacion;
  /** Contexto de una línea. Se muestra siempre, no en un tooltip. */
  nota?: string;
}

/**
 * Un número solo, con su meta al lado.
 *
 * Sin gráfico a propósito: un valor único no es un gráfico, y meterle una
 * sparkline decorativa atrás no agrega información, solo ruido.
 */
export default function Tile({ titulo, valor, objetivo, evaluacion, nota }: Props) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#102542] p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-white/60">{titulo}</p>
        {evaluacion && <Estado evaluacion={evaluacion} />}
      </div>

      <p className="mt-3 font-display text-3xl font-semibold text-white">
        {valor ?? <span className="text-white/30">—</span>}
      </p>

      {objetivo && <p className="mt-1 text-xs text-white/45">{objetivo}</p>}

      {nota && <p className="mt-3 text-xs leading-relaxed text-white/50">{nota}</p>}

      {evaluacion?.diagnostico && (
        <p className="mt-3 border-l-2 border-white/15 pl-3 text-xs leading-relaxed text-white/55">
          {evaluacion.diagnostico}
        </p>
      )}
    </div>
  );
}
