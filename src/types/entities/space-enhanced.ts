/**
 * Enhanced Space Entity Types
 *
 * Spaces are context containers in Symtex that organize work.
 * Projects are goal-oriented containers within Spaces.
 * Initiatives are OKR-style strategic objectives within Projects.
 */

// ============================================================================
// SPACE TYPES
// ============================================================================

/**
 * Types of Spaces in Symtex (Enhanced)
 *
 * Note: This is distinct from the navigation SpaceType in context.ts
 * which is used for breadcrumb navigation (personal/domain/project/initiative)
 */
export type EnhancedSpaceType = 'personal' | 'team' | 'organization' | 'shared';

/**
 * Color palette options for Space theming
 */
export type SpaceColor =
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'red'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray';

/**
 * Available icons for Spaces
 */
export type SpaceIcon =
  | 'home'
  | 'briefcase'
  | 'code'
  | 'book'
  | 'rocket'
  | 'heart'
  | 'star'
  | 'lightning'
  | 'globe'
  | 'users'
  | 'chart'
  | 'folder'
  | 'settings'
  | 'shield'
  | 'target'
  | 'custom';

/**
 * Space visibility settings
 */
export type SpaceVisibility = 'private' | 'team' | 'organization' | 'public';

/**
 * A behavioral rule for a Space
 */
export interface SpaceRule {
  /** Unique identifier */
  id: string;
  /** Human-readable rule name */
  name: string;
  /** The rule content in S1 or natural language */
  content: string;
  /** Whether the rule is active */
  enabled: boolean;
  /** Rule priority (higher = more important) */
  priority: number;
  /** When the rule was created */
  createdAt: Date;
}

/**
 * Enhanced Space interface
 *
 * A Space is the primary context container in Symtex.
 * It organizes Projects, Cognates, and behavioral rules.
 */
export interface EnhancedSpace {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Visual icon identifier */
  icon: SpaceIcon;
  /** Type of Space */
  type: EnhancedSpaceType;
  /** Theme color */
  color: SpaceColor;
  /** Optional description */
  description?: string;
  /** Visibility setting */
  visibility: SpaceVisibility;

  /** Behavioral rules governing this Space */
  rules: SpaceRule[];

  /** IDs of Cognates assigned to this Space */
  assignedCognates: string[];

  /** IDs of Projects in this Space */
  projectIds: string[];

  /** Owner user ID */
  ownerId: string;

  /** Member user IDs (for team/org Spaces) */
  memberIds?: string[];

  /** Parent Space ID (for nested Spaces) */
  parentId?: string;

  /** Metadata */
  createdAt: Date;
  updatedAt: Date;
  lastActivityAt?: Date;

  /** Archived status */
  isArchived: boolean;
}

// ============================================================================
// PROJECT TYPES
// ============================================================================

/**
 * Project status options
 */
export type EnhancedProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'archived';

/**
 * Priority levels for Projects
 */
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

/**
 * A milestone within a Project
 */
export interface EnhancedProjectMilestone {
  /** Unique identifier */
  id: string;
  /** Milestone name */
  name: string;
  /** Description */
  description?: string;
  /** Target completion date */
  targetDate: Date;
  /** Actual completion date */
  completedDate?: Date;
  /** Whether the milestone is completed */
  isCompleted: boolean;
  /** Associated Initiative IDs */
  initiativeIds: string[];
}

/**
 * Enhanced Project interface
 *
 * A Project is a goal-oriented container within a Space.
 * It contains milestones and tracks completion progress.
 */
export interface EnhancedProject {
  /** Unique identifier */
  id: string;
  /** Parent Space ID */
  spaceId: string;
  /** Project name */
  name: string;
  /** Detailed description */
  description: string;
  /** Current status */
  status: EnhancedProjectStatus;
  /** Priority level */
  priority: ProjectPriority;

  /** Completion percentage (0-100) */
  completion: number;

  /** Project milestones */
  milestones: EnhancedProjectMilestone[];

  /** Initiative IDs within this Project */
  initiativeIds: string[];

  /** Start date */
  startDate?: Date;
  /** Target end date */
  targetEndDate?: Date;
  /** Actual end date */
  actualEndDate?: Date;

  /** Tags for organization */
  tags: string[];

  /** Owner user ID */
  ownerId: string;

  /** Assigned Cognate IDs */
  assignedCognates: string[];

  /** Metadata */
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// INITIATIVE TYPES (OKR-Style Strategic Objectives)
// ============================================================================

/**
 * Initiative status options
 */
export type InitiativeStatus =
  | 'draft'
  | 'planned'
  | 'in_progress'
  | 'at_risk'
  | 'completed'
  | 'cancelled';

/**
 * A Key Result within an Initiative (OKR style)
 */
export interface KeyResult {
  /** Unique identifier */
  id: string;
  /** Description of the key result */
  description: string;
  /** Target value to achieve */
  targetValue: number;
  /** Current value */
  currentValue: number;
  /** Unit of measurement */
  unit: string;
  /** Whether the key result is achieved */
  isAchieved: boolean;
  /** Due date */
  dueDate?: Date;
}

/**
 * Initiative interface (OKR-style strategic objective)
 *
 * An Initiative represents a strategic objective with measurable
 * key results. It follows the OKR (Objectives and Key Results) pattern.
 */
export interface Initiative {
  /** Unique identifier */
  id: string;
  /** Parent Project ID */
  projectId: string;
  /** Initiative title (the Objective) */
  title: string;
  /** Detailed description */
  description: string;
  /** Current status */
  status: InitiativeStatus;

  /** Key Results for measuring progress */
  keyResults: KeyResult[];

  /** Overall progress based on Key Results (0-100) */
  progress: number;

  /** Time period (e.g., "Q1 2026") */
  timePeriod?: string;
  /** Start date */
  startDate?: Date;
  /** End date */
  endDate?: Date;

  /** Owner user ID */
  ownerId: string;

  /** Assigned Cognate ID (primary) */
  assignedCognateId?: string;

  /** Related Action IDs */
  actionIds: string[];

  /** Tags for organization */
  tags: string[];

  /** Metadata */
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// ACTION TYPES (Atomic Operations)
// ============================================================================

/**
 * Action status options
 */
export type ActionStatus =
  | 'pending'
  | 'in_progress'
  | 'awaiting_approval'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Action interface (atomic unit of work)
 *
 * An Action is the smallest executable unit of work in Symtex.
 * Actions are performed by Cognates and contribute to Initiatives.
 */
export interface Action {
  /** Unique identifier */
  id: string;
  /** Parent Initiative ID */
  initiativeId: string;
  /** Action title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Current status */
  status: ActionStatus;

  /** Assigned Cognate ID */
  assignedCognateId?: string;

  /** Due date */
  dueDate?: Date;
  /** Completed date */
  completedAt?: Date;

  /** Priority */
  priority: 'low' | 'medium' | 'high';

  /** XP awarded upon completion */
  xpReward: number;

  /** Dependencies (other Action IDs) */
  dependencies: string[];

  /** Result/output of the action */
  result?: string;

  /** Metadata */
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate Initiative progress from Key Results
 */
export function calculateInitiativeProgress(keyResults: KeyResult[]): number {
  if (keyResults.length === 0) return 0;

  const totalProgress = keyResults.reduce((sum, kr) => {
    const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) * 100 : 0;
    return sum + Math.min(progress, 100);
  }, 0);

  return Math.round(totalProgress / keyResults.length);
}

/**
 * Calculate Project completion from milestones
 */
export function calculateProjectCompletion(milestones: EnhancedProjectMilestone[]): number {
  if (milestones.length === 0) return 0;

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  return Math.round((completedCount / milestones.length) * 100);
}

/**
 * Create a default Space
 */
export function createDefaultSpace(
  partial: Partial<EnhancedSpace> & Pick<EnhancedSpace, 'id' | 'name' | 'ownerId'>
): EnhancedSpace {
  const now = new Date();

  return {
    icon: 'folder',
    type: 'personal' as EnhancedSpaceType,
    color: 'indigo',
    visibility: 'private',
    rules: [],
    assignedCognates: [],
    projectIds: [],
    createdAt: now,
    updatedAt: now,
    isArchived: false,
    ...partial,
  };
}

/**
 * Create a default Project
 */
export function createDefaultProject(
  partial: Partial<EnhancedProject> & Pick<EnhancedProject, 'id' | 'name' | 'spaceId' | 'ownerId'>
): EnhancedProject {
  const now = new Date();

  return {
    description: '',
    status: 'planning',
    priority: 'medium',
    completion: 0,
    milestones: [],
    initiativeIds: [],
    tags: [],
    assignedCognates: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

/**
 * Create a default Initiative
 */
export function createDefaultInitiative(
  partial: Partial<Initiative> & Pick<Initiative, 'id' | 'title' | 'projectId' | 'ownerId'>
): Initiative {
  const now = new Date();

  return {
    description: '',
    status: 'draft',
    keyResults: [],
    progress: 0,
    actionIds: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}
