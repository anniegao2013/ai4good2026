'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Skyline } from '@/components/Skyline'
import type { FaroProfile } from '@/lib/types'

// ── Hardcoded first-year checklist ──────────────────────────────────────────

interface Step {
  category: string
  title: string
  description: string
  action: string
  actionUrl: string | null
}

const STEPS: Step[] = [
  {
    category: 'Banking',
    title: 'Open a US bank account',
    description:
      'Most banks accept a passport + ITIN or SSN. Credit unions are often more immigrant-friendly — lower fees, less strict requirements.',
    action: 'Ask your employer if they have a partner bank',
    actionUrl: null,
  },
  {
    category: 'Banking',
    title: 'Set up direct deposit',
    description:
      'Ask HR for a direct deposit form. Bring your routing number and account number. Most US employers pay this way — checks are rare.',
    action: 'Request the direct deposit form from HR',
    actionUrl: null,
  },
  {
    category: 'Credit',
    title: 'Get a secured credit card',
    description:
      'A secured card requires a small deposit ($200–500) and reports to credit bureaus, building your US credit score from zero. It works just like a regular credit card.',
    action: 'Search "secured credit card" at your bank',
    actionUrl: null,
  },
  {
    category: 'Credit',
    title: 'Check your credit report',
    description:
      'You are entitled to one free report per year from each of the 3 major bureaus (Experian, Equifax, TransUnion). Check for errors — they are more common than you think.',
    action: 'Request your free report at annualcreditreport.com',
    actionUrl: 'https://www.annualcreditreport.com',
  },
  {
    category: 'Taxes',
    title: 'Get an ITIN if you do not have an SSN',
    description:
      'An ITIN (Individual Taxpayer Identification Number) from the IRS lets you file taxes and open bank accounts without an SSN. Apply with Form W-7 plus your passport.',
    action: 'Start Form W-7 at IRS.gov',
    actionUrl: 'https://www.irs.gov/individuals/individual-taxpayer-identification-number',
  },
  {
    category: 'Taxes',
    title: 'Understand your pay stub',
    description:
      'Your paycheck shows gross pay minus deductions: federal tax, state tax, Social Security (6.2%), Medicare (1.45%), and any benefits. Net pay is what hits your account.',
    action: 'Compare your gross vs. net this month',
    actionUrl: null,
  },
  {
    category: 'Sending money home',
    title: 'Compare remittance services',
    description:
      'Fees and exchange rates vary widely. Always check the exchange rate, not just the fee — that is where services make most of their margin.',
    action: 'Compare rates before your next transfer',
    actionUrl: null,
  },
  {
    category: 'Savings',
    title: 'Open a high-yield savings account',
    description:
      'Online banks can pay 4–5% APY — far more than traditional branches. No physical branch needed; transfers happen within 1–2 business days.',
    action: 'Search "high yield savings account" at any online bank',
    actionUrl: null,
  },
]

// ── Category visual config ──────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; number: string }> = {
  'Banking':            { color: '#1D9E75', bg: '#1D9E7512', number: '01' },
  'Credit':             { color: '#F59E0B', bg: '#F59E0B12', number: '02' },
  'Taxes':              { color: '#6366F1', bg: '#6366F112', number: '03' },
  'Sending money home': { color: '#EC4899', bg: '#EC489912', number: '04' },
  'Savings':            { color: '#059669', bg: '#05966912', number: '05' },
}

const CATEGORIES = Array.from(new Set(STEPS.map((s) => s.category)))

const COUNTRY_LABELS: Record<string, string> = {
  MX: 'Mexico', IN: 'India', PH: 'Philippines', NG: 'Nigeria',
  GT: 'Guatemala', SV: 'El Salvador', HN: 'Honduras', OTHER: 'your home country',
}

function addBuilding() {
  const current = parseInt(localStorage.getItem('faro_buildings') ?? '0', 10)
  const next = current + 1
  localStorage.setItem('faro_buildings', String(next))
  window.dispatchEvent(new CustomEvent('faro:skyline-update', { detail: { count: next } }))
}

// ── Component ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [profile, setProfile]   = useState<FaroProfile | null>(null)
  const [checked, setChecked]   = useState<Set<number>>(new Set())
  const [openStep, setOpenStep] = useState<number | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('faro_profile')
    if (raw) setProfile(JSON.parse(raw))

    const saved: number[] = JSON.parse(localStorage.getItem('faro_dashboard_checked') ?? '[]')
    setChecked(new Set(saved))
  }, [])

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(Array.from(prev))
      if (next.has(i)) {
        next.delete(i)
        const current = parseInt(localStorage.getItem('faro_buildings') ?? '0', 10)
        const updated = Math.max(0, current - 1)
        localStorage.setItem('faro_buildings', String(updated))
        window.dispatchEvent(new CustomEvent('faro:skyline-update', { detail: { count: updated } }))
      } else {
        next.add(i)
        addBuilding()
      }
      localStorage.setItem('faro_dashboard_checked', JSON.stringify(Array.from(next)))
      return next
    })
  }

  const countryLabel   = profile ? (COUNTRY_LABELS[profile.country] ?? profile.country) : ''
  const completedCount = checked.size

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <Skyline />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-5 border-b border-faro-border flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-widest uppercase text-text-primary">
          Settle
        </Link>
        <Link href="/result" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
          ← My results
        </Link>
      </nav>

      <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-10 pb-36 space-y-10">

        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-text-primary leading-tight mb-1">
            {profile?.name ? `${profile.name}'s roadmap` : 'Your financial roadmap'}
          </h1>
          {countryLabel && (
            <p className="text-sm text-text-secondary">
              Built for someone coming from {countryLabel}.
            </p>
          )}

          {/* Overall progress bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-faro-border rounded-full overflow-hidden">
              <div
                className="h-full bg-faro-primary rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary whitespace-nowrap tabular-nums">
              {completedCount} / {STEPS.length}
            </span>
          </div>
        </section>

        {/* Roadmap — one section per category */}
        {CATEGORIES.map((cat) => {
          const cfg      = CATEGORY_CONFIG[cat] ?? { color: '#6B7280', bg: '#6B728012', number: '—' }
          const catSteps = STEPS.filter((s) => s.category === cat)
          const catDone  = catSteps.filter((s) => checked.has(STEPS.indexOf(s))).length

          return (
            <section key={cat}>

              {/* Category header */}
              <div
                className="flex items-center justify-between px-4 py-3 rounded-xl mb-4"
                style={{ backgroundColor: cfg.bg }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: cfg.color }}
                  >
                    {cfg.number}
                  </span>
                  <span className="font-semibold text-sm" style={{ color: cfg.color }}>
                    {cat}
                  </span>
                </div>
                <span className="text-xs tabular-nums" style={{ color: cfg.color }}>
                  {catDone} / {catSteps.length}
                </span>
              </div>

              {/* Steps with left track */}
              <div className="relative pl-8">

                {/* Vertical track line */}
                <div
                  className="absolute left-[11px] top-3 bottom-3 w-0.5 rounded-full"
                  style={{ backgroundColor: `${cfg.color}25` }}
                />

                <div className="space-y-3">
                  {catSteps.map((step) => {
                    const gi    = STEPS.indexOf(step)
                    const isDone  = checked.has(gi)
                    const isOpen  = openStep === gi

                    return (
                      <div key={gi} className="relative">

                        {/* Track dot */}
                        <div
                          className="absolute -left-[21px] top-[18px] w-[11px] h-[11px] rounded-full border-2 transition-all duration-300 z-10"
                          style={{
                            borderColor:     isDone ? cfg.color : '#D1D5DB',
                            backgroundColor: isDone ? cfg.color : 'white',
                          }}
                        />

                        {/* Card */}
                        <div
                          className={`rounded-xl bg-white border border-faro-border overflow-hidden transition-all duration-200 ${isDone ? 'opacity-70' : ''}`}
                          style={{ borderLeft: `3px solid ${cfg.color}` }}
                        >
                          {/* Card header row */}
                          <div className="flex items-start gap-3 px-4 py-3.5">

                            {/* Checkbox */}
                            <button
                              onClick={() => toggleCheck(gi)}
                              aria-label={isDone ? 'Mark as undone' : 'Mark as done'}
                              className="mt-0.5 shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-200"
                              style={{
                                borderColor:     isDone ? cfg.color : '#D1D5DB',
                                backgroundColor: isDone ? cfg.color : 'white',
                                color: 'white',
                              }}
                            >
                              {isDone && '✓'}
                            </button>

                            {/* Title + toggle */}
                            <button
                              className="flex-1 min-w-0 text-left flex items-start justify-between gap-3"
                              onClick={() => setOpenStep(isOpen ? null : gi)}
                            >
                              <div className="min-w-0">
                                <p className={`text-sm font-medium leading-snug ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
                                  {step.title}
                                </p>
                                {!isOpen && (
                                  <p className="text-xs text-text-secondary mt-0.5 truncate">
                                    {step.description}
                                  </p>
                                )}
                              </div>
                              <span className="shrink-0 text-text-secondary text-sm mt-0.5">
                                {isOpen ? '↑' : '↓'}
                              </span>
                            </button>
                          </div>

                          {/* Expanded body */}
                          {isOpen && (
                            <div className="px-4 pb-4 pt-0 border-t border-faro-border/50">
                              <p className="text-sm text-text-secondary leading-relaxed mt-3">
                                {step.description}
                              </p>

                              {step.action && (
                                <div className="mt-3">
                                  {step.actionUrl ? (
                                    <a
                                      href={step.actionUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm underline underline-offset-2"
                                      style={{ color: cfg.color }}
                                    >
                                      {step.action} →
                                    </a>
                                  ) : (
                                    <p className="text-sm text-text-secondary">{step.action}</p>
                                  )}
                                </div>
                              )}

                              <button
                                onClick={() => toggleCheck(gi)}
                                className="mt-4 text-sm px-4 py-2 rounded-lg border transition-all"
                                style={{
                                  borderColor: cfg.color,
                                  color: cfg.color,
                                }}
                              >
                                {isDone ? '✓ Done' : 'I know this'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>
          )
        })}

        {/* Footer */}
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/result"
            className="text-sm text-text-secondary border border-faro-border rounded-lg px-4 py-2 hover:border-text-primary transition-colors"
          >
            ← Back to my concepts
          </Link>
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
