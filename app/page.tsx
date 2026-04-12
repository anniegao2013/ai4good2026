'use client'

import Link from 'next/link'
import { Skyline } from '@/components/Skyline'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <Skyline prominent />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <LighthouseIcon />
          <span className="text-4xl font-bold tracking-tight text-faro-primary">Faro</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-bold text-text-primary leading-tight mb-5 text-balance">
          Your finances,{' '}
          <span className="text-faro-primary">translated.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-text-secondary leading-relaxed mb-12 max-w-sm mx-auto">
          You already know how money works.{' '}
          <span className="text-text-primary font-medium">
            We&apos;ll show you how it works here.
          </span>
        </p>

        {/* CTA */}
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 bg-faro-primary hover:bg-faro-dark text-white font-semibold text-base px-8 py-4 rounded-2xl transition-colors shadow-lg shadow-faro-primary/20"
        >
          See how your finances translate
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>

        <p className="mt-5 text-xs text-text-secondary">
          Free. No account needed. Takes 2 minutes.
        </p>
      </div>
    </main>
  )
}

function LighthouseIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Lighthouse tower */}
      <rect x="15" y="10" width="6" height="18" rx="1" fill="#1D9E75" />
      {/* Lantern room */}
      <rect x="13" y="7"  width="10" height="5"  rx="1" fill="#085041" />
      {/* Light rays */}
      <line x1="18" y1="7"  x2="18" y2="2"  stroke="#1D9E75" strokeWidth="2" strokeLinecap="round" />
      <line x1="18" y1="7"  x2="23" y2="3"  stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18" y1="7"  x2="13" y2="3"  stroke="#1D9E75" strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <rect x="12" y="28" width="12" height="4"  rx="1" fill="#085041" />
      {/* Door */}
      <rect x="16.5" y="23" width="3"  height="5"  rx="1" fill="#085041" />
      {/* Windows */}
      <rect x="16.5" y="15" width="3"  height="2.5" rx="0.5" fill="#E1F5EE" />
      <rect x="16.5" y="19" width="3"  height="2.5" rx="0.5" fill="#E1F5EE" />
    </svg>
  )
}
