'use client'

import { useState } from 'react'

export type BlockStatus = 'start_here' | 'up_next' | 'coming_soon'

interface BuildingBlockProps {
  title: string
  explanation: string
  status: BlockStatus
  locked?: boolean
  /** Section C only — show fully expanded content */
  expanded?: boolean
  keyDifference?: string
  action?: string
  actionUrl?: string | null
  onComplete?: () => void
  completed?: boolean
}

const STATUS_CONFIG: Record<BlockStatus, { label: string; bg: string; text: string }> = {
  start_here:  { label: 'Start here',   bg: 'bg-faro-primary',  text: 'text-white'          },
  up_next:     { label: 'Up next',      bg: 'bg-faro-light',    text: 'text-faro-dark'       },
  coming_soon: { label: 'Coming soon',  bg: 'bg-faro-surface',  text: 'text-text-secondary'  },
}

export function BuildingBlock({
  title,
  explanation,
  status,
  locked = false,
  expanded = false,
  keyDifference,
  action,
  actionUrl,
  onComplete,
  completed = false,
}: BuildingBlockProps) {
  const [popping, setPopping] = useState(false)
  const cfg = STATUS_CONFIG[status]

  function handleComplete() {
    setPopping(true)
    setTimeout(() => setPopping(false), 300)
    onComplete?.()
  }

  return (
    <div
      className={`
        rounded-2xl border bg-white transition-shadow
        ${expanded
          ? 'border-faro-primary shadow-md shadow-faro-primary/10'
          : 'border-faro-border hover:shadow-sm'
        }
        ${locked ? 'opacity-60' : ''}
      `}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {locked && (
            <svg className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          )}
          <h3 className="font-semibold text-text-primary">{title}</h3>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.text}`}>
          {cfg.label}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 pb-5">
        <p className="text-sm text-text-secondary leading-relaxed">{explanation}</p>

        {/* Expanded section (Section C) */}
        {expanded && keyDifference && (
          <>
            {/* Key difference callout */}
            <div className="mt-4 bg-faro-light border-l-4 border-faro-primary rounded-r-xl px-4 py-3">
              <p className="text-xs font-semibold text-faro-dark mb-1 uppercase tracking-wide">
                Key difference
              </p>
              <p className="text-sm text-faro-dark leading-relaxed">{keyDifference}</p>
            </div>

            {/* Action */}
            {action && (
              <div className="mt-4">
                {actionUrl ? (
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-faro-primary hover:text-faro-dark underline underline-offset-2"
                  >
                    {action}
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-sm text-text-secondary italic">{action}</p>
                )}
              </div>
            )}

            {/* I built this */}
            <button
              onClick={handleComplete}
              disabled={completed}
              className={`
                mt-5 w-full py-3 rounded-xl font-semibold text-sm transition-all
                ${popping ? 'pop' : ''}
                ${completed
                  ? 'bg-faro-light text-faro-primary border border-faro-primary/30 cursor-default'
                  : 'bg-faro-primary hover:bg-faro-dark text-white shadow-sm hover:shadow-md'
                }
              `}
            >
              {completed ? '✓ Done — great work!' : 'I built this ✓'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
