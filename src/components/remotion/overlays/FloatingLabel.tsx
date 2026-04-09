import { useCurrentFrame, spring, useVideoConfig } from "remotion";

interface FloatingLabelProps {
  text: string;
  x: number;
  y: number;
  delay: number;
  direction?: "left" | "right" | "up" | "down";
}

export function FloatingLabel({
  text,
  x,
  y,
  delay,
  direction = "up",
}: FloatingLabelProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame - delay;

  if (localFrame < 0) return null;

  const progress = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.8 },
  });

  const offsets: Record<string, { x: number; y: number }> = {
    left: { x: -20, y: 0 },
    right: { x: 20, y: 0 },
    up: { x: 0, y: -15 },
    down: { x: 0, y: 15 },
  };
  const offset = offsets[direction];
  const tx = offset.x * (1 - progress);
  const ty = offset.y * (1 - progress);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(${tx}px, ${ty}px)`,
        opacity: progress,
        background: "rgba(15, 23, 42, 0.85)",
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        padding: "5px 12px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        pointerEvents: "none",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      {text}
    </div>
  );
}
