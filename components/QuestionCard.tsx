interface QuestionCardProps {
  question: string
  whyWeAsk: string
  children: React.ReactNode
}

export function QuestionCard({ question, whyWeAsk, children }: QuestionCardProps) {
  return (
    <div className="question-enter">
      <h2 className="text-2xl font-semibold text-text-primary mb-2 text-balance leading-snug">
        {question}
      </h2>
      <p className="text-sm text-text-secondary mb-7">
        <span className="font-medium text-text-secondary">Why we ask: </span>
        {whyWeAsk}
      </p>
      {children}
    </div>
  )
}
