"use client";

import { DebugInfo, ExtractedColors } from "@/lib/types";

interface DebugOverlayProps {
  imageUrl: string;
  debugInfo: DebugInfo;
  colors: ExtractedColors;
}

const labelStyles = {
  eyes: {
    color: "#7C3AED", // purple
    name: "Eyes",
  },
  hair: {
    color: "#C4775A", // terracotta
    name: "Hair",
  },
  skin: {
    color: "#8B9A7E", // sage
    name: "Skin",
  },
};

export default function DebugOverlay({ imageUrl, debugInfo, colors }: DebugOverlayProps) {
  const { sample_points, image_width, image_height } = debugInfo;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[var(--color-terracotta)]" />
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
              Developer View
            </span>
          </div>
          <h3 className="font-display text-xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            Sample Points Visualization
          </h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Active</span>
        </div>
      </div>

      <p className="text-sm text-[var(--color-stone)] mb-6">
        The markers show where colors were sampled from your photo during analysis.
      </p>

      {/* Image with overlay */}
      <div className="relative inline-block w-full max-w-lg mx-auto rounded-2xl overflow-hidden shadow-xl">
        <img
          src={imageUrl}
          alt="Analyzed photo"
          className="w-full h-auto"
        />

        {/* SVG overlay for sample points */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${image_width} ${image_height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {sample_points.map((point, index) => {
            const style = labelStyles[point.label];
            const extractedColor = colors[point.label];

            return (
              <g key={index}>
                {/* Outer ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={Math.min(image_width, image_height) * 0.04}
                  fill="none"
                  stroke={style.color}
                  strokeWidth={Math.min(image_width, image_height) * 0.006}
                  strokeDasharray="4 2"
                />

                {/* Inner filled circle with extracted color */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={Math.min(image_width, image_height) * 0.025}
                  fill={extractedColor}
                  stroke="white"
                  strokeWidth={Math.min(image_width, image_height) * 0.004}
                />

                {/* Crosshair lines */}
                <line
                  x1={point.x - Math.min(image_width, image_height) * 0.06}
                  y1={point.y}
                  x2={point.x - Math.min(image_width, image_height) * 0.045}
                  y2={point.y}
                  stroke={style.color}
                  strokeWidth={Math.min(image_width, image_height) * 0.004}
                />
                <line
                  x1={point.x + Math.min(image_width, image_height) * 0.045}
                  y1={point.y}
                  x2={point.x + Math.min(image_width, image_height) * 0.06}
                  y2={point.y}
                  stroke={style.color}
                  strokeWidth={Math.min(image_width, image_height) * 0.004}
                />
                <line
                  x1={point.x}
                  y1={point.y - Math.min(image_width, image_height) * 0.06}
                  x2={point.x}
                  y2={point.y - Math.min(image_width, image_height) * 0.045}
                  stroke={style.color}
                  strokeWidth={Math.min(image_width, image_height) * 0.004}
                />
                <line
                  x1={point.x}
                  y1={point.y + Math.min(image_width, image_height) * 0.045}
                  x2={point.x}
                  y2={point.y + Math.min(image_width, image_height) * 0.06}
                  stroke={style.color}
                  strokeWidth={Math.min(image_width, image_height) * 0.004}
                />

                {/* Label */}
                <text
                  x={point.x}
                  y={point.y + Math.min(image_width, image_height) * 0.08}
                  textAnchor="middle"
                  fill="white"
                  fontSize={Math.min(image_width, image_height) * 0.03}
                  fontWeight="bold"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9)" }}
                >
                  {point.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {sample_points.map((point, index) => {
          const style = labelStyles[point.label];
          const extractedColor = colors[point.label];

          return (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)]"
            >
              <div
                className="w-5 h-5 rounded-full ring-2 shadow-sm"
                style={{
                  backgroundColor: extractedColor,
                  outlineColor: style.color,
                  outlineStyle: 'solid',
                  outlineWidth: '2px',
                }}
              />
              <span className="text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] capitalize">
                {style.name}
              </span>
              <span className="text-xs text-[var(--color-stone)] font-mono">
                ({point.x}, {point.y})
              </span>
            </div>
          );
        })}
      </div>

      {/* Debug info */}
      <div className="mt-6 p-4 bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)] rounded-2xl">
        <div className="flex flex-wrap gap-6 text-xs font-mono text-[var(--color-stone)]">
          <div>
            <span className="text-[var(--color-stone-light)]">Image size:</span>{" "}
            <span className="text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
              {image_width} x {image_height}px
            </span>
          </div>
          <div>
            <span className="text-[var(--color-stone-light)]">Sample points:</span>{" "}
            <span className="text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
              {sample_points.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
