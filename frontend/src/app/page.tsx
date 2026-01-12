"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import { AnalysisResult, Gender } from "@/lib/types";
import { analyzeImage } from "@/lib/api";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>("female");

  const handleImageUpload = async (base64Image: string) => {
    setIsAnalyzing(true);
    setError(null);
    setUploadedImage(base64Image);

    try {
      const analysisResult = await analyzeImage(base64Image);
      setResult(analysisResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setUploadedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Color Palette Analyzer
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Upload a selfie to discover your seasonal color type and get personalized
            color recommendations for your wardrobe.
          </p>
        </div>

        {/* Main Content */}
        {!result && !isAnalyzing && (
          <div className="max-w-xl mx-auto">
            {/* Gender Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                Show clothing recommendations for:
              </label>
              <div className="flex flex-wrap gap-4">
                {(["female", "male", "non-binary"] as const).map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                      gender === option
                        ? "bg-indigo-100 dark:bg-indigo-900/50 ring-2 ring-indigo-500"
                        : "bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={(e) => setGender(e.target.value as Gender)}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${
                      gender === option
                        ? "text-indigo-700 dark:text-indigo-300"
                        : "text-slate-600 dark:text-slate-400"
                    }`}>
                      {option === "non-binary" ? "Non-binary" : option.charAt(0).toUpperCase() + option.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <ImageUploader onImageUpload={handleImageUpload} />
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-center">{error}</p>
              </div>
            )}
          </div>
        )}

        {isAnalyzing && <LoadingAnalysis />}

        {result && (
          <ResultsDisplay result={result} onReset={handleReset} uploadedImage={uploadedImage} gender={gender} />
        )}

        {/* How It Works */}
        {!result && !isAnalyzing && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white text-center mb-8">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">1</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Upload Your Selfie</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Take a photo with good lighting and neutral background for best results.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">2</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">AI Analysis</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Our AI extracts your eye, hair, and skin colors to determine your seasonal type.
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">3</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Get Recommendations</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Receive your personalized color palette and clothing suggestions.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
