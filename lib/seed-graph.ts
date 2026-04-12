// Run with: npx ts-node lib/seed-graph.ts
// Requires NEPTUNE_ENDPOINT env var to be set

import { driver, process as gprocess } from 'gremlin'

const { traversal } = gprocess

const ENDPOINT = process.env.NEPTUNE_ENDPOINT!

const dc = new driver.DriverRemoteConnection(
  `wss://${ENDPOINT}:8182/gremlin`,
  { mimeType: 'application/vnd.gremlin-v2.0+json-with-types' }
)

const g = traversal().withRemote(dc)

interface ConceptSeed {
  id: string
  country: string
  homeConcept: string
  homeDescription: string
  usEquivalent: string
  usDescription: string
  similarity: string
  keyDifference: string
  caution: string
  urgency: string
  category: string
}

const concepts: ConceptSeed[] = [
  // Mexico
  {
    id: 'MX.tanda',
    country: 'MX',
    homeConcept: 'Tanda',
    homeDescription: 'Rotating savings group where members contribute weekly and take turns receiving the pot',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings group through a credit union, often reported to credit bureaus',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build your credit score. Tandas do not.',
    caution: 'Informal tandas have no legal protection if someone stops paying',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'MX.buro_credito',
    country: 'MX',
    homeConcept: 'Buró de Crédito',
    homeDescription: 'Mexican credit bureau score used by lenders',
    usEquivalent: 'FICO score',
    usDescription: '300–850 score used by virtually all US lenders',
    similarity: 'similar',
    keyDifference: 'Your Mexican credit history does not transfer. You start at zero.',
    caution: 'Applying for too many cards at once lowers your score',
    urgency: 'week1',
    category: 'credit',
  },
  {
    id: 'MX.spei',
    country: 'MX',
    homeConcept: 'SPEI transfer',
    homeDescription: "Mexico's instant bank transfer system",
    usEquivalent: 'Zelle / ACH',
    usDescription: 'Zelle is instant bank-to-bank. ACH takes 1–3 business days',
    similarity: 'similar',
    keyDifference: 'Zelle is instant like SPEI. ACH is slower but always free.',
    caution: "Zelle has no buyer protection — only send to people you know",
    urgency: 'month1',
    category: 'banking',
  },
  {
    id: 'MX.rfc',
    country: 'MX',
    homeConcept: 'RFC',
    homeDescription: 'Mexican tax ID used for formal employment and banking',
    usEquivalent: 'ITIN',
    usDescription: "Individual Taxpayer Identification Number — used when SSN isn't available",
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
    homeDescription: 'Store credit line used by many Mexicans as first credit product',
    usEquivalent: 'Secured credit card',
    usDescription: 'Credit card backed by a cash deposit you provide upfront',
    similarity: 'partial',
    keyDifference: 'A secured card builds US credit. Coppel credit does not transfer.',
    caution: 'Pay the full balance every month — interest rates are 25–30%',
    urgency: 'month1',
    category: 'credit',
  },

  // India
  {
    id: 'IN.cibil_score',
    country: 'IN',
    homeConcept: 'CIBIL score',
    homeDescription: "India's primary credit score, range 300–900, used by all major lenders",
    usEquivalent: 'FICO score',
    usDescription: '300–850 score used by virtually all US lenders',
    similarity: 'similar',
    keyDifference: 'CIBIL history does not transfer to the US. You start at zero regardless of your CIBIL score.',
    caution: 'Missing even one payment in the US can drop your FICO score by 60–100 points',
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
    usEquivalent: '401(k) + Roth IRA',
    usDescription: 'Employer-sponsored retirement account, often with employer matching',
    similarity: 'similar',
    keyDifference: '401k is NOT automatic. You must opt in or you lose the employer match — free money left behind.',
    caution: "H-1B holders: you pay into Social Security but may not collect until permanent residency",
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
    homeDescription: "Permanent Account Number — India's primary tax and financial ID",
    usEquivalent: 'SSN / ITIN',
    usDescription: 'SSN for those eligible; ITIN via Form W-7 for others',
    similarity: 'similar',
    keyDifference: 'SSN unlocks most financial products. ITIN is for taxes only but still needed.',
    caution: 'Never share your SSN over phone or email — fraud risk is high',
    urgency: 'week1',
    category: 'tax',
  },

  // Philippines
  {
    id: 'PH.paluwagan',
    country: 'PH',
    homeConcept: 'Paluwagan',
    homeDescription: 'Rotating savings group, widely used across the Philippines',
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
    homeDescription: 'Philippine Social Security System — government pension',
    usEquivalent: 'Social Security / 401(k)',
    usDescription: 'US Social Security is automatic. 401k requires opt-in.',
    similarity: 'similar',
    keyDifference: 'Your SSS contributions do not transfer to US Social Security.',
    caution: 'You must work 10 years in the US (40 credits) to collect Social Security',
    urgency: 'month3',
    category: 'savings',
  },
  {
    id: 'PH.gcash',
    country: 'PH',
    homeConcept: 'GCash',
    homeDescription: 'Mobile wallet and payment app used across the Philippines',
    usEquivalent: 'Chime / Cash App',
    usDescription: 'Mobile-first bank accounts with no minimum balance',
    similarity: 'similar',
    keyDifference: "Chime is FDIC-insured. GCash is not backed by the same guarantees.",
    caution: "Chime is not a traditional bank — some landlords won't accept it for rent",
    urgency: 'week1',
    category: 'banking',
  },

  // Nigeria
  {
    id: 'NG.esusu',
    country: 'NG',
    homeConcept: 'Esusu / Ajo',
    homeDescription: 'Rotating savings group practiced across Nigeria and West Africa',
    usEquivalent: 'Lending circle',
    usDescription: 'Formal rotating savings through a CDFI, reported to credit bureaus',
    similarity: 'equivalent',
    keyDifference: 'US lending circles build your FICO score from zero.',
    caution: 'Informal esusu in the US has no legal protection',
    urgency: 'month1',
    category: 'savings',
  },
  {
    id: 'NG.bvn',
    country: 'NG',
    homeConcept: 'BVN',
    homeDescription: "Nigeria's biometric bank identity system",
    usEquivalent: 'SSN',
    usDescription: 'Social Security Number — required for most US financial products',
    similarity: 'similar',
    keyDifference: "BVN and SSN serve similar ID purposes but don't transfer. You need a US SSN or ITIN.",
    caution: 'Without SSN, apply for ITIN via Form W-7 to access financial services',
    urgency: 'week1',
    category: 'banking',
  },
  {
    id: 'NG.domiciliary',
    country: 'NG',
    homeConcept: 'Domiciliary account',
    homeDescription: 'Foreign currency account held at a Nigerian bank',
    usEquivalent: 'Multi-currency account',
    usDescription: 'Wise or Revolut multi-currency accounts work similarly',
    similarity: 'partial',
    keyDifference: "US banks don't typically offer multi-currency accounts. Use Wise for this.",
    caution: 'Wire transfer fees from US banks can be $25–45. Wise is usually cheaper.',
    urgency: 'month1',
    category: 'banking',
  },

  // Central America
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
    usDescription: 'Digital remittance services with lower fees than traditional wire',
    similarity: 'equivalent',
    keyDifference: 'Wise and Remitly cost 60–80% less than Western Union for most corridors.',
    caution: 'Always compare the exchange rate — "no fee" services hide cost in the rate',
    urgency: 'week1',
    category: 'remittance',
  },
  {
    id: 'CA.dpi',
    country: 'CA',
    homeConcept: 'DPI / consular ID',
    homeDescription: 'National ID card used for identification in home country',
    usEquivalent: 'ITIN + consular ID',
    usDescription: "ITIN for taxes; some banks accept consular IDs (matrícula consular) to open accounts",
    similarity: 'partial',
    keyDifference: 'Many credit unions accept consular IDs to open accounts even without SSN.',
    caution: 'Call ahead — not all branches accept consular IDs even if their bank policy allows it',
    urgency: 'week1',
    category: 'banking',
  },
]

async function main() {
  console.log(`Seeding ${concepts.length} concept nodes into Neptune...`)

  for (const c of concepts) {
    await g
      .addV('ConceptNode')
      .property('id', c.id)
      .property('country', c.country)
      .property('homeConcept', c.homeConcept)
      .property('homeDescription', c.homeDescription)
      .property('usEquivalent', c.usEquivalent)
      .property('usDescription', c.usDescription)
      .property('similarity', c.similarity)
      .property('keyDifference', c.keyDifference)
      .property('caution', c.caution)
      .property('urgency', c.urgency)
      .property('category', c.category)
      .next()
    console.log(`  ✓ ${c.id}`)
  }

  // Seed SIMILAR_TO edges between rotating savings groups
  const rotatingGroups = ['MX.tanda', 'IN.chit_fund', 'PH.paluwagan', 'NG.esusu', 'CA.tanda']
  console.log('\nSeeding SIMILAR_TO edges between rotating savings groups...')
  for (let i = 0; i < rotatingGroups.length; i++) {
    for (let j = i + 1; j < rotatingGroups.length; j++) {
      await g.V(rotatingGroups[i]).addE('SIMILAR_TO').to(g.V(rotatingGroups[j])).next()
      console.log(`  ✓ ${rotatingGroups[i]} <-> ${rotatingGroups[j]}`)
    }
  }

  console.log('\nSeeding complete.')
  await dc.close()
}

main().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
