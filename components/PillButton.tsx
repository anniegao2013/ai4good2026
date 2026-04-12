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
        px-4 py-2.5 rounded-full border text-sm font-medium transition-all
        focus:outline-none focus:ring-2 focus:ring-offset-1
        ${selected
          ? 'bg-faro-primary border-faro-primary text-white shadow-sm focus:ring-faro-primary'
          : 'bg-white border-faro-border text-text-primary hover:border-faro-primary hover:text-faro-primary focus:ring-faro-primary'
        }
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {label}
    </button>
  )
}
