"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const DottedSurface = dynamic(() => import("./ui/dotted-surface"), {
  ssr: false,
});

export default function GlobalBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <DottedSurface
        gridSize={isMobile ? 30 : 60}
        dotSize={isMobile ? 2 : 2.2}
        waveSpeed={isMobile ? 0.5 : 0.8}
      />
    </div>
  );
}
