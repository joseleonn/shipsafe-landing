import { useCurrentFrame, interpolate } from "remotion";

interface HighlightBoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  delay: number;
}

/** Pixels drawn per frame — consistent speed regardless of box size */
const DRAW_SPEED = 30; // px/frame

export function HighlightBox({ x, y, w, h, delay }: HighlightBoxProps) {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  if (localFrame < 0) return null;

  const perimeter = 2 * (w + h);
  const drawFrames = Math.ceil(perimeter / DRAW_SPEED);

  // Stroke draws from 0% to 100% at a constant visual speed
  const drawProgress = interpolate(
    localFrame,
    [0, drawFrames],
    [perimeter, 0],
    { extrapolateRight: "clamp" },
  );

  // Stroke fades in at the start
  const strokeOpacity = interpolate(localFrame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse right when the draw completes
  const glowOpacity = interpolate(
    localFrame,
    [drawFrames, drawFrames + 10, drawFrames + 25],
    [0, 0.7, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        pointerEvents: "none",
      }}
    >
      <svg
        width={w}
        height={h}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <rect
          x={1.5}
          y={1.5}
          width={w - 3}
          height={h - 3}
          rx={12}
          ry={12}
          fill="none"
          stroke="#2563eb"
          strokeWidth={2.5}
          strokeDasharray={perimeter}
          strokeDashoffset={drawProgress}
          opacity={strokeOpacity}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 12,
          boxShadow: `0 0 12px 4px rgba(37, 99, 235, ${glowOpacity * 0.5})`,
        }}
      />
    </div>
  );
}
