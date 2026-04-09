"use client";

import dynamic from "next/dynamic";

const DottedSurface = dynamic(() => import("./ui/dotted-surface"), {
  ssr: false,
});

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <DottedSurface />
    </div>
  );
}
