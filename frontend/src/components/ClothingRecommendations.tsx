"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, animate } from "framer-motion";
import { ColorPalette, Gender } from "@/lib/types";
import { getAmazonSearchUrl } from "@/lib/api";

interface ClothingRecommendationsProps {
  palette: ColorPalette[];
  gender: Gender;
}

interface DragInfo {
  color: ColorPalette;
  imagePath: string;
  originX: number;
  originY: number;
  width: number;
  height: number;
}

function getClothingImagePath(gender: Gender, colorName: string, category: "tops" | "bottoms"): string {
  const genderLabel = gender === "female" ? "Womens" : "Mens";
  const safeName = colorName.replace(/\s+/g, "_");
  const cat = category === "tops" ? "Top" : "Bottom";
  return `/clothing-images/${genderLabel}_${safeName}_${cat}.jpg`;
}

export default function ClothingRecommendations({ palette, gender }: ClothingRecommendationsProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<"tops" | "bottoms">("tops");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);
  const [isOverTray, setIsOverTray] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const trayRef = useRef<HTMLDivElement>(null);
  const phantomX = useMotionValue(0);
  const phantomY = useMotionValue(0);
  const startPointer = useRef({ x: 0, y: 0 });
  const isOverTrayRef = useRef(false);
  const dragInfoRef = useRef<DragInfo | null>(null);

  // Keep refs in sync for closure access
  isOverTrayRef.current = isOverTray;
  dragInfoRef.current = dragInfo;

  const showTray = hoveredIndex !== null || dragInfo !== null;
  const isDragging = dragInfo !== null && !accepted;

  const navigateToTryOn = useCallback(async (color: ColorPalette) => {
    const imagePath = getClothingImagePath(gender, color.name, selectedCategory);
    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        sessionStorage.setItem("tryOnClothingImage", reader.result as string);
        sessionStorage.setItem("tryOnClothingType", selectedCategory === "tops" ? "top" : "bottom");
        router.push("/tryon");
      };
      reader.readAsDataURL(blob);
    } catch {
      sessionStorage.setItem("tryOnClothingType", selectedCategory === "tops" ? "top" : "bottom");
      router.push("/tryon");
    }
  }, [gender, selectedCategory, router]);

  const handlePointerDown = useCallback((e: React.PointerEvent, color: ColorPalette, imagePath: string) => {
    e.preventDefault();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    startPointer.current = { x: e.clientX, y: e.clientY };
    phantomX.set(0);
    phantomY.set(0);
    setDragInfo({
      color,
      imagePath,
      originX: rect.left,
      originY: rect.top,
      width: rect.width,
      height: rect.height,
    });
    setIsOverTray(false);
    setAccepted(false);
  }, [phantomX, phantomY]);

  // Global pointer tracking during drag
  useEffect(() => {
    if (!dragInfo || accepted) return;

    const handleMove = (e: PointerEvent) => {
      phantomX.set(e.clientX - startPointer.current.x);
      phantomY.set(e.clientY - startPointer.current.y);

      if (trayRef.current && dragInfoRef.current) {
        const trayRect = trayRef.current.getBoundingClientRect();
        const info = dragInfoRef.current;
        const cx = info.originX + phantomX.get() + info.width / 2;
        const cy = info.originY + phantomY.get() + info.height / 2;
        const over = cx > trayRect.left && cy > trayRect.top && cy < trayRect.bottom;

        if (over !== isOverTrayRef.current) {
          setIsOverTray(over);
        }
      }
    };

    const handleUp = () => {
      const info = dragInfoRef.current;
      if (isOverTrayRef.current && info) {
        setAccepted(true);
        // Animate phantom into tray center
        if (trayRef.current) {
          const trayRect = trayRef.current.getBoundingClientRect();
          const targetX = trayRect.left + trayRect.width / 2 - info.originX - info.width / 2;
          const targetY = trayRect.top + trayRect.height / 2 - info.originY - info.height / 2;
          animate(phantomX, targetX, { type: "spring", stiffness: 400, damping: 30 });
          animate(phantomY, targetY, { type: "spring", stiffness: 400, damping: 30 });
        }
        setTimeout(() => navigateToTryOn(info.color), 550);
      } else {
        // Spring back to origin
        animate(phantomX, 0, { type: "spring", stiffness: 200, damping: 22 });
        animate(phantomY, 0, { type: "spring", stiffness: 200, damping: 22 });
        setTimeout(() => {
          if (dragInfoRef.current?.imagePath === info?.imagePath) {
            setDragInfo(null);
          }
        }, 350);
      }
    };

    const handleCancel = () => {
      phantomX.set(0);
      phantomY.set(0);
      setDragInfo(null);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);
    };
  }, [dragInfo, accepted, phantomX, phantomY, navigateToTryOn]);

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 p-8 animate-fade-up delay-400">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[var(--color-terracotta)]" />
              <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
                Shop Your Colors
              </span>
            </div>
            <h3 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
              Wardrobe Recommendations
            </h3>
          </div>

          {/* Category toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)]">
            {(["tops", "bottoms"] as const).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${selectedCategory === category
                    ? "bg-white dark:bg-[var(--color-charcoal-soft)] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] shadow-sm"
                    : "text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]"
                  }
                `}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Color cards grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {palette.map((color, index) => {
            const imagePath = getClothingImagePath(gender, color.name, selectedCategory);
            const isHovered = hoveredIndex === index;
            const isBeingDragged = dragInfo?.imagePath === imagePath;

            return (
              <div
                key={index}
                className="group flex flex-col"
                style={{ animationDelay: `${index * 60}ms` }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Color marker */}
                <div className="flex items-center gap-2 mb-2.5 px-0.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 transition-transform duration-300"
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: `0 0 0 1.5px ${color.hex}40`,
                      transform: isHovered ? "scale(1.25)" : "scale(1)",
                    }}
                  />
                  <span className="text-xs font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] truncate tracking-tight">
                    {color.name}
                  </span>
                </div>

                {/* Image — draggable */}
                <div
                  className={`relative overflow-hidden rounded-2xl bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)] cursor-grab active:cursor-grabbing select-none touch-none transition-all duration-300 ${
                    isBeingDragged ? "opacity-25 scale-[0.96]" : ""
                  }`}
                  onPointerDown={(e) => handlePointerDown(e, color, imagePath)}
                  style={{
                    boxShadow: isHovered && !isBeingDragged
                      ? `0 12px 28px -4px ${color.hex}30, 0 4px 12px -2px rgba(0,0,0,0.08)`
                      : "0 1px 3px rgba(0,0,0,0.04)",
                    transform: isHovered && !isBeingDragged ? "translateY(-3px)" : "translateY(0)",
                  }}
                >
                  <div className="aspect-[3/4] w-full">
                    <img
                      src={imagePath}
                      alt={`${color.name} ${selectedCategory}`}
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Action links */}
                <div className="flex items-center gap-3 mt-2 px-0.5">
                  <button
                    onClick={() => navigateToTryOn(color)}
                    className="text-[11px] text-[var(--color-stone)] hover:text-[var(--color-terracotta)] cursor-pointer active:scale-[0.97] transition-colors duration-200"
                  >
                    Try on
                  </button>
                  <span className="text-[var(--color-stone-light)]/40 text-[10px]">|</span>
                  <a
                    href={getAmazonSearchUrl(color.name, selectedCategory, gender)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] text-[var(--color-stone)] hover:text-[var(--color-terracotta)] active:scale-[0.97] transition-colors duration-200"
                  >
                    Amazon
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-[var(--color-stone-light)]/15">
          <p className="text-xs text-[var(--color-stone-light)] text-center">
            Drag a garment to the tray to try it on, or use the links below
          </p>
        </div>
      </div>

      {/* ── Drag Phantom ── */}
      <AnimatePresence>
        {dragInfo && (
          <motion.div
            key={dragInfo.imagePath}
            className="fixed pointer-events-none rounded-2xl overflow-hidden"
            style={{
              left: dragInfo.originX,
              top: dragInfo.originY,
              width: dragInfo.width,
              height: dragInfo.height,
              x: phantomX,
              y: phantomY,
              zIndex: 45,
            }}
            initial={{ scale: 1, opacity: 0.95 }}
            animate={
              accepted
                ? { scale: 0.15, opacity: 0 }
                : {
                    scale: 1.06,
                    opacity: 1,
                    rotate: isOverTray ? -3 : 0,
                  }
            }
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <img
              src={dragInfo.imagePath}
              alt=""
              className="w-full h-full object-contain bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)]"
              draggable={false}
            />
            <div
              className="absolute inset-0 rounded-2xl"
              style={{
                boxShadow: `0 20px 50px -10px ${dragInfo.color.hex}40, 0 8px 20px -6px rgba(0,0,0,0.15)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Try-On Tray ── */}
      <AnimatePresence>
        {showTray && (
          <motion.div
            ref={trayRef}
            className="fixed right-0 top-1/2 flex items-center justify-center rounded-l-2xl"
            style={{ zIndex: 40, translateY: "-50%" }}
            initial={{ width: 0, height: 500, opacity: 0 }}
            animate={{
              width: isDragging ? (isOverTray ? 130 : 90) : 56,
              height: isOverTray ? 540 : 500,
              opacity: isDragging ? 1 : 0.6,
            }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Glassmorphism surface with liquid glass refraction */}
            <motion.div
              className="absolute inset-0 backdrop-blur-2xl rounded-l-2xl"
              animate={{
                backgroundColor: accepted
                  ? "rgba(139, 154, 126, 0.2)"
                  : isOverTray
                    ? "rgba(196, 119, 90, 0.15)"
                    : "rgba(255, 255, 255, 0.05)",
              }}
              transition={{ duration: 0.2 }}
              style={{
                borderLeft: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "inset 1px 0 0 rgba(255,255,255,0.08), -6px 0 24px rgba(0,0,0,0.06)",
              }}
            />

            {/* Tray content */}
            <div className="relative flex flex-col items-center gap-2.5">
              <motion.div
                animate={{
                  scale: accepted ? 1.3 : isOverTray ? 1.2 : 1,
                  rotate: accepted ? 0 : isOverTray ? -6 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                {accepted ? (
                  <motion.svg
                    className="w-7 h-7 text-[var(--color-sage)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  <svg
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isOverTray
                        ? "text-[var(--color-terracotta)]"
                        : "text-[var(--color-stone-light)]"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                    />
                  </svg>
                )}
              </motion.div>

              {isDragging && (
                <motion.span
                  className={`text-[9px] font-medium tracking-wider uppercase whitespace-nowrap transition-colors duration-200 ${
                    isOverTray
                      ? "text-[var(--color-terracotta)]"
                      : "text-[var(--color-stone-light)]"
                  }`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {isOverTray ? "Drop" : "Try on"}
                </motion.span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
