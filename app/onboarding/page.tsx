'use client'

import dynamic from 'next/dynamic'
import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/Header'
import { PillButton } from '@/components/PillButton'
import { Cityscape } from '@/components/Cityscape'
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
  { code: 'debit_card',       label: 'Debit card'                                 },
  { code: 'loans',            label: 'Loans (car, home, personal)'                     },
  { code: 'investments',      label: 'Investments / stocks'                            },
  { code: 'rotating_savings', label: 'Rotating savings group (chit fund / tanda / susu)' },
  { code: 'real_estate',      label: 'Real estate'                                     },
  { code: 'cash',             label: 'Cash'                                       },
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

const TOTAL = 7

// Country label helper
const COUNTRY_LABEL_TO_CODE: Record<string, OnboardingCountry> = Object.fromEntries(
  COUNTRIES.map(c => [c.label.toLowerCase(), c.code])
) as Record<string, OnboardingCountry>

// ── Option button (v0 card style) ────────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex items-center justify-between gap-3 ${
        selected
          ? 'border-faro-primary bg-faro-light'
          : 'border-faro-border bg-white hover:border-faro-primary/50'
      }`}
    >
      <span className={`font-medium ${selected ? 'text-faro-dark' : 'text-text-primary'}`}>
        {label}
      </span>
      {selected && (
        <div className="w-6 h-6 rounded-full bg-faro-primary flex items-center justify-center shrink-0">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </motion.button>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState<Partial<FaroProfile>>({ tools: [] })
  const [otherCountry, setOtherCountry] = useState('')

  const progress = (step - 1) / TOTAL

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
      name:      profile.name ?? '',
      country:   profile.country ?? 'OTHER',
      timeInUS:  profile.timeInUS ?? '',
      status:    profile.status ?? '',
      hasSsn:    profile.hasSsn ?? '',
      tools:     profile.tools ?? [],
      urgency,
    }
    localStorage.setItem('faro_profile', JSON.stringify(final))
    router.push('/loading')
  }

  return (
    <main className="min-h-screen bg-white">
      <Header
        backHref={step === 1 ? '/' : undefined}
        backOnClick={step > 1 ? back : undefined}
        backLabel="Back"
        progress={progress}
      />

      {/* Step dots */}
      <div className="pt-24 pb-0 px-6 max-w-xl mx-auto">
        <div className="flex items-center gap-2">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i < step ? 'w-8 bg-faro-primary' : i === step - 1 ? 'w-8 bg-faro-primary' : 'w-2 bg-faro-border'
              }`}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-text-secondary">
            {step} of {TOTAL}
          </span>
        </div>
      </div>

      {/* Questions */}
      <div className="px-6 pt-8 pb-72 max-w-xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >

            {/* Q1: Name */}
            {step === 1 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  What&rsquo;s your name?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  We&rsquo;ll use this to personalize your roadmap.
                </p>
                <input
                  type="text"
                  placeholder="Your first name"
                  value={profile.name ?? ''}
                  onChange={(e) => set('name', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (profile.name ?? '').trim()) advance()
                  }}
                  autoFocus
                  className="w-full border border-faro-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-faro-primary mb-3"
                />
                <button
                  onClick={advance}
                  disabled={!(profile.name ?? '').trim()}
                  className="w-full bg-faro-primary hover:bg-faro-dark disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Q2: Country — keep interactive globe */}
            {step === 2 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  What country did are you coming from?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  Each country has a distinct financial system. This loads the right comparison map for you.
                </p>

                {/* Search bar */}
                <div className="w-full mb-4">
                  <input
                    type="text"
                    placeholder="Search your country..."
                    value={otherCountry}
                    onChange={(e) => {
                      const raw = e.target.value
                      setOtherCountry(raw)
                      const val = raw.trim().toLowerCase()
                      const match = COUNTRY_LABEL_TO_CODE[val]
                      if (match) {
                        set('country', match)
                      } else if (raw.trim()) {
                        set('country', 'OTHER')
                      }
                    }}
                    className="w-full border border-faro-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-faro-primary"
                  />
                </div>

                {/* Globe */}
                <div className="flex justify-center w-full">
                  <CountryGlobe
                    selectedCode={profile.country !== 'OTHER' ? profile.country ?? null : null}
                    onSelect={(code) => {
                      set('country', code as OnboardingCountry)
                      setOtherCountry(
                        COUNTRIES.find((c) => c.code === code)?.label ?? ''
                      )
                      setTimeout(advance, 200)
                    }}
                  />
                </div>

                {/* Pill shortcuts */}
                <div className="flex flex-wrap gap-2.5 mt-4 justify-center">
                  {COUNTRIES.map((c) => (
                    <PillButton
                      key={c.code}
                      label={c.label}
                      selected={profile.country === c.code}
                      onClick={() => {
                        set('country', c.code as OnboardingCountry)
                        setOtherCountry(c.code !== 'OTHER' ? c.label : '')
                        if (c.code !== 'OTHER') {
                          setTimeout(advance, 160)
                        }
                      }}
                    />
                  ))}
                </div>

                {/* OTHER fallback text input */}
                {profile.country === 'OTHER' && (
                  <div className="mt-3 w-full">
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
              </div>
            )}

            {/* Q3: Time in US */}
            {step === 3 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  How long have you been in the United States?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  This sets which tasks are most urgent for your situation right now.
                </p>
                <div className="grid gap-3">
                  {TIME_IN_US.map((t) => (
                    <OptionButton
                      key={t}
                      label={t}
                      selected={profile.timeInUS === t}
                      onClick={() => {
                        set('timeInUS', t)
                        setTimeout(advance, 200)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Q4: Immigration status */}
            {step === 4 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  What&rsquo;s your current immigration status?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  Different statuses unlock different financial products. H-1B can open most accounts immediately. F-1 students have different tax rules.
                </p>
                <div className="grid gap-3">
                  {STATUSES.map((s) => (
                    <OptionButton
                      key={s}
                      label={s}
                      selected={profile.status === s}
                      onClick={() => {
                        set('status', s)
                        setTimeout(advance, 200)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Q5: SSN status */}
            {step === 5 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  Do you have a Social Security Number (SSN) yet?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  SSN is the key that unlocks most US financial products. If you don&rsquo;t have one, we&rsquo;ll show you alternatives that work right now.
                </p>
                <div className="grid gap-3">
                  {SSN_STATUS.map((s) => (
                    <OptionButton
                      key={s}
                      label={s}
                      selected={profile.hasSsn === s}
                      onClick={() => {
                        set('hasSsn', s)
                        setTimeout(advance, 200)
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Q6: Financial tools back home */}
            {step === 6 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  Back home, which of these did you use?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  Each one maps directly to a US equivalent. Select all that apply.
                </p>
                <div className="grid gap-3 mb-6">
                  {HOME_TOOLS.map((t) => (
                    <OptionButton
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
                  Continue
                </button>
              </div>
            )}

            {/* Q7: Urgent need */}
            {step === 7 && (
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight mb-3 text-balance">
                  What are you most worried about right now?
                </h1>
                <p className="text-text-secondary mb-8 text-base">
                  This re-orders your personal roadmap so the most urgent thing comes first.
                </p>
                <div className="grid gap-3">
                  {URGENCY.map((u) => (
                    <OptionButton
                      key={u}
                      label={u}
                      selected={false}
                      onClick={() => handleFinish(u)}
                    />
                  ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Back button (below questions) */}
        {step > 1 && (
          <motion.button
            onClick={back}
            className="mt-10 text-sm text-text-secondary hover:text-text-primary transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ← Go back
          </motion.button>
        )}
      </div>

      <Cityscape progress={(step - 1) / TOTAL * 0.5} />
    </main>
  )
}
