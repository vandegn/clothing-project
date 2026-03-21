"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColorPalette, Gender } from "@/lib/types";
import { getAmazonSearchUrl } from "@/lib/api";

interface ClothingRecommendationsProps {
  palette: ColorPalette[];
  gender: Gender;
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

  const handleTryOn = async (color: ColorPalette) => {
    const imagePath = getClothingImagePath(gender, color.name, selectedCategory);
    try {
      const res = await fetch(imagePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        sessionStorage.setItem("tryOnClothingImage", base64);
        sessionStorage.setItem("tryOnClothingType", selectedCategory === "tops" ? "top" : "bottom");
        router.push("/tryon");
      };
      reader.readAsDataURL(blob);
    } catch {
      sessionStorage.setItem("tryOnClothingType", selectedCategory === "tops" ? "top" : "bottom");
      router.push("/tryon");
    }
  };

  return (
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

          return (
            <div
              key={index}
              className="group flex flex-col"
              style={{ animationDelay: `${index * 60}ms` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Color marker — always visible above image */}
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

              {/* Image container */}
              <div
                className="relative overflow-hidden rounded-2xl bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)] cursor-grab transition-all duration-300"
                style={{
                  boxShadow: isHovered
                    ? `0 12px 28px -4px ${color.hex}30, 0 4px 12px -2px rgba(0,0,0,0.08)`
                    : "0 1px 3px rgba(0,0,0,0.04)",
                  transform: isHovered ? "translateY(-3px)" : "translateY(0)",
                }}
              >
                <div className="aspect-[3/4] w-full relative">
                  <img
                    src={imagePath}
                    alt={`${color.name} ${selectedCategory}`}
                    className="w-full h-full object-contain transition-transform duration-500"
                    style={{ transform: isHovered ? "scale(1.04)" : "scale(1)" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              </div>

              {/* Action links below image */}
              <div className="flex items-center gap-3 mt-2 px-0.5">
                <button
                  onClick={() => handleTryOn(color)}
                  className="text-[11px] text-[var(--color-stone)] hover:text-[var(--color-terracotta)] active:scale-[0.97] cursor-pointer transition-colors duration-200"
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
          Try on garments with AI or find them on Amazon
        </p>
      </div>
    </div>
  );
}
