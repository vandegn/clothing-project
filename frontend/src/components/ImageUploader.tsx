"use client";

import { useCallback, useState } from "react";

interface ImageUploaderProps {
  onImageUpload: (base64Image: string) => void;
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setPreview(base64);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleAnalyze = () => {
    if (preview) {
      onImageUpload(preview);
    }
  };

  const handleClear = () => {
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative group
            border-2 border-dashed rounded-3xl p-12 md:p-16 text-center cursor-pointer
            transition-all duration-500 ease-out
            bg-white/40 dark:bg-[var(--color-charcoal-soft)]/30
            backdrop-blur-sm
            ${
              isDragging
                ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5 scale-[1.02]"
                : "border-[var(--color-stone-light)]/40 hover:border-[var(--color-terracotta)]/60 hover:bg-white/60 dark:hover:bg-[var(--color-charcoal-soft)]/50"
            }
          `}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--color-stone-light)]/30 rounded-tl-lg transition-colors duration-300 group-hover:border-[var(--color-terracotta)]/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[var(--color-stone-light)]/30 rounded-tr-lg transition-colors duration-300 group-hover:border-[var(--color-terracotta)]/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--color-stone-light)]/30 rounded-bl-lg transition-colors duration-300 group-hover:border-[var(--color-terracotta)]/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--color-stone-light)]/30 rounded-br-lg transition-colors duration-300 group-hover:border-[var(--color-terracotta)]/50" />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-6">
              {/* Icon */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-light)]/20 to-[var(--color-blush)]/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <svg
                    className="w-10 h-10 text-[var(--color-terracotta)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                {/* Floating accent */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-terracotta)] animate-pulse" />
              </div>

              {/* Text */}
              <div className="space-y-2">
                <p className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                  Drop your selfie here
                </p>
                <p className="text-[var(--color-stone)] text-sm">
                  or <span className="text-[var(--color-terracotta)] font-medium hover:underline">browse</span> to choose
                </p>
              </div>

              {/* Format hint */}
              <div className="flex items-center gap-2 text-xs text-[var(--color-stone-light)]">
                <span className="px-2 py-1 rounded-md bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">PNG</span>
                <span className="px-2 py-1 rounded-md bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">JPG</span>
                <span className="px-2 py-1 rounded-md bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">WEBP</span>
                <span className="text-[var(--color-stone-light)]">up to 10MB</span>
              </div>
            </div>
          </label>
        </div>
      ) : (
        <div className="space-y-6 animate-scale-in">
          {/* Preview Container */}
          <div className="relative rounded-3xl overflow-hidden bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)] shadow-2xl shadow-[var(--color-stone)]/10">
            {/* Gradient overlay top */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/20 to-transparent z-10 pointer-events-none" />

            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
            />

            {/* Preview badge */}
            <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur-sm">
              <span className="text-xs font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                Preview
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleClear}
              className="
                group relative px-6 py-3
                text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]
                bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]
                rounded-full font-medium text-sm
                transition-all duration-300
                hover:shadow-lg hover:shadow-[var(--color-stone)]/10
              "
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Choose Different
              </span>
            </button>

            <button
              onClick={handleAnalyze}
              className="
                group relative px-8 py-3
                text-white
                bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)]
                rounded-full font-medium text-sm
                transition-all duration-300
                hover:shadow-xl hover:shadow-[var(--color-terracotta)]/30
                hover:scale-[1.02]
                active:scale-[0.98]
              "
            >
              <span className="flex items-center gap-2">
                Analyze My Colors
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>

              {/* Shimmer effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                <div className="absolute inset-0 animate-shimmer opacity-30" />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
