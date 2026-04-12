'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { OnboardingData, Country, Category } from '@/lib/types'

const COUNTRIES: { code: Country; name: string; flag: string }[] = [
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'CA', name: 'Central America', flag: '🇬🇹' },
]

const TOOL_OPTIONS: { category: Category; label: string; description: string }[] = [
  { category: 'banking', label: 'Everyday banking', description: 'Checking accounts, mobile transfers, digital wallets' },
  { category: 'credit', label: 'Credit & loans', description: 'Credit scores, store credit, personal loans' },
  { category: 'savings', label: 'Savings groups', description: 'Tandas, chit funds, paluwagan, esusu' },
  { category: 'remittance', label: 'Sending money home', description: 'Remittances, wire transfers' },
  { category: 'tax', label: 'Taxes & ID', description: 'Tax IDs, national IDs, employer registration' },
  { category: 'housing', label: 'Housing & mortgages', description: 'Renting, buying, housing loans' },
]

const URGENCY_OPTIONS = [
  { value: 'open_bank_account', label: 'Open a US bank account' },
  { value: 'build_credit', label: 'Build credit from scratch' },
  { value: 'send_money_home', label: 'Send money home affordably' },
  { value: 'file_taxes', label: 'File my first US taxes' },
  { value: 'save_money', label: 'Start saving / investing' },
]

const STATUS_OPTIONS = [
  { value: 'citizen', label: 'US Citizen / Green Card' },
  { value: 'work_visa', label: 'Work visa (H-1B, L-1, O-1, etc.)' },
  { value: 'student_visa', label: 'Student visa (F-1, J-1)' },
  { value: 'refugee', label: 'Refugee / Asylee' },
  { value: 'undocumented', label: 'Undocumented / DACA' },
  { value: 'other', label: 'Other / Prefer not to say' },
]

const TIME_OPTIONS = [
  { value: 'less_1_month', label: 'Less than 1 month' },
  { value: '1_6_months', label: '1–6 months' },
  { value: '6_12_months', label: '6–12 months' },
  { value: '1_3_years', label: '1–3 years' },
  { value: 'more_3_years', label: 'More than 3 years' },
]

type Step = 'country' | 'tools' | 'profile' | 'submitting'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('country')
  const [data, setData] = useState<Partial<OnboardingData>>({
    tools: [],
  })
  const [error, setError] = useState<string | null>(null)

  function selectCountry(country: Country) {
    setData((d) => ({ ...d, country }))
    setStep('tools')
  }

  function toggleTool(category: Category) {
    setData((d) => {
      const tools = d.tools ?? []
      if (tools.includes(category)) {
        return { ...d, tools: tools.filter((t) => t !== category) }
      }
      return { ...d, tools: [...tools, category] }
    })
  }

  async function handleSubmit() {
    if (!data.urgency || !data.status || !data.timeInUS) return

    setStep('submitting')
    setError(null)

    const payload: OnboardingData = {
      country: data.country!,
      tools: data.tools ?? [],
      urgency: data.urgency,
      status: data.status,
      timeInUS: data.timeInUS,
    }

    try {
      const res = await fetch('/api/parallel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('API request failed')

      const result = await res.json()

      // Save to localStorage
      localStorage.setItem('faro_session', JSON.stringify({ ...payload, completedAt: new Date().toISOString() }))
      localStorage.setItem('faro_result', JSON.stringify(result))

      router.push('/result')
    } catch {
      setError('Something went wrong. Please try again.')
      setStep('profile')
    }
  }

  if (step === 'submitting') {
    return <LoadingScreen />
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center border-b border-slate-800">
        <span className="text-xl font-bold text-amber-400">Faro</span>
      </nav>

      {/* Progress */}
      <div className="px-6 pt-6 max-w-xl mx-auto w-full">
        <ProgressBar step={step} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl">
          {/* Step 1: Country */}
          {step === 'country' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Where are you from?</h2>
              <p className="text-slate-400 mb-8">We&apos;ll use this to map your home financial tools to US equivalents.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => selectCountry(c.code)}
                    className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-amber-400 rounded-2xl px-5 py-4 transition-all text-left"
                  >
                    <span className="text-3xl">{c.flag}</span>
                    <span className="font-medium text-white">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Tools */}
          {step === 'tools' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Which financial areas matter to you?</h2>
              <p className="text-slate-400 mb-8">Select all that apply. We&apos;ll prioritize your translation map accordingly.</p>
              <div className="grid grid-cols-1 gap-3 mb-8">
                {TOOL_OPTIONS.map((t) => {
                  const selected = data.tools?.includes(t.category)
                  return (
                    <button
                      key={t.category}
                      onClick={() => toggleTool(t.category)}
                      className={`flex items-start gap-4 rounded-2xl px-5 py-4 border transition-all text-left ${
                        selected
                          ? 'bg-amber-400/10 border-amber-400 text-white'
                          : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                        selected ? 'bg-amber-400 border-amber-400' : 'border-slate-500'
                      }`}>
                        {selected && (
                          <svg className="w-3 h-3 text-slate-950" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{t.label}</div>
                        <div className="text-sm text-slate-400 mt-0.5">{t.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setStep('profile')}
                disabled={!data.tools?.length}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-4 rounded-2xl transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {/* Step 3: Profile */}
          {step === 'profile' && (
            <div>
              <h2 className="text-2xl font-bold mb-2">A bit more about you</h2>
              <p className="text-slate-400 mb-8">This helps us personalize your financial roadmap.</p>

              <div className="space-y-6 mb-8">
                {/* Urgency */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    What&apos;s your most urgent financial need right now?
                  </label>
                  <div className="grid gap-2">
                    {URGENCY_OPTIONS.map((o) => (
                      <label
                        key={o.value}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 border cursor-pointer transition-all ${
                          data.urgency === o.value
                            ? 'bg-amber-400/10 border-amber-400 text-white'
                            : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency"
                          value={o.value}
                          checked={data.urgency === o.value}
                          onChange={(e) => setData((d) => ({ ...d, urgency: e.target.value }))}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          data.urgency === o.value ? 'border-amber-400' : 'border-slate-500'
                        }`}>
                          {data.urgency === o.value && (
                            <div className="w-2 h-2 rounded-full bg-amber-400" />
                          )}
                        </div>
                        <span className="text-sm">{o.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    What&apos;s your immigration status?
                  </label>
                  <select
                    value={data.status ?? ''}
                    onChange={(e) => setData((d) => ({ ...d, status: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">Select status...</option>
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>

                {/* Time in US */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    How long have you been in the US?
                  </label>
                  <select
                    value={data.timeInUS ?? ''}
                    onChange={(e) => setData((d) => ({ ...d, timeInUS: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
                  >
                    <option value="">Select time...</option>
                    {TIME_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('tools')}
                  className="px-6 py-4 rounded-2xl border border-slate-700 text-slate-300 hover:border-slate-500 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!data.urgency || !data.status || !data.timeInUS}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 disabled:text-slate-500 text-slate-950 font-bold py-4 rounded-2xl transition-colors"
                >
                  Build my financial map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

function ProgressBar({ step }: { step: Step }) {
  const steps: Step[] = ['country', 'tools', 'profile']
  const current = steps.indexOf(step)
  return (
    <div className="flex gap-2 mb-2">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 flex-1 rounded-full transition-colors ${
            i <= current ? 'bg-amber-400' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

function LoadingScreen() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700" />
        <div className="absolute inset-0 rounded-full border-4 border-t-amber-400 animate-spin" />
      </div>
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Building your financial map...</p>
        <p className="text-slate-400 text-sm">Querying our knowledge graph and generating your personalized plan</p>
      </div>
    </main>
  )
}
