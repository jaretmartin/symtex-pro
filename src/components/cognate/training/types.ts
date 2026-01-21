/**
 * Shadow Mode Training Types
 *
 * TypeScript definitions for the 6-week boot camp training system,
 * personality framework, style library, and session tracking.
 */

import type { LucideIcon } from 'lucide-react';

// =============================================================================
// Base Training Types (defined locally to avoid @symtex/types dependency)
// =============================================================================

/**
 * Training method options.
 */
export type TrainingMethod =
  | 'shadow_training'
  | 'feedback_loop'
  | 'scenario_practice'
  | 'correction_review'
  | 'style_calibration';

/**
 * Training session status.
 */
export type TrainingSessionStatus = 'pending' | 'in_progress' | 'paused' | 'completed' | 'cancelled';

/**
 * Base training session interface.
 */
export interface TrainingSession {
  /** Unique session identifier */
  id: string;
  /** Cognate being trained */
  cognateId: string;
  /** Training method used */
  method: TrainingMethod;
  /** Session title/description */
  title: string;
  /** When the session started */
  startedAt: Date;
  /** When the session completed (null if ongoing) */
  completedAt: Date | null;
  /** Duration in milliseconds */
  durationMs: number;
  /** XP earned in this session */
  xpEarned: number;
  /** Number of items processed */
  itemsProcessed: number;
  /** Current session status */
  status: TrainingSessionStatus;
  /** Skills that improved during session */
  skillsImproved: string[];
}

/**
 * Personality values map.
 */
export type PersonalityValues = Record<string, number>;

// =============================================================================
// Boot Camp Week System
// =============================================================================

/**
 * Status of a boot camp week.
 */
export type WeekStatus = 'completed' | 'current' | 'locked';

/**
 * Boot camp week configuration.
 */
export interface BootCampWeek {
  /** Week number (1-6) */
  week: number;
  /** Name of the week phase */
  name: string;
  /** Phase description */
  phase: string;
  /** Detailed description of what happens this week */
  description: string;
  /** Tasks to complete this week */
  tasks: string[];
  /** Current status */
  status: WeekStatus;
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Default boot camp configuration for 6 weeks.
 */
export const BOOT_CAMP_WEEKS: BootCampWeek[] = [
  {
    week: 1,
    name: 'Foundation',
    phase: 'Observation',
    description: 'The Cognate observes your communication patterns and gathers baseline data',
    tasks: ['Pattern recognition', 'Communication style analysis', 'Baseline metrics'],
    status: 'locked',
    progress: 0,
  },
  {
    week: 2,
    name: 'Mimicry',
    phase: 'Learning',
    description: 'Active learning and replication of identified patterns and behaviors',
    tasks: ['Style replication', 'Vocabulary adoption', 'Tone matching'],
    status: 'locked',
    progress: 0,
  },
  {
    week: 3,
    name: 'Adaptation',
    phase: 'Practicing',
    description: 'Applying learned patterns in controlled scenarios with feedback loops',
    tasks: ['Scenario testing', 'Error correction', 'Pattern refinement'],
    status: 'locked',
    progress: 0,
  },
  {
    week: 4,
    name: 'Independence',
    phase: 'Executing',
    description: 'Autonomous task execution with minimal supervision',
    tasks: ['Solo execution', 'Decision making', 'Self-correction'],
    status: 'locked',
    progress: 0,
  },
  {
    week: 5,
    name: 'Mastery',
    phase: 'Optimizing',
    description: 'Fine-tuning performance and optimizing for edge cases',
    tasks: ['Performance tuning', 'Edge case handling', 'Efficiency optimization'],
    status: 'locked',
    progress: 0,
  },
  {
    week: 6,
    name: 'Graduation',
    phase: 'Certified',
    description: 'Final certification and deployment readiness assessment',
    tasks: ['Certification exam', 'Performance review', 'Deployment prep'],
    status: 'locked',
    progress: 0,
  },
];

// =============================================================================
// Style Library System
// =============================================================================

/**
 * Categories for communication styles.
 */
export type StyleCategoryId =
  | 'communication'
  | 'technical'
  | 'creative'
  | 'business'
  | 'support'
  | 'leadership';

/**
 * Style category configuration.
 */
export interface StyleCategory {
  id: StyleCategoryId;
  name: string;
  icon: LucideIcon;
  count: number;
}

/**
 * A communication style from the style library.
 */
export interface CommunicationStyle {
  /** Unique identifier */
  id: string;
  /** Style name */
  name: string;
  /** Category */
  category: StyleCategoryId;
  /** Description of the style */
  description: string;
  /** Adoption rate percentage */
  adoptionRate: number;
  /** Example text demonstrating the style */
  examples: string;
  /** Tags for filtering */
  tags: string[];
  /** Whether this style is currently active for the Cognate */
  isActive?: boolean;
}

// =============================================================================
// Training Session Extensions
// =============================================================================

/**
 * Skill being learned during a training session.
 */
export interface TrainingSkill {
  /** Skill name */
  name: string;
  /** Current progress (0-100) */
  progress: number;
  /** Target progress (0-100) */
  target: number;
}

/**
 * Extended training session with skill tracking.
 */
export interface ExtendedTrainingSession extends TrainingSession {
  /** Skills being trained */
  skills: TrainingSkill[];
  /** Number of interactions in this session */
  interactions: number;
  /** Number of corrections made */
  corrections: number;
  /** Current accuracy percentage */
  accuracy: number;
}

// =============================================================================
// Personality Framework Extensions
// =============================================================================

/**
 * Extended personality trait for Shadow Mode training.
 */
export interface ExtendedPersonalityTrait {
  /** Trait identifier */
  id: string;
  /** Display name */
  name: string;
  /** Low end label */
  low: string;
  /** High end label */
  high: string;
  /** Default value (0-100) */
  default: number;
  /** Current value (0-100) */
  value?: number;
}

/**
 * Default personality traits for training.
 */
export const TRAINING_PERSONALITY_TRAITS: ExtendedPersonalityTrait[] = [
  { id: 'formality', name: 'Formality', low: 'Casual', high: 'Formal', default: 65 },
  { id: 'verbosity', name: 'Verbosity', low: 'Concise', high: 'Detailed', default: 50 },
  { id: 'creativity', name: 'Creativity', low: 'Conservative', high: 'Innovative', default: 40 },
  { id: 'assertiveness', name: 'Assertiveness', low: 'Tentative', high: 'Confident', default: 60 },
  { id: 'empathy', name: 'Empathy', low: 'Neutral', high: 'Warm', default: 75 },
  { id: 'technicality', name: 'Technicality', low: 'Simple', high: 'Technical', default: 45 },
  { id: 'humor', name: 'Humor', low: 'Serious', high: 'Playful', default: 30 },
  { id: 'proactivity', name: 'Proactivity', low: 'Reactive', high: 'Proactive', default: 55 },
];

/**
 * Personality values map for training.
 */
export type TrainingPersonalityValues = Record<string, number>;

// =============================================================================
// Training Statistics
// =============================================================================

/**
 * Aggregate training statistics for a Cognate.
 */
export interface TrainingStats {
  /** Total number of training sessions */
  totalSessions: number;
  /** Total hours trained */
  totalHours: number;
  /** Number of patterns learned */
  patternsLearned: number;
  /** Number of styles applied */
  stylesApplied: number;
  /** Overall progress percentage */
  overallProgress: number;
  /** Current boot camp week (1-6) */
  currentWeek: number;
}

// =============================================================================
// Cognate Training State
// =============================================================================

/**
 * Cognate with training data.
 */
export interface TrainingCognate {
  /** Cognate ID */
  id: string;
  /** Display name */
  name: string;
  /** Avatar emoji or URL */
  avatar: string;
  /** Shadow mode progress (0-100) */
  shadowProgress: number;
  /** Current boot camp week (1-6) */
  currentWeek: number;
  /** Training statistics */
  stats?: TrainingStats;
}

// =============================================================================
// Filter Types
// =============================================================================

/**
 * Filters for the style library browser.
 */
export interface StyleFilters {
  /** Search query */
  search: string;
  /** Selected category (or 'all') */
  category: StyleCategoryId | 'all';
  /** Selected tags */
  tags: string[];
}

