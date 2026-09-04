import Image from "next/image";
import type { Shot } from "@/lib/home-content";

/**
 * Marcos de producto. Las capturas son reales (tomadas de la app, 4/9/2026,
 * datos de prueba ocultos y DNI enmascarados). Nunca UI inventada.
 */
export function BrowserFrame({
  shot,
  sizes = "(max-width: 900px) 100vw, 700px",
  priority = false,
  live = false,
  className = "",
}: {
  shot: Extract<Shot, { kind: "browser" }>;
  sizes?: string;
  priority?: boolean;
  live?: boolean;
  className?: string;
}) {
  return (
    <div className={`browser ${className}`}>
      <div className="chrome">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="url">{shot.url}</span>
        {live && <span className="live">Producto real</span>}
      </div>
      <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} />
    </div>
  );
}

export function PhoneFrame({
  shot,
  sizes = "260px",
  priority = false,
  className = "",
}: {
  shot: Extract<Shot, { kind: "phone" }>;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`phone ${shot.short ? "short" : ""} ${className}`}>
      <div className="screen">
        <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} priority={priority} />
      </div>
    </div>
  );
}

export function ShotFrame({ shot, sizes, priority }: { shot: Shot; sizes?: string; priority?: boolean }) {
  return shot.kind === "browser" ? (
    <BrowserFrame shot={shot} sizes={sizes} priority={priority} className="frame" />
  ) : (
    <PhoneFrame shot={shot} sizes={sizes} priority={priority} className="frame" />
  );
}
