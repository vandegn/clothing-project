"use client";

import { AnalysisResult } from "@/lib/types";
import ColorSwatch from "./ColorSwatch";
import SeasonCard from "./SeasonCard";
import ClothingRecommendations from "./ClothingRecommendations";

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  return (
    <div className="space-y-8">
      {/* Season Result */}
      <SeasonCard
        season={result.season}
        description={result.season_description}
        undertone={result.undertone}
        contrast={result.contrast}
      />

      {/* Extracted Colors */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Your Natural Colors
        </h3>
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
      <ClothingRecommendations palette={result.palette} />

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
