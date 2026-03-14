"use client";

import { useState } from "react";
import Link from "next/link";
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

      {/* Floating color orbs */}
      <div className="absolute top-40 left-[15%] w-3 h-3 rounded-full bg-[var(--color-terracotta)] animate-float opacity-60" />
      <div className="absolute top-60 right-[20%] w-2 h-2 rounded-full bg-[var(--color-sage)] animate-float delay-300 opacity-50" />
      <div className="absolute top-80 left-[25%] w-4 h-4 rounded-full bg-[var(--color-blush)] animate-float delay-500 opacity-40" />

      <main className="relative z-10 container mx-auto px-6 py-16 max-w-6xl">
        {/* Header / Hero */}
        {!result && !isAnalyzing && (
          <>
            <header className="text-center mb-16 animate-on-load animate-fade-up">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)] mb-8">
                <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)] animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
                  AI-Powered Color Analysis
                </span>
              </div>

              {/* Main Title */}
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-6 tracking-tight leading-[0.95]">
                Discover Your
                <br />
                <span className="italic text-[var(--color-terracotta)]">Color Season</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-[var(--color-stone)] max-w-xl mx-auto leading-relaxed">
                Unlock the palette that was made for you. Upload a selfie and let our AI reveal your most flattering colors.
              </p>
            </header>

            {/* Upload Section - Hero Focus */}
            <section className="max-w-2xl mx-auto mb-24 animate-on-load animate-fade-up delay-200">
              {/* Gender Selection - Refined */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">
                  {(["female", "male"] as const).map((option) => (
                    <button
                      key={option}
                      onClick={() => setGender(option)}
                      className={`
                        px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300
                        ${gender === option
                          ? "bg-white dark:bg-[var(--color-charcoal)] text-[var(--color-charcoal)] dark:text-[var(--color-cream)] shadow-md"
                          : "text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]"
                        }
                      `}
                    >
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <ImageUploader onImageUpload={handleImageUpload} />

              {error && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl animate-scale-in">
                  <p className="text-red-700 dark:text-red-400 text-center text-sm">{error}</p>
                </div>
              )}
            </section>

            {/* How It Works - Editorial Style */}
            <section className="animate-on-load animate-fade-up delay-400">
              {/* Section Header */}
              <div className="flex items-center justify-center gap-6 mb-16">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-stone-light)]" />
                <h2 className="font-display text-sm tracking-[0.3em] uppercase text-[var(--color-stone)]">
                  How It Works
                </h2>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-stone-light)]" />
              </div>

              {/* Steps Grid */}
              <div className="grid md:grid-cols-3 gap-8 md:gap-4">
                {[
                  {
                    number: "01",
                    title: "Upload",
                    subtitle: "Your Portrait",
                    description: "Share a photo with natural lighting, ensure eyes are open, and whole head fits in frame.",
                    accent: "var(--color-terracotta)"
                  },
                  {
                    number: "02",
                    title: "Analyze",
                    subtitle: "Your Features",
                    description: "We extract your unique eye, hair, and skin tones to determine your undertone and contrast level.",
                    accent: "var(--color-sage)"
                  },
                  {
                    number: "03",
                    title: "Discover",
                    subtitle: "Your Palette",
                    description: "Receive a curated 16-color palette tailored to your seasonal type, plus shopping recommendations.",
                    accent: "var(--color-blush)"
                  }
                ].map((step, index) => (
                  <div
                    key={step.number}
                    className="group relative p-8 rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 hover:border-[var(--color-stone-light)]/40 transition-all duration-500 hover:shadow-xl hover:shadow-[var(--color-stone)]/5"
                    style={{ animationDelay: `${400 + index * 100}ms` }}
                  >
                    {/* Step Number - Large Editorial Style */}
                    <div
                      className="font-display text-7xl font-medium leading-none mb-6 transition-colors duration-300"
                      style={{ color: step.accent }}
                    >
                      {step.number}
                    </div>

                    {/* Title Group */}
                    <div className="mb-4">
                      <h3 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-1">
                        {step.title}
                      </h3>
                      <p className="font-display text-lg italic text-[var(--color-stone)]">
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-[var(--color-stone)] text-sm leading-relaxed">
                      {step.description}
                    </p>

                    {/* Hover accent line */}
                    <div
                      className="absolute bottom-0 left-8 right-8 h-0.5 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ backgroundColor: step.accent }}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Seasonal Color Preview */}
            <section className="mt-24 animate-on-load animate-fade-up delay-600">
              <div className="text-center mb-12">
                <h2 className="font-display text-3xl md:text-4xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-3">
                  The Four Seasons
                </h2>
                <p className="text-[var(--color-stone)]">
                  Each person falls into one of four seasonal color categories
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { name: "Spring", colors: ["#F5E6D3", "#FFDB58", "#FF9966", "#90EE90"], tone: "Warm & Light", accent: "#D97706" },
                  { name: "Summer", colors: ["#E6E6FA", "#FFB6C1", "#87CEEB", "#DDA0DD"], tone: "Cool & Soft", accent: "#7C3AED" },
                  { name: "Autumn", colors: ["#8B4513", "#D2691E", "#DAA520", "#556B2F"], tone: "Warm & Deep", accent: "#C2410C" },
                  { name: "Winter", colors: ["#000000", "#FFFFFF", "#DC143C", "#4169E1"], tone: "Cool & Bold", accent: "#4F46E5" }
                ].map((season, index) => (
                  <div
                    key={season.name}
                    className="group cursor-pointer perspective-1000"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    {/* Card container with lift and tilt effect */}
                    <div className="relative p-4 rounded-3xl bg-white/50 dark:bg-[var(--color-charcoal-soft)]/30 border border-transparent group-hover:border-[var(--color-stone-light)]/30 transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-[var(--color-stone)]/15 group-hover:-translate-y-3 group-hover:bg-white/80 dark:group-hover:bg-[var(--color-charcoal-soft)]/50">

                      {/* Stacked color cards effect */}
                      <div className="relative h-32 mb-4">
                        {season.colors.map((color, i) => (
                          <div
                            key={i}
                            className={`season-card-${i} absolute inset-x-0 h-24 rounded-2xl shadow-md transition-all duration-500 ease-out origin-center group-hover:shadow-lg`}
                            style={{
                              backgroundColor: color,
                              zIndex: season.colors.length - i,
                              top: `${i * 4}px`,
                              transitionDelay: `${i * 40}ms`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Color bar with wave effect on hover */}
                      <div className="flex h-1.5 rounded-full overflow-hidden mb-4 transition-all duration-500 group-hover:h-2.5 group-hover:gap-0.5">
                        {season.colors.map((color, i) => (
                          <div
                            key={i}
                            className="flex-1 transition-all duration-500 ease-out group-hover:rounded-full first:rounded-l-full last:rounded-r-full"
                            style={{
                              backgroundColor: color,
                              transitionDelay: `${i * 75}ms`,
                            }}
                          />
                        ))}
                      </div>

                      {/* Text content with color shift */}
                      <div className="relative">
                        <h3 className="font-display text-xl mb-1 transition-all duration-300 text-[var(--color-charcoal)] dark:text-[var(--color-cream)] group-hover:translate-x-1">
                          <span
                            className="transition-colors duration-300"
                            style={{ color: 'inherit' }}
                          >
                            {season.name}
                          </span>
                        </h3>
                        <p className="text-xs text-[var(--color-stone)] transition-all duration-300 group-hover:text-[var(--color-charcoal)] dark:group-hover:text-[var(--color-cream-dark)] group-hover:translate-x-1">
                          {season.tone}
                        </p>
                      </div>

                      {/* Accent dot that appears on hover */}
                      <div
                        className="absolute top-4 right-4 w-2 h-2 rounded-full transition-all duration-500 ease-out opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100"
                        style={{ backgroundColor: season.accent }}
                      />

                      {/* Subtle glow effect on hover */}
                      <div
                        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
                        style={{ background: `radial-gradient(circle at 50% 0%, ${season.accent}, transparent 70%)` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-32 text-center animate-on-load animate-fade-up delay-800">
              <div className="inline-flex items-center gap-4 text-xs text-[var(--color-stone-light)]">
                <span>Powered by AI</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
                <span>Privacy First</span>
                <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
                <span>No data stored</span>
              </div>
            </footer>
          </>
        )}

        {/* Loading State */}
        {isAnalyzing && <LoadingAnalysis />}

        {/* Results */}
        {result && (
          <ResultsDisplay result={result} onReset={handleReset} uploadedImage={uploadedImage} gender={gender} />
        )}
      </main>
    </div>
  );
}
