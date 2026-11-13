/**
 * Aviso de cierre obligatorio en toda página que cita normativa
 * (regla del 09/11/2026: claude/regla-normativa-verificada.md).
 */
export default function AvisoNormativa() {
  return (
    <p>
      <em>
        Este contenido resume lo que dicen las normas citadas, leídas en sus textos oficiales a
        la fecha de publicación, con fines informativos. Las normas cambian y puede haber
        requisitos locales, sectoriales o del cliente que no figuran acá. Antes de usarlo en una
        auditoría o una inspección, conviene verificar la versión vigente en la fuente oficial
        de cada país y consultar con el profesional de seguridad y salud en el trabajo de la
        empresa.
      </em>
    </p>
  );
}
