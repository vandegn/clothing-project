'use client'

import { createClient } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TryOnContentProps {
  user: User
}

export default function TryOnContent({ user }: TryOnContentProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
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
          {/* Logo / Back */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
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

          {/* User menu */}
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
        <div className="text-center mb-16 animate-on-load animate-fade-up">
          {/* Eyebrow */}
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

        {/* Coming Soon Card */}
        <div className="max-w-2xl mx-auto animate-on-load animate-fade-up delay-200">
          <div className="relative p-12 rounded-3xl bg-white/60 dark:bg-[var(--color-charcoal-soft)]/40 backdrop-blur-sm border border-[var(--color-stone-light)]/20 shadow-xl shadow-[var(--color-stone)]/5 text-center overflow-hidden">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sage)]/5 via-transparent to-[var(--color-blush)]/5 pointer-events-none" />

            {/* Icon */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-sage)]/70 rounded-3xl rotate-6 opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-sage)] to-[var(--color-sage)]/70 rounded-3xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <h3 className="relative font-display text-3xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-4">
              Coming Soon
            </h3>
            <p className="relative text-[var(--color-stone)] leading-relaxed max-w-md mx-auto mb-8">
              Upload a full-body photo and a clothing item to see how it would look on you.
              Powered by advanced AI vision technology.
            </p>

            {/* Feature preview */}
            <div className="relative flex flex-wrap justify-center gap-3">
              {['Upload Photo', 'Select Clothing', 'AI Generation', 'Download Result'].map((step, i) => (
                <div
                  key={step}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-cream-dark)] dark:bg-[var(--color-charcoal)] text-sm text-[var(--color-stone)]"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--color-sage)]/20 text-[var(--color-sage)] text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  {step}
                </div>
              ))}
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-12 right-12 h-1 bg-gradient-to-r from-transparent via-[var(--color-sage)]/40 to-transparent" />
          </div>
        </div>

        {/* Credits Section (placeholder for future) */}
        <div className="max-w-2xl mx-auto mt-8 animate-on-load animate-fade-up delay-400">
          <div className="flex items-center justify-center gap-6 p-6 rounded-2xl bg-white/40 dark:bg-[var(--color-charcoal-soft)]/20 border border-[var(--color-stone-light)]/10">
            <div className="text-center">
              <p className="text-2xl font-display text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">0</p>
              <p className="text-xs text-[var(--color-stone)] uppercase tracking-wider">Credits</p>
            </div>
            <div className="w-px h-10 bg-[var(--color-stone-light)]/20" />
            <button className="px-6 py-2.5 rounded-full bg-[var(--color-terracotta)] text-white text-sm font-medium hover:bg-[var(--color-terracotta-dark)] transition-colors duration-300 shadow-lg shadow-[var(--color-terracotta)]/20">
              Get Credits
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center animate-on-load animate-fade-up delay-600">
          <div className="inline-flex items-center gap-4 text-xs text-[var(--color-stone-light)]">
            <span>1 credit per try-on</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
            <span>Results in ~30 seconds</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-stone-light)]" />
            <span>Powered by GPT-4 Vision</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
