"use client";

import { DebugInfo, ExtractedColors } from "@/lib/types";

interface DebugOverlayProps {
  imageUrl: string;
  debugInfo: DebugInfo;
  colors: ExtractedColors;
}

const labelStyles = {
  eyes: {
    color: "#3B82F6", // blue
    bgColor: "bg-blue-500",
  },
  hair: {
    color: "#8B5CF6", // purple
    bgColor: "bg-purple-500",
  },
  skin: {
    color: "#F59E0B", // amber
    bgColor: "bg-amber-500",
  },
};

export default function DebugOverlay({ imageUrl, debugInfo, colors }: DebugOverlayProps) {
  const { sample_points, image_width, image_height } = debugInfo;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Debug: Sample Points
        </h3>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        The markers show where colors were sampled from your photo.
      </p>

      {/* Image with overlay */}
      <div className="relative inline-block w-full max-w-lg mx-auto">
        <img
          src={imageUrl}
          alt="Analyzed photo"
          className="w-full h-auto rounded-lg"
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
                  style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
                >
                  {point.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center">
        {sample_points.map((point, index) => {
          const style = labelStyles[point.label];
          const extractedColor = colors[point.label];

          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-4 h-4 rounded-full border-2`}
                style={{
                  backgroundColor: extractedColor,
                  borderColor: style.color,
                }}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                {point.label}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                ({point.x}, {point.y})
              </span>
            </div>
          );
        })}
      </div>

      {/* Debug info */}
      <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs font-mono">
        <p className="text-slate-600 dark:text-slate-400">
          Image: {image_width} x {image_height}px
        </p>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Sample points: {sample_points.length}
        </p>
      </div>
    </div>
  );
}
