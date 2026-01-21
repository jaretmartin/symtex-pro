/**
 * Enhanced Cognate Entity Types
 *
 * A Cognate represents an AI entity in Symtex with personality traits,
 * skills, SOPs, autonomy levels, and progression systems.
 *
 * This file contains the comprehensive Cognate interface with full
 * personality modeling, progression tracking, and capability definitions.
 */

// ============================================================================
// CORE TYPE DEFINITIONS
// ============================================================================

/**
 * Cognate tier levels (0-4)
 * Determines the base capabilities and access level of a Cognate
 */
export type CognateTier = 0 | 1 | 2 | 3 | 4;

/**
 * Autonomy levels defining how independently a Cognate can operate
 * - L0: Manual - Requires user approval for every action
 * - L1: Supervised - User approves all actions before execution
 * - L2: Guided - User approves significant actions only
 * - L3: Autonomous - User is notified of actions taken
 * - L4: Full Auto - Complete autonomy with periodic reporting
 */
export type CognateAutonomyLevel = 'L0' | 'L1' | 'L2' | 'L3' | 'L4';

/**
 * Cognate rank progression tiers
 * Earned through XP accumulation and successful Action completion
 */
export type CognateRank =
  | 'Novice'
  | 'Specialist'
  | 'Expert'
  | 'Master'
  | 'Principal'
  | 'Legendary';

/**
 * Current operational status of a Cognate
 */
export type EnhancedCognateStatus = 'draft' | 'active' | 'paused' | 'archived';

/**
 * Cost strategy for model selection
 */
export type CostStrategy = 'economical' | 'balanced' | 'premium';

// ============================================================================
// PERSONALITY TRAITS
// ============================================================================

/**
 * The 8 personality traits that define a Cognate's behavior
 * Each trait is measured on a scale of 0-100
 */
export interface CognatePersonality {
  /**
   * Formality (0-100)
   * 0 = Very casual, uses slang and informal language
   * 100 = Extremely formal, professional tone always
   */
  formality: number;

  /**
   * Verbosity (0-100)
   * 0 = Extremely terse, minimal responses
   * 100 = Very detailed, comprehensive explanations
   */
  verbosity: number;

  /**
   * Creativity (0-100)
   * 0 = Strictly literal, follows rules exactly
   * 100 = Highly creative, suggests novel approaches
   */
  creativity: number;

  /**
   * Assertiveness (0-100)
   * 0 = Passive, always defers to user
   * 100 = Very assertive, confidently recommends actions
   */
  assertiveness: number;

  /**
   * Empathy (0-100)
   * 0 = Action-focused, minimal emotional awareness
   * 100 = Highly empathetic, considers emotional context
   */
  empathy: number;

  /**
   * Technicality (0-100)
   * 0 = Uses simple, accessible language
   * 100 = Uses precise technical terminology
   */
  technicality: number;

  /**
   * Humor (0-100)
   * 0 = Strictly serious, no humor
   * 100 = Frequently incorporates wit and humor
   */
  humor: number;

  /**
   * Patience (0-100)
   * 0 = Expects quick understanding, minimal repetition
   * 100 = Extremely patient, willingly re-explains
   */
  patience: number;
}

// ============================================================================
// CAPABILITY DEFINITIONS
// ============================================================================

/**
 * A skill that a Cognate possesses
 */
export interface CognateSkill {
  /** Unique identifier for the skill */
  id: string;
  /** Display name of the skill */
  name: string;
  /** Description of what the skill enables */
  description: string;
  /** Proficiency level (0-100) */
  proficiency: number;
  /** Category of the skill */
  category: 'technical' | 'communication' | 'analysis' | 'creative' | 'domain';
  /** Whether this skill is currently enabled */
  enabled: boolean;
  /** When the skill was acquired */
  acquiredAt?: Date;
}

/**
 * Standard Operating Procedure assigned to a Cognate
 */
export interface CognateSOP {
  /** Unique identifier for the SOP */
  id: string;
  /** Name of the SOP */
  name: string;
  /** Description of what the SOP does */
  description: string;
  /** Priority level */
  priority: 'low' | 'medium' | 'high' | 'critical';
  /** Whether the SOP is currently active */
  isActive: boolean;
  /** Number of times this SOP has been triggered */
  triggerCount: number;
  /** Last time this SOP was triggered */
  lastTriggeredAt?: Date;
}

/**
 * A behavioral rule that constrains Cognate actions
 */
export interface CognateRule {
  /** Unique identifier for the rule */
  id: string;
  /** Human-readable name */
  name: string;
  /** The rule definition in S1 or natural language */
  definition: string;
  /** Type of rule */
  type: 'constraint' | 'preference' | 'requirement' | 'override';
  /** Priority when rules conflict */
  priority: number;
  /** Whether the rule is currently enforced */
  enabled: boolean;
  /** Scope of the rule */
  scope: 'global' | 'space' | 'project' | 'session';
}

/**
 * External tool connection for a Cognate
 */
export interface ToolConnection {
  /** Unique identifier for the connection */
  id: string;
  /** Tool name */
  name: string;
  /** Tool provider/service */
  provider: string;
  /** Connection status */
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  /** Permissions granted to this tool */
  permissions: string[];
  /** When the tool was connected */
  connectedAt?: Date;
  /** Last time the tool was used */
  lastUsedAt?: Date;
}

// ============================================================================
// PROGRESSION & ACHIEVEMENTS
// ============================================================================

/**
 * A badge earned by a Cognate
 */
export interface Badge {
  /** Unique identifier for the badge */
  id: string;
  /** Display name */
  name: string;
  /** Description of how the badge was earned */
  description: string;
  /** Visual icon identifier */
  icon: string;
  /** Rarity tier */
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  /** When the badge was earned */
  earnedAt: Date;
  /** Category of achievement */
  category: 'performance' | 'milestone' | 'special' | 'streak';
}

/**
 * XP thresholds for each rank
 */
export const RANK_XP_THRESHOLDS: Record<CognateRank, number> = {
  Novice: 0,
  Specialist: 1000,
  Expert: 5000,
  Master: 15000,
  Principal: 50000,
  Legendary: 100000,
};

/**
 * XP thresholds for unlocking autonomy levels
 */
export const AUTONOMY_XP_THRESHOLDS: Record<CognateAutonomyLevel, number> = {
  L0: 0,
  L1: 500,
  L2: 2500,
  L3: 10000,
  L4: 50000,
};

// ============================================================================
// ENHANCED COGNATE INTERFACE
// ============================================================================

/**
 * The comprehensive Cognate interface
 *
 * Represents a fully-featured AI entity in the Symtex system with
 * personality traits, capabilities, progression, and configuration.
 */
export interface EnhancedCognate {
  // =========================================================================
  // Identity
  // =========================================================================

  /** Unique identifier for the Cognate */
  id: string;
  /** Display name */
  name: string;
  /** Avatar image URL or identifier */
  avatar: string;
  /** Brief description of the Cognate's purpose */
  description: string;

  // =========================================================================
  // Classification
  // =========================================================================

  /** Tier level (0-4) determining base capabilities */
  tier: CognateTier;
  /** Role or specialization */
  role: string;
  /** Current operational status */
  status: EnhancedCognateStatus;
  /** Maximum autonomy level this Cognate can operate at */
  autonomyLevel: CognateAutonomyLevel;

  // =========================================================================
  // Progression
  // =========================================================================

  /** Current level (1-100) */
  level: number;
  /** Current experience points */
  xp: number;
  /** XP required to reach the next level */
  xpToNextLevel: number;
  /** Current rank based on XP */
  rank: CognateRank;

  // =========================================================================
  // Personality
  // =========================================================================

  /** The 8 personality traits (0-100 each) */
  personality: CognatePersonality;

  // =========================================================================
  // Capabilities
  // =========================================================================

  /** Skills the Cognate possesses */
  skills: CognateSkill[];
  /** Standard Operating Procedures assigned to this Cognate */
  sops: CognateSOP[];
  /** Behavioral rules constraining this Cognate */
  rules: CognateRule[];
  /** External tool connections */
  tools: ToolConnection[];

  // =========================================================================
  // Model Configuration
  // =========================================================================

  /** Primary AI model to use */
  primaryModel: string;
  /** Fallback model if primary is unavailable */
  fallbackModel?: string;
  /** Cost optimization strategy */
  costStrategy: CostStrategy;

  // =========================================================================
  // Assignments
  // =========================================================================

  /** IDs of Spaces this Cognate is assigned to */
  assignedSpaces: string[];
  /** Achievements earned */
  badges: Badge[];
  /** Current streak count for consecutive successful actions */
  streak: number;

  // =========================================================================
  // Special Flags
  // =========================================================================

  /** Whether this Cognate is the user's personal companion (like Atlas) */
  isCompanion: boolean;
  /** Whether this Cognate is a system/internal Cognate */
  isSystem?: boolean;

  // =========================================================================
  // Metadata
  // =========================================================================

  /** When the Cognate was created */
  createdAt: Date;
  /** When the Cognate was last active */
  lastActiveAt: Date;
  /** ID of the user who created this Cognate */
  createdBy: string;
  /** When the Cognate was last modified */
  updatedAt?: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate the rank for a given XP amount
 */
export function calculateRank(xp: number): CognateRank {
  const ranks: CognateRank[] = [
    'Legendary',
    'Principal',
    'Master',
    'Expert',
    'Specialist',
    'Novice',
  ];

  for (const rank of ranks) {
    if (xp >= RANK_XP_THRESHOLDS[rank]) {
      return rank;
    }
  }

  return 'Novice';
}

/**
 * Calculate maximum autonomy level for a given XP amount
 */
export function calculateMaxAutonomy(xp: number): CognateAutonomyLevel {
  const levels: CognateAutonomyLevel[] = ['L4', 'L3', 'L2', 'L1', 'L0'];

  for (const level of levels) {
    if (xp >= AUTONOMY_XP_THRESHOLDS[level]) {
      return level;
    }
  }

  return 'L0';
}

/**
 * Get the default personality for a new Cognate
 */
export function getDefaultPersonality(): CognatePersonality {
  return {
    formality: 50,
    verbosity: 50,
    creativity: 50,
    assertiveness: 50,
    empathy: 50,
    technicality: 50,
    humor: 30,
    patience: 70,
  };
}

/**
 * Create a new Cognate with default values
 */
export function createDefaultCognate(
  partial: Partial<EnhancedCognate> & Pick<EnhancedCognate, 'id' | 'name' | 'createdBy'>
): EnhancedCognate {
  const now = new Date();

  return {
    avatar: '/avatars/default.png',
    description: '',
    tier: 1,
    role: 'General Assistant',
    status: 'draft',
    autonomyLevel: 'L1',
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    rank: 'Novice',
    personality: getDefaultPersonality(),
    skills: [],
    sops: [],
    rules: [],
    tools: [],
    primaryModel: 'claude-3-sonnet',
    costStrategy: 'balanced',
    assignedSpaces: [],
    badges: [],
    streak: 0,
    isCompanion: false,
    createdAt: now,
    lastActiveAt: now,
    ...partial,
  };
}

// ============================================================================
// COGNATE RUNTIME TYPES (Templates, Instances, Executions)
// ============================================================================

/**
 * Verification patterns for multi-Cognate consensus
 */
export type VerificationPattern = 'sibling' | 'debate' | 'family' | 'waves';

/**
 * Status of a Cognate instance
 */
export type CognateInstanceStatus = 'idle' | 'running' | 'paused' | 'completed' | 'failed' | 'busy';

/**
 * Status of a Cognate template
 */
export type CognateTemplateStatus = 'draft' | 'active' | 'deprecated';

/**
 * Status of a Cognate execution
 */
export type CognateExecutionStatus = 'queued' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

/**
 * A template defining a Cognate's capabilities and defaults
 */
export interface CognateTemplate {
  /** Unique identifier for the template */
  id: string;
  /** Display name for the Cognate type */
  name: string;
  /** Description of what this Cognate does */
  description: string;
  /** Icon identifier for visual representation */
  icon: string;
  /** List of capabilities this Cognate possesses */
  capabilities: string[];
  /** The default verification pattern for this Cognate type */
  defaultPattern: VerificationPattern;
  /** Current status of the template */
  status?: CognateTemplateStatus;
  /** Number of instances created from this template */
  instanceCount: number;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * A running or historical instance of a Cognate
 */
export interface CognateInstance {
  /** Unique identifier for this instance */
  id: string;
  /** The template this instance is based on */
  templateId: string;
  /** Current status of the Cognate */
  status: CognateInstanceStatus;
  /** ID of the mission this Cognate is working on */
  missionId?: string;
  /** ID of the project this Cognate is assigned to */
  projectId?: string;
  /** ISO timestamp when the Cognate started */
  startedAt?: string;
  /** ISO timestamp when the Cognate completed */
  completedAt?: string;
  /** The result produced by the Cognate */
  result?: CognateResult;
  /** Total number of executions */
  totalExecutions: number;
  /** Number of successful executions */
  successfulExecutions: number;
  /** ISO timestamp of last activity */
  lastActiveAt?: string;
  /** Creation timestamp */
  createdAt?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * The result of a Cognate's execution
 */
export interface CognateResult {
  /** Whether the execution was successful */
  success: boolean;
  /** The output produced */
  output: string;
  /** Confidence score for the output (0-1) */
  confidence: number;
  /** Any errors that occurred */
  errors?: string[];
  /** Metadata about the execution */
  metadata?: Record<string, unknown>;
}

/**
 * Configuration for a multi-Cognate execution (store-compatible)
 */
export interface CognateExecution {
  /** Unique identifier for this execution */
  id: string;
  /** ID of the Cognate instance executing */
  instanceId: string;
  /** ID of the primary Cognate leading the execution (for multi-Cognate) */
  cognateId?: string;
  /** The verification pattern being used */
  pattern?: VerificationPattern;
  /** IDs of all Cognates participating in this execution */
  cognates?: string[];
  /** Whether consensus is required for completion */
  consensusRequired?: boolean;
  /** Optional timeout in milliseconds */
  timeout?: number;
  /** Current status of the execution */
  status: CognateExecutionStatus;
  /** The input/prompt that triggered this execution */
  input?: string;
  /** The output/response from the execution */
  output?: string;
  /** Error message if failed */
  error?: string;
  /** ISO timestamp when execution started */
  startedAt: string;
  /** ISO timestamp when execution completed */
  completedAt?: string;
  /** Duration in milliseconds */
  duration?: number;
}

/**
 * Multi-Cognate execution configuration (spec interface)
 */
export interface MultiCognateExecution {
  /** Unique identifier for this execution */
  id: string;
  /** ID of the primary Cognate leading the execution */
  cognateId: string;
  /** The verification pattern being used */
  pattern: VerificationPattern;
  /** IDs of all Cognates participating in this execution */
  cognates: string[];
  /** Whether consensus is required for completion */
  consensusRequired: boolean;
  /** Optional timeout in milliseconds */
  timeout?: number;
}

/**
 * Result of a multi-Cognate consensus process
 */
export interface ConsensusResult {
  /** Whether consensus was reached */
  reached: boolean;
  /** The agreed-upon output if consensus was reached */
  consensusOutput?: string;
  /** Individual Cognate outputs */
  cognateOutputs: CognateOutput[];
  /** Confidence in the consensus (0-1) */
  confidence: number;
  /** Duration of the consensus process in milliseconds */
  duration: number;
}

/**
 * Output from a single Cognate in a multi-Cognate execution
 */
export interface CognateOutput {
  /** ID of the Cognate that produced this output */
  cognateId: string;
  /** The output content */
  output: string;
  /** Confidence score (0-1) */
  confidence: number;
  /** Whether this Cognate agreed with the consensus */
  agreedWithConsensus: boolean;
  /** Reasoning for disagreement if applicable */
  dissent?: string;
}

/**
 * Configuration for Cognate behavior
 */
export interface CognateExecutionConfig {
  /** Maximum execution time in milliseconds */
  maxExecutionTime: number;
  /** Number of retries on failure */
  retryCount: number;
  /** Delay between retries in milliseconds */
  retryDelay: number;
  /** Minimum confidence threshold for outputs */
  confidenceThreshold: number;
  /** Whether to log detailed execution steps */
  verboseLogging: boolean;
}

/**
 * Roster of available Cognates
 */
export interface CognateRoster {
  /** All available Cognate templates */
  templates: CognateTemplate[];
  /** Currently active Cognate instances */
  activeInstances: CognateInstance[];
  /** Recently completed Cognate instances */
  recentInstances: CognateInstance[];
  /** Default configuration for new Cognates */
  defaultConfig: CognateExecutionConfig;
}

// ============================================================================
// DEPRECATED TYPE ALIASES (Backwards Compatibility)
// ============================================================================

/** @deprecated Use CognateInstanceStatus instead */
export type AgentStatus = CognateInstanceStatus;

/** @deprecated Use CognateTemplateStatus instead */
export type AgentTemplateStatus = CognateTemplateStatus;

/** @deprecated Use CognateExecutionStatus instead */
export type AgentExecutionStatus = CognateExecutionStatus;

/** @deprecated Use CognateTemplate instead */
export type AgentTemplate = CognateTemplate;

/** @deprecated Use CognateInstance instead */
export type AgentInstance = CognateInstance;

/** @deprecated Use CognateResult instead */
export type AgentResult = CognateResult;

/** @deprecated Use CognateExecution instead */
export type AgentExecution = CognateExecution;

/** @deprecated Use MultiCognateExecution instead */
export type MultiAgentExecution = MultiCognateExecution;

/** @deprecated Use CognateOutput instead */
export type AgentOutput = CognateOutput;

/** @deprecated Use CognateExecutionConfig instead */
export type AgentConfig = CognateExecutionConfig;

/** @deprecated Use CognateRoster instead */
export type AgentRoster = CognateRoster;
