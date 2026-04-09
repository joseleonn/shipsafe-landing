import { useCurrentFrame, interpolate } from "remotion";

interface TapIndicatorProps {
  x: number;
  y: number;
  delay: number;
}

export function TapIndicator({ x, y, delay }: TapIndicatorProps) {
  const frame = useCurrentFrame();
  const localFrame = frame - delay;

  if (localFrame < 0 || localFrame > 25) return null;

  const scale = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(localFrame, [0, 5, 20, 25], [0, 0.6, 0.6, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
        borderRadius: "50%",
        background: "rgba(37, 99, 235, 0.35)",
        border: "2px solid rgba(37, 99, 235, 0.6)",
        transform: `scale(${scale})`,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
}
