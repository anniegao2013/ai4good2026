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
      'Most banks accept a passport + ITIN or SSN. Credit unions are often more immigrant-friendly than big banks — lower fees, less strict requirements.',
    action: 'Ask your employer if they have a partner bank',
    actionUrl: null,
  },
  {
    category: 'Banking',
    title: 'Set up direct deposit',
    description:
      'Ask HR for a direct deposit form. Bring your routing number and account number. This is how most US employers pay — checks are rare.',
    action: 'Request the direct deposit form from HR',
    actionUrl: null,
  },
  {
    category: 'Credit',
    title: 'Get a secured credit card',
    description:
      'A secured card requires a small deposit ($200–500) and reports to credit bureaus, building your US credit score from zero. It works like a normal credit card.',
    action: 'Search "secured credit card" at your bank',
    actionUrl: null,
  },
  {
    category: 'Credit',
    title: 'Check your credit report',
    description:
      'You are entitled to one free report per year from each of the 3 major bureaus (Experian, Equifax, TransUnion). Check for errors — they are common.',
    action: 'Request your free report at annualcreditreport.com',
    actionUrl: 'https://www.annualcreditreport.com',
  },
  {
    category: 'Taxes',
    title: 'Get an ITIN if you do not have an SSN',
    description:
      'An ITIN (Individual Taxpayer Identification Number) from the IRS lets you file taxes and open bank accounts. You apply with Form W-7 plus your passport.',
    action: 'Start Form W-7 at IRS.gov',
    actionUrl: 'https://www.irs.gov/individuals/individual-taxpayer-identification-number',
  },
  {
    category: 'Taxes',
    title: 'Understand your pay stub',
    description:
      'Your paycheck shows gross pay, then deductions: federal tax, state tax, Social Security (6.2%), Medicare (1.45%), and any benefits. Net pay is what lands in your bank.',
    action: 'Compare your gross vs. net this month',
    actionUrl: null,
  },
  {
    category: 'Sending money home',
    title: 'Compare remittance services',
    description:
      'Fees and exchange rates vary widely. Services like Wise, Remitly, and Western Union each have strengths. Always check the exchange rate, not just the fee — that is where they make the real margin.',
    action: 'Compare rates before your next transfer',
    actionUrl: null,
  },
  {
    category: 'Savings',
    title: 'Open a high-yield savings account',
    description:
      'US savings accounts can pay 4–5% APY at online banks — far more than traditional branches offer. No physical branch needed; transfers happen within 1–2 business days.',
    action: 'Search "high yield savings account" at any online bank',
    actionUrl: null,
  },
]

// Group steps by category
const CATEGORIES = Array.from(new Set(STEPS.map((s) => s.category)))

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
      if (prev.has(i)) return prev           // no un-checking (building stays)
      const next = new Set(Array.from(prev).concat(i))
      localStorage.setItem('faro_dashboard_checked', JSON.stringify(Array.from(next)))
      addBuilding()
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
          Faro
        </Link>
        <Link href="/result" className="text-xs text-text-secondary hover:text-text-primary transition-colors">
          ← My results
        </Link>
      </nav>

      <div className="relative z-10 max-w-xl mx-auto w-full px-6 py-10 pb-32 space-y-10">

        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-text-primary leading-tight mb-2">
            Your financial roadmap
          </h1>
          {countryLabel && (
            <p className="text-sm text-text-secondary">
              Built for someone coming from {countryLabel}.
            </p>
          )}

          {/* Progress bar */}
          <div className="mt-5 flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-faro-border rounded-full overflow-hidden">
              <div
                className="h-full bg-faro-primary rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary whitespace-nowrap">
              {completedCount} / {STEPS.length} done
            </span>
          </div>
        </section>

        {/* Steps grouped by category */}
        {CATEGORIES.map((cat) => {
          const catSteps = STEPS.filter((s) => s.category === cat)

          return (
            <section key={cat}>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                {cat}
              </p>

              <div className="space-y-2">
                {catSteps.map((step) => {
                  const globalIndex = STEPS.indexOf(step)
                  const isDone = checked.has(globalIndex)
                  const isOpen = openStep === globalIndex

                  return (
                    <div
                      key={globalIndex}
                      className={`border rounded-xl transition-all ${
                        isDone ? 'border-faro-primary/30 bg-faro-surface' : 'border-faro-border bg-white'
                      }`}
                    >
                      {/* Row */}
                      <div className="flex items-start gap-3 px-5 py-4">
                        {/* Checkbox — click to complete without opening */}
                        <button
                          onClick={() => toggleCheck(globalIndex)}
                          disabled={isDone}
                          className={`mt-0.5 shrink-0 w-4 h-4 rounded border flex items-center justify-center text-xs transition-all ${
                            isDone
                              ? 'bg-faro-primary border-faro-primary text-white cursor-default'
                              : 'border-faro-border hover:border-faro-primary'
                          }`}
                        >
                          {isDone && '✓'}
                        </button>

                        <button
                          className="flex-1 min-w-0 text-left flex items-start justify-between gap-4"
                          onClick={() => setOpenStep(isOpen ? null : globalIndex)}
                        >
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium text-sm leading-snug ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
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

                      {/* Expanded */}
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 border-t border-faro-border/60">
                          <p className="text-sm text-text-secondary leading-relaxed mt-3">
                            {step.description}
                          </p>

                          {step.action && (
                            <div className="mt-4">
                              {step.actionUrl ? (
                                <a
                                  href={step.actionUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-faro-primary underline underline-offset-2"
                                >
                                  {step.action} →
                                </a>
                              ) : (
                                <p className="text-sm text-text-secondary">{step.action}</p>
                              )}
                            </div>
                          )}

                          {!isDone && (
                            <button
                              onClick={() => toggleCheck(globalIndex)}
                              className="mt-5 text-sm px-4 py-2 rounded-lg border border-faro-border text-text-secondary hover:border-text-primary hover:text-text-primary transition-all"
                            >
                              I know this
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
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
