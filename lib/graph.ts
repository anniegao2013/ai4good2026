/**
 * Graph “system” for the MVP: static nodes + activation filters + profile ordering.
 * No DB — filter/sort in memory.
 */
import type { Category, ConceptNode, FaroProfile, HomeTool, Urgency } from './types'
import { KNOWLEDGE_GRAPH } from './knowledge-graph-data'

const URGENCY_RANK: Record<Urgency, number> = {
  week1: 0,
  month1: 1,
  month3: 2,
  year1: 3,
}

/**
 * Onboarding “What are you most worried about?” → categories to float to the top.
 * Keys must match `URGENCY` in `app/onboarding/page.tsx`.
 */
const TOP_WORRY_TO_CATEGORIES: Record<string, Category[]> = {
  'Finding an apartment':           ['housing', 'credit', 'banking'],
  'Understanding my paycheck':      ['tax', 'banking'],
  'Sending money home':             ['remittance', 'banking'],
  'Building credit':                ['credit', 'banking'],
  'Opening a bank account':         ['banking', 'credit'],
  'Understanding taxes':            ['tax', 'banking'],
  'Saving / investing':             ['savings', 'banking'],
  'Just exploring':                 [],
}

/** Maps onboarding country to graph bucket (Central America → CA). */
export function toGraphCountry(country: string): string {
  if (['GT', 'SV', 'HN'].includes(country)) return 'CA'
  return country
}

/** Maps home tools to graph categories (activation by category). */
export function toolsToCategories(tools: string[]): Category[] {
  const map: Record<string, Category[]> = {
    bank_account:     ['banking'],
    credit_card:      ['credit'],
    debit_card:       ['banking'],
    loans:            ['credit', 'housing'],
    investments:      ['savings'],
    rotating_savings: ['savings'],
    real_estate:      ['housing'],
    cash:             ['banking'],
  }
  const seen: Record<string, boolean> = {}
  const cats: Category[] = []
  for (const t of tools) {
    for (const c of (map[t] ?? [])) {
      if (!seen[c]) {
        seen[c] = true
        cats.push(c)
      }
    }
  }
  return cats
}

/** Human-readable tool labels (onboarding codes → copy). */
export const TOOL_LABELS: Record<HomeTool | string, string> = {
  bank_account:     'Bank account',
  credit_card:      'Credit card',
  debit_card:       'Debit card',
  loans:            'Loans (car, home, personal)',
  investments:      'Investments / stocks',
  rotating_savings: 'Rotating savings group (chit fund / tanda / susu)',
  real_estate:      'Real estate',
  cash:             'Cash',
}

/**
 * “Activated” subgraph: country slice ∩ categories implied by selected tools.
 * Empty tools → all concepts for that country (still useful for OTHER / thin profiles).
 */
export function getActivatedConcepts(
  country: string,
  tools?: HomeTool[] | string[],
  pool: ConceptNode[] = KNOWLEDGE_GRAPH): ConceptNode[] {
  const graphCountry = toGraphCountry(country)
  const inCountry = pool.filter((c) => c.country === graphCountry)
  if (!tools?.length) return inCountry
  const cats = new Set(toolsToCategories(tools as string[]))
  return inCountry.filter((c) => cats.has(c.category as Category))
}

function prefersIdPathWithoutSsn(hasSsn: string): boolean {
  if (!hasSsn || hasSsn === 'Yes') return false
  return /no|not eligible|applied|not sure/i.test(hasSsn)
}

/**
 * Order activated nodes for this person: top worry → SSN/ITIN path → intrinsic urgency → id.
 */
export function orderConceptsForProfile(
  concepts: ConceptNode[],
  profile: Pick<FaroProfile, 'urgency' | 'hasSsn'>
): ConceptNode[] {
  const preferred = new Set(TOP_WORRY_TO_CATEGORIES[profile.urgency] ?? [])
  const boostTaxBanking = prefersIdPathWithoutSsn(profile.hasSsn)

  return [...concepts].sort((a, b) => {
    const ap = preferred.has(a.category as Category) ? 0 : 1
    const bp = preferred.has(b.category as Category) ? 0 : 1
    if (ap !== bp) return ap - bp

    if (boostTaxBanking) {
      const tier = (c: ConceptNode) =>
        c.category === 'tax' || c.category === 'banking' ? 0 : 1
      const at = tier(a)
      const bt = tier(b)
      if (at !== bt) return at - bt
    }

    const ur = URGENCY_RANK[a.urgency] - URGENCY_RANK[b.urgency]
    if (ur !== 0) return ur

    return a.id.localeCompare(b.id)
  })
}

/** One call for the API: activate, then prioritize. */
export function resolveConceptsForProfile(
  profile: Pick<FaroProfile, 'country' | 'tools' | 'urgency' | 'hasSsn'>
): ConceptNode[] {
  const activated = getActivatedConcepts(profile.country, profile.tools)
  return orderConceptsForProfile(activated, profile)
}

/** @deprecated Use `getActivatedConcepts` — kept for older imports */
export function getLocalConcepts(country: string, tools?: string[]): ConceptNode[] {
  return getActivatedConcepts(country, tools)
}

/** Look up a single concept by its ID (e.g. 'MX.tanda') */
export function getConceptById(id: string): ConceptNode | undefined {
  return KNOWLEDGE_GRAPH.find((c) => c.id === id)
}
