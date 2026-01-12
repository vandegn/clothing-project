"use client";

import { useState } from "react";
import { ColorPalette } from "@/lib/types";

interface ColorSwatchProps {
  palette: ColorPalette[];
  season: string;
}

export default function ColorSwatch({ palette, season }: ColorSwatchProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        Your {season.charAt(0).toUpperCase() + season.slice(1)} Color Palette
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Click any color to copy its hex code
      </p>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {palette.map((color, index) => (
          <button
            key={index}
            onClick={() => copyToClipboard(color.hex)}
            className="group relative aspect-square rounded-lg shadow-sm hover:shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            style={{ backgroundColor: color.hex }}
            title={`${color.name} - ${color.hex}`}
          >
            {/* Color name tooltip on hover */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {color.name}
              </div>
            </div>

            {/* Copied indicator */}
            {copiedColor === color.hex && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
                <svg
                  className={`w-6 h-6 ${isLightColor(color.hex) ? "text-slate-900" : "text-white"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Color list for accessibility */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
        {palette.map((color, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-600"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-slate-600 dark:text-slate-400">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
