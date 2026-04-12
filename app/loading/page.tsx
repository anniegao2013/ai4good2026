'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Skyline } from '@/components/Skyline'
import type { FaroProfile } from '@/lib/types'

const MIN_MS = 2400

export default function LoadingPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const raw = localStorage.getItem('faro_profile')
    if (!raw) { router.push('/onboarding'); return }

    const profile: FaroProfile = JSON.parse(raw)
    setName(profile.name || '')

    const ticker = setInterval(() => setFrame((f) => f + 1), 450)

    const minWait   = new Promise<void>((res) => setTimeout(res, MIN_MS))
    const apiFetch  = fetch('/api/parallel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => {
        localStorage.setItem('faro_result', JSON.stringify(data))
        localStorage.setItem('faro_result_fresh', '1')
      })
      .catch(() => {
        // result page will fall back to cached or knowledge-graph result
      })

    Promise.all([minWait, apiFetch]).then(() => {
      clearInterval(ticker)
      router.push('/result')
    })

    return () => clearInterval(ticker)
  }, [router])

  const dots = '.'.repeat((frame % 3) + 1)

  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6 overflow-hidden">
      <Skyline prominent />

      <div className="relative z-10 max-w-md w-full">
        <p className="text-sm font-semibold tracking-widest uppercase text-text-secondary mb-10">
          Settle
        </p>
        <h1 className="text-4xl font-bold text-text-primary leading-tight">
          Building for {name || 'you'}{dots}
        </h1>
        <p className="mt-5 text-base text-text-secondary leading-relaxed max-w-xs">
          Mapping what you already know to how it works here.
        </p>
      </div>
    </main>
  )
}
