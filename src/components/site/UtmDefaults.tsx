"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Pone UTM por defecto en la URL cuando la persona llega sin ninguno.
 *
 * Lo usa /mx para que todo lo que salga de la página de un partner quede
 * atribuido a ese partner aunque el link se haya compartido sin parámetros.
 * Reescribe la URL con history.replaceState (sin recargar ni sumar una entrada
 * al historial), así buildDemoUrl la toma para Calendly, y guarda la
 * atribución para HubSpot (/api/lead). Esto último hay que hacerlo acá:
 * CapturaAtribucion corre antes, en el layout, y ve la URL todavía sin UTM.
 *
 * Tiene que montarse ANTES que SiteShell en el árbol: React corre los efectos
 * de los hermanos en orden, y el botón de la barra (DemoLink) arma su link en
 * su propio efecto. Si la persona ya trae UTM, no se toca nada.
 */
export default function UtmDefaults({ params }: { params: Record<string, string> }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    const hasUtm = [...url.searchParams.keys()].some((k) => k.startsWith("utm_"));
    if (hasUtm) return;
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
    window.history.replaceState(window.history.state, "", url.toString());
    captureAttribution(url.search);
  }, [params]);

  return null;
}
