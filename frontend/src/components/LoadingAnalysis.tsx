"use client";

import { useEffect, useState } from "react";

const steps = [
  { text: "Detecting facial features", icon: "face" },
  { text: "Extracting eye color", icon: "eye" },
  { text: "Analyzing skin tone", icon: "skin" },
  { text: "Identifying hair color", icon: "hair" },
  { text: "Determining your season", icon: "season" },
  { text: "Curating your palette", icon: "palette" },
];

const seasonColors = [
  { color: "var(--color-terracotta)", delay: 0 },
  { color: "var(--color-sage)", delay: 100 },
  { color: "var(--color-blush)", delay: 200 },
  { color: "var(--color-stone)", delay: 300 },
];

export default function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
      {/* Elegant color orbs animation */}
      <div className="relative w-40 h-40 mx-auto mb-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-[var(--color-stone-light)]/30" />

        {/* Rotating gradient ring */}
        <div className="absolute inset-2 rounded-full animate-spin" style={{ animationDuration: '8s' }}>
          <div className="absolute inset-0 rounded-full bg-gradient-conic from-[var(--color-terracotta)] via-[var(--color-sage)] via-[var(--color-blush)] to-[var(--color-terracotta)] opacity-20"
               style={{ background: `conic-gradient(from 0deg, var(--color-terracotta), var(--color-sage), var(--color-blush), var(--color-stone-light), var(--color-terracotta))`, opacity: 0.3 }} />
        </div>

        {/* Inner content area */}
        <div className="absolute inset-4 rounded-full bg-[var(--color-cream)] dark:bg-[#0F0E0D] flex items-center justify-center">
          {/* Orbiting color dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s' }}>
            {seasonColors.map((item, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-pulse"
                style={{
                  backgroundColor: item.color,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${i * 90}deg) translateX(48px) translateY(-50%)`,
                  animationDelay: `${item.delay}ms`,
                }}
              />
            ))}
          </div>

          {/* Center icon */}
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-light)]/30 to-[var(--color-blush)]/30 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-[var(--color-terracotta)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Pulsing outer glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-br from-[var(--color-terracotta)]/10 to-[var(--color-blush)]/10 animate-pulse" style={{ animationDuration: '2s' }} />
      </div>

      {/* Title */}
      <h2 className="font-display text-3xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-3">
        Analyzing Your Colors
      </h2>

      {/* Current step */}
      <div className="h-8 mb-10">
        <p className="text-[var(--color-stone)] text-lg transition-all duration-500 animate-fade-in" key={currentStep}>
          {steps[currentStep].text}
          <span className="inline-flex ml-1">
            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
          </span>
        </p>
      </div>

      {/* Progress bar */}
      <div className="max-w-xs mx-auto">
        <div className="flex justify-between mb-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${
                index === currentStep
                  ? "bg-[var(--color-terracotta)] scale-125"
                  : index < currentStep
                  ? "bg-[var(--color-terracotta)]/60"
                  : "bg-[var(--color-stone-light)]/40"
              }`}
            />
          ))}
        </div>

        {/* Progress line */}
        <div className="h-0.5 bg-[var(--color-stone-light)]/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-blush)] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Subtle hint */}
      <p className="mt-10 text-xs text-[var(--color-stone-light)]">
        This usually takes just a moment
      </p>
    </div>
  );
}
