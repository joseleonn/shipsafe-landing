import type { Metadata } from "next";
import { SITE, PROVEEDOR } from "@/lib/constants";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: `Términos y Condiciones | ${SITE.name}`,
  description:
    "Términos y condiciones de uso de SHIPSAFE, herramienta de registro y gestión documental de Higiene y Seguridad en el Trabajo.",
  alternates: { canonical: "/terminos" },
};

export default function Terminos() {
  return (
    <LegalLayout
      title="Términos y Condiciones de uso de ShipSafe"
      version="Versión 1.0"
      borrador
      slug="/terminos"
    >
      <p>
        Estos Términos regulan el uso de ShipSafe. Al aceptarlos, la
        organización que contrata el servicio y las personas que lo usan quedan
        alcanzadas por lo que sigue.
      </p>

      <section>
        <h2>1. Qué es ShipSafe</h2>
        <p>
          ShipSafe es una{" "}
          <strong>herramienta de registro y gestión documental</strong> de
          Higiene y Seguridad en el Trabajo. Permite cargar, organizar, firmar y
          exportar registros: checklists, desvíos, entregas de elementos de
          protección personal, capacitaciones, permisos de trabajo, protocolos
          de medición y expedientes de accidentes, entre otros.
        </p>
      </section>

      <section>
        <h2>2. Qué NO es ShipSafe</h2>
        <p>
          Esta sección es tan importante como la anterior, y conviene leerla
          completa.
        </p>
        <p>
          <strong>
            ShipSafe no presta servicios de asesoramiento en Higiene y
            Seguridad.
          </strong>{" "}
          No evalúa riesgos, no define medidas de control, no emite opinión
          profesional ni reemplaza al Servicio de Higiene y Seguridad ni al de
          Medicina del Trabajo que la normativa exige.
        </p>
        <p>
          <strong>ShipSafe no valida el contenido que se carga.</strong> Los
          datos, mediciones, respuestas, firmas y documentos los ingresa la
          organización usuaria a través de sus usuarios. ShipSafe los almacena y
          los presenta con el formato que corresponde, pero{" "}
          <strong>
            no verifica que sean correctos, completos, veraces ni suficientes
          </strong>{" "}
          para ningún fin.
        </p>
        <p>
          <strong>
            ShipSafe no garantiza el cumplimiento normativo de la organización
            usuaria.
          </strong>{" "}
          Que un documento se genere con ShipSafe no significa que ese documento
          cumpla con lo que exige la autoridad de aplicación en el caso
          concreto, ni que la organización esté en regla. El cumplimiento
          depende de qué se cargue, cómo se cargue, quién lo firme y qué se haga
          con el resultado, y nada de eso lo controla ShipSafe.
        </p>
        <p>
          <strong>
            Los documentos que ShipSafe genera se presentan bajo exclusiva
            responsabilidad de quien los presenta.
          </strong>{" "}
          ShipSafe produce documentos en los formatos que la normativa establece
          (protocolos de medición, planillas del Protocolo de Ergonomía,
          constancias de entrega de EPP, entre otros). Quien decide presentarlos
          ante una autoridad, y quien los firma, asume la responsabilidad por su
          contenido.
        </p>
      </section>

      <section>
        <h2>3. Cuentas y responsabilidad sobre los usuarios</h2>
        <p>
          La organización usuaria administra sus propios usuarios: los da de
          alta, les asigna un rol y los da de baja. Es responsable de:
        </p>
        <ul>
          <li>
            Que cada persona con acceso sea quien corresponde y tenga el rol que
            corresponde.
          </li>
          <li>Dar de baja los accesos de quienes dejan de necesitarlos.</li>
          <li>El uso que sus usuarios hagan del servicio.</li>
          <li>
            La confidencialidad de las credenciales. Las credenciales son
            personales e intransferibles.
          </li>
        </ul>
      </section>

      <section>
        <h2>4. Datos que la organización carga</h2>
        <p>
          La organización usuaria es{" "}
          <strong>responsable del tratamiento</strong> de los datos personales
          que carga en ShipSafe, incluidos los de sus trabajadores. ShipSafe
          actúa como <strong>encargado del tratamiento</strong>, en los términos
          del Anexo de Tratamiento de Datos que forma parte de estos Términos.
        </p>
        <p>
          En particular, la organización usuaria declara que cuenta con base
          legal suficiente para tratar los datos que carga y para encomendar su
          tratamiento a ShipSafe.
        </p>
      </section>

      <section>
        <h2>5. Disponibilidad del servicio</h2>
        <p>
          ShipSafe se presta <strong>según disponibilidad</strong>. Se hacen
          esfuerzos razonables para mantener el servicio en funcionamiento, pero
          no se garantiza disponibilidad ininterrumpida ni ausencia de errores.
        </p>
        <p>
          El servicio puede interrumpirse por mantenimiento, por fallas de
          proveedores de infraestructura o por causas ajenas. Cuando sea
          previsible, se avisará con anticipación razonable.
        </p>
        <p>
          <strong>La aplicación puede funcionar sin conexión</strong> para
          algunas operaciones y sincronizar después. Esa capacidad es una
          comodidad, no una garantía: la organización usuaria debe verificar que
          los registros hechos sin conexión se hayan sincronizado.
        </p>
      </section>

      <section>
        <h2>6. Alcance de la obligación de ShipSafe</h2>
        <p>
          Lo primero no es un límite de responsabilidad sino una{" "}
          <strong>definición de qué se contrata</strong>, que es distinto:
          ShipSafe se obliga a{" "}
          <strong>poner a disposición una herramienta de registro</strong> que
          funcione según lo descripto, y no a producir un resultado de
          cumplimiento normativo.
        </p>
        <p>
          Esa distinción recorre todo este contrato. Concretamente,{" "}
          <strong>no forma parte del objeto</strong>:
        </p>
        <ul>
          <li>
            Evaluar riesgos, definir medidas de control o emitir opinión
            profesional en Higiene y Seguridad.
          </li>
          <li>
            Verificar que el contenido cargado sea correcto, completo, veraz o
            suficiente.
          </li>
          <li>
            Garantizar que la organización usuaria esté en regla ante ninguna
            autoridad.
          </li>
        </ul>
        <p>
          Sobre las consecuencias de una falla imputable a ShipSafe, y{" "}
          <strong>en la medida en que la ley lo permita</strong>, la
          responsabilidad total acumulada no excederá el monto abonado por la
          organización usuaria en los DOCE (12) meses anteriores al hecho.
        </p>
        <p>
          <strong>
            Los límites de esta cláusula no operan cuando la ley no lo admite.
          </strong>{" "}
          En particular:
        </p>
        <ul>
          <li>
            <strong>No alcanzan al dolo ni a la culpa grave.</strong>
          </li>
          <li>
            No se aplican en la medida en que resulten cláusulas abusivas
            conforme al{" "}
            <strong>art. 988 del Código Civil y Comercial</strong>, que en los
            contratos por adhesión tiene por no escritas las cláusulas que
            restringen los derechos del adherente.
          </li>
          <li>
            No se aplican cuando la relación quede alcanzada por la{" "}
            <strong>Ley 24.240 de Defensa del Consumidor</strong>, lo que puede
            ocurrir, entre otros casos, con organizaciones que califiquen como
            micro, pequeñas o medianas empresas, cuyo art. 37 tiene por no
            convenidas las cláusulas que restringen derechos del consumidor.
          </li>
        </ul>
        <p>
          Se deja constancia expresa de esto en vez de escribir un límite
          absoluto: un límite que la ley no admite no protege a nadie y solo
          hace menos claro el resto del contrato.
        </p>
      </section>

      <section>
        <h2>7. Qué valor tienen las firmas capturadas</h2>
        <p>
          ShipSafe permite capturar firmas manuscritas en pantalla y las
          conserva junto al registro correspondiente. Es importante entender qué
          son y qué no son.
        </p>
        <p>
          Se trata de <strong>firma electrónica</strong> en los términos de la{" "}
          <strong>Ley 25.506</strong>, no de firma digital. La diferencia tiene
          consecuencias prácticas: la firma digital goza de una presunción legal
          de autoría e integridad, de modo que <strong>quien la impugna</strong>{" "}
          debe probar la falsedad. La firma electrónica{" "}
          <strong>no tiene esa presunción</strong>: si alguien la desconoce,{" "}
          <strong>quien la invoca debe acreditar su autenticidad</strong>.
        </p>
        <p>
          Lo que ShipSafe sí aporta, y conviene tenerlo presente porque es donde
          está el valor:
        </p>
        <ul>
          <li>
            La firma se guarda asociada al registro, con fecha y hora de
            captura.
          </li>
          <li>
            Los registros y su evidencia se encadenan con{" "}
            <strong>verificación criptográfica (SHA-256)</strong>, lo que
            permite demostrar que un documento no fue alterado después de
            emitido.
          </li>
        </ul>
        <p>
          Eso ayuda a acreditar <strong>integridad</strong>. No sustituye a la
          prueba de <strong>autoría</strong>, que sigue correspondiendo a quien
          invoque la firma.
        </p>
      </section>

      <section>
        <h2>8. Propiedad</h2>
        <p>
          El software, su código, su diseño y su documentación pertenecen a
          ShipSafe. La organización usuaria recibe una licencia de uso no
          exclusiva e intransferible mientras dure la relación.
        </p>
        <p>
          <strong>Los datos cargados son de la organización usuaria.</strong>{" "}
          ShipSafe no adquiere derechos sobre ellos y no los usa para fines
          distintos de prestar el servicio.
        </p>
      </section>

      <section>
        <h2>9. Exportación y baja</h2>
        <p>
          Mientras el servicio esté activo, la organización usuaria puede
          exportar sus datos desde la aplicación en los formatos disponibles.
        </p>
        <p>
          Al terminar la relación, la organización usuaria puede solicitar una
          copia de sus datos dentro de los TREINTA (30) días corridos. Vencido
          ese plazo, ShipSafe podrá eliminarlos según lo previsto en el Anexo de
          Tratamiento de Datos.
        </p>
      </section>

      <section>
        <h2>10. Derecho de revocación</h2>
        <p>
          Cuando la contratación se realice <strong>a distancia</strong>, por la
          web, sin presencia simultánea de las partes, y la organización usuaria
          quede alcanzada por la <strong>Ley 24.240</strong>, tiene derecho a
          revocar la aceptación dentro de los{" "}
          <strong>DIEZ (10) días corridos</strong> contados desde la celebración
          del contrato, sin expresar causa y sin costo alguno (art. 34 de la Ley
          24.240 y art. 1.110 del Código Civil y Comercial).
        </p>
        <p>
          Ese derecho <strong>es irrenunciable</strong>: ninguna cláusula de
          este contrato lo limita.
        </p>
        <p>
          Para ejercerlo alcanza con usar el{" "}
          <a href="/arrepentimiento">botón de arrepentimiento</a> disponible en
          el sitio de ShipSafe o escribir a{" "}
          <a href={`mailto:${PROVEEDOR.emailLegal}`}>{PROVEEDOR.emailLegal}</a>. No
          se requiere registración previa ni ningún trámite adicional, y dentro
          de las VEINTICUATRO (24) horas se informará el código de
          identificación de la revocación, conforme a la{" "}
          <strong>Disposición 954/2025</strong> de la Subsecretaría de Defensa
          del Consumidor y Lealtad Comercial.
        </p>
      </section>

      <section>
        <h2>11. Modificaciones</h2>
        <p>
          ShipSafe puede modificar estos Términos. Las modificaciones se
          publican como una <strong>versión nueva</strong> y se solicita
          aceptación antes de seguir usando el servicio. Las versiones
          anteriores se conservan y siguen respaldando las aceptaciones que se
          hicieron sobre ellas.
        </p>
      </section>

      <section>
        <h2>12. Ley aplicable y jurisdicción</h2>
        <p>
          Estos Términos se rigen por las leyes de la República Argentina.
        </p>
        <p>
          Para las controversias que <strong>no</strong> queden alcanzadas por
          la Ley 24.240 de Defensa del Consumidor, las partes se someten a los
          tribunales ordinarios de la Ciudad de Rosario, Provincia de Santa Fe.
        </p>
        <p>
          <strong>
            Cuando la relación quede alcanzada por la Ley 24.240, esta cláusula
            no se aplica.
          </strong>{" "}
          El art. 36 de esa ley establece que, en las acciones iniciadas por el
          proveedor, es competente el tribunal del domicilio real del
          consumidor, y declara <strong>nulo cualquier pacto en contrario</strong>
          . Prevalece la ley por sobre lo pactado acá.
        </p>
      </section>

      <section>
        <h2>13. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos Términos:{" "}
          <a href={`mailto:${PROVEEDOR.emailLegal}`}>
            <strong>{PROVEEDOR.emailLegal}</strong>
          </a>
        </p>
      </section>
    </LegalLayout>
  );
}
