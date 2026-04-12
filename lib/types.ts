export type Country = 'MX' | 'IN' | 'PH' | 'NG' | 'CA'

export type Similarity = 'equivalent' | 'similar' | 'partial' | 'no_equivalent'

export type Urgency = 'week1' | 'month1' | 'month3' | 'year1'

export type Category =
  | 'banking'
  | 'credit'
  | 'savings'
  | 'remittance'
  | 'tax'
  | 'housing'

export interface ConceptNode {
  id: string
  country: Country | string
  homeConcept: string
  homeDescription: string
  usEquivalent: string
  usDescription: string
  similarity: Similarity
  keyDifference: string
  caution: string
  urgency: Urgency
  category: Category
}

export interface ResultBlock {
  title: string
  explanation: string
  keyDifference: string
  action: string
  actionUrl: string | null
  urgency: Urgency
}

export interface FaroResult {
  portrait: string
  blocks: ResultBlock[]
  concepts: ConceptNode[]
  fallback?: boolean
}

export interface OnboardingData {
  country: Country | string
  tools: Category[]
  urgency: string
  status: string
  timeInUS: string
}

export interface UserSession extends OnboardingData {
  completedAt: string
}
