interface ProgressBarProps {
  current: number  // 1-based current question
  total: number
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round(((current - 1) / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-text-secondary font-medium">
          Question {current} of {total}
        </span>
        <span className="text-xs text-text-secondary">{pct}% complete</span>
      </div>
      <div className="h-1.5 bg-faro-border rounded-full overflow-hidden">
        <div
          className="h-full bg-faro-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
