/**
 * Automation API Service
 * (Renamed from Workflow - part of terminology standardization)
 */

import { api } from '../client';
import type {
  AutomationDefinition,
  BuilderExecutionResult,
  CreateAutomationRequest,
  UpdateAutomationRequest,
  ExecuteAutomationRequest,
  GenerateAutomationRequest,
  PaginatedResponse,
} from '@/types';

// Use canonical Automation types (Workflow aliases are deprecated)
type Automation = AutomationDefinition;
type ExecutionResult = BuilderExecutionResult;

export const automationService = {
  /**
   * Get all automations
   */
  list: async (params?: {
    page?: number;
    pageSize?: number;
    status?: string;
  }): Promise<PaginatedResponse<Automation>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));
    if (params?.status) searchParams.set('status', params.status);

    const query = searchParams.toString();
    return api.get(`/workflows${query ? `?${query}` : ''}`);
  },

  /**
   * Get a single automation by ID
   */
  get: async (id: string): Promise<Automation> => {
    return api.get(`/workflows/${id}`);
  },

  /**
   * Create a new automation
   */
  create: async (data: CreateAutomationRequest): Promise<Automation> => {
    return api.post('/workflows', data);
  },

  /**
   * Update an existing automation
   */
  update: async (id: string, data: UpdateAutomationRequest): Promise<Automation> => {
    return api.put(`/workflows/${id}`, data);
  },

  /**
   * Delete an automation
   */
  delete: async (id: string): Promise<void> => {
    return api.delete(`/workflows/${id}`);
  },

  /**
   * Execute an automation
   */
  execute: async (
    id: string,
    data?: ExecuteAutomationRequest
  ): Promise<ExecutionResult> => {
    return api.post(`/workflows/${id}/execute`, data);
  },

  /**
   * Get automation execution history
   */
  getExecutions: async (
    id: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PaginatedResponse<ExecutionResult>> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', String(params.page));
    if (params?.pageSize) searchParams.set('pageSize', String(params.pageSize));

    const query = searchParams.toString();
    return api.get(`/workflows/${id}/executions${query ? `?${query}` : ''}`);
  },

  /**
   * Generate automation from natural language
   */
  generate: async (
    data: GenerateAutomationRequest
  ): Promise<{ nodes: unknown[]; edges: unknown[] }> => {
    return api.post('/workflows/generate', data);
  },

  /**
   * Duplicate an automation
   */
  duplicate: async (id: string): Promise<Automation> => {
    return api.post(`/workflows/${id}/duplicate`);
  },

  /**
   * Publish an automation (change status to published)
   */
  publish: async (id: string): Promise<Automation> => {
    return api.post(`/workflows/${id}/publish`);
  },

  /**
   * Archive an automation
   */
  archive: async (id: string): Promise<Automation> => {
    return api.post(`/workflows/${id}/archive`);
  },
};

// Backwards compatibility alias
export const workflowService = automationService;
