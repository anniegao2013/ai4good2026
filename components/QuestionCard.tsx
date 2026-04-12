interface QuestionCardProps {
  question: string
  whyWeAsk: string
  children: React.ReactNode
}

export function QuestionCard({ question, whyWeAsk, children }: QuestionCardProps) {
  return (
    <div className="question-enter w-full">
      <h2 className="text-3xl font-bold text-text-primary mb-3 leading-tight">
        {question}
      </h2>
      <p className="text-sm text-text-secondary italic mb-8">
        {whyWeAsk}
      </p>
      {children}
    </div>
  )
}
