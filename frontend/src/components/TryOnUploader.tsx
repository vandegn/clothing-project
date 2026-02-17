'use client'

import { useCallback, useState } from 'react'

interface UploadPaneProps {
  label: string
  hint: string
  image: string | null
  onImage: (base64: string | null) => void
  inputId: string
}

function UploadPane({ label, hint, image, onImage, inputId }: UploadPaneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const processFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => onImage(e.target?.result as string)
      reader.readAsDataURL(file)
    },
    [onImage]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) processFile(file)
    },
    [processFile]
  )

  if (image) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)] border border-[var(--color-stone-light)]/20 aspect-[3/4] group">
        <img
          src={image}
          alt={label}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-xs font-medium mb-2">{label}</p>
          <button
            onClick={() => onImage(null)}
            className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs hover:bg-white/30 transition-colors"
          >
            Change
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
      className={`
        relative rounded-2xl border-2 border-dashed aspect-[3/4]
        flex flex-col items-center justify-center gap-4 p-6 text-center cursor-pointer
        transition-all duration-300
        bg-white/40 dark:bg-[var(--color-charcoal-soft)]/30 backdrop-blur-sm
        ${isDragging
          ? 'border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5 scale-[1.02]'
          : 'border-[var(--color-stone-light)]/40 hover:border-[var(--color-terracotta)]/60 hover:bg-white/60 dark:hover:bg-[var(--color-charcoal-soft)]/50'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) processFile(file)
        }}
        className="hidden"
        id={inputId}
      />
      <label htmlFor={inputId} className="cursor-pointer flex flex-col items-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-light)]/20 to-[var(--color-blush)]/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="font-display text-lg text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
            {label}
          </p>
          <p className="text-xs text-[var(--color-stone)] mt-1">{hint}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-stone-light)]">
          <span className="px-1.5 py-0.5 rounded bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">PNG</span>
          <span className="px-1.5 py-0.5 rounded bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">JPG</span>
          <span className="px-1.5 py-0.5 rounded bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">WEBP</span>
        </div>
      </label>
    </div>
  )
}

interface TryOnUploaderProps {
  bodyImage: string | null
  clothingImage: string | null
  onBodyImage: (img: string | null) => void
  onClothingImage: (img: string | null) => void
}

export default function TryOnUploader({
  bodyImage,
  clothingImage,
  onBodyImage,
  onClothingImage,
}: TryOnUploaderProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <UploadPane
        label="Your Photo"
        hint="Full-body photo works best"
        image={bodyImage}
        onImage={onBodyImage}
        inputId="body-upload"
      />
      <UploadPane
        label="Clothing Item"
        hint="Flat-lay or product image"
        image={clothingImage}
        onImage={onClothingImage}
        inputId="clothing-upload"
      />
    </div>
  )
}
