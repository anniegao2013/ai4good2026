import { NextRequest, NextResponse } from 'next/server'
import { getConceptById } from '@/lib/knowledge-graph'
import { invokeClaude } from '@/lib/bedrock'
import type {
  ConceptDetail,
  ConceptNode,
  Category,
  Similarity,
  Urgency,
} from '@/lib/types'

/** Strip markdown fences from model output */
function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim()
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```/m)
  if (fence) return JSON.parse(fence[1].trim())
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1))
  return JSON.parse(trimmed)
}

/** Build a reasonable ConceptDetail from just the ConceptNode when Bedrock is unavailable */
function buildFallback(concept: ConceptNode): ConceptDetail {
  return {
    id: concept.id,
    country: concept.country,
    homeConcept: concept.homeConcept,
    usEquivalent: concept.usEquivalent,
    category: concept.category as Category,
    similarity: concept.similarity as Similarity,
    urgency: concept.urgency as Urgency,
    caution: concept.caution,
    tagline: `${concept.homeConcept} maps to ${concept.usEquivalent} — here is what changes.`,
    atAGlance: `${concept.homeDescription} In the US, ${concept.usDescription}`,
    homeSide: {
      label: 'Back home',
      name: concept.homeConcept,
      description: concept.homeDescription,
      keyFeatures: [concept.keyDifference, concept.caution].filter(Boolean),
    },
    usSide: {
      label: 'In the United States',
      name: concept.usEquivalent,
      description: concept.usDescription,
      keyFeatures: [concept.keyDifference].filter(Boolean),
    },
    keyDifferences: [concept.keyDifference].filter(Boolean),
    steps: [
      {
        number: 1,
        title: 'Understand the basics',
        description: concept.usDescription,
        timeframe: 'Day 1',
      },
      {
        number: 2,
        title: 'Get set up',
        description: `Research and set up access to ${concept.usEquivalent}.`,
        timeframe: 'Week 1',
      },
      {
        number: 3,
        title: 'Build the habit',
        description: 'Integrate this tool into your regular financial routine.',
        timeframe: 'Month 1',
      },
    ],
    whenGood: [`When you want to use ${concept.usEquivalent} in the US.`],
    whenNotGood: [
      'When you need personalized financial advice — consult a licensed advisor.',
    ],
    gettingStarted: [
      {
        step: 1,
        title: `Start with ${concept.usEquivalent}`,
        description: concept.usDescription,
        ctas: [{ label: 'Search online', url: null, primary: true }],
      },
    ],
    questionsToAsk: [
      `What documents do I need to set up ${concept.usEquivalent}?`,
      'Are there any fees I should know about?',
      'How does this affect my credit score?',
      'What alternatives exist if I do not qualify yet?',
    ],
  }
}

const COUNTRY_NAMES: Record<string, string> = {
  MX: 'Mexico',
  IN: 'India',
  PH: 'the Philippines',
  NG: 'Nigeria',
  CA: 'Central America',
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const concept = getConceptById(id)
  if (!concept) return NextResponse.json({ error: 'Concept not found' }, { status: 404 })

  const countryName = COUNTRY_NAMES[concept.country] ?? concept.country
  const isCredit = concept.category === 'credit'

  const systemPrompt =
    'You are a financial literacy expert helping immigrants understand US finances. ' +
    'You write in a warm, practical, and empowering tone — jargon-free, specific, and actionable. ' +
    'Respond with ONLY valid JSON. No markdown fences, no preamble, no explanation.'

  const userPrompt = `
Generate a detailed educational JSON object for this financial concept mapping.

Source data (use only these facts):
- Home tool: ${concept.homeConcept} (used in ${countryName})
- Home description: ${concept.homeDescription}
- US equivalent: ${concept.usEquivalent}
- US description: ${concept.usDescription}
- Similarity: ${concept.similarity}
- Category: ${concept.category}
- Key difference: ${concept.keyDifference}
- Caution: ${concept.caution}
- Urgency: ${concept.urgency}

Return JSON with exactly these fields:
{
  "tagline": "1 punchy sentence (max 15 words) that hooks someone who used ${concept.homeConcept} for years",
  "atAGlance": "2-3 sentences. Explain both systems and their relationship clearly for a newcomer.",
  "homeSide": {
    "label": "In ${countryName}",
    "name": "${concept.homeConcept}",
    "description": "1-2 sentences about how it works back home",
    "keyFeatures": ["feature 1 (max 12 words)", "feature 2 (max 12 words)", "feature 3 (max 12 words)"]
  },
  "usSide": {
    "label": "In the United States",
    "name": "${concept.usEquivalent}",
    "description": "1-2 sentences about how it works in the US",
    "keyFeatures": ["feature 1 (max 12 words)", "feature 2 (max 12 words)", "feature 3 (max 12 words)"]
  },
  "keyDifferences": [
    "Complete sentence about difference 1",
    "Complete sentence about difference 2",
    "Complete sentence about difference 3"
  ],
  "steps": [
    {"number": 1, "title": "action title", "description": "2 sentences of practical guidance", "timeframe": "Day 1"},
    {"number": 2, "title": "action title", "description": "2 sentences of practical guidance", "timeframe": "Week 1"},
    {"number": 3, "title": "action title", "description": "2 sentences of practical guidance", "timeframe": "Month 1"}
  ],
  "creditTranslation": ${isCredit ? `{
    "homeScoreSystem": "name and range (e.g. CIBIL Score 300-900)",
    "usScoreSystem": "FICO Score (300-850)",
    "ranges": [
      {"label": "Excellent", "homeRange": "750-900", "usRange": "750-850", "color": "green"},
      {"label": "Good", "homeRange": "650-749", "usRange": "670-739", "color": "blue"},
      {"label": "Fair", "homeRange": "550-649", "usRange": "580-669", "color": "yellow"},
      {"label": "Poor", "homeRange": "300-549", "usRange": "300-579", "color": "red"}
    ],
    "keyInsight": "1-2 sentences about the most important thing to know when translating scores"
  }` : 'null'},
  "whenGood": [
    "Scenario 1 where this tool is the right choice (complete sentence)",
    "Scenario 2 where this tool is the right choice"
  ],
  "whenNotGood": [
    "Scenario 1 where to be careful or choose something else (complete sentence)",
    "Scenario 2 where to be careful"
  ],
  "gettingStarted": [
    {
      "step": 1,
      "title": "First concrete action",
      "description": "2-3 sentences of practical, specific guidance",
      "ctas": [{"label": "button label", "url": null, "primary": true}]
    },
    {
      "step": 2,
      "title": "Second concrete action",
      "description": "2-3 sentences of practical, specific guidance",
      "ctas": [{"label": "button label", "url": null, "primary": false}]
    }
  ],
  "questionsToAsk": [
    "Question 1 to ask a bank or credit union?",
    "Question 2?",
    "Question 3?",
    "Question 4?"
  ]
}`.trim()

  try {
    const raw = await invokeClaude(userPrompt, systemPrompt, 2048)
    const parsed = parseModelJson(raw) as Partial<ConceptDetail>

    const detail: ConceptDetail = {
      id: concept.id,
      country: concept.country,
      homeConcept: concept.homeConcept,
      usEquivalent: concept.usEquivalent,
      category: concept.category as Category,
      similarity: concept.similarity as Similarity,
      urgency: concept.urgency as Urgency,
      caution: concept.caution,
      tagline:          parsed.tagline ?? '',
      atAGlance:        parsed.atAGlance ?? '',
      homeSide:         parsed.homeSide ?? { label: 'Back home', name: concept.homeConcept, description: concept.homeDescription, keyFeatures: [] },
      usSide:           parsed.usSide ?? { label: 'In the United States', name: concept.usEquivalent, description: concept.usDescription, keyFeatures: [] },
      keyDifferences:   Array.isArray(parsed.keyDifferences) ? parsed.keyDifferences : [concept.keyDifference],
      steps:            Array.isArray(parsed.steps) ? parsed.steps : [],
      creditTranslation: parsed.creditTranslation ?? null,
      whenGood:         Array.isArray(parsed.whenGood) ? parsed.whenGood : [],
      whenNotGood:      Array.isArray(parsed.whenNotGood) ? parsed.whenNotGood : [],
      gettingStarted:   Array.isArray(parsed.gettingStarted) ? parsed.gettingStarted : [],
      questionsToAsk:   Array.isArray(parsed.questionsToAsk) ? parsed.questionsToAsk : [],
    }

    return NextResponse.json(detail)
  } catch (err) {
    console.error('Concept detail generation failed, using fallback:', err)
    return NextResponse.json(buildFallback(concept))
  }
}
