"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultsDisplay from "@/components/ResultsDisplay";
import { AnalysisResult, Gender } from "@/lib/types";
import { analyzeImage } from "@/lib/api";

export default function AnalyzePage() {
  const router = useRouter();
  const hasStarted = useRef(false);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>("female");

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Check for cached results first (allows navigating back)
    const cachedResult = sessionStorage.getItem("analyzeResult");
    const cachedImage = sessionStorage.getItem("analyzeCachedImage");
    const cachedGender = sessionStorage.getItem("analyzeCachedGender") as Gender | null;

    if (cachedResult && cachedImage) {
      setResult(JSON.parse(cachedResult));
      setUploadedImage(cachedImage);
      if (cachedGender) setGender(cachedGender);
      setIsAnalyzing(false);
      return;
    }

    // Otherwise, run a new analysis
    const image = sessionStorage.getItem("analyzeImage");
    const storedGender = sessionStorage.getItem("analyzeGender") as Gender | null;

    sessionStorage.removeItem("analyzeImage");
    sessionStorage.removeItem("analyzeGender");

    if (!image) {
      router.replace("/");
      return;
    }

    setUploadedImage(image);
    if (storedGender) setGender(storedGender);

    const runAnalysis = async () => {
      try {
        const analysisResult = await analyzeImage(image);
        setResult(analysisResult);
        // Cache results so user can navigate back
        sessionStorage.setItem("analyzeResult", JSON.stringify(analysisResult));
        sessionStorage.setItem("analyzeCachedImage", image);
        if (storedGender) sessionStorage.setItem("analyzeCachedGender", storedGender);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [router]);

  const handleReset = () => {
    sessionStorage.removeItem("analyzeResult");
    sessionStorage.removeItem("analyzeCachedImage");
    sessionStorage.removeItem("analyzeCachedGender");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] dark:bg-[#0F0E0D] relative overflow-hidden noise-overlay">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--color-terracotta-light)]/20 via-[var(--color-blush)]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-gradient" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[var(--color-sage)]/15 via-[var(--color-stone-light)]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <main className="relative z-10 container mx-auto px-6 pt-24 pb-16 max-w-6xl">
        {/* Loading State */}
        {isAnalyzing && !error && <LoadingAnalysis />}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl mb-6">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 rounded-full bg-[var(--color-terracotta)] hover:bg-[var(--color-terracotta-dark)] text-white font-medium transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Results */}
        {result && (
          <ResultsDisplay result={result} onReset={handleReset} uploadedImage={uploadedImage} gender={gender} />
        )}
      </main>
    </div>
  );
}
