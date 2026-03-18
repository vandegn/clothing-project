"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
      } finally {
        setIsAnalyzing(false);
      }
    };

    runAnalysis();
  }, [router]);

  const handleReset = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] dark:bg-[#0F0E0D] relative overflow-hidden noise-overlay">
      {/* Header */}
      <header className="relative z-20 glass border-b border-[var(--color-stone-light)]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-terracotta)]/20 group-hover:shadow-xl group-hover:shadow-[var(--color-terracotta)]/30 transition-all duration-300">
              <span className="text-white font-display text-lg font-medium">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                TrueColor
              </h1>
              <p className="text-xs text-[var(--color-stone)]">Color Analysis</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--color-terracotta-light)]/20 via-[var(--color-blush)]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-gradient" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[var(--color-sage)]/15 via-[var(--color-stone-light)]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      <main className="relative z-10 container mx-auto px-6 py-16 max-w-6xl">
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
