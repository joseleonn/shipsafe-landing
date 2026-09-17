import type { Metadata } from "next";
import Link from "next/link";
import Cotizador from "./Cotizador";
import { TARIFA, type Tarifa } from "@/lib/cotizador";

/**
 * Cotizador interno. Herramienta, no página de marketing: se abre durante una
 * llamada para cotizar en vivo.
 *
 * `robots: noindex` como en /puesta-en-marcha, y además el middleware exige la
 * sesión del dashboard para todo /interno. La URL tampoco se linkea desde
 * ningún lado público ni entra al sitemap.
 */
export const metadata: Metadata = {
  title: "Cotizador | SHIPSAFE",
  robots: { index: false, follow: false },
};

/**
 * Las constantes se pueden pisar por entorno y bajan a la página por props.
 * Es la única forma de tenerlas fuera del código si el repositorio se vuelve
 * público: un componente de cliente no puede leer process.env, y meterlas en
 * una variable NEXT_PUBLIC_ las publicaría en todos los bundles, que es
 * exactamente lo contrario de lo que queremos.
 */
function tarifaDelEntorno(): Tarifa {
  const num = (v: string | undefined, def: number) => {
    const n = Number(v);
    return Number.isFinite(n) && v !== undefined && v !== "" ? n : def;
  };
  return {
    base: num(process.env.COTIZADOR_BASE, TARIFA.base),
    establecimientoEnterprise: num(process.env.COTIZADOR_ESTABLECIMIENTO_ENTERPRISE, TARIFA.establecimientoEnterprise),
    equipoEnterprise: num(process.env.COTIZADOR_EQUIPO_ENTERPRISE, TARIFA.equipoEnterprise),
    setupUsuario: num(process.env.COTIZADOR_SETUP_USUARIO, TARIFA.setupUsuario),
    setupEstablecimiento: num(process.env.COTIZADOR_SETUP_ESTABLECIMIENTO, TARIFA.setupEstablecimiento),
    setupEquipo: num(process.env.COTIZADOR_SETUP_EQUIPO, TARIFA.setupEquipo),
  };
}

export default function Page() {
  return (
    <main className="min-h-screen bg-primary px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Cotizador</h1>
            <p className="mt-1 text-sm text-white/50">
              Uso interno. No compartas esta pantalla ni estos números con un cliente.
            </p>
          </div>
          <Link href="/dashboard" className="text-sm text-white/45 underline-offset-4 hover:text-white/75 hover:underline">
            Ir al dashboard
          </Link>
        </header>

        <Cotizador tarifa={tarifaDelEntorno()} />
      </div>
    </main>
  );
}
