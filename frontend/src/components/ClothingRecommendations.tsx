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
  const [tryOnModal, setTryOnModal] = useState<{ color: ColorPalette; imagePath: string; category: "tops" | "bottoms" } | null>(null);

  const handleCardClick = (color: ColorPalette) => {
    const imagePath = getClothingImagePath(gender, color.name, selectedCategory);
    setTryOnModal({ color, imagePath, category: selectedCategory });
  };

  const handleTryOn = async () => {
    if (!tryOnModal) return;

    // Fetch the image and convert to base64 data URL for the try-on page
    try {
      const res = await fetch(tryOnModal.imagePath);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        sessionStorage.setItem("tryOnClothingImage", base64);
        sessionStorage.setItem("tryOnClothingType", tryOnModal.category === "tops" ? "top" : "bottom");
        setTryOnModal(null);
        router.push("/tryon");
      };
      reader.readAsDataURL(blob);
    } catch {
      // If image fetch fails, still pass clothing type and navigate
      sessionStorage.setItem("tryOnClothingType", tryOnModal.category === "tops" ? "top" : "bottom");
      setTryOnModal(null);
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
          <p className="text-sm text-[var(--color-stone)] mt-1">
            Click a color to try it on virtually or shop on Amazon
          </p>
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {palette.map((color, index) => {
          const imagePath = getClothingImagePath(gender, color.name, selectedCategory);
          return (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              onClick={() => handleCardClick(color)}
            >
              {/* Color background (fallback) */}
              <div
                className="aspect-[4/3] w-full relative"
                style={{ backgroundColor: color.hex }}
              >
                {/* Clothing image overlay */}
                <img
                  src={imagePath}
                  alt={`${color.name} ${selectedCategory}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    // Hide image on error, showing color background
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content overlay */}
              <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-medium truncate">
                  {color.name}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-white/70 text-xs">Click to try on</span>
                </div>
              </div>

              {/* Static label */}
              <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-xs font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                  {color.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-[var(--color-stone-light)]/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-stone-light)]">
            Click any color to try it on virtually
          </p>

          {/* Amazon link */}
          <a
            href={getAmazonSearchUrl(palette[0]?.name || "", selectedCategory, gender)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 border border-[var(--color-stone-light)]/20 text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] hover:bg-white/80 transition-all duration-300"
          >
            <span>Shop on Amazon</span>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Try-On Confirmation Modal */}
      {tryOnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setTryOnModal(null)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-sm rounded-3xl bg-white/90 dark:bg-[#1A1918]/90 backdrop-blur-xl border border-[var(--color-stone-light)]/20 shadow-2xl shadow-black/10 p-8 animate-scale-in">
            {/* Preview image */}
            <div className="relative rounded-2xl overflow-hidden mb-6 bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]" style={{ backgroundColor: tryOnModal.color.hex }}>
              <div className="aspect-[4/3]">
                <img
                  src={tryOnModal.imagePath}
                  alt={tryOnModal.color.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            </div>

            <h3 className="font-display text-xl text-center text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
              Try this on?
            </h3>
            <p className="text-sm text-[var(--color-stone)] text-center mb-6">
              <span className="font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">{tryOnModal.color.name}</span> {tryOnModal.category === "tops" ? "top" : "bottom"} will be loaded into the virtual try-on
            </p>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setTryOnModal(null)}
                className="flex-1 px-5 py-3 rounded-full border border-[var(--color-stone-light)]/30 text-sm font-medium text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:border-[var(--color-stone-light)]/60 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleTryOn}
                className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-[var(--color-sage)] to-[var(--color-sage)]/80 text-white text-sm font-medium hover:shadow-lg hover:shadow-[var(--color-sage)]/20 transition-all duration-300"
              >
                Try It On
              </button>
            </div>

            {/* Amazon fallback link */}
            <a
              href={getAmazonSearchUrl(tryOnModal.color.name, tryOnModal.category, gender)}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs text-[var(--color-stone)] hover:text-[var(--color-terracotta)] mt-4 transition-colors"
            >
              Or shop this color on Amazon →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
