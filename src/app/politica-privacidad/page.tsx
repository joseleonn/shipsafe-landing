import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

export const metadata: Metadata = {
  title: `Política de Privacidad | ${SITE.name}`,
  description:
    "Política de privacidad de SHIPSAFE. Conocé cómo protegemos tus datos personales.",
  alternates: { canonical: "/politica-privacidad" },
};

export default function PoliticaPrivacidad() {
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
            <span className="text-white/70">Política de Privacidad</span>
          </nav>

          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Política de Privacidad
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Última actualización: 17 de abril de 2026
          </p>

          <div className="mt-10 space-y-8 text-white/75 leading-relaxed [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1">
            <section>
              <h2>1. Información que recopilamos</h2>
              <p>
                En SHIPSAFE recopilamos información que nos proporcionás
                voluntariamente al usar nuestro software de seguridad e higiene
                laboral, incluyendo:
              </p>
              <ul className="mt-3">
                <li>Nombre, email y datos de contacto al registrarte</li>
                <li>
                  Información de tu empresa (nombre, plantas, sectores)
                </li>
                <li>
                  Datos operativos ingresados en la plataforma (inspecciones,
                  desvíos, capacitaciones)
                </li>
                <li>
                  Datos de uso y navegación recopilados automáticamente
                  (cookies, dirección IP, tipo de dispositivo)
                </li>
              </ul>
            </section>

            <section>
              <h2>2. Cómo usamos tu información</h2>
              <p>Utilizamos la información recopilada para:</p>
              <ul className="mt-3">
                <li>Proveer y mejorar el servicio de SHIPSAFE</li>
                <li>Generar reportes e informes dentro de la plataforma</li>
                <li>Comunicarnos sobre actualizaciones o soporte técnico</li>
                <li>Analizar el uso del sitio web para mejorar la experiencia</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2>3. Protección de datos</h2>
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para
                proteger tu información, incluyendo encriptación en tránsito
                (TLS) y en reposo, backups automáticos diarios y control de
                acceso basado en roles.
              </p>
            </section>

            <section>
              <h2>4. Compartición de datos</h2>
              <p>
                No vendemos ni compartimos tu información personal con terceros
                con fines comerciales. Podemos compartir datos con:
              </p>
              <ul className="mt-3">
                <li>
                  Proveedores de infraestructura necesarios para operar el
                  servicio
                </li>
                <li>Autoridades cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h2>5. Cookies y tecnologías de seguimiento</h2>
              <p>
                Usamos Google Analytics para entender cómo se usa nuestro sitio
                web. Podés desactivar las cookies desde la configuración de tu
                navegador.
              </p>
            </section>

            <section>
              <h2>6. Tus derechos</h2>
              <p>
                Conforme a la Ley 25.326 de Protección de Datos Personales de
                Argentina, tenés derecho a acceder, rectificar y suprimir tus
                datos personales. Para ejercer estos derechos, contactanos a{" "}
                <a
                  href="mailto:shipsoftwareteam@gmail.com"
                  className="text-accent underline underline-offset-2"
                >
                  shipsoftwareteam@gmail.com
                </a>
                .
              </p>
            </section>

            <section>
              <h2>7. Cambios a esta política</h2>
              <p>
                Podemos actualizar esta política periódicamente. Publicaremos
                cualquier cambio en esta página con la fecha de actualización
                correspondiente.
              </p>
            </section>

            <section>
              <h2>8. Contacto</h2>
              <p>
                Si tenés preguntas sobre esta política de privacidad, escribinos
                a{" "}
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
