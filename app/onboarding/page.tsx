'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ProgressBar'
import { PillButton } from '@/components/PillButton'
import { QuestionCard } from '@/components/QuestionCard'
import { Skyline } from '@/components/Skyline'
import type { FaroProfile, OnboardingCountry, HomeTool } from '@/lib/types'

const CountryGlobe = dynamic(
  () => import('@/components/CountryGlobe').then((m) => m.CountryGlobe),
  { ssr: false }
)

// ── Option data ──────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: 'MX',    label: 'Mexico'       },
  { code: 'IN',    label: 'India'        },
  { code: 'PH',    label: 'Philippines'  },
  { code: 'NG',    label: 'Nigeria'      },
  { code: 'GT',    label: 'Guatemala'    },
  { code: 'SV',    label: 'El Salvador'  },
  { code: 'HN',    label: 'Honduras'     },
  { code: 'OTHER', label: 'Other'        },
] as const

const TIME_IN_US = [
  'Not arrived yet',
  'Under 1 month',
  '1–6 months',
  '6–12 months',
  '1–3 years',
  '3+ years',
]

const STATUSES = [
  'H-1B (work visa)',
  'F-1 (student)',
  'Green card / LPR',
  'O-1 / L-1',
  'Asylum / refugee',
  'DACA',
  'Prefer not to say',
]

const SSN_STATUS = [
  'Yes',
  'No — but applied',
  'No — not eligible',
  'Not sure',
]

const HOME_TOOLS: { code: HomeTool; label: string }[] = [
  { code: 'bank_account',     label: 'Bank account'                                    },
  { code: 'credit_card',      label: 'Credit card'                                     },
  { code: 'debit_card',       label: 'Debit card only'                                 },
  { code: 'loans',            label: 'Loans (car, home, personal)'                     },
  { code: 'investments',      label: 'Investments / stocks'                            },
  { code: 'rotating_savings', label: 'Rotating savings group (chit fund / tanda / susu)' },
  { code: 'real_estate',      label: 'Real estate'                                     },
  { code: 'cash',             label: 'Cash only'                                       },
]

const URGENCY = [
  'Finding an apartment',
  'Understanding my paycheck',
  'Sending money home',
  'Building credit',
  'Opening a bank account',
  'Understanding taxes',
  'Saving / investing',
  'Just exploring',
]

const TOTAL = 6

//Country label helper
const COUNTRY_LABEL_TO_CODE: Record<string, OnboardingCountry> = Object.fromEntries(
  COUNTRIES.map(c => [c.label.toLowerCase(), c.code])
) as Record<string, OnboardingCountry>

// ── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<FaroProfile>>({ tools: [] })
  const [otherCountry, setOtherCountry] = useState('')

  const advance = useCallback(() => {
    if (step < TOTAL) setStep((s) => s + 1)
  }, [step])

  const back = useCallback(() => {
    if (step > 1) setStep((s) => s - 1)
  }, [step])

  function set<K extends keyof FaroProfile>(key: K, value: FaroProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  function toggleTool(code: HomeTool) {
    setProfile((p) => {
      const tools = p.tools ?? []
      return {
        ...p,
        tools: tools.includes(code) ? tools.filter((t) => t !== code) : [...tools, code],
      }
    })
  }

  function handleFinish(urgency: string) {
    const final: FaroProfile = {
      country:   profile.country ?? 'OTHER',
      timeInUS:  profile.timeInUS ?? '',
      status:    profile.status ?? '',
      hasSsn:    profile.hasSsn ?? '',
      tools:     profile.tools ?? [],
      urgency,
    }
    localStorage.setItem('faro_profile', JSON.stringify(final))
    router.push('/result')
  }

  return (
    <main className="relative min-h-screen bg-white flex flex-col">
      <Skyline />

      {/* Nav */}
      <nav className="relative z-10 px-6 py-4 border-b border-faro-border flex items-center justify-between">
        <span className="text-lg font-bold text-faro-primary">Faro</span>
        {step > 1 && (
          <button
            onClick={back}
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            ← Back
          </button>
        )}
      </nav>

      {/* Progress */}
      <div className="relative z-10 px-6 pt-5 pb-0 max-w-xl mx-auto w-full">
        <ProgressBar current={step} total={TOTAL} />
      </div>

      {/* Questions */}
      <div className="relative z-10 flex-1 flex items-start justify-center px-6 pt-10 pb-16">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center">

          {/* Q1: Country */}
          {step === 1 && (
            <QuestionCard
              question="What country did you grow up in?"
              whyWeAsk="Each country has a distinct financial system. This loads the right comparison map for you."
            >
              {/* 🌍 3D Globe Selector */}
              <CountryGlobe
                onSelect={(code) => {
                  set('country', code as OnboardingCountry)
                  setTimeout(advance, 200)
                }}
              />

              {/* 🔎 Search (constrained to supported countries only) */}
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Search your country..."
                  value={otherCountry}
                  onChange={(e) => {
                    const val = e.target.value.trim().toLowerCase()
                    setOtherCountry(e.target.value)

                    const match = COUNTRY_LABEL_TO_CODE[val]

                    if (match) {
                      set('country', match)
                    } else {
                      set('country', 'OTHER')
                    }
                  }}
                  className="w-full border border-faro-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-faro-primary"
                />
              </div>

              {/* 🟣 Existing pill UI (UNCHANGED behavior) */}
              <div className="flex flex-wrap gap-2.5 mt-4">
                {COUNTRIES.map((c) => (
                  <PillButton
                    key={c.code}
                    label={c.label}
                    selected={profile.country === c.code}
                    onClick={() => {
                      set('country', c.code as OnboardingCountry)

                      if (c.code !== 'OTHER') {
                        setTimeout(advance, 160)
                      }
                    }}
                  />
                ))}
              </div>

              {/* 🧭 OTHER fallback (UNCHANGED behavior) */}
              {profile.country === 'OTHER' && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Type your country..."
                    value={otherCountry}
                    onChange={(e) => setOtherCountry(e.target.value)}
                    className="w-full border border-faro-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-faro-primary"
                  />

                  <button
                    onClick={advance}
                    disabled={!otherCountry.trim()}
                    className="mt-3 w-full bg-faro-primary hover:bg-faro-dark disabled:opacity-40 text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                  >
                    Continue
                  </button>
                </div>
              )}
            </QuestionCard>
          )}

          {/* Q2: Time in US */}
          {step === 2 && (
            <QuestionCard
              question="How long have you been in the United States?"
              whyWeAsk="This sets which tasks are most urgent for your situation right now."
            >
              <div className="flex flex-wrap gap-2.5">
                {TIME_IN_US.map((t) => (
                  <PillButton
                    key={t}
                    label={t}
                    selected={profile.timeInUS === t}
                    onClick={() => {
                      set('timeInUS', t)
                      setTimeout(advance, 160)
                    }}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {/* Q3: Immigration status */}
          {step === 3 && (
            <QuestionCard
              question="What's your current immigration status?"
              whyWeAsk="Different statuses unlock different financial products. H-1B can open most accounts immediately. F-1 students have different tax rules."
            >
              <div className="flex flex-wrap gap-2.5">
                {STATUSES.map((s) => (
                  <PillButton
                    key={s}
                    label={s}
                    selected={profile.status === s}
                    onClick={() => {
                      set('status', s)
                      setTimeout(advance, 160)
                    }}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {/* Q4: SSN status */}
          {step === 4 && (
            <QuestionCard
              question="Do you have a Social Security Number (SSN) yet?"
              whyWeAsk="SSN is the key that unlocks most US financial products. If you don't have one, we'll show you alternatives that work right now."
            >
              <div className="flex flex-wrap gap-2.5">
                {SSN_STATUS.map((s) => (
                  <PillButton
                    key={s}
                    label={s}
                    selected={profile.hasSsn === s}
                    onClick={() => {
                      set('hasSsn', s)
                      setTimeout(advance, 160)
                    }}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

          {/* Q5: Financial tools back home */}
          {step === 5 && (
            <QuestionCard
              question="Back home, which of these did you use? (select all that apply)"
              whyWeAsk="Each one maps directly to a US equivalent. If you had a credit card back home, you already understand the concept — we just need to show you how scoring works differently here."
            >
              <div className="flex flex-wrap gap-2.5 mb-6">
                {HOME_TOOLS.map((t) => (
                  <PillButton
                    key={t.code}
                    label={t.label}
                    selected={(profile.tools ?? []).includes(t.code)}
                    onClick={() => toggleTool(t.code)}
                  />
                ))}
              </div>
              <button
                onClick={advance}
                disabled={(profile.tools ?? []).length === 0}
                className="w-full bg-faro-primary hover:bg-faro-dark disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
              >
                Continue →
              </button>
            </QuestionCard>
          )}

          {/* Q6: Urgent need */}
          {step === 6 && (
            <QuestionCard
              question="What are you most worried about right now?"
              whyWeAsk="This re-orders your personal roadmap so the most urgent thing comes first."
            >
              <div className="flex flex-wrap gap-2.5">
                {URGENCY.map((u) => (
                  <PillButton
                    key={u}
                    label={u}
                    selected={false}
                    onClick={() => handleFinish(u)}
                  />
                ))}
              </div>
            </QuestionCard>
          )}

        </div>
      </div>
    </main>
  )
}
