export type GraphCountry = 'MX' | 'IN' | 'PH' | 'NG' | 'CA'

export type Similarity = 'equivalent' | 'similar' | 'partial' | 'no_equivalent'

export type Urgency = 'week1' | 'month1' | 'month3' | 'year1'

export type Category =
  | 'banking'
  | 'credit'
  | 'savings'
  | 'remittance'
  | 'tax'
  | 'housing'

/** Maps onboarding country codes to knowledge-graph country codes */
export type OnboardingCountry =
  | 'MX' | 'IN' | 'PH' | 'NG' | 'GT' | 'SV' | 'HN' | 'OTHER'

/** Maps onboarding tool selections to categories */
export type HomeTool =
  | 'bank_account'
  | 'credit_card'
  | 'debit_card'
  | 'loans'
  | 'investments'
  | 'rotating_savings'
  | 'real_estate'
  | 'cash'

export interface ConceptNode {
  id: string
  country: GraphCountry | string
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

/** Saved to localStorage as 'faro_profile' */
export interface FaroProfile {
  country: OnboardingCountry
  timeInUS: string
  status: string
  hasSsn: string
  tools: HomeTool[]
  urgency: string
}
