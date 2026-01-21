/**
 * NEXIS Feature - Relationship Intelligence
 *
 * NEXIS provides AI-powered relationship mapping and insights,
 * visualizing connections between contacts, companies, topics, and events.
 */

// Main components
export { default as NexisGraph } from './NexisGraph';
export { default as NexisContactCard } from './NexisContactCard';
export { default as NexisInsightPanel } from './NexisInsightPanel';

// Store and types
export {
  useNexisStore,
  type NexisNode,
  type NexisEdge,
  type NexisInsight,
  type NexisNodeType,
  type NexisEdgeType,
} from './nexis-store';
