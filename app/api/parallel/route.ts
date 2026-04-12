import { NextRequest, NextResponse } from 'next/server'
import { getConceptsByCountry, getConceptsByTools } from '@/lib/neptune'
import { invokeClaude } from '@/lib/bedrock'
import { toNeptuneCountry, toolsToCategories, getLocalConcepts } from '@/lib/knowledge-graph'
import type { ConceptNode } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RawConcept = Record<string, any>

/** Normalize a Neptune valueMap result into a plain ConceptNode */
function normalizeNeptuneConcept(raw: RawConcept): ConceptNode {
  const v = (key: string) => {
    const val = raw[key]
    if (Array.isArray(val)) return val[0]
    if (val && typeof val === 'object' && '@value' in val) return val['@value']
    return val ?? ''
  }
  return {
    id:              v('id'),
    country:         v('country'),
    homeConcept:     v('homeConcept'),
    homeDescription: v('homeDescription'),
    usEquivalent:    v('usEquivalent'),
    usDescription:   v('usDescription'),
    similarity:      v('similarity'),
    keyDifference:   v('keyDifference'),
    caution:         v('caution'),
    urgency:         v('urgency'),
    category:        v('category'),
  }
}

export async function POST(req: NextRequest) {
  const { country, tools, urgency, status, hasSsn, timeInUS } = await req.json()

  // Map onboarding values to Neptune-compatible values
  const neptuneCountry = toNeptuneCountry(country)
  const categories = toolsToCategories(tools ?? [])

  // Step 1: Query Neptune for relevant concept nodes; fall back to local graph
  let concepts: ConceptNode[] = []
  try {
    const raw: RawConcept[] = categories.length > 0
      ? await getConceptsByTools(neptuneCountry, categories)
      : await getConceptsByCountry(neptuneCountry)
    concepts = raw.map(normalizeNeptuneConcept)
  } catch (err) {
    console.error('Neptune query failed, using local knowledge graph:', err)
    concepts = getLocalConcepts(country, tools)
  }

  // Step 2: Build prompt and call Bedrock
  const systemPrompt =
    'You are Faro, a financial guide for immigrants arriving in the US. ' +
    'Use only the facts in the verified knowledge base provided. ' +
    'Do not add information not present there. Be warm, specific, and jargon-free.'

  const toolLabels = (tools as string[])?.join(', ') || 'various financial tools'

  const userPrompt = `
You are Faro, a financial guide for immigrants arriving in the US.

VERIFIED KNOWLEDGE BASE — use only these facts, do not add information not present here:
${JSON.stringify(concepts, null, 2)}

USER PROFILE:
- From: ${country}
- Time in US: ${timeInUS}
- Immigration status: ${status}
- Has SSN: ${hasSsn}
- Financial tools used back home: ${toolLabels}
- Most urgent need: ${urgency}

YOUR TASK:
Generate a JSON response with exactly these fields:

{
  "portrait": "2-3 sentences. Acknowledge who this person is financially. Reference their specific home tools. Warm, respectful tone. No jargon.",
  "blocks": [
    {
      "title": "short block title",
      "explanation": "2-3 sentences anchored to their home equivalent. Explain the US version using the home version as the reference point.",
      "keyDifference": "One sentence. The single most important thing that's different here.",
      "action": "One specific thing they can do today. Start with a verb.",
      "actionUrl": "a real URL if relevant, otherwise null",
      "urgency": "week1 | month1 | month3"
    }
  ]
}

Return only valid JSON. No markdown. No preamble. 3 blocks maximum, ordered by urgency for this specific user.
`.trim()

  try {
    const raw = await invokeClaude(userPrompt, systemPrompt)
    const parsed = JSON.parse(raw)
    return NextResponse.json({ ...parsed, concepts })
  } catch (err) {
    console.error('Bedrock call failed, using fallback response:', err)

    // Fallback — knowledge graph only, no AI
    const portrait =
      `You're coming from ${country} with experience using ${toolLabels}. ` +
      `Here's how those map to the US system.`

    const blocks = concepts.slice(0, 3).map((c) => ({
      title:         `${c.homeConcept} → ${c.usEquivalent}`,
      explanation:   c.usDescription,
      keyDifference: c.keyDifference,
      action:        'Research this concept before your next financial decision.',
      actionUrl:     null,
      urgency:       c.urgency,
    }))

    return NextResponse.json({ portrait, blocks, concepts, fallback: true })
  }
}
