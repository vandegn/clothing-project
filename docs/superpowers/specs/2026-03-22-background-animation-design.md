# Background Animation: Golden Caustics with Prismatic Ribbons

**Date:** 2026-03-22
**Status:** Reviewed
**Replaces:** Static floating orbs + gradient blurs in `page.tsx` (lines 27-33)

## Overview

Replace the current 3 floating orb dots and 2 static gradient blurs with a cinematic, scroll-reactive parallax light system. The animation evokes warm light refracting through a prism — directly tied to TrueColor's "light revealing your colors" brand story.

**Design principles:**
- Light & prismatic: warm caustics + faint prismatic color bands
- Scroll-driven parallax depth across 5 layers
- Bold and cinematic but never competing with upload UI or results
- GPU-accelerated, mobile-conscious

## Layer Architecture

5 fixed-position, pointer-events-none layers behind content (`z-0`):

| Layer | Element | Parallax Speed | Blur | Opacity |
|-------|---------|---------------|------|---------|
| L0 (deepest) | Large warm radial gradient (terracotta-light to cream) | 0.1x | 100px | ~0.15 |
| L1 | Sage-to-blush caustic blob, offset left | 0.25x | 80px | ~0.12 |
| L2 | Terracotta caustic blob, offset right | 0.4x | 60px | ~0.10 |
| L3 | 2-3 thin prismatic ribbons | 0.6x | 20px | 0.06-0.10 |
| L4 (nearest) | Warm radial highlight, top-right | 0.8x | 40px | Fades with scroll |

All layers use `position: fixed; inset: 0; z-index: 0` to avoid layout recalculation. The `BackgroundAnimation` wrapper itself gets `z-index: 0`. The noise overlay `::before` at `z-index: 1` renders above the background layers. The `<main>` content at `z-index: 10` renders above everything.

## Caustic Blob Design (L0-L2)

**Shape:** Organic rounded forms using asymmetric border-radius values (e.g., `30% 70% 60% 40% / 50% 30% 70% 50%`). Not perfect circles.

**Colors (palette-derived, pushed toward luminosity):**
- L0: `terracotta-light` to `cream` radial gradient
- L1: `sage` to `blush` radial gradient
- L2: `terracotta` to `transparent` radial gradient

**Perpetual drift animation (per-blob, infinite loop):**
- Rotation: `[0, 3, -2, 0]` over 10-14s
- Scale pulse: `[1, 1.05, 0.97, 1]` over 12-16s
- Position wander: `x: [0, 20, -15, 0]`, `y: [0, -15, 10, 0]`
- Easing: `type: "tween", ease: "easeInOut"` chosen for predictable looping behavior (spring is also viable with `repeat: Infinity` + `repeatType: "mirror"` in framer-motion v12, but tween gives more precise timing control for ambient loops)

## Prismatic Ribbons (L3)

**Shape:** 2-3 thin elongated divs (~800px wide, ~60px tall), rotated 15-30 degrees.

**Color:** Horizontal linear gradient cycling warm gold to blush to soft violet to sage.

**Behavior:**
- Very low opacity (0.06-0.10) with 20px blur — reads as faint light bands, not solid shapes
- Each ribbon has a different parallax rate so they spread apart on scroll
- Additional slow lateral `x` drift via `useTransform` creates diagonal movement

## Hero Highlight (L4)

**Shape:** Single large radial gradient (warm white/cream center to transparent), positioned top-right.

**Behavior:** Fades from full opacity to 0 as user scrolls past the hero (mapped to first ~500px of scroll). Simulates a directional light source illuminating the hero area.

## Motion Implementation

**Scroll tracking:**
- Single `useScroll()` hook in the top-level `BackgroundAnimation` component
- `scrollY` passed to each layer as a `MotionValue` (stable reference, no re-renders)
- Document height is read via `document.documentElement.scrollHeight` inside a `useEffect`, stored in a `useMotionValue` (not `useState` — avoids re-renders). A `ResizeObserver` on `document.body` keeps it in sync if page height changes (e.g., after images load in `BeforeAfterSection`)
- Each layer uses `useTransform(scrollY, [0, docHeight.get()], [0, -speed * docHeight.get()])` for parallax Y translation. The transform must be recalculated when `docHeight` changes — wrap in a `useEffect` that updates the transform input/output ranges

**Ribbon lateral drift:**
- `useTransform(scrollY, [0, docHeight.get()], [0, lateralOffset])` for horizontal shift on scroll

## Component Architecture

```
BackgroundAnimation.tsx ("use client")
  -- reads useScroll(), passes scrollY to children
  |
  +-- CausticBlob.tsx (React.memo) x3
  |     -- receives: scrollY (MotionValue), parallaxSpeed, config (module-level constant object)
  |     -- renders: motion.div with useTransform for parallax Y + infinite drift animation
  |
  +-- PrismaticRibbon.tsx (React.memo) x2-3
  |     -- receives: scrollY, parallaxSpeed, rotation, gradient
  |     -- renders: motion.div with useTransform for parallax Y + lateral X drift
  |
  +-- HeroHighlight.tsx (React.memo)
        -- receives: scrollY
        -- renders: motion.div with useTransform for scroll-driven opacity fadeout
```

**Render location:** `<BackgroundAnimation />` is rendered as a direct child of the outermost `<div>` in `page.tsx`, but **outside and before** the `overflow-hidden noise-overlay` wrapper. The page structure becomes:

```tsx
<>
  <BackgroundAnimation />
  <div className="min-h-screen bg-... relative overflow-hidden noise-overlay">
    <main className="relative z-10 ...">
      {/* page content */}
    </main>
  </div>
</>
```

This ensures fixed-position layers are not clipped by `overflow-hidden` and the noise overlay `::before` pseudo-element (z-index: 1) naturally sits above the background layers (z-index: 0). The `<main>` content at z-index: 10 stays on top of everything.

## Performance Guardrails

- Animate only `transform` and `opacity` (GPU-composited properties)
- All layers use `will-change: transform`
- Each animated element is `React.memo` isolated — no parent re-renders from motion values
- `useMotionValue` / `useTransform` operate outside React render cycle
- **Stable props:** All non-MotionValue props (gradient colors, positions, blur values) are defined as module-level constant objects outside the component tree, so `React.memo` shallow comparison works correctly. Never pass inline object literals to memoized children.
- Fixed positioning avoids layout thrashing on scroll

## Mobile Strategy

- **Desktop (md+):** All 5 layers active
- **Mobile (<md):** Reduce to 3 layers — keep L0, L1, L2 caustic blobs; hide L3 ribbons and L4 highlight via `hidden md:block`
- Caustic blob sizes reduced on mobile (smaller width/height values)

## What Gets Removed

From `page.tsx`:
- Lines 27-28: Two static gradient blur divs
- Lines 30-33: Three floating orb dots

From `globals.css`:
- `@keyframes float` and `.animate-float` can be removed if no other component uses them (verify first)

## Files to Create

- `frontend/src/components/BackgroundAnimation.tsx`
- `frontend/src/components/background/CausticBlob.tsx`
- `frontend/src/components/background/PrismaticRibbon.tsx`
- `frontend/src/components/background/HeroHighlight.tsx`

## Files to Modify

- `frontend/src/app/page.tsx` — remove old background elements, add `<BackgroundAnimation />`
