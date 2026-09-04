"use client";

import { useEffect, useState } from "react";

/**
 * prefers-reduced-motion sin desajuste de hidratación.
 * `useReducedMotion` de framer-motion lee matchMedia en el primer render del
 * cliente, así que el HTML del servidor (null) no coincide con el del cliente
 * (true) cuando el visitante tiene la preferencia activa → error #418.
 * Acá el primer render siempre devuelve false y el valor real llega en un efecto.
 */
export function useReduce() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return reduce;
}
