# Background Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace static floating orbs with a cinematic 5-layer parallax light system using framer-motion.

**Architecture:** A single `BackgroundAnimation` client component renders 3 caustic blobs, 2-3 prismatic ribbons, and a hero highlight — all `position: fixed` behind content. Each child is a `React.memo`-isolated component receiving a stable `MotionValue` for scroll-driven parallax. Perpetual drift animations run outside React's render cycle.

**Tech Stack:** Next.js 16, React 19, framer-motion 12, Tailwind CSS 4

**Spec:** `docs/superpowers/specs/2026-03-22-background-animation-design.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `frontend/src/components/background/CausticBlob.tsx` | Single memoized caustic blob with parallax + infinite drift |
| Create | `frontend/src/components/background/PrismaticRibbon.tsx` | Single memoized prismatic ribbon with parallax + lateral drift |
| Create | `frontend/src/components/background/HeroHighlight.tsx` | Scroll-fading radial highlight |
| Create | `frontend/src/components/background/config.ts` | Module-level constants: blob configs, ribbon configs, gradient values |
| Create | `frontend/src/components/BackgroundAnimation.tsx` | Orchestrator: `useScroll`, `docHeight` tracking, renders all layers |
| Modify | `frontend/src/app/page.tsx` | Remove old orbs/blurs, restructure wrapper, add `<BackgroundAnimation />` |

---

## Task 1: Create layer configuration constants

**Files:**
- Create: `frontend/src/components/background/config.ts`

- [ ] **Step 1: Create `config.ts` with all layer constants**

```ts
// Module-level constants — stable references for React.memo children

export interface BlobConfig {
  id: string;
  gradient: string;
  position: { top?: string; left?: string; right?: string; bottom?: string };
  size: { width: string; height: string };
  mobileSize: { width: string; height: string };
  borderRadius: string;
  blur: string;
  opacity: number;
  parallaxSpeed: number;
  drift: {
    rotate: number[];
    scale: number[];
    x: number[];
    duration: number;
  };
}

export interface RibbonConfig {
  id: string;
  gradient: string;
  width: string;
  height: string;
  rotation: number;
  position: { top: string; left: string };
  blur: string;
  opacity: number;
  parallaxSpeed: number;
  lateralOffset: number;
}

export const BLOB_CONFIGS: BlobConfig[] = [
  {
    id: "caustic-l0",
    gradient:
      "radial-gradient(circle, var(--color-terracotta-light) 0%, var(--color-cream) 70%, transparent 100%)",
    position: { top: "-10%", right: "-5%" },
    size: { width: "700px", height: "700px" },
    mobileSize: { width: "400px", height: "400px" },
    borderRadius: "30% 70% 60% 40% / 50% 30% 70% 50%",
    blur: "100px",
    opacity: 0.15,
    parallaxSpeed: 0.1,
    drift: {
      rotate: [0, 3, -2, 0],
      scale: [1, 1.05, 0.97, 1],
      x: [0, 20, -15, 0],

      duration: 14,
    },
  },
  {
    id: "caustic-l1",
    gradient:
      "radial-gradient(circle, var(--color-sage) 0%, var(--color-blush) 60%, transparent 100%)",
    position: { top: "30%", left: "-10%" },
    size: { width: "600px", height: "600px" },
    mobileSize: { width: "350px", height: "350px" },
    borderRadius: "60% 40% 30% 70% / 40% 60% 50% 50%",
    blur: "80px",
    opacity: 0.12,
    parallaxSpeed: 0.25,
    drift: {
      rotate: [0, -2, 3, 0],
      scale: [1, 0.97, 1.04, 1],
      x: [0, -20, 15, 0],

      duration: 12,
    },
  },
  {
    id: "caustic-l2",
    gradient:
      "radial-gradient(circle, var(--color-terracotta) 0%, transparent 70%)",
    position: { top: "60%", right: "-8%" },
    size: { width: "500px", height: "500px" },
    mobileSize: { width: "300px", height: "300px" },
    borderRadius: "40% 60% 50% 50% / 60% 40% 70% 30%",
    blur: "60px",
    opacity: 0.1,
    parallaxSpeed: 0.4,
    drift: {
      rotate: [0, 2, -3, 0],
      scale: [1, 1.03, 0.98, 1],
      x: [0, 15, -20, 0],

      duration: 10,
    },
  },
];

export const RIBBON_CONFIGS: RibbonConfig[] = [
  {
    id: "ribbon-0",
    gradient:
      "linear-gradient(90deg, #D4A06A, var(--color-blush), #B8A0D4, var(--color-sage))",
    width: "800px",
    height: "60px",
    rotation: 18,
    position: { top: "25%", left: "-5%" },
    blur: "20px",
    opacity: 0.08,
    parallaxSpeed: 0.55,
    lateralOffset: 100,
  },
  {
    id: "ribbon-1",
    gradient:
      "linear-gradient(90deg, var(--color-sage), #D4A06A, var(--color-blush), #B8A0D4)",
    width: "700px",
    height: "50px",
    rotation: -15,
    position: { top: "55%", left: "10%" },
    blur: "20px",
    opacity: 0.06,
    parallaxSpeed: 0.65,
    lateralOffset: -80,
  },
];

export const HERO_HIGHLIGHT = {
  gradient:
    "radial-gradient(circle at 70% 30%, rgba(255,255,245,0.6) 0%, transparent 60%)",
  parallaxSpeed: 0.8,
  fadeScrollRange: [0, 500] as [number, number],
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/components/background/config.ts
git commit -m "feat: add background animation layer configuration constants"
```

---

## Task 2: Build CausticBlob component

**Files:**
- Create: `frontend/src/components/background/CausticBlob.tsx`

- [ ] **Step 1: Create `CausticBlob.tsx`**

```tsx
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

// Note: Tailwind v4 supports arbitrary values in class names. The mobile-first
// sizing (mobileSize by default, config.size at md+) is applied via className
// instead of style to leverage responsive breakpoints. Width/height are removed
// from style since className handles them.

export const CausticBlob = memo(CausticBlobInner);
```

- [ ] **Step 2: Verify it compiles**

Run: `cd frontend && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to CausticBlob

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/background/CausticBlob.tsx
git commit -m "feat: add CausticBlob parallax component"
```

---

## Task 3: Build PrismaticRibbon component

**Files:**
- Create: `frontend/src/components/background/PrismaticRibbon.tsx`

- [ ] **Step 1: Create `PrismaticRibbon.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it compiles**

Run: `cd frontend && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to PrismaticRibbon

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/background/PrismaticRibbon.tsx
git commit -m "feat: add PrismaticRibbon parallax component"
```

---

## Task 4: Build HeroHighlight component

**Files:**
- Create: `frontend/src/components/background/HeroHighlight.tsx`

- [ ] **Step 1: Create `HeroHighlight.tsx`**

```tsx
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
```

- [ ] **Step 2: Verify it compiles**

Run: `cd frontend && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to HeroHighlight

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/background/HeroHighlight.tsx
git commit -m "feat: add HeroHighlight scroll-fading component"
```

---

## Task 5: Build BackgroundAnimation orchestrator

**Files:**
- Create: `frontend/src/components/BackgroundAnimation.tsx`

- [ ] **Step 1: Create `BackgroundAnimation.tsx`**

```tsx
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
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
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
```

Note: `docHeight` uses `useState` with a lazy initializer (reads `scrollHeight` on first client render, falls back to 3000 for SSR). This avoids the flash of no-background on initial paint. The `ResizeObserver` keeps it in sync as images load or content changes. Re-renders from `docHeight` changes are infrequent (resize/image load only). `BLOB_CONFIGS` and `RIBBON_CONFIGS` are module-level constants, so `React.memo` on children prevents re-renders from other causes.

- [ ] **Step 2: Verify it compiles**

Run: `cd frontend && npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/BackgroundAnimation.tsx
git commit -m "feat: add BackgroundAnimation orchestrator with scroll parallax"
```

---

## Task 6: Integrate into page.tsx and remove old elements

**Files:**
- Modify: `frontend/src/app/page.tsx:1-34`

- [ ] **Step 1: Update page.tsx imports**

Add at the top of the imports:
```tsx
import BackgroundAnimation from "@/components/BackgroundAnimation";
```

- [ ] **Step 2: Restructure the page wrapper**

Replace lines 24-34 (the opening `<div>` with background elements) with:

```tsx
  return (
    <>
      <BackgroundAnimation />
      <div className="min-h-screen bg-[var(--color-cream)] dark:bg-[#0F0E0D] relative overflow-hidden noise-overlay">
        <main className="relative z-10 container mx-auto px-6 pt-24 pb-16 max-w-6xl">
```

This removes:
- The two static gradient blur divs (old lines 27-28)
- The three floating orb dots (old lines 30-33)
- Adds `<BackgroundAnimation />` as a sibling before the page wrapper, inside a fragment

Note: `.animate-gradient` (used on the old line 27 blur div) becomes dead code in `globals.css` after this change. Leave it for now — it can be cleaned up in a follow-up if no other page uses it.

Also update the closing tags at the bottom of the return to close the fragment:

Change the final closing `</div>` structure so the return ends with:
```tsx
      </main>
    </div>
  </>
```

- [ ] **Step 3: Verify build succeeds**

Run: `cd frontend && npm run build 2>&1 | tail -20`
Expected: Build completes without errors

- [ ] **Step 4: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: integrate background animation, remove static orbs"
```

---

## Task 7: Visual verification and tuning

- [ ] **Step 1: Start dev server and verify visually**

Run: `cd frontend && npm run dev`

Open `http://localhost:3000` in a browser. Verify:
- Three caustic blobs are visible as soft, blurred color washes
- Blobs have slow perpetual drift (rotation + scale + position)
- On scroll: layers move at different speeds (parallax depth effect)
- Prismatic ribbons are faintly visible on desktop, hidden on mobile
- Hero highlight fades out as you scroll past the first viewport
- Content (hero text, upload button, cards) remains fully readable
- Noise overlay texture is visible on top of the caustic layers
- No horizontal scrollbar appears
- No jank or frame drops on scroll

- [ ] **Step 2: Test mobile viewport**

Resize browser to 375px width. Verify:
- Only 3 caustic blobs visible (ribbons and highlight hidden)
- Blobs use reduced sizes
- No overflow or horizontal scroll
- Content remains accessible

- [ ] **Step 3: Tune opacity/blur/position values if needed**

If layers are too prominent or too subtle, adjust values in `config.ts`. The constants are centralized there for exactly this purpose. Target: atmospheric glow you notice subconsciously, with prismatic ribbons as faint accents.

- [ ] **Step 4: Final commit after tuning**

```bash
git add -A
git commit -m "feat: tune background animation opacity and positioning"
```
