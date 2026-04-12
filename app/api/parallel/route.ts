import { NextRequest, NextResponse } from 'next/server'
import { getConceptsByCountry, getConceptsByTools } from '@/lib/neptune'
import { invokeClaude } from '@/lib/bedrock'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NeptuneConcept = Record<string, any>

export async function POST(req: NextRequest) {
  const { country, tools, urgency, status, timeInUS } = await req.json()

  // Step 1: Query Neptune for relevant concept nodes
  let concepts: NeptuneConcept[] = []
  try {
    if (tools && tools.length > 0) {
      concepts = await getConceptsByTools(country, tools)
    } else {
      concepts = await getConceptsByCountry(country)
    }
  } catch (err) {
    console.error('Neptune query failed:', err)
    // Fall through to fallback below
  }

  // Step 2: Build prompt with graph data and call Bedrock
  const systemPrompt = `You are Faro, a financial guide for immigrants arriving in the US. Use only the facts in the verified knowledge base provided. Do not add information not present there. Be warm, specific, and jargon-free.`

  const userPrompt = `
VERIFIED KNOWLEDGE BASE — use only these facts:
${JSON.stringify(concepts, null, 2)}

USER PROFILE:
- From: ${country}
- Time in US: ${timeInUS}
- Immigration status: ${status}
- Financial tools used back home: ${tools?.join(', ')}
- Most urgent need: ${urgency}

Generate a JSON response with exactly these fields:
{
  "portrait": "2-3 sentences. Acknowledge who this person is financially. Reference their specific home tools. Warm, respectful tone. No jargon.",
  "blocks": [
    {
      "title": "short block title",
      "explanation": "2-3 sentences anchored to their home equivalent.",
      "keyDifference": "One sentence. The single most important difference.",
      "action": "One specific thing they can do today. Start with a verb.",
      "actionUrl": "a real URL if relevant, otherwise null",
      "urgency": "week1 | month1 | month3"
    }
  ]
}

Return only valid JSON. No markdown. No preamble. 3 blocks maximum, ordered by urgency.
  `

  try {
    const raw = await invokeClaude(userPrompt, systemPrompt)
    const parsed = JSON.parse(raw)
    return NextResponse.json({ ...parsed, concepts })
  } catch (err) {
    console.error('Bedrock call failed:', err)

    // Fallback: generate result from graph data only, no AI
    const portrait = `You're coming from ${country} with experience using ${tools?.join(', ') || 'various financial tools'}. Here's how those map to the US system.`
    const blocks = concepts.slice(0, 3).map((c: NeptuneConcept) => ({
      title: `${c.homeConcept?.['@value'] ?? c.homeConcept} → ${c.usEquivalent?.['@value'] ?? c.usEquivalent}`,
      explanation: c.usDescription?.['@value'] ?? c.usDescription,
      keyDifference: c.keyDifference?.['@value'] ?? c.keyDifference,
      action: 'Research this concept before your next financial decision.',
      actionUrl: null,
      urgency: c.urgency?.['@value'] ?? c.urgency,
    }))

    return NextResponse.json({ portrait, blocks, concepts, fallback: true })
  }
}
