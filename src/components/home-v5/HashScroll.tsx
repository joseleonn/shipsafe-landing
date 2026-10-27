"use client";

import { useEffect } from "react";

/**
 * Al llegar a la home desde otra página con un ancla (por ejemplo, el botón
 * "Volver al inicio" de /plataforma lleva a /#como-funciona), Next navega sin
 * recargar y a veces deja la página arriba. Esto baja a la sección pedida una
 * vez que la página terminó de pintarse.
 */
export default function HashScroll() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const go = () => document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    const t1 = window.setTimeout(go, 60);
    // Segundo intento por si las imágenes de arriba cambiaron la altura.
    const t2 = window.setTimeout(go, 600);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
  return null;
}
