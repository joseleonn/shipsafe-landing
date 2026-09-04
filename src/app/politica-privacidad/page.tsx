import type { Metadata } from "next";
import { SITE, PROVEEDOR } from "@/lib/constants";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: `Política de Privacidad | ${SITE.name}`,
  description:
    "Qué datos personales trata SHIPSAFE, para qué, dónde están alojados y qué derechos tienen las personas sobre ellos. Ley 25.326.",
  alternates: { canonical: "/politica-privacidad" },
};

export default function PoliticaPrivacidad() {
  return (
    <LegalLayout
      title="Política de Privacidad de ShipSafe"
      version="Versión 1.0"
      borrador
      slug="/politica-privacidad"
    >
      <p>
        Esta política explica qué datos personales trata ShipSafe, para qué,
        dónde están y qué derechos tienen las personas sobre ellos. Se rige por
        la <strong>Ley 25.326 de Protección de Datos Personales</strong> y su
        Decreto Reglamentario 1558/2001.
      </p>

      <section>
        <h2>1. Quién es responsable de tus datos</h2>
        <p>
          Hay que distinguir dos roles, porque de eso depende a quién reclamar.
        </p>
        <p>
          <strong>
            La empresa donde trabajás es la responsable del tratamiento.
          </strong>{" "}
          Es quien decide qué datos cargar, para qué, y por cuánto tiempo. Si
          sos trabajador de una empresa que usa ShipSafe, tus derechos se
          ejercen ante ella.
        </p>
        <p>
          <strong>ShipSafe es el encargado del tratamiento.</strong> Trata los
          datos siguiendo las instrucciones de esa empresa, en los términos del{" "}
          <a href="/tratamiento-de-datos">Anexo de Tratamiento de Datos</a>. No
          los usa para fines propios.
        </p>
        <p>
          Esta distinción no es un tecnicismo para eludir responsabilidad:
          ShipSafe mantiene sus propias obligaciones de{" "}
          <strong>confidencialidad y seguridad</strong> (arts. 9 y 10 de la
          Ley), que son indelegables.
        </p>
      </section>

      <section>
        <h2>2. Qué datos se tratan</h2>

        <h3>De las personas con cuenta en el sistema</h3>
        <p>
          Nombre, correo electrónico, contraseña (guardada cifrada, nunca en
          texto plano), rol, organización a la que pertenecen y, cuando
          corresponde, matrícula profesional.
        </p>

        <h3>De los trabajadores de las organizaciones usuarias</h3>
        <p>
          La mayoría de las personas cuyos datos están en ShipSafe{" "}
          <strong>no tienen cuenta</strong>: sus datos los carga su empleador
          para cumplir con la normativa de Higiene y Seguridad. Según el caso:
        </p>
        <ul>
          <li>Nombre, apellido, DNI y CUIL</li>
          <li>Teléfono, correo electrónico y contacto de emergencia</li>
          <li>Puesto, sector, turno, antigüedad y fecha de ingreso</li>
          <li>
            <strong>Firma manuscrita</strong>, capturada como imagen
          </li>
          <li>
            <strong>Datos de salud</strong>, ver el punto siguiente
          </li>
        </ul>

        <h3>Datos de salud (datos sensibles)</h3>
        <p>
          Algunos de los registros que la normativa exige contienen{" "}
          <strong>datos sensibles</strong> en los términos del art. 2 de la Ley
          25.326:
        </p>
        <ul>
          <li>
            Zona del cuerpo afectada, tipo de lesión y días de baja, en
            expedientes de accidentes
          </li>
          <li>
            Códigos CIE-10 y CIUO-88 en denuncias de enfermedad profesional
          </li>
          <li>Fecha de diagnóstico y médico laboral interviniente</li>
          <li>Grupo sanguíneo y obra social, cuando la organización los carga</li>
          <li>
            Manifestaciones tempranas de enfermedad declaradas en protocolos de
            ergonomía
          </li>
        </ul>
        <p>
          Estos datos se tratan porque{" "}
          <strong>
            la normativa de Higiene y Seguridad obliga a registrarlos
          </strong>{" "}
          (resoluciones de la Superintendencia de Riesgos del Trabajo y Ley
          19.587), y con el único fin de confeccionar los registros que esa
          normativa exige.
        </p>

        <h3>Sobre las firmas</h3>
        <p>
          La firma se guarda como <strong>una imagen</strong>, del mismo modo
          que una fotocopia de una firma en papel.{" "}
          <strong>No se capturan datos biométricos</strong>: no se registran
          presión, velocidad, tiempos ni trazos. Antes de firmar, la aplicación
          muestra un aviso explicando exactamente esto.
        </p>

        <h3>Datos técnicos</h3>
        <p>
          Para operar el servicio se registran fechas y horas de acceso,
          dirección IP y navegador. Al aceptar los documentos legales se guardan
          la fecha, la dirección IP y el navegador: son la constancia de esa
          aceptación, y no se usan para nada más.
        </p>
      </section>

      <section>
        <h2>3. Dónde están los datos</h2>
        <p>
          <strong>Los datos se alojan en Brasil.</strong> La base de datos
          (Supabase, región São Paulo) y los servidores de aplicación (Fly.io,
          región São Paulo) están en territorio brasileño. Los archivos (firmas,
          fotos, documentos adjuntos) se guardan en Cloudflare R2, en
          almacenamiento privado.
        </p>
        <p>
          Esto constituye una{" "}
          <strong>transferencia internacional de datos</strong> en los términos
          del art. 12 de la Ley 25.326. Brasil cuenta con legislación de
          protección de datos personales (LGPD, Ley 13.709).
        </p>
      </section>

      <section>
        <h2>4. Análisis asistido por inteligencia artificial</h2>
        <p>
          ShipSafe ofrece una función opcional de{" "}
          <strong>análisis de causa raíz de accidentes</strong> que utiliza un
          proveedor de inteligencia artificial ubicado en{" "}
          <strong>Estados Unidos</strong>.
        </p>
        <p>Cuando esa función se usa:</p>
        <ul>
          <li>
            <strong>
              No se envían el nombre, el apellido ni el DNI
            </strong>{" "}
            de la persona accidentada.
          </li>
          <li>
            Sí se envían las circunstancias del hecho: descripción, sector,
            equipo involucrado, turno, zona del cuerpo afectada, antigüedad en
            el puesto y condiciones al momento del accidente.
          </li>
          <li>
            La descripción del hecho es <strong>texto libre</strong> que redacta
            un usuario. La aplicación advierte antes de enviar que ese texto no
            debe contener datos que identifiquen a la persona.
          </li>
        </ul>
        <p>
          La función es opcional: si no se usa, no se envía nada a ningún
          proveedor externo.
        </p>
      </section>

      <section>
        <h2>5. Con quién se comparten los datos</h2>
        <p>Con nadie, salvo:</p>
        <ul>
          <li>
            <strong>Proveedores de infraestructura</strong> necesarios para
            prestar el servicio: alojamiento de base de datos, servidores,
            almacenamiento de archivos, envío de correos y procesamiento de
            pagos.
          </li>
          <li>
            <strong>El proveedor de inteligencia artificial</strong>, únicamente
            si se usa la función descripta arriba y con el alcance allí
            indicado.
          </li>
          <li>
            <strong>Autoridades</strong>, cuando exista una orden que obligue a
            ello.
          </li>
        </ul>
        <p>
          <strong>
            Los datos no se venden, no se ceden con fines comerciales y no se
            usan para publicidad.
          </strong>
        </p>
      </section>

      <section>
        <h2>6. Cuánto tiempo se conservan</h2>
        <p>
          Mientras la organización usuaria mantenga la relación con ShipSafe, y
          después según lo previsto en el{" "}
          <a href="/tratamiento-de-datos">Anexo de Tratamiento de Datos</a>.
        </p>
        <p>
          Hay que tener presente algo:{" "}
          <strong>
            buena parte de estos registros son evidencia de cumplimiento
            normativo
          </strong>{" "}
          con plazos de conservación propios que fija la ley (constancias de
          entrega de EPP, capacitaciones, protocolos firmados). Esos registros
          no se eliminan mientras esa obligación esté vigente, aun cuando se
          solicite su supresión.
        </p>
      </section>

      <section>
        <h2>7. Tus derechos</h2>
        <p>
          La Ley 25.326 reconoce a toda persona los derechos de{" "}
          <strong>acceso, rectificación, actualización y supresión</strong> de
          sus datos personales.
        </p>
        <p>
          <strong>Si sos trabajador de una empresa que usa ShipSafe</strong>,
          esos derechos se ejercen ante tu empleador, que es el responsable del
          tratamiento. ShipSafe colabora con él para poder cumplirlos.
        </p>
        <p>
          <strong>Si tenés cuenta en ShipSafe</strong>, podés escribir a{" "}
          <a href={`mailto:${PROVEEDOR.emailLegal}`}>
            <strong>{PROVEEDOR.emailLegal}</strong>
          </a>
          .
        </p>
        <p>
          El titular de los datos puede además presentar una denuncia ante la{" "}
          <strong>Agencia de Acceso a la Información Pública</strong>, órgano de
          control de la Ley 25.326.
        </p>
        <blockquote>
          El titular de los datos personales tiene la facultad de ejercer el
          derecho de acceso al mismo en forma gratuita a intervalos no
          inferiores a seis meses, salvo que se acredite un interés legítimo al
          efecto, conforme lo establecido en el artículo 14, inciso 3 de la Ley
          25.326.
        </blockquote>
      </section>

      <section>
        <h2>8. Seguridad</h2>
        <p>
          Las medidas técnicas incluyen: cifrado del tráfico (HTTPS),
          contraseñas protegidas con Argon2, aislamiento entre organizaciones a
          nivel de base de datos, archivos en almacenamiento privado accesible
          solo mediante enlaces temporales, y una cadena de auditoría con
          verificación criptográfica sobre los registros y su evidencia.
        </p>
        <p>
          Ninguna medida elimina por completo el riesgo. Si ocurriera un
          incidente que afecte datos personales, se notificará a las
          organizaciones usuarias afectadas.
        </p>
      </section>

      <section>
        <h2>9. Cambios en esta política</h2>
        <p>
          Los cambios se publican como una <strong>versión nueva</strong> y se
          solicita aceptación. Las versiones anteriores se conservan.
        </p>
      </section>

      <section>
        <h2>10. Contacto</h2>
        <p>
          <a href={`mailto:${PROVEEDOR.emailLegal}`}>
            <strong>{PROVEEDOR.emailLegal}</strong>
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
