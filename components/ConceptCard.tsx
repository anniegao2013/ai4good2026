'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ConceptNode } from '@/lib/types'

interface ConceptCardProps {
  concept: ConceptNode
  /** Action text from AI block (preferred) or fallback */
  action?: string
  actionUrl?: string | null
  onComplete?: () => void
  completed?: boolean
}

export function ConceptCard({
  concept,
  action,
  actionUrl,
  onComplete,
  completed = false,
}: ConceptCardProps) {
  const [open, setOpen] = useState(false)
  const [popping, setPopping] = useState(false)

  function handleComplete() {
    if (completed) return
    setPopping(true)
    setTimeout(() => setPopping(false), 300)
    onComplete?.()
  }

  return (
    <div
      className={`border rounded-xl bg-white transition-all ${
        completed
          ? 'border-faro-primary/30 bg-faro-surface'
          : 'border-faro-border'
      }`}
    >
      {/* ── Header row ─────────────────────────────────────────────── */}
      <button
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
        onClick={() => setOpen((o) => !o)}
      >
        <div className="flex-1 min-w-0">
          {/* home → US title */}
          <p className={`font-semibold text-base leading-snug ${completed ? 'line-through text-text-secondary' : 'text-text-primary'}`}>
            <span className="font-normal text-text-secondary">{concept.homeConcept}</span>
            <span className="mx-2 text-faro-primary font-bold">→</span>
            <span>{concept.usEquivalent}</span>
          </p>
          {!open && (
            <p className="text-sm text-text-secondary mt-0.5 truncate">
              {concept.usDescription}
            </p>
          )}
        </div>

        <div className="shrink-0 mt-0.5">
          {completed ? (
            <span className="text-faro-primary text-sm">✓</span>
          ) : (
            <span className="text-text-secondary text-sm">{open ? '↑' : '↓'}</span>
          )}
        </div>
      </button>

      {/* ── Expanded body ───────────────────────────────────────────── */}
      {open && (
        <div className="px-5 pb-5 pt-1 border-t border-faro-border/60">
          <p className="text-sm text-text-secondary leading-relaxed mt-3">
            {concept.usDescription}
          </p>

          {concept.keyDifference && (
            <div className="mt-4 bg-faro-surface rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                Key difference
              </p>
              <p className="text-sm text-text-primary leading-relaxed">
                {concept.keyDifference}
              </p>
            </div>
          )}

          {concept.caution && (
            <div className="mt-3 rounded-lg px-4 py-3" style={{ background: '#FFF8ED' }}>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#92400E' }}>
                Watch out
              </p>
              <p className="text-sm leading-relaxed" style={{ color: '#78350F' }}>
                {concept.caution}
              </p>
            </div>
          )}

          {action && (
            <div className="mt-4">
              {actionUrl ? (
                <a
                  href={actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-faro-primary underline underline-offset-2"
                >
                  {action} →
                </a>
              ) : (
                <p className="text-sm text-text-secondary">{action}</p>
              )}
            </div>
          )}

          <button
            onClick={handleComplete}
            className={`
              mt-5 text-sm px-4 py-2 rounded-lg border transition-all
              ${popping ? 'pop' : ''}
              ${
                completed
                  ? 'border-faro-primary/30 text-faro-primary bg-faro-light hover:bg-white hover:border-faro-border hover:text-text-secondary'
                  : 'border-faro-border text-text-secondary hover:border-text-primary hover:text-text-primary'
              }
            `}
          >
            {completed ? '✓ Done' : 'I know this'}
          </button>
        </div>
      )}
    </div>
  )
}
