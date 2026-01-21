/**
 * Knowledge Graph 3D Types
 *
 * TypeScript definitions for the 3D force-directed graph visualization.
 */

// ============================================================================
// Node Types
// ============================================================================

export type NodeLayer =
  | 'episodic'
  | 'semantic'
  | 'procedural'
  | 'meta'
  | 'contact'
  | 'company'
  | 'deal'
  | 'project'
  | 'default';

export interface GraphNode {
  id: string;
  label: string;
  layer?: NodeLayer;
  type?: string;
  importance?: number;
  summary?: string;
  timestamp?: string;
  participants?: string[];
  tags?: string[];
  // Force graph positions
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  type?: string;
}

// ============================================================================
// Color Configuration
// ============================================================================

export interface NodeColorConfig {
  primary: string;
  glow: string;
  label: string;
}

export type GraphColorScheme = Record<NodeLayer, NodeColorConfig>;

export const GRAPH_COLOR_SCHEME: GraphColorScheme = {
  // Memory Layers (Recall)
  episodic: { primary: '#7C3AED', glow: '#A78BFA', label: 'Episodic' },
  semantic: { primary: '#2563EB', glow: '#60A5FA', label: 'Semantic' },
  procedural: { primary: '#059669', glow: '#34D399', label: 'Procedural' },
  meta: { primary: '#DC2626', glow: '#F87171', label: 'Meta' },

  // Entity Types (NEXIS)
  contact: { primary: '#10B981', glow: '#6EE7B7', label: 'Contact' },
  company: { primary: '#7C3AED', glow: '#A78BFA', label: 'Company' },
  deal: { primary: '#3B82F6', glow: '#93C5FD', label: 'Deal' },
  project: { primary: '#F59E0B', glow: '#FCD34D', label: 'Project' },

  // Generic fallback
  default: { primary: '#6B7280', glow: '#9CA3AF', label: 'Node' },
};

// ============================================================================
// Component Props
// ============================================================================

export interface KnowledgeGraph3DProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  colorScheme?: GraphColorScheme;
  onNodeClick?: (node: GraphNode) => void;
  showControls?: boolean;
  showLegend?: boolean;
  className?: string;
}

// ============================================================================
// Mock Data
// ============================================================================

export const MOCK_NODES: GraphNode[] = [
  // Episodic memories
  { id: 'ep-1', label: 'Q4 Planning Meeting', layer: 'episodic', importance: 0.9, timestamp: '2026-01-15', participants: ['Sarah', 'Mike', 'Lisa'], tags: ['planning', 'quarterly'] },
  { id: 'ep-2', label: 'Customer Demo - Acme', layer: 'episodic', importance: 0.8, timestamp: '2026-01-12', participants: ['John', 'Client Team'], tags: ['sales', 'demo'] },
  { id: 'ep-3', label: 'Engineering Standup', layer: 'episodic', importance: 0.5, timestamp: '2026-01-10', participants: ['Engineering'], tags: ['daily', 'standup'] },

  // Semantic knowledge
  { id: 'se-1', label: 'API Rate Limits', layer: 'semantic', importance: 0.7, summary: 'Rate limits for external API calls' },
  { id: 'se-2', label: 'Pricing Structure', layer: 'semantic', importance: 0.85, summary: 'Enterprise pricing tiers' },
  { id: 'se-3', label: 'Company Values', layer: 'semantic', importance: 0.6, summary: 'Core company values and mission' },

  // Procedural knowledge
  { id: 'pr-1', label: 'Deployment Process', layer: 'procedural', importance: 0.9, summary: 'Steps for production deployment' },
  { id: 'pr-2', label: 'Onboarding Flow', layer: 'procedural', importance: 0.75, summary: 'New employee onboarding process' },
  { id: 'pr-3', label: 'Support Escalation', layer: 'procedural', importance: 0.8, summary: 'Escalation procedures for support tickets' },

  // Contacts
  { id: 'co-1', label: 'Sarah Chen', layer: 'contact', importance: 0.8, tags: ['executive', 'VP'] },
  { id: 'co-2', label: 'Mike Rodriguez', layer: 'contact', importance: 0.7, tags: ['engineering', 'lead'] },
  { id: 'co-3', label: 'Lisa Park', layer: 'contact', importance: 0.75, tags: ['product', 'manager'] },

  // Projects
  { id: 'pj-1', label: 'MVP Launch', layer: 'project', importance: 0.95, summary: 'Initial product launch' },
  { id: 'pj-2', label: 'API v2', layer: 'project', importance: 0.85, summary: 'API version 2 development' },

  // Deals
  { id: 'dl-1', label: 'Acme Corp Deal', layer: 'deal', importance: 0.9, summary: 'Enterprise deal with Acme' },
];

export const MOCK_EDGES: GraphEdge[] = [
  // Episode connections
  { source: 'ep-1', target: 'co-1', type: 'attended_by' },
  { source: 'ep-1', target: 'co-2', type: 'attended_by' },
  { source: 'ep-1', target: 'co-3', type: 'attended_by' },
  { source: 'ep-1', target: 'pj-1', type: 'about' },
  { source: 'ep-2', target: 'dl-1', type: 'about' },
  { source: 'ep-3', target: 'pj-2', type: 'about' },

  // Semantic connections
  { source: 'se-1', target: 'pj-2', type: 'relates_to' },
  { source: 'se-2', target: 'dl-1', type: 'relates_to' },

  // Procedural connections
  { source: 'pr-1', target: 'pj-1', type: 'used_in' },
  { source: 'pr-1', target: 'pj-2', type: 'used_in' },
  { source: 'pr-3', target: 'se-1', type: 'relates_to' },

  // Contact relationships
  { source: 'co-1', target: 'pj-1', type: 'leads' },
  { source: 'co-2', target: 'pj-2', type: 'leads' },
  { source: 'co-3', target: 'pj-1', type: 'manages' },
];
