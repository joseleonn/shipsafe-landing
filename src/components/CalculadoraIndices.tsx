"use client";

import { useState } from "react";

/**
 * Calculadora de índices de accidentabilidad (17/11/2026).
 * Fórmulas verificadas en el texto oficial de cada país:
 * - Argentina: SRT, Informe anual de accidentabilidad laboral (definiciones de
 *   índice de incidencia, incidencia de fallecidos, índice de pérdida y duración media).
 * - Colombia: Resolución 0312 de 2019, artículo 30 (indicadores mínimos).
 * - Perú: RM 050-2013-TR, Anexo 1, registro de estadísticas (IF, IG, IA).
 * No agregar un país ni cambiar una fórmula sin leer la norma.
 */

type Campo = { id: string; label: string };
type Resultado = { label: string; calc: (v: Record<string, number>) => number | null; unidad: string };
type Pais = { nombre: string; fuente: string; campos: Campo[]; resultados: Resultado[] };

const div = (a: number, b: number) => (b > 0 ? a / b : null);

const PAISES: Record<string, Pais> = {
  AR: {
    nombre: "Argentina (SRT)",
    fuente: "Definiciones del informe anual de accidentabilidad laboral de la SRT.",
    campos: [
      { id: "casos", label: "Accidentes y enfermedades con días de baja o secuela incapacitante" },
      { id: "fallecidos", label: "Trabajadores fallecidos por accidente o enfermedad" },
      { id: "jornadas", label: "Jornadas no trabajadas por accidentes y enfermedades" },
      { id: "trabajadores", label: "Promedio de trabajadores en el período" },
    ],
    resultados: [
      { label: "Índice de incidencia", calc: (v) => mul(div(v.casos, v.trabajadores), 1000), unidad: "casos cada mil trabajadores" },
      { label: "Índice de incidencia de fallecidos", calc: (v) => mul(div(v.fallecidos, v.trabajadores), 1_000_000), unidad: "fallecidos cada millón de trabajadores" },
      { label: "Índice de pérdida", calc: (v) => mul(div(v.jornadas, v.trabajadores), 1000), unidad: "jornadas perdidas cada mil trabajadores" },
      { label: "Duración media de las bajas", calc: (v) => div(v.jornadas, v.casos), unidad: "días por caso" },
    ],
  },
  CO: {
    nombre: "Colombia (Resolución 0312, art. 30)",
    fuente: "Indicadores mínimos del artículo 30 de la Resolución 0312 de 2019. Se calculan por mes.",
    campos: [
      { id: "accidentes", label: "Accidentes de trabajo en el mes" },
      { id: "dias", label: "Días de incapacidad por accidente de trabajo en el mes" },
      { id: "cargados", label: "Días cargados en el mes" },
      { id: "trabajadores", label: "Número de trabajadores en el mes" },
      { id: "ausencia", label: "Días de ausencia por incapacidad laboral o común en el mes" },
      { id: "programados", label: "Días de trabajo programados en el mes (días × trabajadores)" },
    ],
    resultados: [
      { label: "Frecuencia de accidentalidad", calc: (v) => mul(div(v.accidentes, v.trabajadores), 100), unidad: "accidentes cada 100 trabajadores" },
      { label: "Severidad de accidentalidad", calc: (v) => mul(div(v.dias + v.cargados, v.trabajadores), 100), unidad: "días cada 100 trabajadores" },
      { label: "Ausentismo por causa médica", calc: (v) => mul(div(v.ausencia, v.programados), 100), unidad: "% de los días programados" },
    ],
  },
  PE: {
    nombre: "Perú (RM 050-2013-TR)",
    fuente: "Registro de estadísticas de seguridad y salud en el trabajo, Anexo 1 de la RM 050-2013-TR.",
    campos: [
      { id: "accidentes", label: "Accidentes de trabajo incapacitantes" },
      { id: "dias", label: "Días perdidos" },
      { id: "horas", label: "Total de horas hombre trabajadas" },
    ],
    resultados: [
      { label: "Índice de frecuencia", calc: (v) => mul(div(v.accidentes, v.horas), 1_000_000), unidad: "accidentes por millón de horas" },
      { label: "Índice de gravedad", calc: (v) => mul(div(v.dias, v.horas), 1_000_000), unidad: "días perdidos por millón de horas" },
      {
        label: "Índice de accidentabilidad",
        calc: (v) => {
          const f = div(v.accidentes * 1_000_000, v.horas);
          const g = div(v.dias * 1_000_000, v.horas);
          return f === null || g === null ? null : (f * g) / 1000;
        },
        unidad: "frecuencia × gravedad ÷ 1000",
      },
    ],
  },
};

function mul(x: number | null, k: number) {
  return x === null ? null : x * k;
}

const fmt = (n: number) => n.toLocaleString("es-AR", { maximumFractionDigits: 2 });

export default function CalculadoraIndices() {
  const [pais, setPais] = useState("AR");
  const [valores, setValores] = useState<Record<string, string>>({});
  const p = PAISES[pais];
  const v = Object.fromEntries(p.campos.map((c) => [c.id, Number(valores[`${pais}.${c.id}`] || 0)]));

  return (
    <div
      style={{
        border: "1px solid var(--line-2)",
        borderRadius: "var(--r-card)",
        padding: "20px",
        margin: "24px 0",
        background: "var(--surface-2)",
      }}
    >
      <div className="field">
        <label htmlFor="pais">País</label>
        <select id="pais" value={pais} onChange={(e) => setPais(e.target.value)}>
          {Object.entries(PAISES).map(([k, x]) => (
            <option key={k} value={k}>
              {x.nombre}
            </option>
          ))}
        </select>
      </div>
      {p.campos.map((c) => (
        <div className="field" key={`${pais}.${c.id}`}>
          <label htmlFor={`${pais}.${c.id}`}>{c.label}</label>
          <input
            id={`${pais}.${c.id}`}
            type="number"
            inputMode="decimal"
            min={0}
            value={valores[`${pais}.${c.id}`] ?? ""}
            onChange={(e) => setValores({ ...valores, [`${pais}.${c.id}`]: e.target.value })}
          />
        </div>
      ))}
      <div style={{ display: "grid", gap: "10px", marginTop: "8px" }}>
        {p.resultados.map((r) => {
          const n = r.calc(v);
          return (
            <div
              key={r.label}
              style={{ background: "var(--surface)", border: "1px solid var(--line)", borderRadius: "var(--r-sm)", padding: "12px 14px" }}
            >
              <div style={{ fontSize: "13.5px", color: "var(--text-2)" }}>{r.label}</div>
              <div style={{ fontSize: "22px", fontWeight: 600 }}>{n === null ? "—" : fmt(n)}</div>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>{r.unidad}</div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: "13px", color: "var(--muted)", marginTop: "12px" }}>Fórmulas: {p.fuente}</p>
    </div>
  );
}
