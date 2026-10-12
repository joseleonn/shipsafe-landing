"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { COOKIE_SESION, sesionValida } from "@/lib/dashboard/auth";
import { cambiarEstado, SLUG_VALIDO, type EstadoArticulo } from "@/lib/blog";

const ESTADOS: EstadoArticulo[] = ["borrador", "publicado", "descartado"];

/**
 * Publica, despublica o descarta un artículo desde /interno/blog.
 *
 * El middleware ya exige la sesión para todo /interno, pero una Server Action
 * se puede invocar por POST directo, así que se vuelve a verificar acá.
 */
export async function cambiarEstadoArticulo(formData: FormData) {
  const sesion = (await cookies()).get(COOKIE_SESION)?.value;
  if (!(await sesionValida(sesion))) redirect("/dashboard/login?volver=/interno/blog");

  const slug = String(formData.get("slug") ?? "");
  const estado = String(formData.get("estado") ?? "") as EstadoArticulo;
  if (!SLUG_VALIDO.test(slug) || !ESTADOS.includes(estado)) throw new Error("Pedido inválido");

  await cambiarEstado(slug, estado);

  // Sin deploy: la página pública, el índice, el sitemap y llms.txt se
  // regeneran en la próxima visita.
  revalidatePath(`/blog/${slug}`);
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/interno/blog");
  revalidatePath(`/interno/blog/${slug}`);
}
