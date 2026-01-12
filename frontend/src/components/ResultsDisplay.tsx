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
    <div className="space-y-8">
      {/* Debug Overlay - Show sample points on image (toggle-able) */}
      {showDebug && uploadedImage && result.debug_info && (
        <DebugOverlay
          imageUrl={uploadedImage}
          debugInfo={result.debug_info}
          colors={result.colors}
        />
      )}

      {/* Season Result */}
      <SeasonCard
        season={result.season}
        description={result.season_description}
        undertone={result.undertone}
        contrast={result.contrast}
      />

      {/* Extracted Colors */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your Natural Colors
          </h3>
          {uploadedImage && result.debug_info && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                showDebug
                  ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${showDebug ? "bg-green-500" : "bg-slate-400"}`} />
              {showDebug ? "Debug On" : "Debug Off"}
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-6 justify-center">
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-md mx-auto"
              style={{ backgroundColor: result.colors.eyes }}
            />
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Eyes</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{result.colors.eyes}</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-md mx-auto"
              style={{ backgroundColor: result.colors.hair }}
            />
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Hair</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{result.colors.hair}</p>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 rounded-full border-4 border-white shadow-md mx-auto"
              style={{ backgroundColor: result.colors.skin }}
            />
            <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-300">Skin</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{result.colors.skin}</p>
          </div>
        </div>
      </div>

      {/* Color Palette */}
      <ColorSwatch palette={result.palette} season={result.season} />

      {/* Clothing Recommendations */}
      <ClothingRecommendations palette={result.palette} gender={gender} />

      {/* Try Again Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-8 py-3 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-600 dark:border-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors font-medium"
        >
          Analyze Another Photo
        </button>
      </div>
    </div>
  );
}
