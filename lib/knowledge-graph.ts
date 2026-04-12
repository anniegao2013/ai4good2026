/**
 * Public entry for the static graph: re-exports engine + data.
 * Concept rows live in `data/knowledge-graph.json`.
 */
export { KNOWLEDGE_GRAPH } from './knowledge-graph-data'
export {
  getActivatedConcepts,
  getConceptById,
  getLocalConcepts,
  orderConceptsForProfile,
  resolveConceptsForProfile,
  toGraphCountry,
  toolsToCategories,
  TOOL_LABELS,
} from './graph'
