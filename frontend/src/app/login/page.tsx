'use client'

import { createClient } from '@/lib/supabase'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

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
                Chromatic
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
      <div className="absolute top-32 left-[20%] w-3 h-3 rounded-full bg-[var(--color-terracotta)] animate-float opacity-60" />
      <div className="absolute top-48 right-[25%] w-2 h-2 rounded-full bg-[var(--color-sage)] animate-float delay-300 opacity-50" />
      <div className="absolute bottom-32 left-[30%] w-4 h-4 rounded-full bg-[var(--color-blush)] animate-float delay-500 opacity-40" />

      {/* Main content - centered */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-73px)] p-6">
        <div className="w-full max-w-md">
          {/* Login card */}
          <div className="animate-fade-up bg-white/70 dark:bg-[var(--color-charcoal-soft)]/50 backdrop-blur-xl rounded-3xl p-10 border border-[var(--color-stone-light)]/20 shadow-2xl shadow-[var(--color-stone)]/10">
            {/* Header */}
            <div className="text-center mb-10">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)] mb-6">
                <span className="w-2 h-2 rounded-full bg-[var(--color-terracotta)] animate-pulse" />
                <span className="text-xs font-medium tracking-widest uppercase text-[var(--color-stone)]">
                  Virtual Try-On
                </span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl font-medium text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-4 tracking-tight leading-tight">
                Welcome
                <br />
                <span className="italic text-[var(--color-terracotta)]">Back</span>
              </h1>

              <p className="text-[var(--color-stone)] leading-relaxed">
                Sign in to access your personalized virtual fitting room
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl animate-scale-in">
                <p className="text-red-700 dark:text-red-400 text-center text-sm">{error}</p>
              </div>
            )}

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[var(--color-charcoal)] border-2 border-[var(--color-stone-light)]/30 rounded-2xl px-6 py-4 text-[var(--color-charcoal)] dark:text-[var(--color-cream)] font-medium hover:border-[var(--color-terracotta)]/50 hover:shadow-lg hover:shadow-[var(--color-terracotta)]/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-[var(--color-stone-light)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Continue with Google'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-stone-light)]/30 to-transparent" />
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-[var(--color-stone-light)] leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="text-[var(--color-terracotta)] hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-[var(--color-terracotta)] hover:underline">Privacy Policy</a>
            </p>
          </div>

          {/* Footer decoration */}
          <div className="flex justify-center mt-8 animate-fade-in delay-300">
            <div className="inline-flex items-center gap-3 text-xs text-[var(--color-stone-light)]">
              <span className="w-8 h-px bg-[var(--color-stone-light)]/30" />
              <span>Secured with Supabase</span>
              <span className="w-8 h-px bg-[var(--color-stone-light)]/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
