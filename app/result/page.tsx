'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skyline } from '@/components/Skyline'
import { ConceptCard } from '@/components/ConceptCard'
import type { FaroResult, FaroProfile } from '@/lib/types'

const COUNTRY_LABELS: Record<string, string> = {
  MX: 'Mexico', IN: 'India', PH: 'Philippines', NG: 'Nigeria',
  GT: 'Guatemala', SV: 'El Salvador', HN: 'Honduras', OTHER: 'your home country',
}

/** Increment the global building count and notify the Skyline. */
function addBuilding() {
  const current = parseInt(localStorage.getItem('faro_buildings') ?? '0', 10)
  const next = current + 1
  localStorage.setItem('faro_buildings', String(next))
  window.dispatchEvent(new CustomEvent('faro:skyline-update', { detail: { count: next } }))
  return next
}

export default function ResultPage() {
  const [result, setResult]   = useState<FaroResult | null>(null)
  const [profile, setProfile] = useState<FaroProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)
  const [doneBlocks, setDoneBlocks] = useState<Set<number>>(new Set())

  useEffect(() => {
    const rawProfile = localStorage.getItem('faro_profile')
    if (!rawProfile) { setError('no_profile'); setLoading(false); return }

    const parsed: FaroProfile = JSON.parse(rawProfile)
    setProfile(parsed)

    // Restore completed blocks
    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    const done = new Set<number>()
    for (let i = 0; i < 3; i++) {
      if (progress[`block${i}_completed`]) done.add(i)
    }
    if (done.size) setDoneBlocks(done)

    // If the loading page already fetched a fresh result, use it directly
    const isFresh = localStorage.getItem('faro_result_fresh') === '1'
    if (isFresh) {
      localStorage.removeItem('faro_result_fresh')
      const cached = localStorage.getItem('faro_result')
      if (cached) {
        setResult(JSON.parse(cached))
        setLoading(false)
        return
      }
    }

    fetch('/api/parallel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed),
    })
      .then((r) => { if (!r.ok) throw new Error('API error'); return r.json() })
      .then((data: FaroResult) => {
        setResult(data)
        localStorage.setItem('faro_result', JSON.stringify(data))
      })
      .catch(() => {
        const cached = localStorage.getItem('faro_result')
        if (cached) setResult(JSON.parse(cached))
        else setError('api_failed')
      })
      .finally(() => setLoading(false))
  }, [])

  function markDone(i: number) {
    const wasChecked = doneBlocks.has(i)
    setDoneBlocks((prev) => {
      const next = new Set(Array.from(prev))
      if (wasChecked) { next.delete(i) } else { next.add(i) }
      return next
    })
    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    if (wasChecked) {
      delete progress[`block${i}_completed`]
      localStorage.setItem('faro_progress', JSON.stringify(progress))
      const current = parseInt(localStorage.getItem('faro_buildings') ?? '0', 10)
      const updated = Math.max(0, current - 1)
      localStorage.setItem('faro_buildings', String(updated))
      window.dispatchEvent(new CustomEvent('faro:skyline-update', { detail: { count: updated } }))
    } else {
      localStorage.setItem('faro_progress', JSON.stringify({ ...progress, [`block${i}_completed`]: true }))
      addBuilding()
    }
  }

  if (error === 'no_profile') {
    return (
      <Centered>
        <p className="text-text-secondary mb-5">No profile found. Complete onboarding first.</p>
        <Link href="/onboarding" className="text-sm text-faro-primary underline underline-offset-2">
          Start onboarding
        </Link>
      </Centered>
    )
  }

  if (error === 'api_failed') {
    return (
      <Centered>
        <p className="text-text-secondary mb-5">Couldn&apos;t load your results. Please try again.</p>
        <button onClick={() => window.location.reload()} className="text-sm text-faro-primary underline underline-offset-2">
          Retry
        </button>
      </Centered>
    )
  }

  if (loading || !result || !profile) {
    return (
      <main className="relative min-h-screen bg-white flex flex-col">
        <Skyline />
        <NavBar />
        <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-10 space-y-3">
          <div className="skeleton h-24 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
          <div className="skeleton h-14 rounded-xl" />
        </div>
      </main>
    )
  }

  const countryLabel   = COUNTRY_LABELS[profile.country] ?? profile.country
  const completedCount = doneBlocks.size
  const concepts       = result.concepts ?? []

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <Skyline />
      <NavBar />

      <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-10 space-y-10">

        {/* Portrait */}
        <section>
          <p className="text-text-primary leading-relaxed text-base">
            {result.portrait}
          </p>
          {result.fallback && (
            <p className="mt-2 text-xs text-text-secondary italic">
              AI unavailable — using knowledge base only.
            </p>
          )}
        </section>

        {/* Concept cards — each one is a home→US translation tile */}
        {concepts.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">
                {countryLabel} → United States
              </h2>
              {completedCount > 0 && (
                <span className="text-sm text-text-secondary">
                  {completedCount} / {concepts.slice(0, 3).length} done
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {concepts.slice(0, 3).map((concept, i) => (
                <ConceptCard
                  key={concept.id ?? i}
                  concept={concept}
                  action={result.blocks?.[i]?.action}
                  actionUrl={result.blocks?.[i]?.actionUrl}
                  onComplete={() => markDone(i)}
                  completed={doneBlocks.has(i)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Dashboard CTA ─────────────────────────────────────────────── */}
        <section className="border border-faro-border rounded-xl px-5 py-5">
          <p className="text-sm font-semibold text-text-primary mb-1">
            Ready to go deeper?
          </p>
          <p className="text-sm text-text-secondary mb-4">
            Your full financial roadmap — banking, credit, taxes, and sending money home.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-faro-primary text-white font-medium text-sm px-5 py-2.5 rounded-lg hover:bg-faro-dark transition-colors"
          >
            Open your roadmap →
          </Link>
        </section>

        {/* Footer */}
        <div className="pb-20 flex gap-4 flex-wrap">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Settle', url: window.location.origin })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                alert('Link copied!')
              }
            }}
            className="text-sm text-text-secondary border border-faro-border rounded-lg px-4 py-2 hover:border-text-primary transition-colors"
          >
            Share Settle
          </button>
          <Link
            href="/onboarding"
            className="text-sm text-text-secondary border border-faro-border rounded-lg px-4 py-2 hover:border-text-primary transition-colors"
          >
            Start over
          </Link>
        </div>

      </div>
    </main>
  )
}

function NavBar() {
  return (
    <nav className="relative z-10 px-6 py-5 flex items-center justify-between border-b border-faro-border">
      <span className="text-sm font-semibold tracking-widest uppercase text-text-primary">Settle</span>
      <Link href="/onboarding" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
        Start over
      </Link>
    </nav>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
      {children}
    </main>
  )
}
