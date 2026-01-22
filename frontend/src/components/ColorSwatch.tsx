"use client";

import { useState } from "react";
import { ColorPalette } from "@/lib/types";

interface ColorSwatchProps {
  palette: ColorPalette[];
  season: string;
}

export default function ColorSwatch({ palette, season }: ColorSwatchProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const copyToClipboard = async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedColor(hex);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Calculate if a color is light (for text contrast)
  const isLightColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 p-8 animate-fade-up delay-200">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[var(--color-terracotta)]" />
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
              Your Palette
            </span>
          </div>
          <h3 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            {season.charAt(0).toUpperCase() + season.slice(1)} Colors
          </h3>
        </div>
        <p className="text-sm text-[var(--color-stone)] hidden sm:block">
          Click to copy hex code
        </p>
      </div>

      {/* Main color grid - large swatches */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3 mb-8">
        {palette.map((color, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(color.hex)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="group relative aspect-square rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 hover:z-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)] focus:ring-offset-2"
            style={{ backgroundColor: color.hex }}
            title={`${color.name} - ${color.hex}`}
          >
            {/* Hover overlay with color name */}
            <div className={`absolute inset-0 rounded-2xl flex items-center justify-center transition-opacity duration-200 ${
              hoveredIndex === index ? "opacity-100" : "opacity-0"
            }`}>
              <div className={`text-xs font-medium px-2 py-1 rounded-lg backdrop-blur-sm ${
                isLightColor(color.hex)
                  ? "bg-black/10 text-black/80"
                  : "bg-white/20 text-white"
              }`}>
                {color.name}
              </div>
            </div>

            {/* Copied indicator */}
            {copiedColor === color.hex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-2xl animate-scale-in">
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/90">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs font-medium text-[var(--color-charcoal)]">Copied</span>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Color list - elegant horizontal layout */}
      <div className="border-t border-[var(--color-stone-light)]/20 pt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
          {palette.map((color, index) => (
            <button
              key={index}
              onClick={() => copyToClipboard(color.hex)}
              className="group flex items-center gap-3 text-left hover:bg-[var(--color-cream-dark)]/50 dark:hover:bg-[var(--color-charcoal)]/50 rounded-lg p-2 -m-2 transition-colors"
            >
              <div
                className="w-5 h-5 rounded-md shadow-sm ring-1 ring-black/5 flex-shrink-0 transition-transform group-hover:scale-110"
                style={{ backgroundColor: color.hex }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] truncate">
                  {color.name}
                </p>
                <p className="text-xs text-[var(--color-stone)] group-hover:text-[var(--color-terracotta)] transition-colors">
                  {color.hex}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
