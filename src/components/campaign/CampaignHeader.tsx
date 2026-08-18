import Image from "next/image";

/**
 * Header minimalista de las landings de campaña (/demo, /prueba-gratis).
 * Solo el logo, sin links de menú: cada link extra es una fuga de conversión.
 *
 * Compartido entre landings: no depende del _data.ts de ninguna.
 */
export default function CampaignHeader() {
  return (
    <header className="relative z-20 mx-auto flex max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">
      <span className="flex items-center gap-2.5">
        <Image
          src="/shipsafe-logo.png"
          alt="SHIPSAFE"
          width={36}
          height={36}
          priority
          className="h-9 w-9"
        />
        <span className="font-display text-lg font-bold tracking-tight text-white">
          SHIPSAFE
        </span>
      </span>
    </header>
  );
}
