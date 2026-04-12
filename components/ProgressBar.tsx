interface ProgressBarProps {
  current: number  // 1-based current question
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full transition-all duration-300 ${
            i < current
              ? 'bg-faro-primary w-8'
              : 'bg-faro-border w-3'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-text-secondary">{current} / {total}</span>
    </div>
  )
}
