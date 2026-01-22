"use client";

import { useState } from "react";
import { AnalysisResult, Gender } from "@/lib/types";
import ColorSwatch from "./ColorSwatch";
import SeasonCard from "./SeasonCard";
import ClothingRecommendations from "./ClothingRecommendations";
import DebugOverlay from "./DebugOverlay";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
  uploadedImage?: string | null;
  gender: Gender;
}

export default function ResultsDisplay({ result, onReset, uploadedImage, gender }: ResultsDisplayProps) {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onReset}
          className="group flex items-center gap-2 text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)] transition-colors"
        >
          <svg
            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Analyze Another Photo</span>
        </button>

        {/* Debug toggle */}
        {uploadedImage && result.debug_info && (
          <button
            onClick={() => setShowDebug(!showDebug)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all
              ${showDebug
                ? "bg-[var(--color-terracotta)]/10 text-[var(--color-terracotta)] ring-1 ring-[var(--color-terracotta)]/30"
                : "bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)] text-[var(--color-stone)] hover:text-[var(--color-charcoal)]"
              }
            `}
          >
            <span className={`w-2 h-2 rounded-full transition-colors ${showDebug ? "bg-[var(--color-terracotta)]" : "bg-[var(--color-stone-light)]"}`} />
            Debug {showDebug ? "On" : "Off"}
          </button>
        )}
      </div>

      {/* Debug Overlay */}
      {showDebug && uploadedImage && result.debug_info && (
        <div className="animate-scale-in">
          <DebugOverlay
            imageUrl={uploadedImage}
            debugInfo={result.debug_info}
            colors={result.colors}
          />
        </div>
      )}

      {/* Season Result - Hero */}
      <SeasonCard
        season={result.season}
        description={result.season_description}
        undertone={result.undertone}
        contrast={result.contrast}
      />

      {/* Extracted Colors - Elegant display */}
      <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 p-8 animate-fade-up delay-100">
        {/* Section header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[var(--color-terracotta)]" />
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
              Color Analysis
            </span>
          </div>
          <h3 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            Your Natural Colors
          </h3>
        </div>

        {/* Color circles */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { label: "Eyes", color: result.colors.eyes },
            { label: "Hair", color: result.colors.hair },
            { label: "Skin", color: result.colors.skin },
          ].map((item, index) => (
            <div
              key={item.label}
              className="flex flex-col items-center animate-fade-up"
              style={{ animationDelay: `${150 + index * 100}ms` }}
            >
              {/* Large color circle */}
              <div className="relative mb-4">
                {/* Outer ring */}
                <div className="absolute -inset-2 rounded-full border border-[var(--color-stone-light)]/30" />
                {/* Color circle */}
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg ring-4 ring-white dark:ring-[var(--color-charcoal)]"
                  style={{ backgroundColor: item.color }}
                />
                {/* Glow effect */}
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-30 -z-10"
                  style={{ backgroundColor: item.color }}
                />
              </div>

              {/* Label */}
              <p className="font-display text-lg text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                {item.label}
              </p>
              <p className="text-xs text-[var(--color-stone)] font-mono mt-1">
                {item.color.toUpperCase()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Palette */}
      <ColorSwatch palette={result.palette} season={result.season} />

      {/* Clothing Recommendations */}
      <ClothingRecommendations palette={result.palette} gender={gender} />

      {/* Bottom CTA */}
      <div className="text-center pt-8 animate-fade-up delay-500">
        <div className="inline-flex flex-col items-center">
          <p className="text-[var(--color-stone)] text-sm mb-4">
            Want to try with a different photo?
          </p>
          <button
            onClick={onReset}
            className="
              group relative px-8 py-3
              text-[var(--color-charcoal)] dark:text-[var(--color-cream)]
              border-2 border-[var(--color-stone-light)]/40 hover:border-[var(--color-terracotta)]
              rounded-full font-medium text-sm
              transition-all duration-300
              hover:shadow-lg hover:shadow-[var(--color-terracotta)]/10
            "
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start Over
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
