"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { HERO_HIGHLIGHT } from "./config";

interface HeroHighlightProps {
  scrollY: MotionValue<number>;
  docHeight: number;
}

function HeroHighlightInner({ scrollY, docHeight }: HeroHighlightProps) {
  const opacity = useTransform(
    scrollY,
    HERO_HIGHLIGHT.fadeScrollRange,
    [1, 0]
  );

  const y = useTransform(
    scrollY,
    [0, docHeight || 1],
    [0, -(HERO_HIGHLIGHT.parallaxSpeed * (docHeight || 1))]
  );

  return (
    <motion.div
      className="hidden md:block"
      style={{
        position: "fixed",
        inset: 0,
        background: HERO_HIGHLIGHT.gradient,
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
        opacity,
        y,
      }}
    />
  );
}

export const HeroHighlight = memo(HeroHighlightInner);
