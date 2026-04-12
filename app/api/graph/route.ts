import { NextRequest, NextResponse } from 'next/server'
import { getConceptsByCountry, getSimilarConcepts } from '@/lib/neptune'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')
  const conceptId = searchParams.get('conceptId')

  if (conceptId) {
    const similar = await getSimilarConcepts(conceptId)
    return NextResponse.json({ similar })
  }

  if (country) {
    const concepts = await getConceptsByCountry(country)
    return NextResponse.json({ concepts })
  }

  return NextResponse.json({ error: 'Provide country or conceptId' }, { status: 400 })
}
