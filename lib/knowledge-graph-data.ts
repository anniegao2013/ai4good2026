import type { ConceptNode } from './types'
import raw from '../data/knowledge-graph.json'

/** Static concept table — edit `data/knowledge-graph.json` to add rows. */
export const KNOWLEDGE_GRAPH = raw as ConceptNode[]
