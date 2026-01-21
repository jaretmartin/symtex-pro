/**
 * Enhanced Automation Entity Types
 *
 * Automations are automated sequences of Actions in Symtex.
 * They replace the concept of "workflows" and provide trigger-based
 * execution of predefined steps.
 */

// ============================================================================
// TRIGGER TYPES
// ============================================================================

/**
 * Types of triggers that can start an Automation
 */
export type EnhancedTriggerType =
  | 'manual'
  | 'schedule'
  | 'webhook'
  | 'event'
  | 'condition'
  | 'message'
  | 'file_change'
  | 'api_call';

/**
 * Schedule frequency options
 */
export type ScheduleFrequency =
  | 'once'
  | 'hourly'
  | 'daily'
  | 'weekly'
  | 'monthly'
  | 'yearly'
  | 'custom';

/**
 * Days of the week for scheduling
 */
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

/**
 * Schedule configuration for scheduled triggers
 */
export interface ScheduleConfig {
  /** Frequency of execution */
  frequency: ScheduleFrequency;
  /** Time of day (HH:MM format) */
  time?: string;
  /** Day of week (for weekly schedules) */
  dayOfWeek?: DayOfWeek;
  /** Day of month (for monthly schedules) */
  dayOfMonth?: number;
  /** Custom cron expression (for custom schedules) */
  cronExpression?: string;
  /** Timezone for scheduling */
  timezone: string;
  /** Start date for the schedule */
  startDate?: Date;
  /** End date for the schedule (optional) */
  endDate?: Date;
}

/**
 * Webhook configuration for webhook triggers
 */
export interface WebhookConfig {
  /** The webhook endpoint path */
  path: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Expected headers */
  expectedHeaders?: Record<string, string>;
  /** Secret for webhook validation */
  secret?: string;
}

/**
 * Event configuration for event-based triggers
 */
export interface EventConfig {
  /** Event type to listen for */
  eventType: string;
  /** Event source */
  source: string;
  /** Filter conditions */
  filters?: Record<string, unknown>;
}

/**
 * Condition configuration for conditional triggers
 */
export interface ConditionConfig {
  /** Field to evaluate */
  field: string;
  /** Comparison operator */
  operator:
    | 'equals'
    | 'not_equals'
    | 'contains'
    | 'not_contains'
    | 'greater_than'
    | 'less_than'
    | 'matches';
  /** Value to compare against */
  value: string | number | boolean;
  /** Additional conditions (AND logic) */
  and?: ConditionConfig[];
  /** Alternative conditions (OR logic) */
  or?: ConditionConfig[];
}

/**
 * Base trigger configuration
 */
export interface BaseTriggerConfig {
  /** Trigger type */
  type: EnhancedTriggerType;
}

/**
 * Manual trigger (no additional config)
 */
export interface ManualTriggerConfig extends BaseTriggerConfig {
  type: 'manual';
}

/**
 * Scheduled trigger
 */
export interface ScheduleTriggerConfig extends BaseTriggerConfig {
  type: 'schedule';
  schedule: ScheduleConfig;
}

/**
 * Webhook trigger
 */
export interface WebhookTriggerConfig extends BaseTriggerConfig {
  type: 'webhook';
  webhook: WebhookConfig;
}

/**
 * Event-based trigger
 */
export interface EventTriggerConfig extends BaseTriggerConfig {
  type: 'event';
  event: EventConfig;
}

/**
 * Condition-based trigger
 */
export interface ConditionTriggerConfig extends BaseTriggerConfig {
  type: 'condition';
  condition: ConditionConfig;
}

/**
 * Message-based trigger
 */
export interface MessageTriggerConfig extends BaseTriggerConfig {
  type: 'message';
  /** Pattern to match in messages */
  pattern: string;
  /** Whether the pattern is a regex */
  isRegex: boolean;
  /** Source to listen to */
  source?: 'symbios' | 'slack' | 'email' | 'any';
}

/**
 * Union type for all trigger configurations
 */
export type TriggerConfig =
  | ManualTriggerConfig
  | ScheduleTriggerConfig
  | WebhookTriggerConfig
  | EventTriggerConfig
  | ConditionTriggerConfig
  | MessageTriggerConfig;

// ============================================================================
// AUTOMATION STEP TYPES
// ============================================================================

/**
 * Types of steps in an Automation
 */
export type AutomationStepType =
  | 'action'
  | 'condition'
  | 'loop'
  | 'delay'
  | 'notification'
  | 'integration'
  | 'cognate_call'
  | 'approval';

/**
 * Base step configuration
 */
export interface BaseStepConfig {
  /** Step type */
  type: AutomationStepType;
  /** Step ID */
  id: string;
  /** Step name */
  name: string;
  /** Whether the step is enabled */
  enabled: boolean;
  /** Error handling strategy */
  onError: 'stop' | 'continue' | 'retry';
  /** Maximum retry attempts */
  maxRetries?: number;
  /** Retry delay in milliseconds */
  retryDelay?: number;
}

/**
 * Action step - performs a specific action
 */
export interface ActionStep extends BaseStepConfig {
  type: 'action';
  /** Action to perform */
  actionId: string;
  /** Input parameters */
  inputs: Record<string, unknown>;
  /** Expected outputs */
  outputs?: string[];
}

/**
 * Condition step - branches based on condition
 */
export interface ConditionStep extends BaseStepConfig {
  type: 'condition';
  /** Condition to evaluate */
  condition: ConditionConfig;
  /** Steps to execute if true */
  thenSteps: AutomationStep[];
  /** Steps to execute if false */
  elseSteps?: AutomationStep[];
}

/**
 * Loop step - repeats steps
 */
export interface LoopStep extends BaseStepConfig {
  type: 'loop';
  /** Maximum iterations */
  maxIterations: number;
  /** Collection to iterate over */
  collection?: string;
  /** Steps to repeat */
  steps: AutomationStep[];
}

/**
 * Delay step - waits for a duration
 */
export interface DelayStep extends BaseStepConfig {
  type: 'delay';
  /** Delay in milliseconds */
  duration: number;
}

/**
 * Notification step - sends a notification
 */
export interface NotificationStep extends BaseStepConfig {
  type: 'notification';
  /** Channel to notify */
  channel: 'email' | 'slack' | 'in_app' | 'webhook';
  /** Recipients */
  recipients: string[];
  /** Message template */
  template: string;
}

/**
 * Cognate call step - invokes a Cognate
 */
export interface CognateCallStep extends BaseStepConfig {
  type: 'cognate_call';
  /** Cognate to invoke */
  cognateId: string;
  /** Prompt or instruction */
  prompt: string;
  /** Context to provide */
  context?: Record<string, unknown>;
  /** Wait for response */
  awaitResponse: boolean;
}

/**
 * Approval step - requires human approval
 */
export interface ApprovalStep extends BaseStepConfig {
  type: 'approval';
  /** Approvers (user IDs) */
  approvers: string[];
  /** Required approval count */
  requiredApprovals: number;
  /** Timeout in milliseconds */
  timeout: number;
  /** Action on timeout */
  onTimeout: 'approve' | 'reject' | 'escalate';
  /** Escalation user ID */
  escalateTo?: string;
}

/**
 * Union type for all automation steps
 */
export type AutomationStep =
  | ActionStep
  | ConditionStep
  | LoopStep
  | DelayStep
  | NotificationStep
  | CognateCallStep
  | ApprovalStep;

// ============================================================================
// APPROVAL POLICY
// ============================================================================

/**
 * Approval policy for Automations
 */
export interface ApprovalPolicy {
  /** Whether approval is required */
  requiresApproval: boolean;
  /** Type of approval */
  approvalType: 'any' | 'all' | 'majority' | 'threshold';
  /** Threshold count (for threshold type) */
  thresholdCount?: number;
  /** Approver user IDs */
  approvers: string[];
  /** Timeout in milliseconds */
  timeout: number;
  /** Action on timeout */
  onTimeout: 'auto_approve' | 'auto_reject' | 'escalate' | 'pause';
  /** Escalation user ID */
  escalateTo?: string;
  /** Message to show approvers */
  approvalMessage?: string;
}

// ============================================================================
// ENHANCED AUTOMATION INTERFACE
// ============================================================================

/**
 * Automation status
 */
export type EnhancedAutomationStatus =
  | 'draft'
  | 'active'
  | 'paused'
  | 'error'
  | 'disabled'
  | 'archived';

/**
 * Enhanced Automation interface
 *
 * An Automation is a trigger-based sequence of steps that execute
 * automatically when conditions are met.
 */
export interface EnhancedAutomation {
  /** Unique identifier */
  id: string;
  /** Automation name */
  name: string;
  /** Description */
  description: string;
  /** Current status */
  status: EnhancedAutomationStatus;

  /** Trigger configuration */
  trigger: TriggerConfig;

  /** Steps to execute */
  steps: AutomationStep[];

  /** Approval policy */
  approvalPolicy: ApprovalPolicy;

  /** Associated Space ID */
  spaceId?: string;
  /** Associated Project ID */
  projectId?: string;

  /** Assigned Cognate ID (primary executor) */
  assignedCognateId?: string;

  /** Tags for organization */
  tags: string[];

  /** Version number */
  version: number;

  /** Execution statistics */
  stats: {
    /** Total execution count */
    totalRuns: number;
    /** Successful runs */
    successfulRuns: number;
    /** Failed runs */
    failedRuns: number;
    /** Average duration in milliseconds */
    averageDuration: number;
    /** Last run timestamp */
    lastRunAt?: Date;
    /** Next scheduled run */
    nextRunAt?: Date;
  };

  /** Owner user ID */
  ownerId: string;

  /** Metadata */
  createdAt: Date;
  updatedAt: Date;

  /** Whether the automation is enabled */
  isEnabled: boolean;
}

// ============================================================================
// AUTOMATION RUN TYPES
// ============================================================================

/**
 * Status of an automation run
 */
export type AutomationRunStatus =
  | 'pending'
  | 'running'
  | 'awaiting_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timeout';

/**
 * Log entry for an automation run
 */
export interface EnhancedAutomationLog {
  /** Timestamp */
  timestamp: Date;
  /** Log level */
  level: 'debug' | 'info' | 'warn' | 'error';
  /** Step ID (if applicable) */
  stepId?: string;
  /** Step name */
  stepName?: string;
  /** Log message */
  message: string;
  /** Additional data */
  data?: Record<string, unknown>;
  /** Duration of the step in milliseconds */
  duration?: number;
}

/**
 * Step result in an automation run
 */
export interface StepResult {
  /** Step ID */
  stepId: string;
  /** Step name */
  stepName: string;
  /** Status */
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  /** Start time */
  startedAt?: Date;
  /** End time */
  completedAt?: Date;
  /** Duration in milliseconds */
  duration?: number;
  /** Output data */
  output?: Record<string, unknown>;
  /** Error message if failed */
  error?: string;
}

/**
 * Enhanced Automation Run interface
 *
 * Represents a single execution of an Automation with full
 * execution history and results.
 */
export interface EnhancedAutomationRun {
  /** Unique identifier */
  id: string;
  /** Automation ID */
  automationId: string;
  /** Automation version at time of run */
  automationVersion: number;
  /** Run status */
  status: AutomationRunStatus;

  /** Trigger information */
  triggeredBy: {
    /** Trigger type */
    type: EnhancedTriggerType;
    /** User ID if manually triggered */
    userId?: string;
    /** Event data if event triggered */
    eventData?: Record<string, unknown>;
  };

  /** Input data */
  input: Record<string, unknown>;

  /** Output data */
  output?: Record<string, unknown>;

  /** Step results */
  stepResults: StepResult[];

  /** Execution logs */
  logs: EnhancedAutomationLog[];

  /** Approval status (if applicable) */
  approval?: {
    /** Current approval status */
    status: 'pending' | 'approved' | 'rejected' | 'expired';
    /** Approvers who have responded */
    responses: Array<{
      userId: string;
      decision: 'approved' | 'rejected';
      timestamp: Date;
      comment?: string;
    }>;
    /** Deadline for approval */
    deadline: Date;
  };

  /** Error details if failed */
  error?: {
    /** Error message */
    message: string;
    /** Error code */
    code?: string;
    /** Stack trace */
    stack?: string;
    /** Step where error occurred */
    stepId?: string;
  };

  /** Timing information */
  startedAt: Date;
  completedAt?: Date;
  /** Duration in milliseconds */
  duration?: number;

  /** Retry information */
  retryCount: number;
  /** Parent run ID if this is a retry */
  parentRunId?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate success rate for an automation
 */
export function calculateSuccessRate(stats: EnhancedAutomation['stats']): number {
  if (stats.totalRuns === 0) return 100;
  return Math.round((stats.successfulRuns / stats.totalRuns) * 100);
}

/**
 * Create a default automation
 */
export function createDefaultAutomation(
  partial: Partial<EnhancedAutomation> & Pick<EnhancedAutomation, 'id' | 'name' | 'ownerId'>
): EnhancedAutomation {
  const now = new Date();

  return {
    description: '',
    status: 'draft',
    trigger: { type: 'manual' },
    steps: [],
    approvalPolicy: {
      requiresApproval: false,
      approvalType: 'any',
      approvers: [],
      timeout: 24 * 60 * 60 * 1000, // 24 hours
      onTimeout: 'pause',
    },
    tags: [],
    version: 1,
    stats: {
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      averageDuration: 0,
    },
    createdAt: now,
    updatedAt: now,
    isEnabled: false,
    ...partial,
  };
}

// ============================================================================
// VISUAL AUTOMATION BUILDER TYPES (Migrated from workflow.ts)
// ============================================================================

import type { Node, Edge } from 'reactflow';

/**
 * Status of a visual automation in the builder
 */
export type AutomationBuilderStatus = 'draft' | 'published' | 'archived';

/**
 * A visual automation definition for the LUX Builder
 */
export interface AutomationDefinition {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  status: AutomationBuilderStatus;
  createdAt: string;
  updatedAt: string;
  lastExecutedAt?: string;
}

/**
 * Metadata for an automation definition
 */
export interface AutomationMetadata {
  tags?: string[];
  category?: string;
  executionCount?: number;
}

// Node data types for each node type in the visual builder
export interface TriggerNodeData {
  label: string;
  description?: string;
  icon?: string;
  triggerType?: 'manual' | 'schedule' | 'webhook' | 'event';
  config?: Record<string, unknown>;
}

export interface ConditionNodeData {
  label: string;
  description?: string;
  icon?: string;
  expression?: string;
  operator?: 'equals' | 'contains' | 'greater' | 'less' | 'exists';
  leftOperand?: string;
  rightOperand?: string;
}

export interface ActionNodeData {
  label: string;
  description?: string;
  icon?: string;
  actionType?: 'email' | 'sms' | 'api' | 'notification' | 'update' | 'create';
  config?: Record<string, unknown>;
}

export interface DelayNodeData {
  label: string;
  description?: string;
  duration?: string;
  unit?: 'seconds' | 'minutes' | 'hours' | 'days';
}

export type NodeData = TriggerNodeData | ConditionNodeData | ActionNodeData | DelayNodeData;

// Builder execution types
export type BuilderExecutionStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface BuilderExecutionLog {
  nodeId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: unknown;
}

export interface BuilderExecutionContext {
  automationId: string;
  runId: string;
  variables: Record<string, unknown>;
  status: BuilderExecutionStatus;
  currentNodeId: string | null;
  logs: BuilderExecutionLog[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface BuilderExecutionResult {
  success: boolean;
  context: BuilderExecutionContext;
  duration: number;
}

// History for undo/redo in the visual builder
export interface HistorySnapshot {
  nodes: Node[];
  edges: Edge[];
  timestamp: number;
}

// ============================================================================
// DEPRECATED TYPE ALIASES (Backwards Compatibility)
// ============================================================================

/** @deprecated Use AutomationBuilderStatus instead */
export type WorkflowStatus = AutomationBuilderStatus;

/** @deprecated Use AutomationDefinition instead */
export type Workflow = AutomationDefinition;

/** @deprecated Use AutomationMetadata instead */
export type WorkflowMetadata = AutomationMetadata;

/** @deprecated Use BuilderExecutionStatus instead */
export type ExecutionStatus = BuilderExecutionStatus;

/** @deprecated Use BuilderExecutionLog instead */
export type ExecutionLog = BuilderExecutionLog;

/** @deprecated Use BuilderExecutionContext instead */
export type ExecutionContext = BuilderExecutionContext;

/** @deprecated Use BuilderExecutionResult instead */
export type ExecutionResult = BuilderExecutionResult;
