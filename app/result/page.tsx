'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skyline } from '@/components/Skyline'
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
  const [doneBlocks, setDoneBlocks] = useState<Set<number>>(new Set())

  useEffect(() => {
    const rawProfile = localStorage.getItem('faro_profile')
    if (!rawProfile) {
      setError('no_profile')
      setLoading(false)
      return
    }

    const parsed: FaroProfile = JSON.parse(rawProfile)
    setProfile(parsed)

    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    const done = new Set<number>()
    if (progress.block0_completed) done.add(0)
    if (done.size) setDoneBlocks(done)

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
    setDoneBlocks((prev) => new Set([...prev, i]))
    const progress = JSON.parse(localStorage.getItem('faro_progress') ?? '{}')
    localStorage.setItem('faro_progress', JSON.stringify({ ...progress, [`block${i}_completed`]: true }))
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

  const countryLabel = COUNTRY_LABELS[profile.country] ?? profile.country
  const completedCount = doneBlocks.size

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

        {/* Priorities */}
        {result.blocks && result.blocks.length > 0 && (
          <section>
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Your priorities</h2>
              {completedCount > 0 && (
                <span className="text-sm text-text-secondary">
                  {completedCount} / {result.blocks.length} done
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {result.blocks.map((block: ResultBlock, i: number) => (
                <BuildingBlock
                  key={i}
                  title={block.title}
                  explanation={block.explanation}
                  status={BLOCK_STATUS[i] ?? 'coming_soon'}
                  locked={false}
                  keyDifference={block.keyDifference}
                  action={block.action}
                  actionUrl={block.actionUrl}
                  onComplete={() => markDone(i)}
                  completed={doneBlocks.has(i)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Translation map — compact, below priorities */}
        {result.concepts && result.concepts.length > 0 && (
          <section>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
              {countryLabel} → United States
            </p>
            <div className="border border-faro-border rounded-xl divide-y divide-faro-border">
              {result.concepts.map((c, i) => (
                <Link
                  key={c.id ?? i}
                  href={`/learn/${c.id}`}
                  className="flex items-center gap-3 flex-wrap px-4 py-3 hover:bg-faro-surface transition-colors"
                >
                  <span className="text-sm text-text-primary font-medium">{c.homeConcept}</span>
                  <span className="text-faro-primary text-sm">→</span>
                  <span className="text-sm text-text-primary">{c.usEquivalent}</span>
                  <span className="ml-auto text-xs text-faro-primary">Learn more →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <div className="pb-16 flex gap-4 flex-wrap">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Faro', url: window.location.origin })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                alert('Link copied!')
              }
            }}
            className="text-sm text-text-secondary border border-faro-border rounded-lg px-4 py-2 hover:border-text-primary transition-colors"
          >
            Share Faro
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
      <span className="text-sm font-semibold tracking-widest uppercase text-text-primary">Faro</span>
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
