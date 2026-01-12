"use client";

interface SeasonCardProps {
  season: "spring" | "summer" | "autumn" | "winter";
  description: string;
  undertone: "warm" | "cool";
  contrast: "low" | "medium" | "high";
}

const seasonStyles = {
  spring: {
    gradient: "from-yellow-100 via-green-100 to-pink-100",
    darkGradient: "dark:from-yellow-900/20 dark:via-green-900/20 dark:to-pink-900/20",
    accent: "text-green-600 dark:text-green-400",
    icon: "bg-green-100 dark:bg-green-900/30",
  },
  summer: {
    gradient: "from-blue-100 via-purple-100 to-pink-100",
    darkGradient: "dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20",
    accent: "text-blue-600 dark:text-blue-400",
    icon: "bg-blue-100 dark:bg-blue-900/30",
  },
  autumn: {
    gradient: "from-orange-100 via-red-100 to-yellow-100",
    darkGradient: "dark:from-orange-900/20 dark:via-red-900/20 dark:to-yellow-900/20",
    accent: "text-orange-600 dark:text-orange-400",
    icon: "bg-orange-100 dark:bg-orange-900/30",
  },
  winter: {
    gradient: "from-slate-100 via-blue-100 to-purple-100",
    darkGradient: "dark:from-slate-800 dark:via-blue-900/20 dark:to-purple-900/20",
    accent: "text-indigo-600 dark:text-indigo-400",
    icon: "bg-indigo-100 dark:bg-indigo-900/30",
  },
};

const seasonIcons = {
  spring: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  summer: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  autumn: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  winter: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18m0-18l4 4m-4-4L8 7m4 14l4-4m-4 4l-4-4M3 12h18M3 12l4 4m-4-4l4-4m14 4l-4 4m4-4l-4-4" />
    </svg>
  ),
};

export default function SeasonCard({ season, description, undertone, contrast }: SeasonCardProps) {
  const styles = seasonStyles[season];

  return (
    <div className={`rounded-xl p-8 bg-gradient-to-br ${styles.gradient} ${styles.darkGradient}`}>
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className={`w-20 h-20 rounded-full ${styles.icon} flex items-center justify-center ${styles.accent}`}>
          {seasonIcons[season]}
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className={`text-3xl font-bold capitalize ${styles.accent}`}>
            {season}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mt-2 max-w-xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <span className="px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              {undertone === "warm" ? "Warm" : "Cool"} Undertone
            </span>
            <span className="px-3 py-1 bg-white/60 dark:bg-slate-800/60 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300">
              {contrast.charAt(0).toUpperCase() + contrast.slice(1)} Contrast
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
