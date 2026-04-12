const CATEGORY_LABELS: Record<string, string> = {
  banking:    'Banking',
  credit:     'Credit',
  savings:    'Savings',
  remittance: 'Remittance',
  tax:        'Tax & ID',
  housing:    'Housing',
}

const CATEGORY_COLORS: Record<string, string> = {
  banking:    'bg-blue-50 text-blue-700',
  credit:     'bg-orange-50 text-orange-700',
  savings:    'bg-green-50 text-green-700',
  remittance: 'bg-purple-50 text-purple-700',
  tax:        'bg-yellow-50 text-yellow-700',
  housing:    'bg-rose-50 text-rose-700',
}

interface TranslationRowProps {
  homeConcept: string
  usEquivalent: string
  category: string
  keyDifference: string
}

export function TranslationRow({
  homeConcept,
  usEquivalent,
  category,
  keyDifference,
}: TranslationRowProps) {
  const label = CATEGORY_LABELS[category] ?? category
  const color = CATEGORY_COLORS[category] ?? 'bg-gray-50 text-gray-700'

  return (
    <div className="py-4 border-b border-faro-border last:border-0">
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-semibold text-text-primary">{homeConcept}</span>
        <span className="text-faro-primary font-bold text-lg leading-none">→</span>
        <span className="font-semibold text-faro-dark">{usEquivalent}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>
          {label}
        </span>
      </div>
      <p className="mt-1 text-sm text-text-secondary leading-relaxed">{keyDifference}</p>
    </div>
  )
}
