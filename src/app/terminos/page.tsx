import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata: Metadata = {
  title: `Términos y Condiciones | ${SITE.name}`,
  description:
    "Términos y condiciones de uso de SHIPSAFE, software de seguridad e higiene laboral.",
  alternates: { canonical: "/terminos" },
};

export default function Terminos() {
  return (
    <>
      <GlobalBackground />
      <Navbar />
      <main className="relative z-10 pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-white/50">
            <Link href="/" className="transition-colors hover:text-white">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-white/70">Términos y Condiciones</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Términos y Condiciones
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Última actualización: 17 de abril de 2026
          </p>

          <div className="mt-10 space-y-8 text-white/75 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
            <section>
              <h2>1. Aceptación de los términos</h2>
              <p>
                Al acceder y utilizar SHIPSAFE (el &quot;Servicio&quot;),
                aceptás estos términos y condiciones. Si no estás de acuerdo,
                no utilices el Servicio.
              </p>
            </section>

            <section>
              <h2>2. Descripción del servicio</h2>
              <p>
                SHIPSAFE es un software de seguridad e higiene laboral que
                permite a empresas y profesionales gestionar inspecciones,
                desvíos, capacitaciones, mediciones ambientales y cumplimiento
                normativo de forma digital.
              </p>
            </section>

            <section>
              <h2>3. Registro y cuenta</h2>
              <p>
                Para usar el Servicio necesitás crear una cuenta proporcionando
                información veraz y actualizada. Sos responsable de mantener la
                confidencialidad de tus credenciales de acceso.
              </p>
            </section>

            <section>
              <h2>4. Uso aceptable</h2>
              <p>Te comprometés a:</p>
              <ul className="mt-3">
                <li>Usar el Servicio conforme a la legislación vigente</li>
                <li>No intentar acceder a cuentas o datos de otros usuarios</li>
                <li>
                  No usar el Servicio para fines ilegales o no autorizados
                </li>
                <li>Mantener la información de tu cuenta actualizada</li>
              </ul>
            </section>

            <section>
              <h2>5. Propiedad intelectual</h2>
              <p>
                SHIPSAFE, su código, diseño, marcas y contenido son propiedad de
                Ship Software Team. Los datos que cargues en la plataforma son
                de tu propiedad.
              </p>
            </section>

            <section>
              <h2>6. Disponibilidad del servicio</h2>
              <p>
                Nos esforzamos por mantener el Servicio disponible de forma
                continua, pero no garantizamos disponibilidad ininterrumpida.
                Podemos realizar mantenimientos programados con aviso previo.
              </p>
            </section>

            <section>
              <h2>7. Limitación de responsabilidad</h2>
              <p>
                SHIPSAFE es una herramienta de gestión y registro. La
                responsabilidad por el cumplimiento de la normativa de seguridad
                e higiene recae en la empresa y los profesionales habilitados. El
                software no reemplaza el criterio profesional.
              </p>
            </section>

            <section>
              <h2>8. Modificaciones</h2>
              <p>
                Podemos modificar estos términos en cualquier momento.
                Publicaremos los cambios en esta página y, si son significativos,
                te notificaremos por email.
              </p>
            </section>

            <section>
              <h2>9. Ley aplicable</h2>
              <p>
                Estos términos se rigen por las leyes de la República Argentina.
                Cualquier disputa será sometida a la jurisdicción de los
                tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
              </p>
            </section>

            <section>
              <h2>10. Contacto</h2>
              <p>
                Para consultas sobre estos términos, escribinos a{" "}
                <a
                  href="mailto:shipsoftwareteam@gmail.com"
                  className="text-accent underline underline-offset-2"
                >
                  shipsoftwareteam@gmail.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
