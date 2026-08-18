"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import AnimatedHeading from "./ui/AnimatedHeading";
import { HOME_VIDEO } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";

/**
 * VSL corto de la home, justo debajo del hero.
 *
 * Lazy a propósito: hasta el primer click no se descarga NADA de YouTube (ni el
 * iframe ni sus ~1MB de JS), solo el thumbnail. La home es la página que rankea
 * en orgánico, así que el video no puede pagarse con LCP ni con Core Web
 * Vitals. Mismo criterio que el VideoEmbed de /demo.
 *
 * La config (qué video, qué título) vive en HOME_VIDEO en constants.ts.
 */
export default function VideoIntro() {
  const [playing, setPlaying] = useState(false);

  if (!HOME_VIDEO.available) return null;

  const poster = `https://i.ytimg.com/vi/${HOME_VIDEO.youtubeId}/maxresdefault.jpg`;
  const embed = `https://www.youtube.com/embed/${HOME_VIDEO.youtubeId}?autoplay=1&rel=0`;

  const handlePlay = () => {
    trackEvent("vsl_play", { source: "home" });
    setPlaying(true);
  };

  return (
    <section id="video" className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="blur">
          <AnimatedHeading className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {HOME_VIDEO.title}
          </AnimatedHeading>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-white/75">
            {HOME_VIDEO.subtitle}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.15} variant="slideUp">
          <div className="relative mx-auto mt-12 max-w-4xl">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 rounded-full bg-accent/10 blur-[70px]"
            />

            <div
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-accent/10"
              style={{ aspectRatio: "16 / 9" }}
            >
              {playing ? (
                <iframe
                  src={embed}
                  title={HOME_VIDEO.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={`Reproducir: ${HOME_VIDEO.title}`}
                  className="group absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-inset"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={poster}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      // maxresdefault no existe para todos los videos → hqdefault.
                      e.currentTarget.src = poster.replace(
                        "maxresdefault",
                        "hqdefault"
                      );
                    }}
                  />
                  <span className="absolute inset-0 bg-primary/30 transition-colors duration-300 group-hover:bg-primary/20" />
                  <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/40 transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-7 w-7 translate-x-0.5 fill-current" />
                  </span>
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
