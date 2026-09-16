"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Guarda la atribución en cuanto alguien entra al sitio, en la página que sea.
 *
 * Antes esto lo hacía un solo formulario, el de /recurso. Pero los anuncios
 * mandan a /puesta-en-marcha, que usa otro formulario: ahí los UTM llegaban en
 * la URL, nadie los guardaba, y `getAttribution()` leía un localStorage vacío.
 * Resultado: todos los leads del anuncio entraban a HubSpot sin origen y el
 * dashboard los contaba como si hubieran llegado solos.
 *
 * Va montado en el layout raíz, al lado del pixel, porque la atribución es del
 * sitio y no de un formulario. Se lee `window.location.search` directo en vez
 * de `useSearchParams` para no forzar un Suspense ni sacar del prerender a
 * todas las páginas estáticas.
 */
export default function CapturaAtribucion() {
  useEffect(() => {
    captureAttribution(window.location.search);
  }, []);

  return null;
}
