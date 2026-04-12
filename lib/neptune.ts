const NEPTUNE_ENDPOINT = process.env.NEPTUNE_ENDPOINT!
const NEPTUNE_PORT = process.env.NEPTUNE_PORT || '8182'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryNeptune(gremlinQuery: string): Promise<any[]> {
  const url = `https://${NEPTUNE_ENDPOINT}:${NEPTUNE_PORT}/gremlin`
  const body = JSON.stringify({ gremlin: gremlinQuery })

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  })

  if (!response.ok) {
    throw new Error(`Neptune query failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.result.data['@value']
}

// Get all concept nodes for a given country
export async function getConceptsByCountry(country: string) {
  const query = `g.V().has('ConceptNode', 'country', '${country}').valueMap(true)`
  return queryNeptune(query)
}

// Get concepts filtered by country + category list
export async function getConceptsByTools(country: string, tools: string[]) {
  const categoryFilter = tools.map((t) => `'${t}'`).join(', ')
  const query = `
    g.V()
     .has('ConceptNode', 'country', '${country}')
     .has('category', within(${categoryFilter}))
     .valueMap(true)
  `
  return queryNeptune(query)
}

// Get US equivalent for a specific home concept
export async function getUSEquivalent(conceptId: string) {
  const query = `
    g.V('${conceptId}')
     .out('MAPS_TO')
     .valueMap(true)
  `
  return queryNeptune(query)
}

// Get all concepts similar to this one across countries (for cross-country insights)
export async function getSimilarConcepts(conceptId: string) {
  const query = `
    g.V('${conceptId}')
     .both('SIMILAR_TO')
     .valueMap(true)
  `
  return queryNeptune(query)
}
