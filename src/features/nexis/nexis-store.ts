/**
 * NEXIS Store - Zustand state management for relationship graph
 *
 * Manages contacts, companies, topics, and their relationships
 * for the NEXIS relationship intelligence feature.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Node types in the NEXIS graph
export type NexisNodeType = 'person' | 'company' | 'topic' | 'event';

// Edge types representing relationships
export type NexisEdgeType = 'works_at' | 'knows' | 'mentioned_in' | 'attended' | 'interested_in' | 'collaborated_on';

export interface NexisNode {
  id: string;
  type: NexisNodeType;
  label: string;
  data: {
    name: string;
    title?: string;
    company?: string;
    email?: string;
    avatar?: string;
    description?: string;
    industry?: string;
    date?: string;
    location?: string;
    strength?: number; // 0-100 relationship strength
    lastContact?: string;
    tags?: string[];
  };
  position: { x: number; y: number };
}

export interface NexisEdge {
  id: string;
  source: string;
  target: string;
  type: NexisEdgeType;
  label?: string;
  data?: {
    strength?: number;
    since?: string;
    notes?: string;
  };
}

export interface NexisInsight {
  id: string;
  type: 'connection' | 'opportunity' | 'reminder' | 'trend';
  title: string;
  description: string;
  relatedNodes: string[];
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

interface NexisState {
  // Data
  nodes: NexisNode[];
  edges: NexisEdge[];
  insights: NexisInsight[];

  // UI State
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  filterTypes: NexisNodeType[];
  searchQuery: string;
  isLoading: boolean;

  // Actions
  setNodes: (nodes: NexisNode[]) => void;
  setEdges: (edges: NexisEdge[]) => void;
  addNode: (node: NexisNode) => void;
  updateNode: (id: string, updates: Partial<NexisNode>) => void;
  removeNode: (id: string) => void;
  addEdge: (edge: NexisEdge) => void;
  removeEdge: (id: string) => void;
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;
  setFilterTypes: (types: NexisNodeType[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getConnectedNodes: (nodeId: string) => NexisNode[];
  getNodeEdges: (nodeId: string) => NexisEdge[];
  getFilteredNodes: () => NexisNode[];
}

// Mock data for demonstration
const mockNodes: NexisNode[] = [
  // People
  {
    id: 'person-1',
    type: 'person',
    label: 'Sarah Chen',
    data: {
      name: 'Sarah Chen',
      title: 'VP of Engineering',
      company: 'TechCorp',
      email: 'sarah@techcorp.com',
      strength: 92,
      lastContact: '2 days ago',
      tags: ['decision-maker', 'technical'],
    },
    position: { x: 250, y: 150 },
  },
  {
    id: 'person-2',
    type: 'person',
    label: 'Michael Torres',
    data: {
      name: 'Michael Torres',
      title: 'Product Manager',
      company: 'StartupX',
      email: 'michael@startupx.io',
      strength: 78,
      lastContact: '1 week ago',
      tags: ['product', 'startup'],
    },
    position: { x: 450, y: 100 },
  },
  {
    id: 'person-3',
    type: 'person',
    label: 'Emily Watson',
    data: {
      name: 'Emily Watson',
      title: 'CEO',
      company: 'InnovateCo',
      email: 'emily@innovateco.com',
      strength: 85,
      lastContact: '3 days ago',
      tags: ['executive', 'decision-maker'],
    },
    position: { x: 150, y: 350 },
  },
  {
    id: 'person-4',
    type: 'person',
    label: 'James Kim',
    data: {
      name: 'James Kim',
      title: 'CTO',
      company: 'TechCorp',
      email: 'james@techcorp.com',
      strength: 65,
      lastContact: '2 weeks ago',
      tags: ['technical', 'c-suite'],
    },
    position: { x: 350, y: 280 },
  },
  {
    id: 'person-5',
    type: 'person',
    label: 'Lisa Park',
    data: {
      name: 'Lisa Park',
      title: 'Head of Sales',
      company: 'StartupX',
      email: 'lisa@startupx.io',
      strength: 71,
      lastContact: '5 days ago',
      tags: ['sales', 'partnership'],
    },
    position: { x: 550, y: 220 },
  },
  // Companies
  {
    id: 'company-1',
    type: 'company',
    label: 'TechCorp',
    data: {
      name: 'TechCorp',
      industry: 'Enterprise Software',
      description: 'Leading enterprise software company',
      tags: ['enterprise', 'software', 'fortune-500'],
    },
    position: { x: 100, y: 200 },
  },
  {
    id: 'company-2',
    type: 'company',
    label: 'StartupX',
    data: {
      name: 'StartupX',
      industry: 'AI/ML',
      description: 'AI-powered productivity tools',
      tags: ['startup', 'ai', 'series-b'],
    },
    position: { x: 500, y: 350 },
  },
  {
    id: 'company-3',
    type: 'company',
    label: 'InnovateCo',
    data: {
      name: 'InnovateCo',
      industry: 'FinTech',
      description: 'Next-gen financial services',
      tags: ['fintech', 'growth-stage'],
    },
    position: { x: 50, y: 450 },
  },
  // Topics
  {
    id: 'topic-1',
    type: 'topic',
    label: 'AI Strategy',
    data: {
      name: 'AI Strategy',
      description: 'Artificial intelligence implementation strategies',
      tags: ['ai', 'strategy', 'trending'],
    },
    position: { x: 300, y: 450 },
  },
  {
    id: 'topic-2',
    type: 'topic',
    label: 'Cloud Migration',
    data: {
      name: 'Cloud Migration',
      description: 'Cloud infrastructure and migration',
      tags: ['cloud', 'infrastructure'],
    },
    position: { x: 600, y: 450 },
  },
  // Events
  {
    id: 'event-1',
    type: 'event',
    label: 'Tech Summit 2026',
    data: {
      name: 'Tech Summit 2026',
      date: '2026-03-15',
      location: 'San Francisco, CA',
      description: 'Annual technology leadership summit',
      tags: ['conference', 'networking'],
    },
    position: { x: 400, y: 500 },
  },
  {
    id: 'event-2',
    type: 'event',
    label: 'AI Conference',
    data: {
      name: 'AI Conference',
      date: '2026-02-20',
      location: 'New York, NY',
      description: 'AI innovation and implementation conference',
      tags: ['ai', 'conference'],
    },
    position: { x: 200, y: 550 },
  },
];

const mockEdges: NexisEdge[] = [
  // Works at relationships
  { id: 'e1', source: 'person-1', target: 'company-1', type: 'works_at', data: { since: '2022-01' } },
  { id: 'e2', source: 'person-4', target: 'company-1', type: 'works_at', data: { since: '2020-06' } },
  { id: 'e3', source: 'person-2', target: 'company-2', type: 'works_at', data: { since: '2023-03' } },
  { id: 'e4', source: 'person-5', target: 'company-2', type: 'works_at', data: { since: '2024-01' } },
  { id: 'e5', source: 'person-3', target: 'company-3', type: 'works_at', data: { since: '2019-09' } },
  // Knows relationships
  { id: 'e6', source: 'person-1', target: 'person-2', type: 'knows', data: { strength: 75, notes: 'Met at conference' } },
  { id: 'e7', source: 'person-1', target: 'person-3', type: 'knows', data: { strength: 85, notes: 'Former colleagues' } },
  { id: 'e8', source: 'person-2', target: 'person-5', type: 'knows', data: { strength: 90, notes: 'Same company' } },
  { id: 'e9', source: 'person-3', target: 'person-4', type: 'knows', data: { strength: 60, notes: 'Industry connection' } },
  // Interested in topics
  { id: 'e10', source: 'person-1', target: 'topic-1', type: 'interested_in' },
  { id: 'e11', source: 'person-2', target: 'topic-1', type: 'interested_in' },
  { id: 'e12', source: 'person-4', target: 'topic-2', type: 'interested_in' },
  { id: 'e13', source: 'company-2', target: 'topic-1', type: 'mentioned_in' },
  // Event attendance
  { id: 'e14', source: 'person-1', target: 'event-1', type: 'attended' },
  { id: 'e15', source: 'person-2', target: 'event-1', type: 'attended' },
  { id: 'e16', source: 'person-3', target: 'event-2', type: 'attended' },
  { id: 'e17', source: 'person-4', target: 'event-2', type: 'attended' },
];

const mockInsights: NexisInsight[] = [
  {
    id: 'insight-1',
    type: 'opportunity',
    title: 'Potential Introduction',
    description: 'Sarah Chen and Michael Torres both attended Tech Summit 2026. Consider facilitating an introduction.',
    relatedNodes: ['person-1', 'person-2', 'event-1'],
    priority: 'high',
    createdAt: '2026-01-20',
  },
  {
    id: 'insight-2',
    type: 'reminder',
    title: 'Follow-up Needed',
    description: "It's been 2 weeks since your last contact with James Kim. Consider scheduling a check-in.",
    relatedNodes: ['person-4'],
    priority: 'medium',
    createdAt: '2026-01-19',
  },
  {
    id: 'insight-3',
    type: 'trend',
    title: 'AI Strategy Interest',
    description: '3 of your contacts are actively discussing AI Strategy. This may be a hot topic for outreach.',
    relatedNodes: ['topic-1', 'person-1', 'person-2'],
    priority: 'low',
    createdAt: '2026-01-18',
  },
];

export const useNexisStore = create<NexisState>()(
  devtools(
    (set, get) => ({
      // Initial state with mock data
      nodes: mockNodes,
      edges: mockEdges,
      insights: mockInsights,
      selectedNodeId: null,
      hoveredNodeId: null,
      filterTypes: ['person', 'company', 'topic', 'event'],
      searchQuery: '',
      isLoading: false,

      // Actions
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),

      addNode: (node) =>
        set((state) => ({
          nodes: [...state.nodes, node],
        })),

      updateNode: (id, updates) =>
        set((state) => ({
          nodes: state.nodes.map((n) =>
            n.id === id ? { ...n, ...updates } : n
          ),
        })),

      removeNode: (id) =>
        set((state) => ({
          nodes: state.nodes.filter((n) => n.id !== id),
          edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        })),

      addEdge: (edge) =>
        set((state) => ({
          edges: [...state.edges, edge],
        })),

      removeEdge: (id) =>
        set((state) => ({
          edges: state.edges.filter((e) => e.id !== id),
        })),

      selectNode: (id) => set({ selectedNodeId: id }),
      setHoveredNode: (id) => set({ hoveredNodeId: id }),
      setFilterTypes: (types) => set({ filterTypes: types }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Computed
      getConnectedNodes: (nodeId) => {
        const { nodes, edges } = get();
        const connectedIds = new Set<string>();

        edges.forEach((edge) => {
          if (edge.source === nodeId) connectedIds.add(edge.target);
          if (edge.target === nodeId) connectedIds.add(edge.source);
        });

        return nodes.filter((n) => connectedIds.has(n.id));
      },

      getNodeEdges: (nodeId) => {
        const { edges } = get();
        return edges.filter((e) => e.source === nodeId || e.target === nodeId);
      },

      getFilteredNodes: () => {
        const { nodes, filterTypes, searchQuery } = get();
        return nodes.filter((n) => {
          const matchesType = filterTypes.includes(n.type);
          const matchesSearch =
            !searchQuery ||
            n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.data.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.data.tags?.some((t) =>
              t.toLowerCase().includes(searchQuery.toLowerCase())
            );
          return matchesType && matchesSearch;
        });
      },
    }),
    { name: 'NexisStore' }
  )
);
