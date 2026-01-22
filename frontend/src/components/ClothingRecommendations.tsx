"use client";

import { useState } from "react";
import { ColorPalette, Gender } from "@/lib/types";
import { getAmazonSearchUrl } from "@/lib/api";

interface ClothingRecommendationsProps {
  palette: ColorPalette[];
  gender: Gender;
}

export default function ClothingRecommendations({ palette, gender }: ClothingRecommendationsProps) {
  const [selectedCategory, setSelectedCategory] = useState<"tops" | "bottoms">("tops");

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
            Find clothing in your perfect colors on Amazon
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
        {palette.map((color, index) => (
          <a
            key={index}
            href={getAmazonSearchUrl(color.name, selectedCategory, gender)}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
          >
            {/* Color background */}
            <div
              className="aspect-[4/3] w-full"
              style={{ backgroundColor: color.hex }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Content overlay */}
            <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-sm font-medium truncate">
                {color.name}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-white/70 text-xs">Shop on Amazon</span>
                <svg
                  className="w-3 h-3 text-white/70"
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
              </div>
            </div>

            {/* Static label */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/90 dark:bg-black/70 backdrop-blur-sm opacity-100 group-hover:opacity-0 transition-opacity duration-300">
              <span className="text-xs font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                {color.name}
              </span>
            </div>
          </a>
        ))}
      </div>

      {/* Footer note */}
      <div className="mt-6 pt-6 border-t border-[var(--color-stone-light)]/20">
        <p className="text-xs text-[var(--color-stone-light)] text-center">
          Links open Amazon search results for {selectedCategory} in your recommended colors
        </p>
      </div>
    </div>
  );
}
