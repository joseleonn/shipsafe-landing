import { Suspense } from "react";
import type { Metadata } from "next";
import { calcularMetricas, esPeriodo, PERIODOS } from "@/lib/dashboard/metricas";
import { evaluar, rangoTexto, TICKET_ARS, TIPO_DE_CAMBIO } from "@/lib/dashboard/metas";
import Tile from "./_components/Tile";
import Embudo from "./_components/Embudo";
import SerieDiaria from "./_components/SerieDiaria";
import TablaCreativos from "./_components/TablaCreativos";
import Filtros from "./_components/Filtros";
import CerrarSesion from "./_components/CerrarSesion";

export const metadata: Metadata = {
  title: "Dashboard | SHIPSAFE",
  robots: { index: false, follow: false },
};

// Datos en vivo en cada carga. Sin caché: el dashboard se abre unas pocas veces
// por día y un número viejo acá cuesta más que la llamada a la API.
export const dynamic = "force-dynamic";

const nf = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 });
const nfEntero = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const usd = (n: number | null) => (n === null ? null : `USD ${nf.format(n)}`);
const pct = (n: number | null) => (n === null ? null : `${nf.format(n)}%`);
const ars = (n: number | null) => (n === null ? null : `$ ${nfEntero.format(n)}`);

function Aviso({ tono, children }: { tono: "error" | "info"; children: React.ReactNode }) {
  const estilo =
    tono === "error"
      ? "border-[#d03b3b]/40 bg-[#d03b3b]/10 text-[#f2b8b8]"
      : "border-white/15 bg-white/[0.04] text-white/65";
  return (
    <p className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${estilo}`}>
      <span aria-hidden className="mr-2">
        {tono === "error" ? "■" : "▲"}
      </span>
      {children}
    </p>
  );
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string }>;
}) {
  const { periodo: crudo } = await searchParams;
  const periodo = esPeriodo(crudo) ? crudo : "30d";
  const m = await calcularMetricas(periodo);

  const ticketUsd = TICKET_ARS / TIPO_DE_CAMBIO;

  return (
    <main className="min-h-screen bg-primary px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">
              Canal de Meta Ads
            </h1>
            <p className="mt-1 text-sm text-white/50">
              {PERIODOS[periodo].label} · datos en vivo de HubSpot y Meta
            </p>
          </div>
          <CerrarSesion />
        </header>

        <Suspense fallback={null}>
          <Filtros actual={periodo} />
        </Suspense>

        {(m.errorHubSpot || m.avisoMeta) && (
          <div className="space-y-3">
            {m.errorHubSpot && <Aviso tono="error">{m.errorHubSpot}</Aviso>}
            {m.avisoMeta && <Aviso tono="info">{m.avisoMeta}</Aviso>}
          </div>
        )}

        {/* ── La métrica madre ───────────────────────────────────────────────
            El playbook es explícito: no se miran todas las métricas del
            Business Manager, se mira la final y el resto sirve para diagnosticar
            dónde se rompe. La página está ordenada así a propósito. */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/45">
            La métrica madre
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Tile
              titulo="Costo por agenda calificada"
              valor={usd(m.costoPorAgendaUsd)}
              objetivo={rangoTexto("costoPorAgenda", "usd") + " · techo USD 160"}
              evaluacion={evaluar("costoPorAgenda", m.costoPorAgendaUsd)}
              nota="Todo lo demás en esta página existe para explicar este número."
            />
            <Tile
              titulo="CAC"
              valor={usd(m.cacUsd)}
              objetivo="Techo USD 800 (recupero antes de 90 días)"
              evaluacion={evaluar("cac", m.cacUsd)}
              nota={`Ticket de referencia: ARS ${nfEntero.format(TICKET_ARS)} por mes ≈ USD ${nfEntero.format(ticketUsd)}.`}
            />
            <Tile
              titulo="Clientes nuevos"
              valor={String(m.ganados)}
              objetivo="Capacidad de implementación: 1 a 2 por mes"
              nota={
                m.facturacionArs
                  ? `Facturación mensual sumada: ${ars(m.facturacionArs)}.`
                  : "Sin negocios ganados en este período."
              }
            />
          </div>
        </section>

        {/* ── Diagnóstico ──────────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-white/45">
            Diagnóstico: dónde se rompe
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Tile
              titulo="Inversión"
              valor={usd(m.gastoUsd)}
              nota={
                m.impresiones
                  ? `${nfEntero.format(m.impresiones)} impresiones · ${nfEntero.format(m.clicsEnlace ?? 0)} clics al enlace.`
                  : undefined
              }
            />
            <Tile
              titulo="CPM"
              valor={usd(m.cpmUsd)}
              objetivo={rangoTexto("cpm", "usd")}
              evaluacion={evaluar("cpm", m.cpmUsd)}
            />
            <Tile
              titulo="Hook rate"
              valor={pct(m.hookRate)}
              objetivo={rangoTexto("hookRate", "pct")}
              evaluacion={evaluar("hookRate", m.hookRate)}
              nota="Reproducciones de 3 segundos sobre impresiones. Solo aplica a anuncios de video."
            />
            <Tile
              titulo="CTR de enlace"
              valor={pct(m.ctrEnlace)}
              objetivo={rangoTexto("ctr", "pct")}
              evaluacion={evaluar("ctr", m.ctrEnlace)}
            />
            <Tile
              titulo="Conversión de la landing"
              valor={pct(m.conversionLanding)}
              objetivo={rangoTexto("conversionLanding", "pct")}
              evaluacion={evaluar("conversionLanding", m.conversionLanding)}
              nota="Leads sobre clics al enlace."
            />
            <Tile
              titulo="Costo por lead"
              valor={usd(m.cplUsd)}
              objetivo={rangoTexto("cpl", "usd")}
              evaluacion={evaluar("cpl", m.cplUsd)}
            />
            <Tile
              titulo="Lead a agenda"
              valor={pct(m.leadAAgenda)}
              objetivo={rangoTexto("leadAAgenda", "pct")}
              evaluacion={evaluar("leadAAgenda", m.leadAAgenda)}
              nota={`${m.calificados} de ${m.leads} leads califican.`}
            />
            <Tile
              titulo="Asistencia a la demo"
              valor={pct(m.asistencia)}
              objetivo={rangoTexto("asistencia", "pct")}
              evaluacion={evaluar("asistencia", m.asistencia)}
            />
            <Tile
              titulo="Demo a cierre"
              valor={pct(m.demoACierre)}
              objetivo={rangoTexto("demoACierre", "pct")}
              evaluacion={evaluar("demoACierre", m.demoACierre)}
            />
            <Tile
              titulo="Ciclo de venta"
              valor={
                m.cicloVentaDias === null ? null : `${nf.format(m.cicloVentaDias)} días`
              }
              objetivo="Referencia del playbook: 60 a 75 días"
              nota="Mediana entre agendar la demo y cerrar. Si al día 45 medís el canal en clientes cerrados, vas a apagar algo que está funcionando."
            />
          </div>
        </section>

        <Embudo etapas={m.embudo} />

        <SerieDiaria metricas={m} />

        <TablaCreativos filas={m.porCreativo} />

        <footer className="space-y-2 border-t border-white/10 pt-6 text-xs leading-relaxed text-white/40">
          <p>
            Los objetivos salen de la tabla de control del playbook y son hipótesis de
            arranque, no promesas. A los 14 días de campaña se reemplazan por los números
            reales editando <code className="text-white/60">src/lib/dashboard/metas.ts</code>.
          </p>
          <p>
            Tipo de cambio de referencia: ARS {nfEntero.format(TIPO_DE_CAMBIO)} por USD. Si
            pagás Meta con tarjeta argentina, el costo real de la inversión es mayor por las
            percepciones impositivas, que acá no se ven.
          </p>
          <p>
            Un guion largo significa que todavía no hay datos suficientes para calcular ese
            número. No significa cero.
          </p>
        </footer>
      </div>
    </main>
  );
}
