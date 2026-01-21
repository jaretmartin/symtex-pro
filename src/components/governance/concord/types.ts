/**
 * Concord Types
 *
 * TypeScript definitions for the AI-to-AI debate/negotiation system.
 */

// ============================================================================
// Session Types
// ============================================================================

export type SessionTypeId =
  | 'strategy'
  | 'allocation'
  | 'brainstorm'
  | 'retrospective'
  | 'planning'
  | 'conflict-resolution';

export interface SessionType {
  id: SessionTypeId;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const SESSION_TYPES: SessionType[] = [
  {
    id: 'strategy',
    name: 'Strategy',
    description: 'Strategic decision-making',
    icon: 'Target',
    color: 'bg-purple-500/20 text-purple-400',
  },
  {
    id: 'allocation',
    name: 'Resource Allocation',
    description: 'Budget and resource decisions',
    icon: 'Scale',
    color: 'bg-blue-500/20 text-blue-400',
  },
  {
    id: 'brainstorm',
    name: 'Brainstorm',
    description: 'Creative ideation session',
    icon: 'Lightbulb',
    color: 'bg-amber-500/20 text-amber-400',
  },
  {
    id: 'retrospective',
    name: 'Retrospective',
    description: 'Review and improve',
    icon: 'ClipboardCheck',
    color: 'bg-green-500/20 text-green-400',
  },
  {
    id: 'planning',
    name: 'Planning',
    description: 'Project and timeline planning',
    icon: 'Calendar',
    color: 'bg-cyan-500/20 text-cyan-400',
  },
  {
    id: 'conflict-resolution',
    name: 'Conflict Resolution',
    description: 'Resolve disagreements',
    icon: 'RotateCcw',
    color: 'bg-red-500/20 text-red-400',
  },
];

// ============================================================================
// Participant Types
// ============================================================================

export interface ConcordParticipant {
  cognateId: string;
  name: string;
  role: string;
  avatar: string;
  represents: string;
  goal: string;
  assertiveness: number;
  flexibility: number;
  expertise?: string[];
}

export interface CognateForConcord {
  id: string;
  name: string;
  role: string;
  avatar: string;
  represents: string;
  defaultGoal: string;
  expertise: string[];
  personality: {
    assertiveness: number;
    flexibility: number;
  };
}

// ============================================================================
// Constraints
// ============================================================================

export interface SessionConstraints {
  totalBudget: string;
  consensusRequired: boolean;
  timeLimit: number;
}

// ============================================================================
// Transcript Types
// ============================================================================

export type Sentiment =
  | 'assertive'
  | 'constructive'
  | 'analytical'
  | 'compromising'
  | 'agreeable'
  | 'supportive'
  | 'neutral';

export interface TranscriptTurn {
  turn: number;
  speaker: string;
  message: string;
  timestamp: string;
  sentiment: Sentiment;
}

// ============================================================================
// Session Types
// ============================================================================

export interface ConcordSession {
  id: string;
  topic: string;
  type: SessionTypeId;
  status: 'setup' | 'running' | 'paused' | 'completed';
  participants: ConcordParticipant[];
  constraints: SessionConstraints;
  transcript: TranscriptTurn[];
  consensus: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

// ============================================================================
// Dynamics Types (for live session)
// ============================================================================

export interface ParticipantAlignment {
  cognateId: string;
  alignment: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SessionDynamics {
  sessionId: string;
  consensus: number;
  participantAlignment: ParticipantAlignment[];
  emergingConsensus: string[];
  estimatedTimeRemaining: number;
  currentTopic: string;
}

// ============================================================================
// Template Types
// ============================================================================

export interface SessionTemplate {
  id: string;
  name: string;
  description: string;
  type: SessionTypeId;
  suggestedParticipants: string[];
  defaultConstraints: {
    consensusRequired: boolean;
    timeLimit: number;
  };
}

export const SESSION_TEMPLATES: SessionTemplate[] = [
  {
    id: 'budget-allocation',
    name: 'Budget Allocation',
    description: 'Multi-department budget negotiation',
    type: 'allocation',
    suggestedParticipants: ['cfo-cognate', 'marketing-cognate', 'eng-cognate'],
    defaultConstraints: { consensusRequired: true, timeLimit: 15 },
  },
  {
    id: 'product-strategy',
    name: 'Product Strategy',
    description: 'Strategic product direction discussion',
    type: 'strategy',
    suggestedParticipants: ['product-cognate', 'eng-cognate', 'marketing-cognate'],
    defaultConstraints: { consensusRequired: false, timeLimit: 20 },
  },
  {
    id: 'feature-prioritization',
    name: 'Feature Prioritization',
    description: 'Decide on feature roadmap priorities',
    type: 'planning',
    suggestedParticipants: ['product-cognate', 'eng-cognate', 'support-cognate'],
    defaultConstraints: { consensusRequired: true, timeLimit: 10 },
  },
];

// ============================================================================
// Mock Cognates for Concord
// ============================================================================

export const CONCORD_COGNATES: CognateForConcord[] = [
  {
    id: 'cfo-cognate',
    name: 'CFO Advocate',
    role: 'Financial Guardian',
    avatar: '💰',
    represents: 'Finance Department',
    defaultGoal: 'Optimize ROI and maintain budget discipline',
    expertise: ['Budgeting', 'Financial Planning', 'Cost Analysis'],
    personality: { assertiveness: 75, flexibility: 40 },
  },
  {
    id: 'marketing-cognate',
    name: 'Marketing Champion',
    role: 'Brand Advocate',
    avatar: '📣',
    represents: 'Marketing Department',
    defaultGoal: 'Maximize brand visibility and market reach',
    expertise: ['Brand Strategy', 'Campaigns', 'Market Analysis'],
    personality: { assertiveness: 80, flexibility: 60 },
  },
  {
    id: 'eng-cognate',
    name: 'Engineering Lead',
    role: 'Technical Advisor',
    avatar: '⚙️',
    represents: 'Engineering Department',
    defaultGoal: 'Ensure technical feasibility and quality',
    expertise: ['Architecture', 'Scalability', 'Technical Debt'],
    personality: { assertiveness: 65, flexibility: 50 },
  },
  {
    id: 'product-cognate',
    name: 'Product Visionary',
    role: 'User Advocate',
    avatar: '🎯',
    represents: 'Product Team',
    defaultGoal: 'Deliver maximum user value',
    expertise: ['User Research', 'Roadmapping', 'Prioritization'],
    personality: { assertiveness: 70, flexibility: 65 },
  },
  {
    id: 'support-cognate',
    name: 'Customer Voice',
    role: 'Support Representative',
    avatar: '💬',
    represents: 'Customer Success',
    defaultGoal: 'Address customer pain points',
    expertise: ['Customer Feedback', 'Issue Resolution', 'Retention'],
    personality: { assertiveness: 55, flexibility: 75 },
  },
  {
    id: 'legal-cognate',
    name: 'Compliance Guardian',
    role: 'Legal Advisor',
    avatar: '⚖️',
    represents: 'Legal Department',
    defaultGoal: 'Ensure regulatory compliance and risk mitigation',
    expertise: ['Compliance', 'Risk Assessment', 'Contract Review'],
    personality: { assertiveness: 85, flexibility: 30 },
  },
];
