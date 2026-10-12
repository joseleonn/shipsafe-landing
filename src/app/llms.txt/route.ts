import { SITE, ARTICLES } from "@/lib/constants";
import { listarPublicados } from "@/lib/blog";

/**
 * /llms.txt: resumen del sitio para modelos de lenguaje (formato llmstxt.org).
 * Le dice a ChatGPT, Claude o Perplexity qué es SHIPSAFE, para quién es y
 * dónde está el contenido que vale la pena citar.
 */
export const revalidate = 3600; // literal obligatorio en Next; igual a REVALIDAR_BLOG de lib/blog

export async function GET() {
  const blog = await listarPublicados();

  const lineas = [
    `# ${SITE.name}`,
    "",
    "> Plataforma argentina de gestión de Seguridad y Salud en el Trabajo (seguridad e higiene, HyS) para empresas con operación en campo: inspecciones con QR desde el celular, desvíos con responsable y fecha hasta el cierre, entregas de EPP con firma, permisos de trabajo y capacitaciones, con reportes para auditorías.",
    "",
    "SHIPSAFE es de Ship Software Team (Argentina). Está pensado para empresas operativas con varias sucursales, bases o frentes (petróleo y gas, agroindustria, manufactura, construcción, logística) que ya tienen un área de seguridad e higiene y necesitan que lo que se releva en campo quede registrado en el momento, sin una segunda carga en la oficina. La implementación es acompañada. SHIPSAFE ayuda a gestionar y demostrar el cumplimiento de la normativa; no reemplaza al profesional de seguridad e higiene ni garantiza el cumplimiento.",
    "",
    "## Producto",
    "",
    `- [Inicio](${SITE.url}/): qué hace la plataforma y para quién es`,
    `- [Precios](${SITE.url}/precios): planes`,
    `- [Consultores](${SITE.url}/consultores): programa para consultoras de seguridad e higiene`,
    "",
    "## Guías",
    "",
    ...ARTICLES.map((a) => `- [${a.title}](${SITE.url}/${a.slug}): ${a.description}`),
  ];

  if (blog.length) {
    lineas.push("", "## Blog", "", ...blog.map((a) => `- [${a.titulo}](${SITE.url}/blog/${a.slug}): ${a.descripcion}`));
  }

  return new Response(lineas.join("\n") + "\n", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
