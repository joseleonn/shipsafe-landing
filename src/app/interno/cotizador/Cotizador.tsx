"use client";

import { useMemo, useState } from "react";
import {
  cotizar,
  verificar,
  ars,
  usd,
  fmt,
  ENTRADA_INICIAL,
  PRESETS,
  PRECIO_USUARIO,
  type Entrada,
  type Tarifa,
} from "@/lib/cotizador";

/**
 * La herramienta. Se opera, no se lee: el abono manda, todo lo demás lo
 * sostiene. Tiene que servir a 400 px porque se abre del celular en medio de
 * una llamada.
 */

const nums = "font-mono [font-variant-numeric:tabular-nums]";
const caja = "rounded-xl border border-white/10 bg-white/[0.03] p-4";
const etiqueta = "block text-xs font-medium uppercase tracking-wide text-white/45";

function Campo({
  label, nota, value, onChange, min = 0, step = 1,
}: {
  label: string; nota?: string; value: number; onChange: (n: number) => void; min?: number; step?: number;
}) {
  return (
    <label className="block">
      <span className={etiqueta}>{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(e.target.value === "" ? min : Number(e.target.value))}
        className={`mt-1.5 w-full rounded-lg border border-white/12 bg-primary px-3 py-2.5 text-lg text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/30 ${nums}`}
      />
      {nota && <span className="mt-1 block text-xs text-white/35">{nota}</span>}
    </label>
  );
}

function Cifra({
  titulo, valor, pesos, grande = false, acento = false,
}: {
  titulo: string; valor: string; pesos?: string; grande?: boolean; acento?: boolean;
}) {
  return (
    <div className={`${caja} ${acento ? "border-accent/40 bg-accent/10" : ""}`}>
      <div className={etiqueta}>{titulo}</div>
      <div className={`${nums} mt-1 font-semibold text-white ${grande ? "text-4xl sm:text-5xl" : "text-2xl"}`}>
        {valor}
      </div>
      {pesos && <div className={`${nums} mt-0.5 text-sm text-white/45`}>{pesos}</div>}
    </div>
  );
}

function Desglose({ titulo, filas, total, tc }: {
  titulo: string; filas: { etiqueta: string; monto: number }[]; total: number; tc: number;
}) {
  return (
    <div className={caja}>
      <div className={etiqueta}>{titulo}</div>
      <dl className="mt-2.5 space-y-1.5 text-sm">
        {filas.map((f) => (
          <div key={f.etiqueta} className="flex justify-between gap-4">
            <dt className="text-white/55">{f.etiqueta}</dt>
            <dd className={`${nums} text-white/80`}>{usd(f.monto)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-white/10 pt-1.5">
          <dt className="text-white/70">Total</dt>
          <dd className={`${nums} font-semibold text-white`}>
            {usd(total)} <span className="font-normal text-white/40">· {ars(total, tc)}</span>
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function Cotizador({ tarifa }: { tarifa: Tarifa }) {
  const [e, setE] = useState<Entrada>(ENTRADA_INICIAL);
  const [abierto, setAbierto] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const set = <K extends keyof Entrada>(k: K, v: Entrada[K]) => setE((p) => ({ ...p, [k]: v }));

  const r = useMemo(() => cotizar(e, tarifa), [e, tarifa]);
  const checks = useMemo(() => verificar(e.precioUsuario, tarifa), [e.precioUsuario, tarifa]);
  const todoOk = checks.every((c) => c.ok);

  const unidad = e.tipoOperacion === "clientes" ? "clientes" : "establecimientos";
  const tc = e.pesosPorDolar;

  // En Enterprise el equipo es variable de precio, así que el conteo sobre el
  // que se calculó tiene que viajar con la cotización: es la base del número.
  const enterprise = r.linea === "Enterprise";
  const alcance = enterprise
    ? `${e.usuarios} usuarios, ${e.establecimientos} ${unidad} y ${fmt(e.equipos)} equipos`
    : `${e.usuarios} usuarios y ${e.establecimientos} ${unidad}`;

  const texto = [
    `Para una operación de ${alcance}:`,
    "",
    `• Abono mensual: ${usd(r.abono)} (${ars(r.abono, tc)})`,
    e.setupIncluido
      ? `• Implementación: incluida (valor ${usd(r.concesion)})`
      : `• Implementación, pago único: ${usd(r.setup)} (${ars(r.setup, tc)})`,
    enterprise
      ? `• Total anual: ${usd(r.abonoAnualTotal)} (${ars(r.abonoAnualTotal, tc)})`
      : `• Pago anual: ${usd(r.abonoAnualMensual)}/mes, ${Math.round(r.descuento * 100)}% de descuento`,
    "",
    "Los operarios no se cuentan ni se cobran: entran con DNI, sin usuario ni mail.",
    ...(r.porCliente !== null ? [`Son ${usd(r.porCliente)} por cliente por mes.`] : []),
  ].join("\n");

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.nombre}
            type="button"
            onClick={() => setE((prev) => ({ ...prev, ...p }))}
            className="rounded-full border border-white/12 px-3.5 py-1.5 text-sm text-white/70 transition hover:border-accent/50 hover:bg-accent/10 hover:text-white"
          >
            {p.nombre}
          </button>
        ))}
      </div>

      {/* Entradas */}
      <div className={`${caja} space-y-4`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Campo label="Usuarios que administran" nota="Supervisores y técnicos con login" value={e.usuarios} onChange={(n) => set("usuarios", n)} min={1} />
          <Campo label={e.tipoOperacion === "clientes" ? "Clientes" : "Establecimientos"} value={e.establecimientos} onChange={(n) => set("establecimientos", n)} min={1} />
          <Campo label="Equipos con QR, total" value={e.equipos} onChange={(n) => set("equipos", n)} min={0} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className={etiqueta}>Tipo de operación</span>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-lg border border-white/12 p-1">
              {(["sucursales", "clientes"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("tipoOperacion", t)}
                  aria-pressed={e.tipoOperacion === t}
                  className={`rounded-md px-3 py-2 text-sm transition ${
                    e.tipoOperacion === t ? "bg-accent font-medium text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {t === "sucursales" ? "Sucursales de una empresa" : "Clientes distintos"}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 self-end">
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/12 p-3">
              <input
                type="checkbox"
                checked={e.requisitosTecnicos}
                onChange={(ev) => set("requisitosTecnicos", ev.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none accent-accent"
              />
              <span className="text-sm leading-snug text-white/70">
                Pide SSO, ERP, on-premise, white-label o SLA contractual
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/12 p-3">
              <input
                type="checkbox"
                checked={e.setupIncluido}
                onChange={(ev) => set("setupIncluido", ev.target.checked)}
                className="mt-0.5 h-4 w-4 flex-none accent-accent"
              />
              <span className="text-sm leading-snug text-white/70">
                Implementación incluida en la propuesta
              </span>
            </label>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-white/35">
          Los operarios no son una variable de precio: entran con DNI, sin usuario ni mail. No se cuentan
          ni se cobran.
        </p>
      </div>

      {/* Línea */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="rounded-md bg-accent/15 px-2.5 py-1 font-display text-sm font-semibold text-white">
          {r.linea}
        </span>
        <span className="text-sm text-white/45">{r.razon}</span>
        {r.descuento > 0 && (
          <span className="text-sm text-white/45">· {Math.round(r.descuento * 100)}% anual</span>
        )}
      </div>

      {r.avisos.map((a) => (
        <p key={a} className="rounded-lg border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-amber-100">
          {a}
        </p>
      ))}

      {/* Salidas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Cifra titulo="Abono mensual" valor={usd(r.abono)} pesos={ars(r.abono, tc)} grande acento />
        </div>
        <Cifra
          titulo="Implementación, pago único"
          valor={e.setupIncluido ? "Incluida" : usd(r.setup)}
          pesos={e.setupIncluido ? `Concesión: ${usd(r.concesion)}` : ars(r.setup, tc)}
        />
        <Cifra titulo="Primer mes" valor={usd(r.primerMes)} pesos={ars(r.primerMes, tc)} />
        <Cifra
          titulo={r.descuento > 0 ? `Anual · ${Math.round(r.descuento * 100)}% off` : "Anual"}
          valor={r.descuento > 0 ? `${usd(r.abonoAnualMensual)}/mes` : usd(r.abonoAnualTotal)}
          pesos={
            r.descuento > 0
              ? `${usd(r.abonoAnualTotal)} el año · ${ars(r.abonoAnualTotal, tc)}`
              : `${ars(r.abonoAnualTotal, tc)} · Enterprise ya se cotiza anual, sin descuento adicional`
          }
        />
        {r.porCliente !== null && (
          <Cifra titulo="Por cliente gestionado, por mes" valor={usd(r.porCliente)} pesos={ars(r.porCliente, tc)} acento />
        )}
      </div>

      {r.porCliente !== null && (
        <p className="text-sm leading-relaxed text-white/45">
          Es el número que la consultora traslada a su honorario: sobre {e.establecimientos} clientes, cada
          uno le cuesta {usd(r.porCliente)} por mes.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Desglose titulo="Cómo se arma el abono" filas={r.desgloseAbono} total={r.abono} tc={tc} />
        <Desglose titulo="Cómo se arma la implementación" filas={r.desgloseSetup} total={r.setup} tc={tc} />
      </div>

      {/* Texto para pegar */}
      <div className={caja}>
        <div className="flex items-center justify-between gap-3">
          <span className={etiqueta}>Para pegar por WhatsApp</span>
          <button
            type="button"
            onClick={copiar}
            className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/75 transition hover:border-accent/50 hover:bg-accent/10 hover:text-white"
          >
            {copiado ? "Copiado" : "Copiar"}
          </button>
        </div>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-sm leading-relaxed text-white/75">{texto}</pre>
      </div>

      {/* Parámetros */}
      <details open={abierto} onToggle={(ev) => setAbierto((ev.target as HTMLDetailsElement).open)} className={caja}>
        <summary className="cursor-pointer text-sm text-white/55 marker:text-white/30">Parámetros</summary>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Campo label="Pesos por dólar" value={e.pesosPorDolar} onChange={(n) => set("pesosPorDolar", n)} min={1} />
          <Campo
            label="Precio del usuario, USD"
            nota={`Entre ${PRECIO_USUARIO.min} y ${PRECIO_USUARIO.max}. El establecimiento se deriva: queda en ${fmt(r.precioEstablecimiento, 2)}.`}
            value={e.precioUsuario}
            onChange={(n) => set("precioUsuario", Math.min(PRECIO_USUARIO.max, Math.max(PRECIO_USUARIO.min, n)))}
            min={PRECIO_USUARIO.min}
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-white/35">
          El precio del establecimiento no se ingresa a mano. Se despeja del plan Starter, y por eso
          cualquier reparto que elijas entre usuario y establecimiento sigue dando los dos planes ya
          vendidos.
        </p>
      </details>

      {/* Verificación en vivo */}
      <div className={`${caja} ${todoOk ? "" : "border-red-400/40 bg-red-400/10"}`}>
        <div className={etiqueta}>Comprobación · los casos calibrados</div>
        <ul className="mt-2.5 space-y-1.5 text-sm">
          {checks.map((c) => (
            <li key={c.nombre} className="flex flex-wrap items-baseline gap-x-2">
              <span aria-hidden className={c.ok ? "text-emerald-400" : "text-red-400"}>
                {c.ok ? "✓" : "✗"}
              </span>
              <span className="text-white/55">{c.config}</span>
              <span className={`${nums} text-white/80`}>
                abono {fmt(c.abonoDio)}/{fmt(c.abonoEsperado)} · setup {fmt(c.setupDio)}/{fmt(c.setupEsperado)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-xs leading-relaxed text-white/35">
          Los dos primeros son ventas cerradas. El tercero es la cotización de Adecoagro, que
          todavía no compró: si negocia para abajo, hay que recalibrar el precio de establecimiento
          de Enterprise.
        </p>
        {!todoOk && (
          <p className="mt-2.5 text-sm text-red-200">
            No coincide con los planes vendidos. Hay un error en la implementación o en los parámetros:
            no cotices con esto.
          </p>
        )}
      </div>
    </div>
  );
}
