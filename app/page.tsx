'use client'

import Link from 'next/link'
import { Skyline } from '@/components/Skyline'

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <Skyline prominent />

      <div className="relative z-10 max-w-md w-full">
        {/* Wordmark */}
        <p className="text-sm text-text-secondary mb-10 tracking-widest uppercase">Settle</p>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-text-primary leading-tight mb-6">
          Your finances,<br />translated.
        </h1>

        {/* Subtext */}
        <p className="text-base text-text-secondary leading-relaxed mb-10 max-w-xs">
          You already know how money works where you&rsquo;re from.
          We&rsquo;ll show you how it works here.
        </p>

        {/* CTA */}
        <Link
          href="/onboarding"
          className="inline-block bg-faro-primary text-white font-medium text-sm px-6 py-3 rounded-lg hover:bg-faro-dark transition-colors"
        >
          Get started
        </Link>

        <p className="mt-5 text-xs text-text-secondary">
          Free &middot; No account needed &middot; 2 minutes
        </p>
      </div>
    </main>
  )
}
