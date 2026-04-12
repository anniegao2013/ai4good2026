/**
 * Hardcoded knowledge graph — used as a fallback when Neptune is unavailable.
 * Country codes here match Neptune: MX, IN, PH, NG, CA (Central America).
 */
import type { ConceptNode, Category } from './types'

export const KNOWLEDGE_GRAPH: ConceptNode[] = [
  // ── Mexico ─────────────────────────────────────────────────────────────────
  {
    id: 'MX.tanda',
    country: 'MX',
    homeConcept: 'Tanda',
    homeDescription: 'Rotating savings group where members contribute weekly and take turns receiving the pot',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings group through a credit union, reported to credit bureaus',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build your FICO credit score. Tandas do not.',
    caution: 'Informal tandas have no legal protection if someone stops paying',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'MX.cede',
    country: 'MX',
    homeConcept: 'CEDE',
    homeDescription: 'Certificate of deposit held at a Mexican bank, earns fixed interest over a term',
    usEquivalent: 'Certificate of Deposit (CD)',
    usDescription: 'FDIC-insured savings product that earns a fixed rate for a set term (3mo–5yr)',
    similarity: 'equivalent',
    keyDifference: 'US CDs are FDIC-insured up to $250,000 — your money is federally protected.',
    caution: 'Early withdrawal penalties apply — only lock up money you won\'t need',
    urgency: 'month3',
    category: 'savings',
  },
  {
    id: 'MX.buro_credito',
    country: 'MX',
    homeConcept: 'Buró de Crédito',
    homeDescription: 'Mexican credit bureau score used by lenders',
    usEquivalent: 'FICO score',
    usDescription: '300–850 score used by virtually all US lenders for credit decisions',
    similarity: 'similar',
    keyDifference: 'Your Mexican credit history does not transfer. You start at zero in the US.',
    caution: 'Applying for too many cards at once lowers your score',
    urgency: 'week1',
    category: 'credit',
  },
  {
    id: 'MX.spei',
    country: 'MX',
    homeConcept: 'SPEI transfer',
    homeDescription: 'Mexico\'s instant interbank transfer system',
    usEquivalent: 'Zelle / ACH',
    usDescription: 'Zelle is instant bank-to-bank. ACH takes 1–3 business days.',
    similarity: 'similar',
    keyDifference: 'Zelle is instant like SPEI. ACH is slower but always free.',
    caution: 'Zelle has no buyer protection — only send to people you know',
    urgency: 'month1',
    category: 'banking',
  },
  {
    id: 'MX.rfc',
    country: 'MX',
    homeConcept: 'RFC',
    homeDescription: 'Mexican tax ID used for formal employment and banking',
    usEquivalent: 'ITIN',
    usDescription: 'Individual Taxpayer Identification Number — for taxes when SSN isn\'t available',
    similarity: 'similar',
    keyDifference: 'ITIN is for taxes only, not work authorization. Apply via IRS Form W-7.',
    caution: 'You need an ITIN to file taxes even without an SSN',
    urgency: 'week1',
    category: 'tax',
  },
  {
    id: 'MX.credito_coppel',
    country: 'MX',
    homeConcept: 'Crédito Coppel',
    homeDescription: 'Store credit line used by many Mexicans as their first credit product',
    usEquivalent: 'Secured credit card',
    usDescription: 'Credit card backed by a cash deposit you provide upfront — builds US credit',
    similarity: 'partial',
    keyDifference: 'A secured card builds US credit. Coppel credit history does not transfer.',
    caution: 'Pay the full balance monthly — interest rates average 25–30%',
    urgency: 'month1',
    category: 'credit',
  },

  // ── India ──────────────────────────────────────────────────────────────────
  {
    id: 'IN.cibil_score',
    country: 'IN',
    homeConcept: 'CIBIL score',
    homeDescription: 'India\'s primary credit score, range 300–900, used by all major lenders',
    usEquivalent: 'FICO score',
    usDescription: '300–850 score used by virtually all US lenders',
    similarity: 'similar',
    keyDifference: 'Your CIBIL history does not transfer. You start at zero regardless of your score.',
    caution: 'Missing even one payment in the US can drop your FICO by 60–100 points',
    urgency: 'week1',
    category: 'credit',
  },
  {
    id: 'IN.chit_fund',
    country: 'IN',
    homeConcept: 'Chit fund',
    homeDescription: 'Rotating savings group regulated by state governments in India',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings group through a CDFI or credit union',
    similarity: 'equivalent',
    keyDifference: 'US lending circles report to credit bureaus and build your FICO score.',
    caution: 'Only use lending circles through regulated nonprofits like Mission Asset Fund',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'IN.epf',
    country: 'IN',
    homeConcept: 'EPF / PPF',
    homeDescription: 'Employer Provident Fund — mandatory retirement contribution in India',
    usEquivalent: '401(k)',
    usDescription: 'Employer-sponsored retirement account with optional employer matching',
    similarity: 'similar',
    keyDifference: '401k is NOT automatic. You must opt in or you miss the employer match — free money.',
    caution: 'H-1B holders pay into Social Security but may not collect until permanent residency',
    urgency: 'month3',
    category: 'savings',
  },
  {
    id: 'IN.upi',
    country: 'IN',
    homeConcept: 'UPI',
    homeDescription: 'Unified Payments Interface — instant bank-to-bank transfers via phone number',
    usEquivalent: 'Zelle / Venmo',
    usDescription: 'Zelle for bank transfers, Venmo for social payments',
    similarity: 'equivalent',
    keyDifference: 'Zelle is like UPI — instant and free. Venmo has a small fee for instant transfers.',
    caution: 'Zelle transfers are instant and irreversible — no dispute process',
    urgency: 'month1',
    category: 'banking',
  },
  {
    id: 'IN.pan_card',
    country: 'IN',
    homeConcept: 'PAN card',
    homeDescription: 'Permanent Account Number — India\'s primary tax and financial identity',
    usEquivalent: 'SSN / ITIN',
    usDescription: 'SSN for those eligible; ITIN via Form W-7 for others',
    similarity: 'similar',
    keyDifference: 'SSN unlocks most financial products. ITIN is for taxes only but still required.',
    caution: 'Never share your SSN over phone or email — identity theft risk is high',
    urgency: 'week1',
    category: 'tax',
  },
  {
    id: 'IN.gold_loan',
    country: 'IN',
    homeConcept: 'Gold loan',
    homeDescription: 'Loan secured against gold jewelry or coins — very common in India',
    usEquivalent: 'Secured personal loan',
    usDescription: 'Loan backed by collateral (savings account, CD, or other asset)',
    similarity: 'partial',
    keyDifference: 'US lenders don\'t typically accept gold. Use a secured loan against your savings instead.',
    caution: 'Building credit via a secured card or credit-builder loan is usually a better first step',
    urgency: 'month3',
    category: 'credit',
  },

  // ── Philippines ───────────────────────────────────────────────────────────
  {
    id: 'PH.paluwagan',
    country: 'PH',
    homeConcept: 'Paluwagan',
    homeDescription: 'Rotating savings group widely used across the Philippines',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings group through a credit union or CDFI',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build credit history. Paluwagan does not.',
    caution: 'Only join lending circles through regulated organizations',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'PH.sss',
    country: 'PH',
    homeConcept: 'SSS contributions',
    homeDescription: 'Philippine Social Security System — mandatory government pension',
    usEquivalent: 'Social Security',
    usDescription: 'Federal retirement program — automatic payroll deduction',
    similarity: 'similar',
    keyDifference: 'Your SSS contributions do not transfer. You need 40 US work credits to collect here.',
    caution: 'Also enroll in your employer\'s 401k — Social Security alone is not enough to retire on',
    urgency: 'month3',
    category: 'savings',
  },
  {
    id: 'PH.pagibig',
    country: 'PH',
    homeConcept: 'Pag-IBIG Fund',
    homeDescription: 'Government housing savings and loan program in the Philippines',
    usEquivalent: 'FHA loan program',
    usDescription: 'Federal Housing Administration loans with low down payments (3.5%) for first-time buyers',
    similarity: 'similar',
    keyDifference: 'FHA loans require a US credit score and 2-year employment history.',
    caution: 'Most immigrants need 2–3 years of credit history before qualifying for a mortgage',
    urgency: 'year1',
    category: 'housing',
  },
  {
    id: 'PH.gcash',
    country: 'PH',
    homeConcept: 'GCash',
    homeDescription: 'Mobile wallet and payments super-app used across the Philippines',
    usEquivalent: 'Chime / Cash App',
    usDescription: 'Mobile-first bank accounts with no minimum balance and no monthly fees',
    similarity: 'similar',
    keyDifference: 'Chime is FDIC-insured up to $250k. GCash deposits do not carry equivalent guarantees.',
    caution: 'Some landlords won\'t accept Chime for rent — a traditional bank account helps too',
    urgency: 'week1',
    category: 'banking',
  },

  // ── Nigeria ───────────────────────────────────────────────────────────────
  {
    id: 'NG.esusu',
    country: 'NG',
    homeConcept: 'Esusu / Ajo',
    homeDescription: 'Rotating savings group practiced across Nigeria and West Africa',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings through a CDFI, reported to credit bureaus',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build your FICO score from zero — esusu doesn\'t.',
    caution: 'Informal esusu in the US has no legal protection if someone defaults',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'NG.bvn',
    country: 'NG',
    homeConcept: 'BVN',
    homeDescription: 'Bank Verification Number — Nigeria\'s biometric bank identity',
    usEquivalent: 'SSN',
    usDescription: 'Social Security Number — required for most US financial products',
    similarity: 'similar',
    keyDifference: 'BVN and SSN serve similar ID purposes but don\'t transfer. You need a US SSN or ITIN.',
    caution: 'Without an SSN, apply for ITIN via Form W-7 to start accessing financial services',
    urgency: 'week1',
    category: 'banking',
  },
  {
    id: 'NG.domiciliary',
    country: 'NG',
    homeConcept: 'Domiciliary account',
    homeDescription: 'Foreign-currency account held at a Nigerian bank',
    usEquivalent: 'Multi-currency account',
    usDescription: 'Wise or Revolut multi-currency accounts work similarly for holding USD/other currencies',
    similarity: 'partial',
    keyDifference: 'US banks don\'t typically offer multi-currency accounts. Use Wise instead.',
    caution: 'Wire transfer fees from US banks can be $25–45. Wise is usually 60–80% cheaper.',
    urgency: 'month1',
    category: 'banking',
  },
  {
    id: 'NG.mobile_money',
    country: 'NG',
    homeConcept: 'Mobile money (M-Pesa / OPay)',
    homeDescription: 'Phone-based money storage and transfers without a bank account',
    usEquivalent: 'Prepaid debit card',
    usDescription: 'Reloadable prepaid cards (NetSpend, Serve) usable anywhere Visa/Mastercard is accepted',
    similarity: 'partial',
    keyDifference: 'Prepaid cards don\'t build credit. Open a real bank account as soon as possible.',
    caution: 'Prepaid cards often have high fees — treat them as a temporary bridge, not a long-term solution',
    urgency: 'week1',
    category: 'banking',
  },

  // ── Central America (GT / SV / HN) ────────────────────────────────────────
  {
    id: 'CA.tanda',
    country: 'CA',
    homeConcept: 'Tanda / Cundina',
    homeDescription: 'Rotating savings group widely used across Central America',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings through a credit union or nonprofit',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build FICO credit history. Tandas do not.',
    caution: 'Mission Asset Fund runs free, credit-building lending circles across the US',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'CA.remesas',
    country: 'CA',
    homeConcept: 'Remesas',
    homeDescription: 'Money sent home to family — the primary financial product for many',
    usEquivalent: 'International wire / Wise / Remitly',
    usDescription: 'Digital remittance services with far lower fees than traditional wire',
    similarity: 'equivalent',
    keyDifference: 'Wise and Remitly cost 60–80% less than Western Union for most corridors.',
    caution: 'Always compare the exchange rate — "zero fee" services hide costs in the rate',
    urgency: 'week1',
    category: 'remittance',
  },
  {
    id: 'CA.dpi',
    country: 'CA',
    homeConcept: 'DPI / consular ID',
    homeDescription: 'National ID card or consular ID used for identification',
    usEquivalent: 'ITIN + consular ID',
    usDescription: 'ITIN for taxes; many credit unions accept consular IDs to open accounts',
    similarity: 'partial',
    keyDifference: 'Many credit unions accept consular IDs (matrícula consular) to open accounts without SSN.',
    caution: 'Call ahead — not all branches accept consular IDs even if their national policy allows it',
    urgency: 'week1',
    category: 'banking',
  },
]

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Maps onboarding country to Neptune country code */
export function toNeptuneCountry(country: string): string {
  if (['GT', 'SV', 'HN'].includes(country)) return 'CA'
  return country
}

/** Maps home tool selections to Neptune categories */
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
      if (!seen[c]) { seen[c] = true; cats.push(c) }
    }
  }
  return cats
}

/** Fallback: filter hardcoded graph by country + tools */
export function getLocalConcepts(country: string, tools?: string[]): ConceptNode[] {
  const neptuneCountry = toNeptuneCountry(country)
  const all = KNOWLEDGE_GRAPH.filter((c) => c.country === neptuneCountry)
  if (!tools || tools.length === 0) return all
  const cats = toolsToCategories(tools)
  return all.filter((c) => cats.includes(c.category as Category))
}

/** Human-readable tool labels */
export const TOOL_LABELS: Record<string, string> = {
  bank_account:     'Bank account',
  credit_card:      'Credit card',
  debit_card:       'Debit card only',
  loans:            'Loans (car, home, personal)',
  investments:      'Investments / stocks',
  rotating_savings: 'Rotating savings group (chit fund / tanda / susu)',
  real_estate:      'Real estate',
  cash:             'Cash only',
}
