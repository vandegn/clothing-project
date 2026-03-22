"use client";

import { memo } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import type { BlobConfig } from "./config";

interface CausticBlobProps {
  scrollY: MotionValue<number>;
  docHeight: number;
  config: BlobConfig;
}

function CausticBlobInner({ scrollY, docHeight, config }: CausticBlobProps) {
  const y = useTransform(
    scrollY,
    [0, docHeight || 1],
    [0, -(config.parallaxSpeed * (docHeight || 1))]
  );

  return (
    <motion.div
      className={`w-[${config.mobileSize.width}] h-[${config.mobileSize.height}] md:w-[${config.size.width}] md:h-[${config.size.height}]`}
      style={{
        position: "fixed",
        top: config.position.top,
        left: config.position.left,
        right: config.position.right,
        bottom: config.position.bottom,
        background: config.gradient,
        borderRadius: config.borderRadius,
        filter: `blur(${config.blur})`,
        opacity: config.opacity,
        pointerEvents: "none",
        zIndex: 0,
        willChange: "transform",
        y,
      }}
      animate={{
        rotate: config.drift.rotate,
        scale: config.drift.scale,
        x: config.drift.x,
      }}
      transition={{
        duration: config.drift.duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
      }}
    />
  );
}

export const CausticBlob = memo(CausticBlobInner);
