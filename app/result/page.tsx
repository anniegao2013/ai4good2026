'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skyline } from '@/components/Skyline'
import { TranslationRow } from '@/components/TranslationRow'
import { BuildingBlock } from '@/components/BuildingBlock'
import type { FaroResult, FaroProfile, ResultBlock } from '@/lib/types'

const BLOCK_STATUS = ['start_here', 'up_next', 'coming_soon'] as const

const COUNTRY_LABELS: Record<string, string> = {
  MX: 'Mexico', IN: 'India', PH: 'Philippines', NG: 'Nigeria',
  GT: 'Guatemala', SV: 'El Salvador', HN: 'Honduras', OTHER: 'your home country',
}

export default function ResultPage() {
  const [result, setResult] = useState<FaroResult | null>(null)
  const [profile, setProfile] = useState<FaroProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [block0Done, setBlock0Done] = useState(false)

  useEffect(() => {
    const rawProfile = localStorage.getItem('faro_profile')
    if (!rawProfile) {
      setError('no_profile')
      setLoading(false)
      return
    }

    const parsed: FaroProfile = JSON.parse(rawProfile)
    setProfile(parsed)

    // Check if already completed block 0
    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    if (progress.block0_completed) setBlock0Done(true)

    // Call API
    fetch('/api/parallel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    })
      .then((r) => {
        if (!r.ok) throw new Error('API error')
        return r.json()
      })
      .then((data: FaroResult) => {
        setResult(data)
        // Cache result
        localStorage.setItem('faro_result', JSON.stringify(data))
      })
      .catch(() => {
        // Try cached result
        const cached = localStorage.getItem('faro_result')
        if (cached) setResult(JSON.parse(cached))
        else setError('api_failed')
      })
      .finally(() => setLoading(false))
  }, [])

  function markBlock0Done() {
    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    localStorage.setItem('faro_progress', JSON.stringify({ ...progress, block0_completed: true }))
    setBlock0Done(true)
  }

  // ── Error states ────────────────────────────────────────────────────────
  if (error === 'no_profile') {
    return (
      <Centered>
        <p className="text-text-secondary mb-5">No profile found. Please complete the onboarding first.</p>
        <Link href="/onboarding" className="bg-faro-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-faro-dark transition-colors">
          Start onboarding
        </Link>
      </Centered>
    )
  }

  if (error === 'api_failed') {
    return (
      <Centered>
        <p className="text-text-secondary mb-5">Couldn&apos;t load your results. Please try again.</p>
        <button onClick={() => window.location.reload()} className="bg-faro-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-faro-dark transition-colors">
          Retry
        </button>
      </Centered>
    )
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading || !result || !profile) {
    return (
      <main className="relative min-h-screen bg-white flex flex-col">
        <Skyline />
        <NavBar />
        <div className="relative z-10 max-w-2xl mx-auto w-full px-6 py-10 space-y-4">
          <SkeletonCard h="h-28" />
          <SkeletonCard h="h-16" />
          <SkeletonCard h="h-16" />
          <SkeletonCard h="h-40" />
        </div>
      </main>
    )
  }

  const countryLabel = COUNTRY_LABELS[profile.country] ?? profile.country

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <Skyline />

      <NavBar />

      <div className="relative z-10 max-w-2xl mx-auto w-full px-6 py-10 space-y-10">

        {/* ── Section A: Translation card ─────────────────────────────────── */}
        <section>
          {/* AI Portrait */}
          <div className="border-l-4 border-faro-primary bg-faro-surface rounded-r-2xl px-6 py-5 mb-7">
            <p className="text-text-primary text-lg leading-relaxed">{result.portrait}</p>
            {result.fallback && (
              <p className="mt-2 text-xs text-text-secondary italic">
                (AI unavailable — using verified knowledge graph only)
              </p>
            )}
          </div>

          {/* Translation map */}
          {result.concepts && result.concepts.length > 0 && (
            <div className="bg-white border border-faro-border rounded-2xl px-5 py-1">
              <div className="py-3 border-b border-faro-border">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
                  {countryLabel} → United States
                </span>
              </div>
              {result.concepts.map((c, i) => (
                <TranslationRow
                  key={c.id ?? i}
                  homeConcept={c.homeConcept}
                  usEquivalent={c.usEquivalent}
                  category={c.category}
                  keyDifference={c.keyDifference}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Section B: Your 3 priorities ────────────────────────────────── */}
        {result.blocks && result.blocks.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Your 3 priorities</h2>
            <div className="space-y-3">
              {result.blocks.map((block: ResultBlock, i: number) => (
                <BuildingBlock
                  key={i}
                  title={block.title}
                  explanation={block.explanation}
                  status={BLOCK_STATUS[i] ?? 'coming_soon'}
                  locked={i > 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Section C: First block expanded ─────────────────────────────── */}
        {result.blocks && result.blocks[0] && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Let&apos;s start here
            </h2>
            <BuildingBlock
              title={result.blocks[0].title}
              explanation={result.blocks[0].explanation}
              status="start_here"
              expanded
              keyDifference={result.blocks[0].keyDifference}
              action={result.blocks[0].action}
              actionUrl={result.blocks[0].actionUrl}
              onComplete={markBlock0Done}
              completed={block0Done}
            />
          </section>
        )}

        {/* ── Footer CTA ────────────────────────────────────────────────── */}
        <div className="text-center pb-8">
          <p className="text-sm text-text-secondary mb-4">
            Know someone who just arrived? Share Faro with them.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Faro — Your finances, translated.', url: window.location.origin })
                } else {
                  navigator.clipboard.writeText(window.location.origin)
                  alert('Link copied!')
                }
              }}
              className="bg-faro-primary hover:bg-faro-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Share Faro
            </button>
            <Link
              href="/onboarding"
              className="border border-faro-border hover:border-faro-primary text-text-secondary hover:text-faro-primary px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Start over
            </Link>
          </div>
          <p className="mt-8 text-xs text-text-secondary max-w-sm mx-auto">
            Faro provides general financial education, not personalized financial advice.
            Always consult a licensed financial professional for decisions specific to your situation.
          </p>
        </div>

      </div>
    </main>
  )
}

// ── Small helpers ────────────────────────────────────────────────────────────

function NavBar() {
  return (
    <nav className="relative z-10 px-6 py-4 border-b border-faro-border flex items-center justify-between">
      <span className="text-lg font-bold text-faro-primary">Faro</span>
      <Link href="/onboarding" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
        Start over
      </Link>
    </nav>
  )
}

function SkeletonCard({ h }: { h: string }) {
  return <div className={`skeleton rounded-2xl w-full ${h}`} />
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
      {children}
    </main>
  )
}
