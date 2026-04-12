'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Header } from '@/components/Header'
import { Cityscape } from '@/components/Cityscape'
import { ConceptCard } from '@/components/ConceptCard'
import type { FaroResult, FaroProfile } from '@/lib/types'

const COUNTRY_LABELS: Record<string, string> = {
  MX: 'Mexico', IN: 'India', PH: 'Philippines', NG: 'Nigeria',
  GT: 'Guatemala', SV: 'El Salvador', HN: 'Honduras', OTHER: 'your home country',
}

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

  const concepts  = result?.concepts ?? []
  const progress  = 0.3 + (doneBlocks.size / Math.max(concepts.slice(0, 3).length, 1)) * 0.4

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
      <main className="min-h-screen bg-white">
        <Header backHref="/" backLabel="Start over" />
        <div className="pt-28 pb-80 px-6 max-w-2xl mx-auto space-y-3">
          <div className="skeleton h-32 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
          <div className="skeleton h-20 rounded-2xl" />
        </div>
        <Cityscape progress={0.3} />
      </main>
    )
  }

  const countryLabel   = COUNTRY_LABELS[profile.country] ?? profile.country
  const completedCount = doneBlocks.size

  return (
    <main className="min-h-screen bg-white">
      <Header backHref="/" backLabel="Start over" progress={progress} />

      <div className="pt-28 pb-80 px-6 max-w-2xl mx-auto space-y-8">

        {/* ── Welcome card ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl border border-faro-border p-6 md:p-8"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-faro-light flex items-center justify-center shrink-0 text-xl">
              ✨
            </div>
            <div>
              <h2 className="font-semibold text-text-primary mb-1">Welcome to the US!</h2>
              <p className="text-sm text-text-secondary">Here&rsquo;s your personalised financial roadmap</p>
            </div>
          </div>
          <p className="text-text-primary leading-relaxed">{result.portrait}</p>
          {result.fallback && (
            <p className="mt-3 text-xs text-text-secondary italic">
              AI unavailable — using knowledge base only.
            </p>
          )}
        </motion.div>

        {/* ── Concept cards ───────────────────────────────────────────── */}
        {concepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <span className="text-text-secondary">{countryLabel}</span>
                <span className="text-faro-primary">→</span>
                <span>United States</span>
              </h2>
              {completedCount > 0 && (
                <span className="text-sm font-medium px-3 py-1 rounded-full bg-faro-light text-faro-dark">
                  {completedCount} / {concepts.slice(0, 3).length}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {concepts.slice(0, 3).map((concept, i) => (
                <motion.div
                  key={concept.id ?? i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                >
                  <ConceptCard
                    concept={concept}
                    action={result.blocks?.[i]?.action}
                    actionUrl={result.blocks?.[i]?.actionUrl}
                    onComplete={() => markDone(i)}
                    completed={doneBlocks.has(i)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Dashboard CTA ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-faro-light rounded-3xl border border-faro-primary/20 p-6 md:p-8 text-center"
        >
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            Ready to take action?
          </h3>
          <p className="text-text-secondary mb-6 max-w-sm mx-auto">
            Your full roadmap — banking, credit, taxes, and sending money home.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-faro-primary hover:bg-faro-dark text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Open your roadmap →
          </Link>
        </motion.div>

        {/* ── Footer actions ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex justify-center gap-6"
        >
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Settle', url: window.location.origin })
              } else {
                navigator.clipboard.writeText(window.location.origin)
                alert('Link copied!')
              }
            }}
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ↗ Share
          </button>
          <Link
            href="/onboarding"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ↺ Start over
          </Link>
        </motion.div>

      </div>

      <Cityscape progress={progress} />
    </main>
  )
}

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
      {children}
    </main>
  )
}
