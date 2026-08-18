"use client";

import { useEffect, useState } from "react";
import Magnetic from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { DEMO_URL, buildDemoUrl, CTA_LABEL } from "../_data";

interface CtaButtonProps {
  /** Sección desde la que se dispara, para medir en analytics */
  section: string;
  label?: string;
  /** "lg" para hero/cierre, "md" para CTAs intermedios */
  size?: "md" | "lg";
  /** Ocupa todo el ancho del contenedor (cards de precio) */
  fullWidth?: boolean;
  className?: string;
}

export default function CtaButton({
  section,
  label = CTA_LABEL,
  size = "lg",
  fullWidth = false,
  className,
}: CtaButtonProps) {
  const sizeClasses =
    size === "lg"
      ? "px-8 py-4 text-base sm:text-lg"
      : "px-7 py-3.5 text-sm sm:text-base";

  // Render del servidor usa DEMO_URL (UTM por defecto). Al montar, reemplazamos
  // por la URL de Calendly con los UTM/click-id reales del visitante.
  const [href, setHref] = useState(DEMO_URL);
  useEffect(() => {
    setHref(buildDemoUrl(window.location.search));
  }, []);

  return (
    <Magnetic className={fullWidth ? "w-full" : "w-fit"}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() =>
          trackEvent(EVENTS.GENERATE_LEAD, {
            source: "demo",
            section,
          })
        }
        className={cn(
          "group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-accent font-semibold text-white transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary active:scale-[0.98]",
          sizeClasses,
          fullWidth && "w-full",
          className
        )}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-accent to-blue-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative">
          {label}
        </span>
      </a>
    </Magnetic>
  );
}
