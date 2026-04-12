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
  name: string
  country: OnboardingCountry
  timeInUS: string
  status: string
  hasSsn: string
  tools: HomeTool[]
  urgency: string
}

// ── Concept detail types ─────────────────────────────────────────────────────

export interface ComparisonSide {
  label: string
  name: string
  description: string
  keyFeatures: string[]
}

export interface VisualStep {
  number: number
  title: string
  description: string
  timeframe?: string
}

export interface CreditRange {
  label: string
  homeRange: string
  usRange: string
  color: string
}

export interface CreditTranslation {
  homeScoreSystem: string
  usScoreSystem: string
  ranges: CreditRange[]
  keyInsight: string
}

export interface Cta {
  label: string
  url: string | null
  primary?: boolean
}

export interface GettingStartedStep {
  step: number
  title: string
  description: string
  ctas: Cta[]
}

export interface ConceptDetail {
  id: string
  country: string
  homeConcept: string
  usEquivalent: string
  category: Category
  similarity: Similarity
  urgency: Urgency
  tagline: string
  atAGlance: string
  homeSide: ComparisonSide
  usSide: ComparisonSide
  keyDifferences: string[]
  steps: VisualStep[]
  creditTranslation?: CreditTranslation | null
  whenGood: string[]
  whenNotGood: string[]
  gettingStarted: GettingStartedStep[]
  questionsToAsk: string[]
  caution: string
}
