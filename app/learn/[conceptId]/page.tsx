'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Cityscape } from '@/components/Cityscape'
import type {
  ConceptDetail,
  CreditTranslation,
  VisualStep as VStep,
  GettingStartedStep as GSStep,
} from '@/lib/types'

// ── Constants ──────────────────────────────────────────────────────────────────

const SIMILARITY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  equivalent:    { label: 'Direct equivalent',   bg: 'bg-green-100',  text: 'text-green-800'  },
  similar:       { label: 'Very similar',         bg: 'bg-blue-100',   text: 'text-blue-800'   },
  partial:       { label: 'Partial match',        bg: 'bg-amber-100',  text: 'text-amber-800'  },
  no_equivalent: { label: 'No direct equivalent', bg: 'bg-gray-100',   text: 'text-gray-700'   },
}

const URGENCY_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  week1:  { label: 'Do this week',    bg: 'bg-rose-100',   text: 'text-rose-800'   },
  month1: { label: 'This month',      bg: 'bg-orange-100', text: 'text-orange-800' },
  month3: { label: 'Within 3 months', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  year1:  { label: 'Within a year',   bg: 'bg-gray-100',   text: 'text-gray-700'   },
}

const CATEGORY_LABELS: Record<string, string> = {
  banking:    'Banking',
  credit:     'Credit',
  savings:    'Savings',
  remittance: 'Remittance',
  tax:        'Tax & ID',
  housing:    'Housing',
}

const CREDIT_COLORS: Record<string, string> = {
  green:  'bg-green-400',
  blue:   'bg-blue-400',
  yellow: 'bg-amber-400',
  red:    'bg-red-400',
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ConceptDetailPage({ params }: { params: { conceptId: string } }) {
  const id = decodeURIComponent(params.conceptId)
  const [detail, setDetail] = useState<ConceptDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const cacheKey = `faro_concept_${id}`
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        setDetail(JSON.parse(cached))
        setLoading(false)
        return
      } catch { /* invalid cache — fall through to fetch */ }
    }

    fetch(`/api/concept?id=${encodeURIComponent(id)}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json() })
      .then((data: ConceptDetail) => {
        setDetail(data)
        localStorage.setItem(cacheKey, JSON.stringify(data))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSkeleton />
  if (error || !detail) return <ErrorState />

  const simCfg = SIMILARITY_CONFIG[detail.similarity] ?? SIMILARITY_CONFIG.similar
  const urgCfg = URGENCY_CONFIG[detail.urgency] ?? URGENCY_CONFIG.month1
  const catLabel = CATEGORY_LABELS[detail.category] ?? detail.category

  return (
    <main className="min-h-screen bg-white">
      <Header backHref="/result" backLabel="Back to results" />

      <div className="pt-28 pb-80 px-6 max-w-2xl mx-auto w-full space-y-10">

        {/* ── S1 + S2: Breadcrumb + Hero ──────────────────────────────────── */}
        <section>
          <div className="flex flex-wrap gap-2 mb-5">
            <Badge bg={simCfg.bg} text={simCfg.text}>{simCfg.label}</Badge>
            <Badge bg={urgCfg.bg} text={urgCfg.text}>{urgCfg.label}</Badge>
            <Badge bg="bg-gray-100" text="text-gray-700">{catLabel}</Badge>
          </div>
          <h1 className="text-3xl font-bold text-text-primary leading-tight">
            {detail.homeConcept}
            <span className="text-faro-primary mx-3">→</span>
            {detail.usEquivalent}
          </h1>
          {detail.tagline && (
            <p className="mt-3 text-lg text-text-secondary leading-relaxed">{detail.tagline}</p>
          )}
        </section>

        {/* ── S3: At-a-glance ─────────────────────────────────────────────── */}
        <section className="bg-faro-light border-l-4 border-faro-primary rounded-r-2xl px-6 py-5">
          <p className="text-xs font-semibold text-faro-dark uppercase tracking-wide mb-2">
            At a glance
          </p>
          <p className="text-text-primary leading-relaxed">{detail.atAGlance}</p>
        </section>

        {/* ── S4: Side-by-side comparison ─────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">How they compare</h2>
          <div className="grid grid-cols-2 gap-4">
            <ComparisonCard side={detail.homeSide} highlight={false} />
            <ComparisonCard side={detail.usSide} highlight />
          </div>
        </section>

        {/* ── S5: Key differences ─────────────────────────────────────────── */}
        {detail.keyDifferences.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">What changes in the US</h2>
            <div className="space-y-3">
              {detail.keyDifferences.map((diff, i) => (
                <div
                  key={i}
                  className="flex gap-3 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl px-4 py-3"
                >
                  <span className="text-amber-600 font-bold shrink-0 mt-0.5 text-base leading-none">!</span>
                  <p className="text-sm text-text-primary leading-relaxed">{diff}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── S6: 3 visual steps ──────────────────────────────────────────── */}
        {detail.steps.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-6">Your 3-step path</h2>
            <div>
              {detail.steps.map((step, i) => (
                <VisualStepItem
                  key={i}
                  step={step}
                  isLast={i === detail.steps.length - 1}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── S7: Credit score translation (credit category only) ──────────── */}
        {detail.category === 'credit' && detail.creditTranslation && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Translating your credit score
            </h2>
            <CreditScoreSection ct={detail.creditTranslation} />
          </section>
        )}

        {/* ── S8: When good / not good ─────────────────────────────────────── */}
        {(detail.whenGood.length > 0 || detail.whenNotGood.length > 0) && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">When to use it</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {detail.whenGood.length > 0 && <WhenCard type="good" items={detail.whenGood} />}
              {detail.whenNotGood.length > 0 && <WhenCard type="bad" items={detail.whenNotGood} />}
            </div>
          </section>
        )}

        {/* ── S9: Getting-started checklist ───────────────────────────────── */}
        {detail.gettingStarted.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-5">Getting started</h2>
            <div className="space-y-4">
              {detail.gettingStarted.map((gs, i) => (
                <GettingStartedCard key={i} gs={gs} />
              ))}
            </div>
          </section>
        )}

        {/* ── S10: Questions to ask ────────────────────────────────────────── */}
        {detail.questionsToAsk.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Questions to ask your bank
            </h2>
            <div className="bg-white border border-faro-border rounded-2xl divide-y divide-faro-border">
              {detail.questionsToAsk.map((q, i) => (
                <div key={i} className="px-5 py-4 flex gap-3 items-start">
                  <span className="text-faro-primary font-bold shrink-0 text-sm">Q{i + 1}</span>
                  <p className="text-sm text-text-primary leading-relaxed">{q}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── S11: Video placeholder ───────────────────────────────────────── */}
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-4">Video guide</h2>
          <div className="bg-faro-surface border border-faro-border rounded-2xl flex flex-col items-center justify-center py-14 gap-4">
            <div className="w-16 h-16 rounded-full bg-faro-light flex items-center justify-center">
              <svg
                className="w-7 h-7 text-faro-primary ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="font-semibold text-text-primary">Video coming soon</p>
              <p className="text-sm text-text-secondary mt-1">
                A step-by-step walkthrough of {detail.usEquivalent}
              </p>
            </div>
          </div>
        </section>

        {/* ── S12: Bottom reassurance ──────────────────────────────────────── */}
        <section className="border-t border-faro-border pt-8 pb-4">
          {detail.caution && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl px-5 py-4 mb-6">
              <p className="text-xs font-semibold text-rose-700 uppercase tracking-wide mb-1">
                Important note
              </p>
              <p className="text-sm text-rose-800 leading-relaxed">{detail.caution}</p>
            </div>
          )}
          <p className="text-xs text-text-secondary text-center max-w-sm mx-auto mb-6">
            Settle provides general financial education, not personalized financial advice.
            Always consult a licensed financial professional for decisions specific to your situation.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/result"
              className="bg-faro-primary hover:bg-faro-dark text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              ← Back to my results
            </Link>
            <Link
              href="/onboarding"
              className="border border-faro-border hover:border-faro-primary text-text-secondary hover:text-faro-primary px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Start over
            </Link>
          </div>
        </section>

      </div>

      <Cityscape progress={0.5} />
    </main>
  )
}

// ── Subcomponents ──────────────────────────────────────────────────────────────

function Badge({
  children,
  bg,
  text,
}: {
  children: React.ReactNode
  bg: string
  text: string
}) {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${bg} ${text}`}>
      {children}
    </span>
  )
}

function ComparisonCard({
  side,
  highlight,
}: {
  side: { label: string; name: string; description: string; keyFeatures: string[] }
  highlight: boolean
}) {
  return (
    <div
      className={`rounded-2xl border-2 p-4 ${
        highlight
          ? 'border-faro-primary bg-faro-light/40'
          : 'border-faro-border bg-white'
      }`}
    >
      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
        {side.label}
      </p>
      <p
        className={`font-bold text-base mb-2 ${
          highlight ? 'text-faro-dark' : 'text-text-primary'
        }`}
      >
        {side.name}
      </p>
      <p className="text-sm text-text-secondary leading-relaxed mb-3">{side.description}</p>
      {side.keyFeatures.length > 0 && (
        <ul className="space-y-1.5">
          {side.keyFeatures.map((f, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-primary">
              <span className={`shrink-0 ${highlight ? 'text-faro-primary' : 'text-text-secondary'}`}>
                •
              </span>
              {f}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function VisualStepItem({ step, isLast }: { step: VStep; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full bg-faro-primary text-white font-bold text-sm flex items-center justify-center shrink-0">
          {step.number}
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-faro-border mt-1 min-h-[2rem]" />
        )}
      </div>
      <div className="pb-7">
        {step.timeframe && (
          <span className="text-xs font-semibold text-faro-primary uppercase tracking-wide">
            {step.timeframe}
          </span>
        )}
        <h3 className="font-semibold text-text-primary mt-0.5">{step.title}</h3>
        <p className="text-sm text-text-secondary mt-1 leading-relaxed">{step.description}</p>
      </div>
    </div>
  )
}

function CreditScoreSection({ ct }: { ct: CreditTranslation }) {
  return (
    <div className="bg-white border border-faro-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-2 bg-faro-surface px-5 py-3 border-b border-faro-border">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">
          {ct.homeScoreSystem}
        </span>
        <span className="text-xs font-semibold text-faro-primary uppercase tracking-wide">
          {ct.usScoreSystem}
        </span>
      </div>
      {ct.ranges.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-2 px-5 py-3.5 border-b border-faro-border last:border-0"
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                CREDIT_COLORS[r.color] ?? 'bg-gray-400'
              }`}
            />
            <span className="text-sm font-medium text-text-primary">{r.label}</span>
            <span className="text-sm text-text-secondary">{r.homeRange}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                CREDIT_COLORS[r.color] ?? 'bg-gray-400'
              }`}
            />
            <span className="text-sm text-text-secondary">{r.usRange}</span>
          </div>
        </div>
      ))}
      <div className="px-5 py-4 bg-faro-light">
        <p className="text-xs font-semibold text-faro-dark uppercase tracking-wide mb-1">
          Key insight
        </p>
        <p className="text-sm text-faro-dark leading-relaxed">{ct.keyInsight}</p>
      </div>
    </div>
  )
}

function WhenCard({ type, items }: { type: 'good' | 'bad'; items: string[] }) {
  const isGood = type === 'good'
  return (
    <div
      className={`rounded-2xl border p-4 ${
        isGood ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-wide mb-3 ${
          isGood ? 'text-green-700' : 'text-amber-700'
        }`}
      >
        {isGood ? '✓ Good when' : '⚠ Be careful if'}
      </p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sm text-text-primary">
            <span
              className={`shrink-0 font-bold ${isGood ? 'text-green-600' : 'text-amber-600'}`}
            >
              →
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function GettingStartedCard({ gs }: { gs: GSStep }) {
  return (
    <div className="rounded-2xl border border-faro-border bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-full bg-faro-primary text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {gs.step}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">{gs.title}</h3>
          <p className="text-sm text-text-secondary mt-1 leading-relaxed">{gs.description}</p>
          {gs.ctas.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {gs.ctas.map((cta, i) =>
                cta.url ? (
                  <a
                    key={i}
                    href={cta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
                      cta.primary
                        ? 'bg-faro-primary hover:bg-faro-dark text-white'
                        : 'border border-faro-border hover:border-faro-primary text-faro-primary'
                    }`}
                  >
                    {cta.label} ↗
                  </a>
                ) : (
                  <span
                    key={i}
                    className={`text-sm font-semibold px-4 py-2 rounded-xl ${
                      cta.primary
                        ? 'bg-faro-light text-faro-dark'
                        : 'text-text-secondary border border-faro-border'
                    }`}
                  >
                    {cta.label}
                  </span>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <Header backHref="/result" backLabel="Back to results" />
      <div className="pt-28 pb-80 px-6 max-w-2xl mx-auto w-full space-y-6">
        <div className="skeleton h-12 rounded-xl w-3/4" />
        <div className="skeleton h-6 rounded w-1/2" />
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-44 rounded-2xl" />
        <div className="skeleton h-32 rounded-2xl" />
        <div className="skeleton h-52 rounded-2xl" />
      </div>
      <Cityscape progress={0.5} />
    </main>
  )
}

function ErrorState() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center gap-4">
      <p className="text-text-secondary mb-2">
        Couldn&apos;t load this concept. Please go back and try again.
      </p>
      <Link
        href="/result"
        className="bg-faro-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-faro-dark transition-colors"
      >
        ← Back to results
      </Link>
    </main>
  )
}
