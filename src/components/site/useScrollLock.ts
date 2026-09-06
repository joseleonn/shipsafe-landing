"use client";

import { useEffect } from "react";

/**
 * Bloqueo de scroll que iOS respeta: mientras `on` es true el body queda fijo
 * en la posición actual, y al soltar se la devolvemos (sin el scroll suave
 * del html, que si no animaría la vuelta). Lo usan el menú mobile y el modal
 * de la demo. Si dos lo piden a la vez, React corre la limpieza del primero
 * antes de aplicar el segundo, así que no se pisan.
 */
export function useScrollLock(on: boolean) {
  useEffect(() => {
    if (!on) return;
    const html = document.documentElement;
    const body = document.body;
    const y = window.scrollY;
    const prev = { position: body.style.position, top: body.style.top, left: body.style.left, right: body.style.right, width: body.style.width, overflow: html.style.overflow, behavior: html.style.scrollBehavior };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    html.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      html.style.overflow = prev.overflow;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, y);
      html.style.scrollBehavior = prev.behavior;
    };
  }, [on]);
}
