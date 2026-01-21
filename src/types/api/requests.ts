/**
 * API request payload types
 *
 * NOTE: Use canonical Symtex terminology:
 * - Cognates (not agents)
 * - Automations (not workflows)
 */

import type { MissionPriority, MissionStatus } from '../entities/mission';
import type { AutomationBuilderStatus } from '../entities/automation-enhanced';

export interface CreateMissionRequest {
  title: string;
  description: string;
  priority: MissionPriority;
  dueDate?: string;
  tags?: string[];
}

export interface UpdateMissionRequest {
  title?: string;
  description?: string;
  priority?: MissionPriority;
  status?: MissionStatus;
  progress?: number;
  dueDate?: string;
  tags?: string[];
}

export interface CreateAutomationRequest {
  name: string;
  description?: string;
  nodes: unknown[];
  edges: unknown[];
}

export interface UpdateAutomationRequest {
  name?: string;
  description?: string;
  nodes?: unknown[];
  edges?: unknown[];
  status?: AutomationBuilderStatus;
}

export interface ExecuteAutomationRequest {
  triggerData?: Record<string, unknown>;
  dryRun?: boolean;
}

export interface GenerateAutomationRequest {
  prompt: string;
  context?: string;
}

export interface TrackEventRequest {
  type: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
  sessionId?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================================================
// DEPRECATED TYPE ALIASES (Backwards Compatibility)
// ============================================================================

/** @deprecated Use CreateAutomationRequest instead */
export type CreateWorkflowRequest = CreateAutomationRequest;

/** @deprecated Use UpdateAutomationRequest instead */
export type UpdateWorkflowRequest = UpdateAutomationRequest;

/** @deprecated Use ExecuteAutomationRequest instead */
export type ExecuteWorkflowRequest = ExecuteAutomationRequest;

/** @deprecated Use GenerateAutomationRequest instead */
export type GenerateWorkflowRequest = GenerateAutomationRequest;
