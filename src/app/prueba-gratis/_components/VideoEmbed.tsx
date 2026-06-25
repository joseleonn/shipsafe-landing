"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { VSL } from "../_data";

/**
 * Reproductor del VSL, lazy a propósito: no descarga el reproductor (ni el
 * player de YouTube) hasta el primer play — clave para que la landing cargue
 * en menos de 3s con tráfico pago.
 *
 * Adapta el marco según el video:
 *  - "youtube" → horizontal 16:9
 *  - "mp4"      → vertical 9:16 (pensado para un VSL filmado en celular)
 *
 * Si VSL.available es false, muestra solo el poster (sin play que haga 404).
 */
export default function VideoEmbed() {
  const [playing, setPlaying] = useState(false);
  const isYoutube = VSL.type === "youtube";

  const aspect = isYoutube ? "16 / 9" : "9 / 16";
  // YouTube (16:9) ocupa todo el ancho del contenedor padre; el mp4 (9:16)
  // mantiene ancho de "celular".
  const widthClass = isYoutube ? "" : "max-w-[300px]";
  const frame = `relative mx-auto w-full ${widthClass} overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-accent/10`;

  const handlePlay = () => {
    trackEvent("vsl_play", { source: "prueba-gratis" });
    setPlaying(true);
  };

  // Poster: thumbnail externo de YouTube via <img> (evita configurar
  // remotePatterns en next.config); poster local via next/image.
  const Poster = ({ priority }: { priority?: boolean }) =>
    isYoutube ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={VSL.poster}
        alt="Mirá cómo funciona SHIPSAFE"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          // maxresdefault no siempre existe → caer a hqdefault
          e.currentTarget.src = VSL.poster.replace("maxresdefault", "hqdefault");
        }}
      />
    ) : (
      <Image
        src={VSL.poster}
        alt="Vista de la app SHIPSAFE"
        fill
        sizes="(max-width: 768px) 80vw, 300px"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        priority={priority}
      />
    );

  // Fallback: el VSL aún no está cargado → poster estático sin play.
  if (!VSL.available) {
    return (
      <div className={`${frame} group`} style={{ aspectRatio: aspect }}>
        <Poster priority />
      </div>
    );
  }

  if (!playing) {
    return (
      <button
        type="button"
        onClick={handlePlay}
        aria-label="Reproducir video"
        className={`${frame} group cursor-pointer`}
        style={{ aspectRatio: aspect }}
      >
        <Poster priority />
        <span className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/10" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40 transition-transform duration-300 group-hover:scale-110">
          <Play className="h-7 w-7 translate-x-0.5 fill-current" />
        </span>
      </button>
    );
  }

  if (isYoutube) {
    return (
      <div className={frame} style={{ aspectRatio: aspect }}>
        <iframe
          src={`${VSL.src}${VSL.src.includes("?") ? "&" : "?"}autoplay=1`}
          title="Video de SHIPSAFE"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className={frame} style={{ aspectRatio: aspect }}>
      <video
        src={VSL.src}
        poster={VSL.poster}
        controls
        autoPlay
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
