import type { Evaluacion } from "@/lib/dashboard/metas";

/**
 * Indicador de "¿está en objetivo?".
 *
 * SIEMPRE lleva glifo + texto. No es un adorno: sobre este fondo el rojo de
 * "fuera de techo" y el verde de "en objetivo" quedan a ΔE 4,1 con deuteranopía
 * (medido con el validador de paleta). Con color solo, una de cada doce
 * personas ve dos insignias iguales. El color acá refuerza, no informa.
 */

const ESTILOS = {
  bueno: { color: "#0ca30c", glifo: "●", borde: "rgba(12,163,12,0.35)" },
  atencion: { color: "#fab219", glifo: "▲", borde: "rgba(250,178,25,0.35)" },
  malo: { color: "#d03b3b", glifo: "■", borde: "rgba(208,59,59,0.4)" },
  sin_datos: { color: "#8fa3bf", glifo: "–", borde: "rgba(255,255,255,0.14)" },
} as const;

export default function Estado({ evaluacion }: { evaluacion: Evaluacion }) {
  const e = ESTILOS[evaluacion.estado];
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium"
      style={{ color: e.color, borderColor: e.borde }}
    >
      <span aria-hidden>{e.glifo}</span>
      {evaluacion.etiqueta}
    </span>
  );
}
