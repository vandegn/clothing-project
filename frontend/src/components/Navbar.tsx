'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const routes = [
  { href: '/', label: 'Home' },
  { href: '/analyze', label: 'Analyze' },
  { href: '/tryon', label: 'Try On' },
];

export default function Navbar() {
  const pathname = usePathname();

  const activeIndex = routes.findIndex((r) =>
    r.href === '/' ? pathname === '/' : pathname.startsWith(r.href)
  );

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1.5 p-1.5 rounded-full glass border border-[var(--color-stone-light)]/20"
        style={{
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.08)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-terracotta)] to-[var(--color-terracotta-dark)] flex items-center justify-center shrink-0"
        >
          <span className="text-white font-display text-sm font-medium">
            C
          </span>
        </Link>

        {/* Nav segments */}
        <div className="relative grid grid-cols-3">
          {/* Sliding indicator */}
          {activeIndex >= 0 && (
            <div
              className="absolute top-0 bottom-0 rounded-full bg-[var(--color-terracotta)]"
              style={{
                width: `${100 / routes.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
                transition:
                  'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          )}

          {routes.map((route) => {
            const isActive =
              route.href === '/'
                ? pathname === '/'
                : pathname.startsWith(route.href);

            return (
              <Link
                key={route.href}
                href={route.href}
                className={`relative z-10 px-5 py-2 text-sm font-medium text-center rounded-full transition-colors duration-300 active:scale-[0.98] ${
                  isActive
                    ? 'text-white'
                    : 'text-[var(--color-stone)] hover:text-[var(--color-charcoal)] dark:hover:text-[var(--color-cream)]'
                }`}
              >
                {route.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
