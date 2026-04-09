"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DottedSurface = dynamic(() => import("./ui/dotted-surface"), {
  ssr: false,
});

export default function GlobalBackground() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      {isDesktop ? (
        <DottedSurface />
      ) : (
        /* Static radial gradient on mobile — no JS animation overhead */
        <div
          className="h-full w-full"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, rgba(37,99,235,0.08) 0%, transparent 70%)",
          }}
        />
      )}
    </div>
  );
}
