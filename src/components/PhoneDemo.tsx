"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import PhoneShowcase, {
  TOTAL_FRAMES,
} from "./remotion/PhoneShowcase";
import { SCREEN_COUNT, SCREEN_DURATION, FPS, SCREENSHOTS } from "./remotion/constants";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false, loading: () => <PhoneSkeleton /> },
);

function PhoneSkeleton() {
  return (
    <div
      className="animate-pulse rounded-[2.6rem] bg-gray-200"
      style={{ aspectRatio: "9/19.5", width: "100%", height: "100%" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Label config per screen                                            */
/* ------------------------------------------------------------------ */

interface ScreenLabel {
  text: string;
  side: "left" | "right";
  /** vertical position as percentage from top */
  top: string;
}

const SCREEN_LABELS: ScreenLabel[][] = [
  // Dashboard
  [
    { text: "KPIs en tiempo real", side: "right", top: "28%" },
    { text: "Todo de un vistazo", side: "left", top: "55%" },
  ],
  // Analytics
  [
    { text: "Reportes visuales", side: "left", top: "22%" },
    { text: "Decisiones con datos", side: "right", top: "52%" },
  ],
  // Checklist
  [
    { text: "Inspecciones digitales", side: "right", top: "20%" },
    { text: "Cero papel", side: "left", top: "48%" },
  ],
  // Menu
  [
    { text: "15+ módulos integrados", side: "left", top: "32%" },
    { text: "Todo en un solo lugar", side: "right", top: "60%" },
  ],
];

/* ------------------------------------------------------------------ */
/*  Connector line + animated label pill                               */
/* ------------------------------------------------------------------ */

const LINE_LENGTH = 32;
const DOT_R = 3;
const LINE_DRAW_DURATION = 0.4;
// HighlightBox starts at frame 15, draws for 40 frames → done at frame 55
// At 30fps that's ~1.83s. Labels start right as the box finishes.
const LABEL_BASE_DELAY = 1.5;
const LABEL_STAGGER = 0.2;

function ConnectorLine({
  isRight,
  delay,
}: {
  isRight: boolean;
  delay: number;
}) {
  const w = LINE_LENGTH + DOT_R * 2 + 2;
  const cy = DOT_R + 1;

  // SVG points: dot on phone side, line going outward
  const dotCx = isRight ? DOT_R + 1 : w - DOT_R - 1;
  const lineX1 = isRight ? DOT_R * 2 + 2 : 0;
  const lineX2 = isRight ? w : w - DOT_R * 2 - 2;

  return (
    <motion.svg
      width={w}
      height={cy * 2}
      className="absolute"
      style={{
        top: "50%",
        marginTop: -cy,
        ...(isRight ? { left: -w } : { right: -w }),
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.2, delay }}
    >
      {/* Dot at the phone edge */}
      <motion.circle
        cx={dotCx}
        cy={cy}
        r={DOT_R}
        fill="#3b82f6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay,
        }}
      />
      {/* Line that draws itself outward */}
      <motion.line
        x1={lineX1}
        y1={cy}
        x2={lineX2}
        y2={cy}
        stroke="rgba(59,130,246,0.5)"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          duration: LINE_DRAW_DURATION,
          ease: "easeOut",
          delay: delay + 0.1,
        }}
      />
    </motion.svg>
  );
}

function LabelPill({
  label,
  index,
  variant,
}: {
  label: ScreenLabel;
  index: number;
  variant: "mobile" | "desktop";
}) {
  const isRight = label.side === "right";
  const baseDelay = LABEL_BASE_DELAY + index * LABEL_STAGGER;
  const pillDelay = baseDelay + LINE_DRAW_DURATION + 0.1;
  const connectorGap = LINE_LENGTH + DOT_R * 2 + 16;

  if (variant === "mobile") {
    return (
      <motion.div
        className="pointer-events-none absolute z-20"
        style={{
          top: label.top,
          ...(isRight ? { right: -30 } : { left: -30 }),
        }}
        initial={{ opacity: 0, x: isRight ? 8 : -8 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isRight ? 4 : -4, transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.8, delay: pillDelay }}
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-primary/90 px-2.5 py-1 shadow-lg shadow-black/30 backdrop-blur-md">
          <span className="h-1 w-1 flex-shrink-0 rounded-full bg-accent" />
          <span className="whitespace-nowrap text-[9px] font-medium text-white">
            {label.text}
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={{
        top: label.top,
        ...(isRight
          ? { left: "100%", marginLeft: connectorGap }
          : { right: "100%", marginRight: connectorGap }),
      }}
      initial={{ opacity: 0, x: isRight ? 12 : -12, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRight ? 6 : -6, scale: 0.96, transition: { duration: 0.25, ease: "easeIn" } }}
      transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.8, delay: pillDelay }}
    >
      <div className="relative">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-1.5 shadow-lg shadow-black/20 backdrop-blur-md">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
          <span className="whitespace-nowrap text-[11px] font-medium text-white/90">
            {label.text}
          </span>
        </div>
        <ConnectorLine isRight={isRight} delay={baseDelay} />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const screenshotOrder = [
  SCREENSHOTS.dashboard,
  SCREENSHOTS.analytics,
  SCREENSHOTS.checklist,
  SCREENSHOTS.menu,
];

export default function PhoneDemo() {
  const [screenIndex, setScreenIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const screenDurationMs = (SCREEN_DURATION / FPS) * 1000;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScreenIndex((prev) => (prev + 1) % SCREEN_COUNT);
    }, screenDurationMs);
    return () => clearInterval(interval);
  }, [screenDurationMs]);

  return (
    <div className="relative mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-none">
      {/* Labels — mobile: overlapping phone edges */}
      <div className="pointer-events-none absolute inset-0 lg:hidden" style={{ overflow: "visible" }}>
        <AnimatePresence>
          {SCREEN_LABELS[screenIndex]?.map((label, i) => (
            <LabelPill
              key={`${screenIndex}-${i}`}
              label={label}
              index={i}
              variant="mobile"
            />
          ))}
        </AnimatePresence>
      </div>
      {/* Labels — desktop: outside phone with connectors */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block" style={{ overflow: "visible" }}>
        <AnimatePresence>
          {SCREEN_LABELS[screenIndex]?.map((label, i) => (
            <LabelPill
              key={`${screenIndex}-${i}`}
              label={label}
              index={i}
              variant="desktop"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Phone bezel */}
      <div className="rounded-[3rem] bg-gray-950 p-[6px] shadow-2xl ring-1 ring-white/10">
        {/* Notch */}
        <div className="relative z-10 mx-auto -mb-5 h-6 w-24 rounded-b-2xl bg-gray-950" />
        {/* Screen */}
        <div
          className="overflow-hidden rounded-[2.6rem] bg-gray-100"
          style={{ aspectRatio: "9/19.5" }}
        >
          {isDesktop ? (
            <Player
              component={PhoneShowcase}
              compositionWidth={360}
              compositionHeight={780}
              durationInFrames={TOTAL_FRAMES}
              fps={30}
              loop
              autoPlay
              controls={false}
              acknowledgeRemotionLicense
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            /* Mobile: smooth crossfade between static screenshots */
            <div className="relative h-full w-full">
              {screenshotOrder.map((src, i) => (
                <img
                  key={src}
                  src={`/${src}`}
                  alt="ShipSafe app"
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out"
                  style={{ opacity: i === screenIndex ? 1 : 0 }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
