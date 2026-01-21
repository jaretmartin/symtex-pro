/**
 * CANONICAL SYMTEX TERMINOLOGY
 *
 * This file defines the official terminology used throughout Symtex.
 * Import this file to enforce correct terms and maintain consistency.
 *
 * @example
 * import { TERMINOLOGY, isForbiddenTerm } from '@/constants/terminology';
 */

// ============================================================================
// CANONICAL TERMINOLOGY
// ============================================================================

export const TERMINOLOGY = {
  // =========================================================================
  // AI Workers
  // =========================================================================

  /** Singular term for an AI worker entity */
  AI_WORKER_SINGULAR: 'Cognate',
  /** Plural term for AI worker entities */
  AI_WORKER_PLURAL: 'Cognates',
  /** The foundation/primary Cognate that orchestrates others */
  FOUNDATION_COGNATE: 'Atlas',

  // =========================================================================
  // Containers
  // =========================================================================

  /** A context container for organizing work */
  CONTEXT_CONTAINER: 'Space',
  /** Plural form of context containers */
  CONTEXT_CONTAINER_PLURAL: 'Spaces',
  /** A goal-oriented container within a Space */
  GOAL_CONTAINER: 'Project',
  /** Plural form of goal containers */
  GOAL_CONTAINER_PLURAL: 'Projects',

  // =========================================================================
  // Work Units
  // =========================================================================

  /** A high-level strategic objective (OKR-style) */
  STRATEGIC_OBJECTIVE: 'Initiative',
  /** Plural form of strategic objectives */
  STRATEGIC_OBJECTIVE_PLURAL: 'Initiatives',
  /** An automated sequence of steps */
  WORKFLOW: 'Automation',
  /** Plural form of workflows */
  WORKFLOW_PLURAL: 'Automations',
  /** The smallest unit of executable work */
  ATOMIC_OPERATION: 'Action',
  /** Plural form of atomic operations */
  ATOMIC_OPERATION_PLURAL: 'Actions',

  // =========================================================================
  // Systems & Methodologies
  // =========================================================================

  /** The symbolic programming language for Cognate instructions */
  SYMBOLIC_LANGUAGE: 'S1',
  /** The methodology for training Cognates by observing user behavior */
  TRAINING_METHODOLOGY: 'Shadow Mode',
  /** The framework for understanding user preferences and patterns */
  USER_PROFILING: 'DNA Framework',
  /** The system for managing and versioning prompts */
  PROMPT_MANAGEMENT: 'PromptOps',

  // =========================================================================
  // Chat Interface
  // =========================================================================

  /** The main conversational interface */
  MAIN_CHAT: 'Symbios',

  // =========================================================================
  // Routing Engines
  // =========================================================================

  /** The symbolic/deterministic processing engine */
  SYMBOLIC_ENGINE: 'Symtex Core',
  /** The neural/AI-powered orchestration engine */
  NEURAL_ENGINE: 'Symtex Conductor',

  // =========================================================================
  // FORBIDDEN TERMS
  // =========================================================================

  /**
   * Terms that should NEVER be used in Symtex.
   * Use the corresponding canonical term instead.
   *
   * - 'agent' -> Use 'Cognate'
   * - 'workflow' -> Use 'Automation' or 'Narrative'
   * - 'workspace' -> Use 'Space'
   * - 'task' -> Use 'Action' or 'Initiative'
   * - 'mission' -> Use 'Initiative' or 'Action'
   * - 'X83' -> Use 'S1'
   * - 'CX83' -> Use 'Symtex'
   */
  FORBIDDEN: ['agent', 'workflow', 'workspace', 'task', 'mission', 'X83', 'CX83'] as const,
} as const;

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/** A term that should never be used in Symtex */
export type ForbiddenTerm = (typeof TERMINOLOGY.FORBIDDEN)[number];

/** The complete terminology mapping type */
export type Terminology = typeof TERMINOLOGY;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if a term is forbidden in Symtex terminology
 *
 * @param term - The term to check
 * @returns True if the term is forbidden
 *
 * @example
 * isForbiddenTerm('agent'); // true
 * isForbiddenTerm('Cognate'); // false
 */
export function isForbiddenTerm(term: string): term is ForbiddenTerm {
  return TERMINOLOGY.FORBIDDEN.includes(term.toLowerCase() as ForbiddenTerm);
}

/**
 * Get the canonical replacement for a forbidden term
 *
 * @param term - The forbidden term to replace
 * @returns The canonical replacement term, or undefined if not forbidden
 */
export function getCanonicalTerm(term: string): string | undefined {
  const lowerTerm = term.toLowerCase();

  const replacements: Record<ForbiddenTerm, string> = {
    agent: TERMINOLOGY.AI_WORKER_SINGULAR,
    workflow: TERMINOLOGY.WORKFLOW,
    workspace: TERMINOLOGY.CONTEXT_CONTAINER,
    task: TERMINOLOGY.ATOMIC_OPERATION,
    mission: TERMINOLOGY.STRATEGIC_OBJECTIVE,
    X83: TERMINOLOGY.SYMBOLIC_LANGUAGE,
    CX83: 'Symtex',
  };

  return replacements[lowerTerm as ForbiddenTerm];
}

/**
 * Replace forbidden terms in a string with their canonical equivalents
 *
 * @param text - The text to process
 * @returns The text with forbidden terms replaced
 */
export function enforceTerminology(text: string): string {
  let result = text;

  for (const forbidden of TERMINOLOGY.FORBIDDEN) {
    const replacement = getCanonicalTerm(forbidden);
    if (replacement) {
      // Case-insensitive replacement preserving word boundaries
      const regex = new RegExp(`\\b${forbidden}\\b`, 'gi');
      result = result.replace(regex, replacement);
    }
  }

  return result;
}

// ============================================================================
// DISPLAY LABELS
// ============================================================================

/**
 * Human-readable labels for UI display
 */
export const TERMINOLOGY_LABELS = {
  // Cognate levels
  COGNATE_TIERS: {
    0: 'Foundation',
    1: 'Standard',
    2: 'Advanced',
    3: 'Expert',
    4: 'Elite',
  } as const,

  // Autonomy levels
  AUTONOMY_LEVELS: {
    L0: 'Manual - Full user control',
    L1: 'Supervised - User approves all actions',
    L2: 'Guided - User approves significant actions',
    L3: 'Autonomous - User notified of actions',
    L4: 'Full Auto - Complete autonomy',
  } as const,

  // Cognate ranks
  COGNATE_RANKS: {
    Novice: { label: 'Novice', minXP: 0 },
    Specialist: { label: 'Specialist', minXP: 1000 },
    Expert: { label: 'Expert', minXP: 5000 },
    Master: { label: 'Master', minXP: 15000 },
    Principal: { label: 'Principal', minXP: 50000 },
    Legendary: { label: 'Legendary', minXP: 100000 },
  } as const,

  // Status colors
  STATUS_COLORS: {
    draft: 'gray',
    active: 'green',
    paused: 'yellow',
    archived: 'slate',
  } as const,
} as const;
