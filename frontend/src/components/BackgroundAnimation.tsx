"use client";

import { useEffect, useState } from "react";
import { useScroll } from "framer-motion";
import { CausticBlob } from "./background/CausticBlob";
import { PrismaticRibbon } from "./background/PrismaticRibbon";
import { HeroHighlight } from "./background/HeroHighlight";
import { BLOB_CONFIGS, RIBBON_CONFIGS } from "./background/config";

export default function BackgroundAnimation() {
  const { scrollY } = useScroll();
  const [docHeight, setDocHeight] = useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.scrollHeight
      : 3000
  );

  useEffect(() => {
    const updateHeight = () => {
      setDocHeight(document.documentElement.scrollHeight);
    };

    const observer = new ResizeObserver(updateHeight);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "var(--background)",
      }}
    >
      {BLOB_CONFIGS.map((config) => (
        <CausticBlob
          key={config.id}
          scrollY={scrollY}
          docHeight={docHeight}
          config={config}
        />
      ))}
      {RIBBON_CONFIGS.map((config) => (
        <PrismaticRibbon
          key={config.id}
          scrollY={scrollY}
          docHeight={docHeight}
          config={config}
        />
      ))}
      <HeroHighlight scrollY={scrollY} docHeight={docHeight} />
    </div>
  );
}
