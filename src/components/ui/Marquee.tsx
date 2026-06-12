import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: string[];
  /** Duración del loop en segundos */
  speed?: number;
  className?: string;
}

export default function Marquee({ items, speed = 40, className }: MarqueeProps) {
  // Cada copia repite los items para cubrir viewports anchos sin huecos en el loop
  const repeated = [...items, ...items, ...items];

  const pills = (ariaHidden: boolean) => (
    <div
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "flex shrink-0 items-center gap-3 pr-3",
        ariaHidden && "motion-reduce:hidden"
      )}
    >
      {repeated.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={cn(
            "whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-white/60",
            // En reduced-motion la copia visible no repite: solo los items originales
            !ariaHidden && i >= items.length && "motion-reduce:hidden"
          )}
        >
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center"
        style={{ animationDuration: `${speed}s` }}
      >
        {pills(false)}
        {pills(true)}
      </div>
    </div>
  );
}
