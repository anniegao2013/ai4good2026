'use client'

import Link from 'next/link'

interface HeaderProps {
  backHref?: string
  backOnClick?: () => void
  backLabel?: string
  /** 0–1 progress shown as a thin bar */
  progress?: number
}

export function Header({ backHref, backOnClick, backLabel = 'Back', progress }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-faro-border">
      <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-faro-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-base font-semibold text-text-primary">Settle</span>
        </Link>

        {progress !== undefined && (
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-24 h-1.5 bg-faro-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-faro-primary rounded-full transition-all duration-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className="text-xs text-text-secondary font-medium">
              {Math.round(progress * 100)}%
            </span>
          </div>
        )}

        {(backHref || backOnClick) && (
          backOnClick ? (
            <button
              onClick={backOnClick}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-faro-surface"
            >
              ← <span className="hidden sm:inline">{backLabel}</span>
            </button>
          ) : (
            <Link
              href={backHref!}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-faro-surface"
            >
              ← <span className="hidden sm:inline">{backLabel}</span>
            </Link>
          )
        )}
      </div>
    </header>
  )
}
