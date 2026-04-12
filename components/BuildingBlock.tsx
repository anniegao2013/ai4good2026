'use client'

import { useState } from 'react'

export type BlockStatus = 'start_here' | 'up_next' | 'coming_soon'

interface BuildingBlockProps {
  title: string
  explanation: string
  status: BlockStatus
  locked?: boolean
  expanded?: boolean
  keyDifference?: string
  action?: string
  actionUrl?: string | null
  onComplete?: () => void
  completed?: boolean
}

export function BuildingBlock({
  title,
  explanation,
  locked = false,
  expanded: initialExpanded = false,
  keyDifference,
  action,
  actionUrl,
  onComplete,
  completed = false,
}: BuildingBlockProps) {
  const [open, setOpen] = useState(initialExpanded)
  const [popping, setPopping] = useState(false)

  function handleComplete() {
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
      } ${locked ? 'opacity-50' : ''}`}
    >
      {/* Row header */}
      <button
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4"
        onClick={() => !locked && setOpen((o) => !o)}
        disabled={locked}
      >
        <div className="flex-1 min-w-0">
          <p className={`font-medium leading-snug ${completed ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
            {title}
          </p>
          {!open && (
            <p className="text-sm text-text-secondary mt-0.5 truncate">{explanation}</p>
          )}
        </div>

        <div className="shrink-0 mt-0.5">
          {completed ? (
            <span className="text-faro-primary text-sm">✓</span>
          ) : locked ? (
            <span className="text-xs text-text-secondary/50">later</span>
          ) : (
            <span className="text-text-secondary text-sm">{open ? '↑' : '↓'}</span>
          )}
        </div>
      </button>

      {/* Expanded body */}
      {open && !locked && (
        <div className="px-5 pb-5 pt-1 border-t border-faro-border/60">
          <p className="text-sm text-text-secondary leading-relaxed mt-3">{explanation}</p>

          {keyDifference && (
            <div className="mt-4 bg-faro-surface rounded-lg px-4 py-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1">
                Key difference
              </p>
              <p className="text-sm text-text-primary leading-relaxed">{keyDifference}</p>
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
            disabled={completed}
            className={`
              mt-5 text-sm px-4 py-2 rounded-lg border transition-all
              ${popping ? 'pop' : ''}
              ${completed
                ? 'border-faro-primary/30 text-faro-primary bg-faro-light cursor-default'
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
