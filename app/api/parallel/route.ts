import { NextRequest, NextResponse } from 'next/server'
import { invokeClaude } from '@/lib/bedrock'
import { resolveConceptsForProfile } from '@/lib/knowledge-graph'
import type { ConceptNode, ResultBlock } from '@/lib/types'

/** Accept raw model output even when wrapped in ```json fences or leading prose. */
function parseModelJson(raw: string): unknown {
  const trimmed = raw.trim()
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```/m)
  if (fence) return JSON.parse(fence[1].trim())
  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return JSON.parse(trimmed.slice(start, end + 1))
  return JSON.parse(trimmed)
}

export async function POST(req: NextRequest) {
  const { country, tools, urgency, status, hasSsn, timeInUS } = await req.json()

  const concepts: ConceptNode[] = resolveConceptsForProfile({
    country,
    tools: tools ?? [],
    urgency,
    hasSsn,
  })

  // Build prompt and call Bedrock
  const systemPrompt =
    'You are Settle, a financial guide for immigrants arriving in the US. ' +
    'Use only the facts in the verified knowledge base provided. ' +
    'Do not add information not present there. Be warm, specific, and jargon-free.'

  const toolLabels = (tools as string[])?.join(', ') || 'various financial tools'

  const userPrompt = `
You are Settle, a financial guide for immigrants arriving in the US.

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

Return only valid JSON. No markdown. No preamble. 3 blocks maximum.
The VERIFIED KNOWLEDGE BASE array is already ordered by priority for this user (top items first) — follow that order unless a lower item clearly fits their stated top worry better.
`.trim()

  try {
    const raw = await invokeClaude(userPrompt, systemPrompt)
    const parsed = parseModelJson(raw) as {
      portrait?: string
      blocks?: ResultBlock[]
    }
    if (!parsed.portrait || !Array.isArray(parsed.blocks)) {
      throw new Error('Model JSON missing portrait or blocks')
    }
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
