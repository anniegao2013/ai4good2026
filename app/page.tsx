'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cityscape } from '@/components/Cityscape'

const features = [
  {
    emoji: '🌍',
    title: 'Works for your country',
    description: 'Personalised guidance based on the financial system you already know.',
  },
  {
    emoji: '💳',
    title: 'Build credit from scratch',
    description: 'Step-by-step roadmap to establish US credit history — even without a credit card at home.',
  },
  {
    emoji: '🏦',
    title: 'Open the right accounts',
    description: 'Banks, credit unions, and services that welcome newcomers — no SSN required to start.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative px-6 pt-16 pb-32 md:pt-24 md:pb-40">
        <div className="max-w-3xl mx-auto">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 rounded-xl bg-faro-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-lg font-semibold text-text-primary">Settle</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6 text-balance">
              Your finances,{' '}
              <span className="text-faro-primary">translated.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-10 max-w-xl">
              You already know how money works where you&rsquo;re from.
              We&rsquo;ll show you how it works here — step by step.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-faro-primary hover:bg-faro-dark text-white font-semibold text-base px-8 py-3.5 rounded-full transition-colors"
            >
              Get started →
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center flex-wrap gap-4 text-sm text-text-secondary"
          >
            <span className="flex items-center gap-1.5">✨ Free forever</span>
            <span className="w-1 h-1 rounded-full bg-faro-border" />
            <span>No account needed</span>
            <span className="w-1 h-1 rounded-full bg-faro-border" />
            <span>2 min to complete</span>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section className="px-6 pb-72">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-sm font-semibold text-faro-primary mb-6 uppercase tracking-wide">
              What you&rsquo;ll learn
            </h2>

            <div className="grid gap-4">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex gap-4 p-5 rounded-2xl bg-white border border-faro-border hover:border-faro-primary/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-faro-light flex items-center justify-center shrink-0 text-xl">
                    {f.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                    <p className="text-sm text-text-secondary">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Cityscape progress={0.1} />
    </main>
  )
}
