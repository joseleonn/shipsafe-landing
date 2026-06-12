"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";

interface NumberTickerProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

export default function NumberTicker({
  value,
  suffix = "",
  duration = 1.6,
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  // SSR y reduced motion muestran el valor final directo (sin layout shift)
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!isInView || prefersReducedMotion) return;
    motionValue.set(0);
    const unsubscribe = motionValue.on("change", (v) =>
      setDisplay(Math.round(v))
    );
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
    });
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [isInView, prefersReducedMotion, motionValue, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
