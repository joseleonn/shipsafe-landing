import type { ReactNode } from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { SCREEN_DURATION, FADE_FRAMES } from "./constants";

interface ScreenSlideProps {
  children: ReactNode;
  index: number;
}

/**
 * Wrapper that handles the fade + slide transition.
 * Uses a Remotion <Sequence> so children get a local frame starting at 0.
 */
export function ScreenSlide({ children, index }: ScreenSlideProps) {
  const start = index * SCREEN_DURATION;

  return (
    <Sequence from={start} durationInFrames={SCREEN_DURATION} layout="none">
      <SlideTransition>{children}</SlideTransition>
    </Sequence>
  );
}

/** Inner component that reads the local frame (0-based thanks to Sequence) */
function SlideTransition({ children }: { children: ReactNode }) {
  const localFrame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(localFrame, [0, FADE_FRAMES], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out
  const fadeOut = interpolate(
    localFrame,
    [SCREEN_DURATION - FADE_FRAMES, SCREEN_DURATION],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const opacity = Math.min(fadeIn, fadeOut);

  // Slide: enter from right, exit to left
  const slideIn = interpolate(localFrame, [0, FADE_FRAMES], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slideOut = interpolate(
    localFrame,
    [SCREEN_DURATION - FADE_FRAMES, SCREEN_DURATION],
    [0, -30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const translateX = localFrame < SCREEN_DURATION / 2 ? slideIn : slideOut;

  return (
    <AbsoluteFill
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
}
