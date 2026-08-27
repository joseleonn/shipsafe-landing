import type { Metadata } from "next";
import { SITE } from "@/lib/constants";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: `Anexo de Tratamiento de Datos Personales | ${SITE.name}`,
  description:
    "Anexo que regula el tratamiento de datos personales que SHIPSAFE realiza por cuenta de la organización usuaria, conforme al art. 25 de la Ley 25.326.",
  alternates: { canonical: "/tratamiento-de-datos" },
};

const SUBENCARGADOS = [
  ["Supabase", "Base de datos", "Brasil (São Paulo)"],
  ["Fly.io", "Servidores de aplicación", "Brasil (São Paulo)"],
  ["Cloudflare R2", "Almacenamiento de archivos", "Distribuido"],
  ["Proveedor de correo", "Notificaciones", "—"],
  ["Mercado Pago", "Procesamiento de pagos", "Argentina"],
  ["Proveedor de IA", "Análisis de causa raíz (opcional)", "Estados Unidos"],
];

export default function TratamientoDeDatos() {
  return (
    <LegalLayout
      title="Anexo de Tratamiento de Datos Personales"
      version="Versión 1.0"
      borrador
      slug="/tratamiento-de-datos"
    >
      <p>
        Este Anexo integra los{" "}
        <a href="/terminos">Términos y Condiciones de ShipSafe</a> y regula el
        tratamiento de datos personales que ShipSafe realiza por cuenta de la
        organización usuaria, conforme al{" "}
        <strong>art. 25 de la Ley 25.326</strong>.
      </p>

      <section>
        <h2>1. Roles de las partes</h2>
        <p>
          <strong>
            La organización usuaria es RESPONSABLE del tratamiento.
          </strong>{" "}
          Decide qué datos personales cargar, con qué finalidad, y por cuánto
          tiempo. Es quien debe contar con base legal para tratarlos.
        </p>
        <p>
          <strong>ShipSafe es ENCARGADO del tratamiento.</strong> Trata esos
          datos únicamente por cuenta y según instrucciones de la organización
          usuaria, con el alcance de este Anexo.
        </p>
        <p>
          ShipSafe <strong>no trata los datos para finalidades propias</strong>,
          no los cede a terceros fuera de lo previsto acá, y no los utiliza para
          elaborar perfiles ni para entrenar modelos.
        </p>
      </section>

      <section>
        <h2>2. Objeto y finalidad</h2>
        <p>
          ShipSafe trata los datos con la única finalidad de{" "}
          <strong>prestar el servicio</strong>: almacenar, organizar, mostrar,
          firmar y exportar los registros de Higiene y Seguridad que la
          organización usuaria carga.
        </p>
      </section>

      <section>
        <h2>3. Categorías de datos y de titulares</h2>
        <p>
          <strong>Titulares:</strong> usuarios con cuenta en ShipSafe, y
          trabajadores y contratistas de la organización usuaria cuyos datos
          ésta cargue.
        </p>
        <p>
          Hay que hacer notar algo que la organización usuaria debe tener
          presente:{" "}
          <strong>la mayoría de los titulares no son usuarios del sistema</strong>
          . Sus datos los carga el empleador y no tienen relación directa con
          ShipSafe. Es el empleador quien debe informarles y contar con base
          legal.
        </p>
        <p>
          <strong>Categorías de datos:</strong>
        </p>
        <ul>
          <li>Identificación: nombre, apellido, DNI, CUIL, legajo</li>
          <li>Contacto: teléfono, correo electrónico, contacto de emergencia</li>
          <li>Laborales: puesto, sector, turno, antigüedad, fecha de ingreso</li>
          <li>Firma manuscrita, como imagen</li>
          <li>
            <strong>Datos sensibles de salud</strong>: zona del cuerpo afectada,
            tipo de lesión, días de baja, códigos CIE-10 y CIUO-88, diagnóstico,
            grupo sanguíneo, obra social
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Datos sensibles</h2>
        <p>
          El tratamiento de datos de salud está sujeto a las restricciones de
          los <strong>arts. 7 y 8 de la Ley 25.326</strong>.
        </p>
        <p>
          ShipSafe los trata <strong>exclusivamente</strong> porque la normativa
          de Higiene y Seguridad obliga a la organización usuaria a
          registrarlos, y con el único fin de confeccionar los registros que esa
          normativa exige.{" "}
          <strong>
            Corresponde a la organización usuaria acreditar la base legal
          </strong>{" "}
          de ese tratamiento.
        </p>
      </section>

      <section>
        <h2>5. Subencargados</h2>
        <p>
          ShipSafe recurre a los siguientes proveedores, que actúan como
          subencargados:
        </p>
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/15 text-left text-white/60">
                <th className="py-2 pr-4 font-medium">Proveedor</th>
                <th className="py-2 pr-4 font-medium">Servicio</th>
                <th className="py-2 font-medium">Ubicación</th>
              </tr>
            </thead>
            <tbody>
              {SUBENCARGADOS.map(([proveedor, servicio, ubicacion]) => (
                <tr key={proveedor} className="border-b border-white/5">
                  <td className="py-2 pr-4 text-white/90">{proveedor}</td>
                  <td className="py-2 pr-4">{servicio}</td>
                  <td className="py-2">{ubicacion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          ShipSafe informará con antelación razonable cualquier alta o cambio de
          subencargado que trate datos personales.
        </p>
      </section>

      <section>
        <h2>6. Transferencias internacionales</h2>
        <p>
          El alojamiento en <strong>Brasil</strong> constituye transferencia
          internacional (art. 12 de la Ley 25.326). Brasil cuenta con
          legislación de protección de datos personales (LGPD, Ley 13.709).
        </p>
        <p>
          El <strong>análisis por inteligencia artificial</strong> implica
          transferencia a <strong>Estados Unidos</strong>, y está sujeto a estas
          condiciones:
        </p>
        <ul>
          <li>
            Es <strong>opcional</strong>: solo ocurre si un usuario de la
            organización usa esa función.
          </li>
          <li>
            <strong>No se transmiten nombre, apellido ni DNI</strong> de la
            persona involucrada.
          </li>
          <li>
            Se transmiten las circunstancias del hecho, que pueden incluir datos
            de salud no asociados a una identidad.
          </li>
          <li>
            La aplicación advierte, en el momento de usar la función, que el
            texto libre no debe contener datos identificatorios.
          </li>
        </ul>
      </section>

      <section>
        <h2>7. Medidas de seguridad</h2>
        <p>ShipSafe aplica, como mínimo:</p>
        <ul>
          <li>Cifrado del tráfico en tránsito (HTTPS)</li>
          <li>Contraseñas protegidas con Argon2</li>
          <li>
            Aislamiento entre organizaciones a nivel de base de datos (Row Level
            Security)
          </li>
          <li>
            Archivos en almacenamiento privado, accesibles solo mediante enlaces
            temporales
          </li>
          <li>Control de acceso por roles</li>
          <li>
            Cadena de auditoría con verificación criptográfica sobre registros y
            evidencia
          </li>
          <li>Registro de altas, bajas y modificaciones de usuarios</li>
        </ul>
      </section>

      <section>
        <h2>8. Deber de confidencialidad</h2>
        <p>
          ShipSafe y su personal están obligados al{" "}
          <strong>secreto profesional</strong> respecto de los datos tratados,
          conforme al <strong>art. 10 de la Ley 25.326</strong>. La obligación
          subsiste aun después de terminada la relación.
        </p>
      </section>

      <section>
        <h2>9. Colaboración con los derechos de los titulares</h2>
        <p>
          Cuando un titular ejerza sus derechos de acceso, rectificación,
          actualización o supresión ante la organización usuaria, ShipSafe
          colaborará para hacerlos efectivos, dentro de los plazos de la Ley.
        </p>
        <p>
          <strong>Límite a la supresión:</strong> los registros que constituyen
          evidencia de cumplimiento normativo (constancias de entrega de EPP,
          capacitaciones, protocolos firmados, expedientes de accidentes) tienen
          plazos de conservación fijados por la legislación laboral y de riesgos
          del trabajo. Mientras esa obligación esté vigente, esos registros no
          se eliminan. Corresponde a la organización usuaria, como responsable,
          evaluar cada pedido a la luz de esos plazos.
        </p>
      </section>

      <section>
        <h2>10. Incidentes de seguridad</h2>
        <p>
          Ante un incidente que afecte datos personales, ShipSafe notificará a
          la organización usuaria <strong>sin dilación indebida</strong>, con la
          información disponible sobre qué ocurrió, qué datos pudieron verse
          afectados y qué medidas se tomaron.
        </p>
      </section>

      <section>
        <h2>11. Devolución y eliminación al terminar</h2>
        <p>
          Al terminar la relación, la organización usuaria dispone de{" "}
          <strong>TREINTA (30) días corridos</strong> para solicitar una copia
          completa de sus datos en formato de uso común.
        </p>
        <p>
          Vencido ese plazo, ShipSafe eliminará los datos, salvo aquellos que
          deba conservar por obligación legal, en cuyo caso se conservan
          bloqueados, sin tratamiento activo, hasta que ese plazo venza.
        </p>
      </section>

      <section>
        <h2>12. Auditoría</h2>
        <p>
          La organización usuaria puede solicitar, con antelación razonable y no
          más de una vez por año calendario, información sobre las medidas de
          seguridad aplicadas.
        </p>
      </section>

      <section>
        <h2>13. Vigencia</h2>
        <p>
          Este Anexo rige mientras dure la relación contractual, y sus
          obligaciones de confidencialidad y de eliminación de datos subsisten
          después de terminada.
        </p>
      </section>
    </LegalLayout>
  );
}
