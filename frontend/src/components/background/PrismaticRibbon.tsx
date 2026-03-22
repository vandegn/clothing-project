"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { RibbonConfig } from "./config";

interface PrismaticRibbonProps {
  scrollY: MotionValue<number>;
  docHeight: number;
  config: RibbonConfig;
}

function PrismaticRibbonInner({
  scrollY,
  docHeight,
  config,
}: PrismaticRibbonProps) {
  const y = useTransform(
    scrollY,
    [0, docHeight || 1],
    [0, -(config.parallaxSpeed * (docHeight || 1))]
  );

  const x = useTransform(
    scrollY,
    [0, docHeight || 1],
    [0, config.lateralOffset]
  );

  return (
    <motion.div
      className="hidden md:block"
      style={{
        position: "fixed",
        top: config.position.top,
        left: config.position.left,
        width: config.width,
        height: config.height,
        background: config.gradient,
        borderRadius: "999px",
        filter: `blur(${config.blur})`,
        opacity: config.opacity,
        rotate: config.rotation,
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
        y,
        x,
      }}
    />
  );
}

export const PrismaticRibbon = memo(PrismaticRibbonInner);
