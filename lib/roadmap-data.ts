export type TrackId = 'banking' | 'credit' | 'taxes' | 'remittance' | 'savings'

export interface Track {
  id: TrackId
  label: string
  color: string
  bgColor: string
}

export interface RoadmapNode {
  id: string
  title: string
  description: string
  details: string
  tips: string[]
  track: TrackId
  position: { x: number; y: number }
  dependencies: string[]
}

export const tracks: Track[] = [
  { id: 'banking',    label: 'Banking',            color: '#1D9E75', bgColor: '#E1F5EE' },
  { id: 'credit',     label: 'Credit',             color: '#2563eb', bgColor: '#eff6ff' },
  { id: 'taxes',      label: 'Taxes & ID',         color: '#d97706', bgColor: '#fffbeb' },
  { id: 'remittance', label: 'Sending Money Home', color: '#e11d48', bgColor: '#fff1f2' },
  { id: 'savings',    label: 'Savings',            color: '#7c3aed', bgColor: '#f5f3ff' },
]

export const roadmapNodes: RoadmapNode[] = [
  // ── Row 0: Entry points ──────────────────────────────────────────────────
  {
    id: 'bank-account',
    title: 'Open a US bank account',
    description: 'Your first financial home in the US. Most banks accept a passport + ITIN or SSN.',
    details: 'Credit unions are often more immigrant-friendly than big banks — lower fees, fewer requirements. Bring your passport and any visa documents. Online banks like Chime or SoFi have no minimum balance requirements.',
    tips: [
      'Credit unions rarely require an SSN to open an account',
      'Ask your employer if they have a partner bank — some offer fee waivers',
      'Avoid banks with monthly fees above $5',
    ],
    track: 'banking',
    position: { x: 1, y: 0 },
    dependencies: [],
  },
  {
    id: 'itin',
    title: 'Get an ITIN (if no SSN)',
    description: 'An Individual Taxpayer Identification Number lets you file taxes and open accounts.',
    details: 'Apply with IRS Form W-7 plus your passport and visa. Processing takes 7–11 weeks. An ITIN is not the same as an SSN — it\'s tax-use only — but many banks and lenders accept it.',
    tips: [
      'You can apply through an IRS Certified Acceptance Agent to avoid mailing your passport',
      'Renew your ITIN if it was issued before 2013 and hasn\'t been used in 3 years',
    ],
    track: 'taxes',
    position: { x: 3, y: 0 },
    dependencies: [],
  },

  // ── Row 1 ────────────────────────────────────────────────────────────────
  {
    id: 'direct-deposit',
    title: 'Set up direct deposit',
    description: 'How most US employers pay — paper checks are rare. Faster access to your money.',
    details: 'Ask HR for a direct deposit form. Provide your bank\'s routing number (9 digits, printed at the bottom left of a check or in your banking app) and your account number. Funds usually arrive the same day payroll runs.',
    tips: [
      'Some banks give early access to direct deposits (up to 2 days early)',
      'Split direct deposit between checking and savings to automate saving',
    ],
    track: 'banking',
    position: { x: 0, y: 1 },
    dependencies: ['bank-account'],
  },
  {
    id: 'pay-stub',
    title: 'Understand your pay stub',
    description: 'Learn what\'s deducted before your paycheck hits your account.',
    details: 'Your pay stub shows: gross pay (what you earned), then deductions like federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any benefits (health insurance, 401k). Net pay is what you actually receive.',
    tips: [
      'Social Security and Medicare together are called FICA — 7.65% of your gross pay',
      'If you filled out your W-4 incorrectly, you may owe taxes in April — check with HR',
      'A pre-tax 401k contribution reduces your taxable income immediately',
    ],
    track: 'taxes',
    position: { x: 2, y: 1 },
    dependencies: ['direct-deposit'],
  },
  {
    id: 'file-taxes',
    title: 'File your first tax return',
    description: 'Required if you earned US income. April 15 deadline (or October with extension).',
    details: 'Use your ITIN or SSN to file. Free File through IRS.gov is available if your income is under $73,000. If you\'re on F-1/J-1 status, you may be a "non-resident alien" and must use different forms (1040-NR). Consider using Sprintax or a CPA familiar with immigrant taxes.',
    tips: [
      'Non-residents on F-1/J-1 cannot use TurboTax — use Sprintax instead',
      'Keep all W-2s, 1099s, and receipts — the IRS can audit up to 3 years back',
      'File even if you had no income — it establishes your tax history',
    ],
    track: 'taxes',
    position: { x: 3, y: 1 },
    dependencies: ['itin'],
  },
  {
    id: 'compare-remittance',
    title: 'Compare remittance services',
    description: 'Find the best rate and lowest fees before sending money home.',
    details: 'Always compare the exchange rate AND fees — the real cost is buried in the rate margin. Wise and Remitly typically offer the best rates. Western Union is slower and pricier but has wide cash pickup networks. Never use airport currency exchange booths.',
    tips: [
      'Use wise.com/compare to benchmark rates before each transfer',
      'The mid-market rate (on Google) is the "real" rate — aim to get within 1–2% of it',
      'Larger transfers often get better rates — batch if you can',
    ],
    track: 'remittance',
    position: { x: 4, y: 1 },
    dependencies: ['bank-account'],
  },

  // ── Row 2 ────────────────────────────────────────────────────────────────
  {
    id: 'secured-card',
    title: 'Get a secured credit card',
    description: 'Builds your US credit score from zero using a small refundable deposit.',
    details: 'A secured card requires a deposit ($200–$500) that becomes your credit limit. The bank reports your payments to Experian, Equifax, and TransUnion every month — this is how your credit score grows. After 6–12 months of on-time payments, many banks will upgrade you to an unsecured card and return your deposit.',
    tips: [
      'Pay the full balance every month — carrying a balance costs interest and doesn\'t help your score',
      'Keep utilization below 30% of your limit (e.g., spend max $60 on a $200 limit card)',
      'Discover it® Secured and Capital One Platinum Secured are good starter cards',
    ],
    track: 'credit',
    position: { x: 0, y: 2 },
    dependencies: ['bank-account'],
  },
  {
    id: 'emergency-fund',
    title: 'Start an emergency fund',
    description: 'Aim for 1 month of expenses to start — 3–6 months is the goal.',
    details: 'Keep your emergency fund in a separate high-yield savings account so you\'re not tempted to spend it. Having cash reserves means you won\'t need credit cards when something unexpected happens, protecting your credit score.',
    tips: [
      'Automate a small fixed transfer (even $25/paycheck) to make saving effortless',
      'Don\'t invest your emergency fund — it needs to be liquid',
      'Medical bills, car repairs, and visa fees are the most common emergencies for newcomers',
    ],
    track: 'savings',
    position: { x: 2, y: 2 },
    dependencies: ['direct-deposit'],
  },
  {
    id: 'regular-transfer',
    title: 'Set up scheduled remittances',
    description: 'Automate regular transfers home to lock in good rates and save on fees.',
    details: 'Once you have a preferred service, set up automatic monthly transfers. Some services let you lock in exchange rates in advance (forward contracts). Regularity also makes it easier to budget and reduces the mental load of remembering to send money.',
    tips: [
      'Check if your service offers loyalty rewards or rate locks for recurring transfers',
      'Tax tip: transfers to family abroad are gifts, not income — you generally don\'t owe US tax on them',
    ],
    track: 'remittance',
    position: { x: 4, y: 2 },
    dependencies: ['compare-remittance'],
  },

  // ── Row 3 ────────────────────────────────────────────────────────────────
  {
    id: 'credit-report',
    title: 'Check your credit report',
    description: 'Free once per year from each of the 3 bureaus. Errors are common.',
    details: 'Visit AnnualCreditReport.com (the only officially authorized site). Request reports from Experian, Equifax, and TransUnion separately — stagger them every 4 months to monitor year-round. Dispute any errors directly with the bureau online; they have 30 days to investigate.',
    tips: [
      'Look for accounts you didn\'t open — a common sign of identity theft',
      'A "hard inquiry" from applying for credit temporarily lowers your score by ~5 points',
      'Closed accounts with good history stay on your report for 10 years — that\'s good!',
    ],
    track: 'credit',
    position: { x: 0, y: 3 },
    dependencies: ['secured-card'],
  },
  {
    id: 'high-yield-savings',
    title: 'Open a high-yield savings account',
    description: 'Online banks pay 4–5% APY — 10x more than most traditional banks.',
    details: 'Online banks (Marcus by Goldman Sachs, Ally, SoFi) have no branches but offer dramatically higher interest rates. Transfers take 1–2 business days. FDIC-insured up to $250,000. Keep your emergency fund and short-term savings here.',
    tips: [
      'Compare rates at DepositAccounts.com weekly — they shift with the Fed rate',
      'Avoid accounts with withdrawal limits or minimum balance fees',
      'CDs (Certificates of Deposit) offer slightly higher rates if you can lock money away for 6–12 months',
    ],
    track: 'savings',
    position: { x: 2, y: 3 },
    dependencies: ['emergency-fund'],
  },
]

// Returns nodes that are not yet completed but have all dependencies met
export function getSuggestedNextNodes(
  completedIds: Set<string>,
  count = 3
): RoadmapNode[] {
  return roadmapNodes
    .filter(
      (n) =>
        !completedIds.has(n.id) &&
        n.dependencies.every((dep) => completedIds.has(dep))
    )
    .slice(0, count)
}

// Returns nodes that depend on the given node id
export function getDependentNodes(nodeId: string): RoadmapNode[] {
  return roadmapNodes.filter((n) => n.dependencies.includes(nodeId))
}
