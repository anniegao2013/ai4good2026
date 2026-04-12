'use client'

interface PillButtonProps {
  label: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

export function PillButton({ label, selected, onClick, disabled }: PillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 rounded-lg border text-sm transition-all
        focus:outline-none
        ${selected
          ? 'bg-faro-dark border-faro-dark text-white'
          : 'bg-white border-faro-border text-text-primary hover:border-text-primary'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {label}
    </button>
  )
}
