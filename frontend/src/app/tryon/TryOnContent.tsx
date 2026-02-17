'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { submitTryOn } from '@/lib/tryon-api'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import TryOnUploader from '@/components/TryOnUploader'
import PurchaseCreditsModal from '@/components/PurchaseCreditsModal'

const PROCESSING_MESSAGES = [
  'Analyzing your photo...',
  'Matching the outfit...',
  'Generating your look...',
  'Adding finishing touches...',
]

interface TryOnContentProps {
  user: User
  paymentStatus?: string | null
}

export default function TryOnContent({ user, paymentStatus }: TryOnContentProps) {
  const router = useRouter()
  const supabase = createClient()
  const resultRef = useRef<HTMLDivElement>(null)

  const [credits, setCredits] = useState<number | null>(null)
  const [bodyImage, setBodyImage] = useState<string | null>(null)
  const [clothingImage, setClothingImage] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)

  // Validation & warning
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [skipWarning, setSkipWarning] = useState(false)

  // Processing animation
  const [processingStep, setProcessingStep] = useState(0)

  const fetchCredits = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single()
    if (data) setCredits(data.credits)
  }

  useEffect(() => {
    fetchCredits()
    setSkipWarning(localStorage.getItem('chromatic_skip_warning') === 'true')
  }, [])

  // Re-fetch credits after returning from Stripe
  useEffect(() => {
    if (paymentStatus === 'success') {
      const timer = setTimeout(fetchCredits, 1500)
      return () => clearTimeout(timer)
    }
  }, [paymentStatus])

  // Rotate processing messages
  useEffect(() => {
    if (!submitting) { setProcessingStep(0); return }
    const interval = setInterval(() => {
      setProcessingStep(s => (s + 1) % PROCESSING_MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [submitting])

  // Scroll to result
  useEffect(() => {
    if (resultImage && resultRef.current) {
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [resultImage])

  // Auto-dismiss upload error
  useEffect(() => {
    if (!uploadError) return
    const t = setTimeout(() => setUploadError(null), 5000)
    return () => clearTimeout(t)
  }, [uploadError])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleTryOn = async () => {
    setUploadError(null)

    // 1) Validate images
    if (!bodyImage && !clothingImage) {
      setUploadError('Please upload both your photo and a clothing item')
      return
    }
    if (!bodyImage) {
      setUploadError('Please upload your full-body photo')
      return
    }
    if (!clothingImage) {
      setUploadError('Please upload a clothing item image')
      return
    }

    // 2) Check credits
    if (!credits || credits < 1) {
      setShowModal(true)
      return
    }

    // 3) Show warning if not dismissed
    if (!skipWarning) {
      setShowWarning(true)
      return
    }

    // 4) Submit
    await doSubmit()
  }

  const handleWarningContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem('chromatic_skip_warning', 'true')
      setSkipWarning(true)
    }
    setShowWarning(false)
    doSubmit()
  }

  const doSubmit = async () => {
    setSubmitting(true)
    setResult(null)
    setResultImage(null)

    try {
      const res = await submitTryOn(user.id, bodyImage!, clothingImage!)
      setResult(res.message)
      setResultImage(res.result_image || null)
      setCredits(res.credits_remaining)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.'
      if (msg === 'Insufficient credits') {
        setShowModal(true)
      } else {
        setResult(msg)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${resultImage}`
    link.download = 'chromatic-tryon.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleTryAnother = () => {
    setResult(null)
    setResultImage(null)
    setBodyImage(null)
    setClothingImage(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] dark:bg-[#0F0E0D] relative overflow-hidden noise-overlay">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[var(--color-sage)]/20 via-[var(--color-blush)]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-gradient" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[var(--color-terracotta-light)]/15 via-[var(--color-stone-light)]/10 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

      {/* Floating color orbs */}
      <div className="absolute top-40 left-[15%] w-3 h-3 rounded-full bg-[var(--color-sage)] animate-float opacity-60" />
      <div className="absolute top-60 right-[20%] w-2 h-2 rounded-full bg-[var(--color-terracotta)] animate-float delay-300 opacity-50" />
      <div className="absolute top-80 left-[25%] w-4 h-4 rounded-full bg-[var(--color-blush)] animate-float delay-500 opacity-40" />

      {/* Header */}
      <header className="relative z-20 glass border-b border-[var(--color-stone-light)]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] flex items-center justify-center shadow-lg shadow-[var(--color-terracotta)]/20 group-hover:shadow-xl group-hover:shadow-[var(--color-terracotta)]/30 transition-all duration-300">
              <span className="text-white font-display text-lg font-medium">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                Chromatic
              </h1>
              <p className="text-xs text-[var(--color-stone)]">Virtual Try-On</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/50 dark:bg-[var(--color-charcoal-soft)]/50 border border-[var(--color-stone-light)]/20">
              {user.user_metadata?.avatar_url && (
                <img
                  src={user.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-7 h-7 rounded-full ring-2 ring-[var(--color-terracotta)]/20"
                />
              )}
              <span className="text-sm text-[var(--color-charcoal)] dark:text-[var(--color-cream)] font-medium hidden sm:inline">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-sm text-[var(--color-stone)] hover:text-[var(--color-terracotta)] transition-colors duration-300"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="text-center mb-12 animate-on-load animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)] mb-8">
            <span className="w-2 h-2 rounded-full bg-[var(--color-sage)] animate-pulse" />
            <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
              AI-Powered Styling
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-6 tracking-tight leading-tight">
            Virtual
            <br />
            <span className="italic text-[var(--color-sage)]">Try-On</span>
          </h2>

          <p className="text-lg text-[var(--color-stone)] max-w-xl mx-auto leading-relaxed">
            See how clothes look on you before you buy. Upload a photo and let AI do the magic.
          </p>
        </div>

        {/* Credits Bar */}
        <div className="max-w-2xl mx-auto mb-10 animate-on-load animate-fade-up delay-200">
          <div className="flex items-center justify-center gap-6 p-5 rounded-2xl bg-white/40 dark:bg-[var(--color-charcoal-soft)]/20 border border-[var(--color-stone-light)]/10">
            <div className="text-center">
              <p className="text-2xl font-display text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                {credits !== null ? credits : '...'}
              </p>
              <p className="text-xs text-[var(--color-stone)] uppercase tracking-wider">Credits</p>
            </div>
            <div className="w-px h-10 bg-[var(--color-stone-light)]/20" />
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-2.5 rounded-full bg-[var(--color-terracotta)] text-white text-sm font-medium hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300 shadow-lg shadow-[var(--color-terracotta)]/20"
            >
              Get Credits
            </button>
          </div>
          {paymentStatus === 'success' && (
            <p className="text-center text-sm text-[var(--color-sage)] mt-3 font-medium">
              Payment successful! Your credits have been added.
            </p>
          )}
        </div>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto animate-on-load animate-fade-up delay-300">
          <TryOnUploader
            bodyImage={bodyImage}
            clothingImage={clothingImage}
            onBodyImage={setBodyImage}
            onClothingImage={setClothingImage}
          />
        </div>

        {/* Upload Validation Error */}
        {uploadError && (
          <div className="max-w-2xl mx-auto mt-4 animate-scale-in">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20">
              <div className="w-8 h-8 shrink-0 rounded-full bg-[var(--color-terracotta)]/15 flex items-center justify-center">
                <svg className="w-4 h-4 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm text-[var(--color-terracotta-dark)] dark:text-[var(--color-terracotta)] font-medium">
                {uploadError}
              </p>
              <button
                onClick={() => setUploadError(null)}
                className="ml-auto text-[var(--color-terracotta)]/60 hover:text-[var(--color-terracotta)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Try On Button */}
        <div className="max-w-2xl mx-auto mt-8 text-center animate-on-load animate-fade-up delay-400">
          <button
            onClick={handleTryOn}
            disabled={submitting}
            className={`
              group relative px-10 py-4 rounded-full font-medium text-sm
              transition-all duration-300
              ${!submitting
                ? 'bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] text-white hover:shadow-xl hover:shadow-[var(--color-terracotta)]/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-[var(--color-stone-light)]/30 text-[var(--color-stone)] cursor-not-allowed'
              }
            `}
          >
            {submitting ? (
              <span className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="transition-opacity duration-500" key={processingStep}>
                  {PROCESSING_MESSAGES[processingStep]}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Try On
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            )}
          </button>

          {!submitting && !resultImage && (
            <p className="text-xs text-[var(--color-stone-light)] mt-3">
              {!bodyImage || !clothingImage
                ? 'Upload both images to enable try-on'
                : '1 credit will be used'}
            </p>
          )}
        </div>

        {/* Error Result (no image) */}
        {result && !resultImage && !submitting && (
          <div className="max-w-2xl mx-auto mt-8 p-6 rounded-2xl bg-[var(--color-terracotta)]/5 border border-[var(--color-terracotta)]/20 text-center animate-scale-in">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-terracotta)]/15 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[var(--color-charcoal)] dark:text-[var(--color-cream)] font-medium">{result}</p>
            <button
              onClick={() => setResult(null)}
              className="mt-4 text-sm text-[var(--color-terracotta)] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* ── AI Result Display ── */}
        {resultImage && (
          <div ref={resultRef} className="max-w-4xl mx-auto mt-16 animate-scale-in">
            {/* Section header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-sage)]/10 border border-[var(--color-sage)]/20 mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
                <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-sage)]">
                  AI Generated
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] tracking-tight">
                Your <span className="italic text-[var(--color-sage)]">Look</span>
              </h3>
              <p className="text-sm text-[var(--color-stone)] mt-2">
                Here&apos;s how you&apos;d look in this outfit
              </p>
            </div>

            {/* Triptych: body + clothing → result */}
            <div className="grid grid-cols-5 gap-4 md:gap-6 items-center">
              {/* Input images — left column */}
              <div className="col-span-2 flex flex-col gap-3">
                {/* Body photo */}
                <div className="relative rounded-2xl overflow-hidden border border-[var(--color-stone-light)]/20 bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">
                  <div className="aspect-[3/4]">
                    <img
                      src={bodyImage!}
                      alt="Your photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-[10px] font-medium tracking-wider uppercase">Your Photo</p>
                  </div>
                </div>

                {/* Connector */}
                <div className="flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-stone-light)]/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[var(--color-stone)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>

                {/* Clothing */}
                <div className="relative rounded-2xl overflow-hidden border border-[var(--color-stone-light)]/20 bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal-soft)]">
                  <div className="aspect-[3/4]">
                    <img
                      src={clothingImage!}
                      alt="Clothing item"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/50 to-transparent">
                    <p className="text-white text-[10px] font-medium tracking-wider uppercase">Outfit</p>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="col-span-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-[var(--color-terracotta)] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="text-[10px] text-[var(--color-stone-light)] uppercase tracking-widest">Result</span>
                </div>
              </div>

              {/* Hero result image — right column */}
              <div className="col-span-2">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[var(--color-charcoal)]/10 ring-2 ring-[var(--color-sage)]/30">
                  <div className="aspect-square">
                    <img
                      src={`data:image/png;base64,${resultImage}`}
                      alt="Virtual try-on result"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Subtle gradient overlay at top */}
                  <div className="absolute top-0 inset-x-0 p-3 bg-gradient-to-b from-black/30 to-transparent flex justify-end">
                    <div className="px-2 py-1 rounded-full bg-[var(--color-sage)]/80 backdrop-blur-sm">
                      <span className="text-white text-[10px] font-medium tracking-wider uppercase">AI Generated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 border border-[var(--color-stone-light)]/20 text-sm font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] hover:bg-white/80 dark:hover:bg-[var(--color-charcoal-soft)]/60 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <button
                onClick={handleTryAnother}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] text-white text-sm font-medium hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20 transition-all duration-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Another
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-24 text-center animate-on-load animate-fade-up delay-600">
          <div className="inline-flex items-center gap-4 text-xs text-[var(--color-stone-light)]">
            <span>1 credit per try-on</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
            <span>Results in ~30 seconds</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
            <span>Powered by AI Vision</span>
          </div>
        </footer>
      </main>

      {/* ── Photo Quality Warning Modal ── */}
      {showWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowWarning(false)}
          />

          {/* Modal card */}
          <div className="relative w-full max-w-md rounded-3xl bg-white/90 dark:bg-[#1A1918]/90 backdrop-blur-xl border border-[var(--color-stone-light)]/20 shadow-2xl shadow-black/10 p-8 animate-scale-in">
            {/* Icon */}
            <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-[var(--color-terracotta-light)]/20 to-[var(--color-blush)]/20 flex items-center justify-center">
              <svg className="w-7 h-7 text-[var(--color-terracotta)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>

            <h3 className="font-display text-xl text-center text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
              Quick Photo Check
            </h3>
            <p className="text-sm text-[var(--color-stone)] text-center mb-6 leading-relaxed">
              For the best results, double-check your reference photo:
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-6">
              {[
                'Full body visible in the frame',
                'Good, even lighting',
                'Facing the camera directly',
                'Simple background preferred',
              ].map((tip) => (
                <li key={tip} className="flex items-center gap-3">
                  <div className="w-5 h-5 shrink-0 rounded-full bg-[var(--color-sage)]/15 flex items-center justify-center">
                    <svg className="w-3 h-3 text-[var(--color-sage)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-[var(--color-charcoal)] dark:text-[var(--color-cream-dark)]">{tip}</span>
                </li>
              ))}
            </ul>

            {/* Don't show again */}
            <label className="flex items-center gap-3 mb-6 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-5 h-5 rounded-md border-2 border-[var(--color-stone-light)]/40 peer-checked:border-[var(--color-terracotta)] peer-checked:bg-[var(--color-terracotta)] transition-all duration-200 flex items-center justify-center">
                  {dontShowAgain && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[var(--color-stone)] group-hover:text-[var(--color-charcoal)] dark:group-hover:text-[var(--color-cream)] transition-colors">
                Do not warn me about this again
              </span>
            </label>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowWarning(false)}
                className="flex-1 px-5 py-3 rounded-full border border-[var(--color-stone-light)]/30 text-sm font-medium text-[var(--color-stone)] hover:text-[var(--color-charcoal)] hover:border-[var(--color-stone-light)]/60 transition-all duration-300"
              >
                Go Back
              </button>
              <button
                onClick={handleWarningContinue}
                className="flex-1 px-5 py-3 rounded-full bg-gradient-to-r from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] text-white text-sm font-medium hover:shadow-lg hover:shadow-[var(--color-terracotta)]/20 transition-all duration-300"
              >
                Looks Good, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase Credits Modal */}
      {showModal && (
        <PurchaseCreditsModal
          userId={user.id}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}
