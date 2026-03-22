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
