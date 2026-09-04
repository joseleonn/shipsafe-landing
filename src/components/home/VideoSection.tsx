"use client";

import { useState } from "react";
import Image from "next/image";
import Icon from "@/components/site/Icon";
import { SHOTS, YOUTUBE_ID } from "@/lib/home-content";
import { trackEvent, EVENTS } from "@/lib/analytics";

/** Póster con captura real; el iframe de YouTube se monta recién al click. */
export default function VideoSection() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="video" id="video">
      <div className="glow c" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head center">
          <div className="eyebrow num"><span>05</span>Por dentro</div>
          <h2>
            Mirá la plataforma <em>por dentro.</em>
          </h2>
          <p className="lede">Cómo se carga una inspección desde el celular, cómo se sigue un desvío hasta que se cierra y qué termina viendo la gerencia.</p>
        </div>
        {playing ? (
          <div className="player is-playing">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
              title="SHIPSAFE por dentro"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <button
            className="player"
            type="button"
            aria-label="Reproducir el video: la plataforma por dentro"
            onClick={() => { setPlaying(true); trackEvent(EVENTS.VSL_PLAY, { source: "home" }); }}
          >
            <Image src={SHOTS.dashboardCharts.src} alt="" width={SHOTS.dashboardCharts.width} height={SHOTS.dashboardCharts.height} sizes="(max-width: 900px) 100vw, 900px" />
            <span className="shade" />
            <span className="play"><Icon name="play" filled /></span>
            <span className="dur">1:30</span>
          </button>
        )}
      </div>
    </section>
  );
}
