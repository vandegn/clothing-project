'use client'

import { useEffect, useState } from 'react'
import { getPackages, createCheckoutSession, type CreditPackage } from '@/lib/tryon-api'

interface PurchaseCreditsModalProps {
  onClose: () => void
}

export default function PurchaseCreditsModal({ onClose }: PurchaseCreditsModalProps) {
  const [packages, setPackages] = useState<CreditPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)

  useEffect(() => {
    getPackages()
      .then((pkgs) => setPackages(Object.values(pkgs)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handlePurchase = async (pkg: CreditPackage) => {
    setPurchasing(pkg.id)
    try {
      const url = await createCheckoutSession(pkg.id)
      window.location.href = url
    } catch {
      setPurchasing(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[var(--color-charcoal-soft)] border border-[var(--color-stone-light)]/20 shadow-2xl p-8 animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)] hover:bg-[var(--color-cream-dark)] dark:hover:bg-[var(--color-charcoal)] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="font-display text-2xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-2">
            Get Try-On Credits
          </h3>
          <p className="text-sm text-[var(--color-stone)]">
            Each credit lets you try on one outfit
          </p>
        </div>

        {/* Packages */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-[var(--color-terracotta)]/30 border-t-[var(--color-terracotta)] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4">
            {packages
              .sort((a, b) => a.price - b.price)
              .map((pkg) => {
                const perCredit = (pkg.price / 100 / pkg.credits).toFixed(2)
                const isBest = pkg.credits === 50
                return (
                  <button
                    key={pkg.id}
                    onClick={() => handlePurchase(pkg)}
                    disabled={purchasing !== null}
                    className={`
                      relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300
                      ${purchasing === pkg.id
                        ? 'border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5'
                        : 'border-[var(--color-stone-light)]/20 hover:border-[var(--color-terracotta)]/50 hover:shadow-lg'
                      }
                      ${purchasing !== null && purchasing !== pkg.id ? 'opacity-50' : ''}
                      bg-white/60 dark:bg-[var(--color-charcoal)]/40
                    `}
                  >
                    {isBest && (
                      <span className="absolute -top-2.5 left-5 px-2.5 py-0.5 rounded-full bg-[var(--color-sage)] text-white text-[10px] font-medium uppercase tracking-wider">
                        Best Value
                      </span>
                    )}
                    <div className="text-left">
                      <p className="font-display text-lg text-[var(--color-charcoal)] dark:text-[var(--color-cream)]">
                        {pkg.label}
                      </p>
                      <p className="text-xs text-[var(--color-stone)]">
                        ${perCredit} per credit
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {purchasing === pkg.id ? (
                        <div className="w-5 h-5 border-2 border-[var(--color-terracotta)]/30 border-t-[var(--color-terracotta)] rounded-full animate-spin" />
                      ) : (
                        <span className="font-display text-xl text-[var(--color-terracotta)]">
                          ${(pkg.price / 100).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}
