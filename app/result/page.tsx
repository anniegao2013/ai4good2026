'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { FaroResult, ResultBlock, UserSession } from '@/lib/types'

const URGENCY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  week1: { label: 'Do this week', color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/30' },
  month1: { label: 'Do this month', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
  month3: { label: 'Within 3 months', color: 'text-green-400', bg: 'bg-green-400/10 border-green-400/30' },
  year1: { label: 'Within a year', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30' },
}

const COUNTRY_FLAG: Record<string, string> = {
  MX: '🇲🇽',
  IN: '🇮🇳',
  PH: '🇵🇭',
  NG: '🇳🇬',
  CA: '🇬🇹',
}

const COUNTRY_NAME: Record<string, string> = {
  MX: 'Mexico',
  IN: 'India',
  PH: 'Philippines',
  NG: 'Nigeria',
  CA: 'Central America',
}

export default function ResultPage() {
  const [result, setResult] = useState<FaroResult | null>(null)
  const [session, setSession] = useState<UserSession | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const rawResult = localStorage.getItem('faro_result')
    const rawSession = localStorage.getItem('faro_session')

    if (!rawResult || !rawSession) {
      setNotFound(true)
      return
    }

    try {
      setResult(JSON.parse(rawResult))
      setSession(JSON.parse(rawSession))
    } catch {
      setNotFound(true)
    }
  }, [])

  if (notFound) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-6 px-6">
        <p className="text-slate-400 text-lg">No results found. Please complete the onboarding first.</p>
        <Link href="/onboarding" className="bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-amber-300 transition-colors">
          Start over
        </Link>
      </main>
    )
  }

  if (!result || !session) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-t-amber-400 border-slate-700 animate-spin" />
      </main>
    )
  }

  const flag = COUNTRY_FLAG[session.country] ?? ''
  const countryName = COUNTRY_NAME[session.country] ?? session.country

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <span className="text-xl font-bold text-amber-400">Faro</span>
        <Link
          href="/onboarding"
          className="text-sm text-slate-400 hover:text-white transition-colors"
        >
          Start over
        </Link>
      </nav>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
            <span>{flag}</span>
            <span>{countryName} → United States</span>
            {result.fallback && (
              <span className="bg-slate-700 text-slate-300 text-xs px-2 py-0.5 rounded-full ml-2">
                Graph-only mode
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">Your Financial Map</h1>
        </div>

        {/* Portrait card */}
        <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-slate-200 leading-relaxed">{result.portrait}</p>
          </div>
        </div>

        {/* Translation blocks */}
        <div>
          <h2 className="text-lg font-semibold text-slate-300 mb-4">Your action roadmap</h2>
          <div className="space-y-4">
            {result.blocks.map((block, i) => (
              <TranslationCard key={i} block={block} index={i} />
            ))}
          </div>
        </div>

        {/* Cross-country insight */}
        <CrossCountryInsight country={session.country} tools={session.tools} />

        {/* CTA */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 text-center">
          <p className="text-slate-300 mb-4">
            Financial literacy is a journey. Share Faro with someone who just arrived.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Faro – Financial Map for Immigrants', url: window.location.origin })
                } else {
                  navigator.clipboard.writeText(window.location.origin)
                  alert('Link copied to clipboard!')
                }
              }}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold px-6 py-3 rounded-xl transition-colors"
            >
              Share Faro
            </button>
            <Link
              href="/onboarding"
              className="border border-slate-600 hover:border-slate-400 text-slate-300 px-6 py-3 rounded-xl transition-colors"
            >
              Redo for someone else
            </Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-slate-600 text-xs text-center pb-4">
          Faro provides general financial education, not personalized financial advice.
          Always consult a licensed financial professional for decisions specific to your situation.
        </p>
      </div>
    </main>
  )
}

function TranslationCard({ block, index }: { block: ResultBlock; index: number }) {
  const urgency = URGENCY_LABELS[block.urgency] ?? URGENCY_LABELS['month1']
  const [home, us] = block.title.split('→').map((s) => s.trim())

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-2xl overflow-hidden">
      {/* Card header */}
      <div className="px-5 py-4 border-b border-slate-700 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-slate-400 text-sm font-mono shrink-0">#{index + 1}</span>
          {home && us ? (
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="font-semibold text-white">{home}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-amber-400">{us}</span>
            </div>
          ) : (
            <span className="font-semibold text-white">{block.title}</span>
          )}
        </div>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${urgency.bg} ${urgency.color}`}>
          {urgency.label}
        </span>
      </div>

      {/* Card body */}
      <div className="px-5 py-4 space-y-4">
        <p className="text-slate-300 text-sm leading-relaxed">{block.explanation}</p>

        {/* Key difference */}
        <div className="flex gap-2.5 bg-amber-400/5 border border-amber-400/20 rounded-xl px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-amber-300 text-sm">{block.keyDifference}</p>
        </div>

        {/* Action */}
        <div className="flex gap-2.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <div>
            <span className="text-slate-400 text-xs uppercase tracking-wider">Action: </span>
            {block.actionUrl ? (
              <a
                href={block.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 text-sm hover:underline"
              >
                {block.action}
              </a>
            ) : (
              <span className="text-green-300 text-sm">{block.action}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CrossCountryInsight({ country, tools }: { country: string; tools: string[] }) {
  const hasSavingsGroup = tools.includes('savings')
  if (!hasSavingsGroup) return null

  const GROUP_NAMES: Record<string, string> = {
    MX: 'tanda',
    IN: 'chit fund',
    PH: 'paluwagan',
    NG: 'esusu',
    CA: 'tanda / cundina',
  }

  const home = GROUP_NAMES[country]
  if (!home) return null

  const others = Object.entries(GROUP_NAMES)
    .filter(([c]) => c !== country)
    .map(([, name]) => name)
    .join(', ')

  return (
    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-400/20 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-300 mb-1">Cross-community insight</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your <span className="text-white">{home}</span> is the same concept practiced by immigrants from Mexico, India, the Philippines, Nigeria, and Central America — just different names ({others}). In the US, they all map to <span className="text-white">lending circles</span>. Mission Asset Fund runs free credit-building lending circles in most cities.
          </p>
        </div>
      </div>
    </div>
  )
}
