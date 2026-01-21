/**
 * Conflict Resolution Types
 *
 * Type definitions for the conflict detection and resolution system.
 * These types align with @symtex/types but are kept local for Pro's standalone use.
 *
 * @module components/cognate/conflicts/types
 */

// =============================================================================
// CONFLICT SEVERITY
// =============================================================================

/**
 * Severity levels for conflicts.
 */
export type ConflictSeverity = 'blocking' | 'warning' | 'info';

/**
 * Configuration for conflict severity display.
 */
export interface ConflictSeverityConfig {
  label: string;
  color: 'red' | 'amber' | 'blue';
  bgColor: string;
  borderColor: string;
  textColor: string;
  description: string;
}

/**
 * All conflict severity configurations.
 */
export const CONFLICT_SEVERITIES: Record<ConflictSeverity, ConflictSeverityConfig> = {
  blocking: {
    label: 'Blocking',
    color: 'red',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-400',
    description: 'Must be resolved before deployment',
  },
  warning: {
    label: 'Warning',
    color: 'amber',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-400',
    description: 'Should be reviewed but may be intentional',
  },
  info: {
    label: 'Info',
    color: 'blue',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    description: 'Informational - no action required',
  },
};

// =============================================================================
// CONFLICT TYPES
// =============================================================================

/**
 * Types of conflicts that can be detected.
 */
export type ConflictType =
  | 'trigger_overlap'
  | 'action_contradiction'
  | 'condition_subsumption'
  | 'priority_ambiguity'
  | 'resource_contention'
  | 'circular_dependency';

/**
 * Configuration for conflict type display.
 */
export interface ConflictTypeConfig {
  label: string;
  description: string;
  icon: string;
}

/**
 * All conflict type configurations.
 */
export const CONFLICT_TYPES: Record<ConflictType, ConflictTypeConfig> = {
  trigger_overlap: {
    label: 'Trigger Overlap',
    description: 'Multiple rules triggered by the same event',
    icon: 'Layers',
  },
  action_contradiction: {
    label: 'Action Contradiction',
    description: 'Rules specify conflicting actions for same scenario',
    icon: 'GitBranch',
  },
  condition_subsumption: {
    label: 'Condition Subsumption',
    description: "One rule's conditions are a subset of another",
    icon: 'Minimize2',
  },
  priority_ambiguity: {
    label: 'Priority Ambiguity',
    description: 'Rules with same priority may execute in undefined order',
    icon: 'ArrowUpDown',
  },
  resource_contention: {
    label: 'Resource Contention',
    description: 'Multiple rules competing for same resource',
    icon: 'Lock',
  },
  circular_dependency: {
    label: 'Circular Dependency',
    description: 'Rules create a dependency loop',
    icon: 'RefreshCw',
  },
};

// =============================================================================
// RESOLUTION STRATEGIES
// =============================================================================

/**
 * Status of a conflict.
 */
export type ConflictStatus = 'active' | 'resolved' | 'acknowledged' | 'ignored';

/**
 * Strategies for resolving conflicts.
 */
export type ResolutionStrategy =
  | 'priority_override'
  | 'specificity_selection'
  | 'condition_partitioning'
  | 'rule_chaining'
  | 'merge_with_conditionals'
  | 'disable_rule';

/**
 * Configuration for a resolution strategy.
 */
export interface ResolutionStrategyConfig {
  label: string;
  description: string;
  icon: string;
  applicableTo: ConflictType[];
}

/**
 * All resolution strategy configurations.
 */
export const RESOLUTION_STRATEGIES: Record<ResolutionStrategy, ResolutionStrategyConfig> = {
  priority_override: {
    label: 'Priority Override',
    description: 'Assign explicit priority to determine execution order',
    icon: 'ArrowUp',
    applicableTo: ['trigger_overlap', 'priority_ambiguity'],
  },
  specificity_selection: {
    label: 'Specificity Selection',
    description: 'More specific rule takes precedence',
    icon: 'Target',
    applicableTo: ['trigger_overlap', 'condition_subsumption'],
  },
  condition_partitioning: {
    label: 'Condition Partitioning',
    description: 'Split conditions to eliminate overlap',
    icon: 'Scissors',
    applicableTo: ['trigger_overlap', 'condition_subsumption'],
  },
  rule_chaining: {
    label: 'Rule Chaining',
    description: 'Execute rules in sequence as a pipeline',
    icon: 'Link',
    applicableTo: ['trigger_overlap', 'resource_contention'],
  },
  merge_with_conditionals: {
    label: 'Merge with Conditionals',
    description: 'Combine rules with conditional branches',
    icon: 'GitMerge',
    applicableTo: ['trigger_overlap', 'action_contradiction'],
  },
  disable_rule: {
    label: 'Disable Conflicting Rule',
    description: 'Deactivate one of the conflicting rules',
    icon: 'Power',
    applicableTo: ['action_contradiction', 'circular_dependency'],
  },
};

// =============================================================================
// CONFLICT ENTITY TYPES
// =============================================================================

/**
 * Reference to a rule involved in a conflict.
 */
export interface ConflictingRule {
  /** Rule identifier */
  ruleId: string;
  /** SOP identifier */
  sopId: string;
  /** Trigger condition */
  trigger: string;
  /** Main action(s) */
  action: string;
  /** Priority level */
  priority: number;
  /** Full rule code */
  code: string;
}

/**
 * Reference to an SOP affected by a conflict.
 */
export interface AffectedSOP {
  /** SOP identifier */
  id: string;
  /** SOP title */
  title: string;
  /** Rule IDs in this SOP that are involved */
  rules: string[];
}

/**
 * Describes the scenario where the conflict occurs.
 */
export interface OverlapScenario {
  /** Human-readable description */
  description: string;
  /** Input values that trigger the conflict */
  inputs: Record<string, unknown>;
  /** Possible outcomes due to the conflict */
  potentialOutcomes: string[];
}

/**
 * A suggested way to resolve the conflict.
 */
export interface SuggestedResolution {
  /** The resolution strategy to use */
  strategy: ResolutionStrategy;
  /** Description of how to apply it */
  description: string;
  /** Preview of what the resolved code would look like */
  preview: string;
  /** Impact description */
  impact: string;
  /** Whether this is the recommended solution */
  recommended: boolean;
}

/**
 * Records how a conflict was actually resolved.
 */
export interface AppliedResolution {
  /** The strategy that was used */
  strategy: ResolutionStrategy;
  /** Description of the change */
  description: string;
  /** The actual code change */
  change: string;
}

/**
 * Represents a detected conflict between SOP rules.
 */
export interface SOPConflict {
  /** Unique identifier */
  id: string;
  /** Type of conflict */
  type: ConflictType;
  /** Severity level */
  severity: ConflictSeverity;
  /** Current status */
  status: ConflictStatus;
  /** Brief title */
  title: string;
  /** Detailed description */
  description: string;
  /** When this conflict was detected */
  createdAt: string;
  /** How the conflict was detected */
  detectedBy: 'static_analysis' | 'runtime_monitor' | 'manual_review';
  /** SOPs affected by this conflict */
  affectedSOPs: AffectedSOP[];
  /** The specific rules in conflict */
  conflictingRules: ConflictingRule[];
  /** Example scenario where conflict manifests */
  overlapScenario: OverlapScenario;
  /** Suggested ways to resolve (for active conflicts) */
  suggestedResolutions?: SuggestedResolution[];
  /** How the conflict was resolved (for resolved conflicts) */
  appliedResolution?: AppliedResolution;
  /** When the conflict was resolved */
  resolvedAt?: string;
  /** Who resolved the conflict */
  resolvedBy?: string;
  /** Notes about the resolution */
  resolutionNotes?: string;
}

/**
 * Entry in the conflict history/audit log.
 */
export interface ConflictHistoryEntry {
  /** Unique identifier */
  id: string;
  /** Associated conflict ID */
  conflictId: string;
  /** Action taken */
  action: 'detected' | 'resolved' | 'acknowledged' | 'ignored' | 'reopened';
  /** When the action occurred */
  timestamp: string;
  /** User who took the action */
  user: string;
  /** Resolution strategy used (if applicable) */
  strategy?: ResolutionStrategy;
  /** Notes about the action */
  notes?: string;
}

/**
 * Statistics about conflicts for a Cognate or globally.
 */
export interface ConflictStats {
  /** Total number of conflicts */
  total: number;
  /** Number of active conflicts */
  active: number;
  /** Number of resolved conflicts */
  resolved: number;
  /** Number of blocking conflicts */
  blocking: number;
  /** Number of warning conflicts */
  warnings: number;
  /** Number of info conflicts */
  info: number;
}
