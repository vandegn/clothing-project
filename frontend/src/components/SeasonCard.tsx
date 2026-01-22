"use client";

interface SeasonCardProps {
  season: "spring" | "summer" | "autumn" | "winter";
  description: string;
  undertone: "warm" | "cool";
  contrast: "low" | "medium" | "high";
}

const seasonConfig = {
  spring: {
    colors: ["#FFFBEB", "#FEF3C7", "#FDE68A", "#A7F3D0"],
    accent: "#D97706",
    accentLight: "#FDE68A",
    label: "Spring",
    emoji: "bloom",
  },
  summer: {
    colors: ["#F0F9FF", "#E0E7FF", "#DDD6FE", "#FBCFE8"],
    accent: "#7C3AED",
    accentLight: "#DDD6FE",
    label: "Summer",
    emoji: "mist",
  },
  autumn: {
    colors: ["#FEF3C7", "#FED7AA", "#FDBA74", "#A3E635"],
    accent: "#C2410C",
    accentLight: "#FDBA74",
    label: "Autumn",
    emoji: "leaf",
  },
  winter: {
    colors: ["#F8FAFC", "#E0E7FF", "#C7D2FE", "#F9A8D4"],
    accent: "#4F46E5",
    accentLight: "#C7D2FE",
    label: "Winter",
    emoji: "frost",
  },
};

export default function SeasonCard({ season, description, undertone, contrast }: SeasonCardProps) {
  const config = seasonConfig[season];

  return (
    <div className="relative overflow-hidden rounded-3xl animate-scale-in">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${config.colors[0]} 0%, ${config.colors[1]} 33%, ${config.colors[2]} 66%, ${config.colors[3]} 100%)`,
        }}
      />

      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Decorative circles */}
      <div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-30"
        style={{ backgroundColor: config.accentLight }}
      />
      <div
        className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-20"
        style={{ backgroundColor: config.accent }}
      />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          {/* Left side - Season reveal */}
          <div className="flex-shrink-0">
            {/* Season type label */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-sm mb-4">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: config.accent }}
              />
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: config.accent }}>
                Your Season
              </span>
            </div>

            {/* Large season name */}
            <h2
              className="font-display text-5xl md:text-6xl lg:text-7xl font-medium capitalize leading-none mb-2"
              style={{ color: config.accent }}
            >
              {config.label}
            </h2>

            {/* Color bar */}
            <div className="flex h-2 w-32 rounded-full overflow-hidden mt-4">
              {config.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Right side - Description and traits */}
          <div className="flex-1 md:pt-8">
            <p className="text-lg text-[var(--color-charcoal)]/80 leading-relaxed mb-6 max-w-lg">
              {description}
            </p>

            {/* Traits */}
            <div className="flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm">
                <svg className="w-4 h-4" style={{ color: config.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-charcoal)]">
                  {undertone === "warm" ? "Warm" : "Cool"} Undertone
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm">
                <svg className="w-4 h-4" style={{ color: config.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <span className="text-sm font-medium text-[var(--color-charcoal)]">
                  {contrast.charAt(0).toUpperCase() + contrast.slice(1)} Contrast
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
