'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const comparisons = [
  {
    id: 'person1',
    before: '/before-after/person1/before.png',
    after: '/before-after/person1/after.png',
    season: 'Winter',
    insight:
      'A muted dusty rose washes out cool undertones, while rich crimson creates striking contrast that brings the whole look alive.',
  },
  {
    id: 'person2',
    before: '/before-after/person2/before.png',
    after: '/before-after/person2/after.png',
    season: 'Summer',
    insight:
      'Warm forest green clashes with cool undertones, but a soft steel blue harmonizes naturally and lets skin glow.',
  },
];

function ComparisonCard({
  comparison,
  reverse,
}: {
  comparison: (typeof comparisons)[number];
  reverse: boolean;
}) {
  return (
    <div
      className={`flex flex-col ${
        reverse ? 'md:flex-row-reverse' : 'md:flex-row'
      } items-center gap-8 md:gap-12`}
    >
      {/* === Mobile: clean side-by-side === */}
      <div className="flex md:hidden gap-3 w-full px-2">
        <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={comparison.before}
            alt="Before"
            fill
            className="object-cover"
            sizes="45vw"
          />
          <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase bg-white/80 backdrop-blur-sm text-[var(--color-stone)] shadow-sm">
            Before
          </span>
        </div>
        <div className="flex items-center shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="text-[var(--color-terracotta)] opacity-60"
          >
            <path
              d="M4 10h12m0 0l-4-4m4 4l-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={comparison.after}
            alt="After"
            fill
            className="object-cover"
            sizes="45vw"
          />
          <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wider uppercase bg-[var(--color-terracotta)] text-white shadow-sm">
            After
          </span>
        </div>
      </div>

      {/* === Desktop: overlapping cards with hover fan-out === */}
      <div className="hidden md:flex items-center justify-center w-[65%] h-[520px]">
        {/* Tight hover target — sized to the rest-state card bounds */}
        <motion.div
          className="relative w-[60%] h-[90%] cursor-pointer"
          initial="rest"
          whileHover="hover"
          style={{ overflow: 'visible' }}
        >
          {/* Before card — behind, rotated left */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[73%] h-[91%] rounded-2xl overflow-hidden shadow-lg border border-[var(--color-stone-light)]/10"
            variants={{
              rest: { x: '-58%', y: '-50%', rotate: -5, scale: 0.97 },
              hover: { x: '-104%', y: '-50%', rotate: -1, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{ zIndex: 1 }}
          >
            <Image
              src={comparison.before}
              alt="Before — wearing the wrong seasonal color"
              fill
              className="object-cover"
              sizes="28vw"
            />
            <div className="absolute inset-0 bg-[var(--color-stone)]/[0.04]" />
            <motion.span
              className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-white/80 dark:bg-[var(--color-charcoal-soft)]/80 backdrop-blur-sm text-[var(--color-stone)] shadow-sm"
              variants={{
                rest: { opacity: 0.4, y: 6 },
                hover: { opacity: 1, y: 0 },
              }}
            >
              Before
            </motion.span>
          </motion.div>

          {/* After card — in front, rotated right */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-[73%] h-[91%] rounded-2xl overflow-hidden shadow-2xl"
            variants={{
              rest: { x: '-42%', y: '-50%', rotate: 4, scale: 1 },
              hover: { x: '4%', y: '-50%', rotate: 1, scale: 1 },
            }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            style={{ zIndex: 2 }}
          >
            <Image
              src={comparison.after}
              alt="After — wearing the correct seasonal color"
              fill
              className="object-cover"
              sizes="28vw"
            />
            <motion.span
              className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase bg-[var(--color-terracotta)] text-white shadow-sm"
              variants={{
                rest: { opacity: 0.4, y: 6 },
                hover: { opacity: 1, y: 0 },
              }}
            >
              After
            </motion.span>
          </motion.div>

          {/* Hover hint */}
          <motion.p
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-[var(--color-stone-light)] whitespace-nowrap"
            variants={{ rest: { opacity: 0.5 }, hover: { opacity: 0 } }}
            style={{ zIndex: 3 }}
          >
            Hover to compare
          </motion.p>
        </motion.div>
      </div>

      {/* Text content */}
      <div
        className={`w-full md:w-[35%] text-center ${
          reverse ? 'md:text-right' : 'md:text-left'
        }`}
      >
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-[var(--color-terracotta)] mb-3">
          {comparison.season} Season
        </p>
        <p
          className={`text-[var(--color-stone)] text-sm leading-relaxed max-w-sm mx-auto ${
            reverse ? 'md:ml-auto md:mr-0' : 'md:mx-0'
          }`}
        >
          {comparison.insight}
        </p>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <section className="mt-24 animate-on-load animate-fade-up delay-700">
      {/* Editorial section header */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-stone-light)]" />
        <h2 className="font-display text-sm tracking-[0.3em] uppercase text-[var(--color-stone)]">
          The Right Colors Matter
        </h2>
        <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-stone-light)]" />
      </div>

      <div className="text-center mb-16">
        <h3 className="font-display text-3xl md:text-4xl text-[var(--color-charcoal)] dark:text-[var(--color-cream)] mb-3">
          See the Difference
        </h3>
        <p className="text-[var(--color-stone)] max-w-lg mx-auto">
          Wearing your seasonal palette transforms your entire look
        </p>
      </div>

      <div className="space-y-16 md:space-y-24">
        {comparisons.map((comparison, index) => (
          <ComparisonCard
            key={comparison.id}
            comparison={comparison}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
