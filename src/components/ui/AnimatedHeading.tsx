"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  /** Solo texto plano: se divide por palabras */
  children: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  delay?: number;
}

export default function AnimatedHeading({
  children,
  as: Tag = "h2",
  className,
  delay = 0,
}: AnimatedHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = children.split(" ");

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag className={cn("[&>span]:inline-block", className)} aria-label={children}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
          <motion.span
            aria-hidden="true"
            className="inline-block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.045,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && <span aria-hidden="true">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
