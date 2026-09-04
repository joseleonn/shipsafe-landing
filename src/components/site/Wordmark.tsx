import Image from "next/image";

/**
 * Marca SHIPSAFE: isotipo + wordmark bicolor (SHIP en navy, SAFE en el azul de
 * la marca), igual que en la aplicación.
 */
export default function Wordmark({ priority = false, size = 28 }: { priority?: boolean; size?: number }) {
  return (
    <>
      <Image src="/shipsafe-logo.png" alt="" width={size} height={size} priority={priority} />
      <span className="wordmark" aria-hidden="true">
        SHIP<b>SAFE</b>
      </span>
      <span className="sr-only">SHIPSAFE</span>
    </>
  );
}
