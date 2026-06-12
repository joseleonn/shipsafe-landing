"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

interface MagneticProps {
  children: ReactNode;
  /** Cuánto se desplaza hacia el cursor (0 a 1) */
  strength?: number;
  className?: string;
}

const MAX_SHIFT = 6;

export default function Magnetic({
  children,
  strength = 0.25,
  className,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 300, damping: 20 });
  const y = useSpring(rawY, { stiffness: 300, damping: 20 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    const rect = el.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) * strength;
    const offsetY = (e.clientY - rect.top - rect.height / 2) * strength;
    rawX.set(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, offsetX)));
    rawY.set(Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, offsetY)));
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
