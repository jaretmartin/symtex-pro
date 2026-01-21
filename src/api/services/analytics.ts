/**
 * Analytics API Service
 */

import { api } from '../client';
import type { TrackEventRequest } from '@/types';

// Generate a session ID that persists for the browser session
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('symtex_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('symtex_session_id', sessionId);
  }
  return sessionId;
};

export const analyticsService = {
  /**
   * Track a single event
   */
  track: async (event: Omit<TrackEventRequest, 'sessionId' | 'timestamp'>): Promise<void> => {
    const payload: TrackEventRequest = {
      ...event,
      timestamp: new Date().toISOString(),
      sessionId: getSessionId(),
    };

    // In development, skip sending analytics
    if (import.meta.env.DEV) {
      return;
    }

    // In production, use sendBeacon for reliability
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(
        `${import.meta.env.VITE_API_URL ?? '/api'}/analytics/events`,
        JSON.stringify(payload)
      );
    } else {
      // Fallback to regular fetch
      await api.post('/analytics/events', payload);
    }
  },

  /**
   * Track a page view
   */
  pageView: async (path: string, title?: string): Promise<void> => {
    return analyticsService.track({
      type: 'page_view',
      properties: { path, title },
    });
  },

  /**
   * Track a feature usage
   */
  featureUsed: async (feature: string, metadata?: Record<string, unknown>): Promise<void> => {
    return analyticsService.track({
      type: 'feature_used',
      properties: { feature, ...metadata },
    });
  },

  /**
   * Track automation created
   */
  automationCreated: async (automationId: string, nodeCount: number): Promise<void> => {
    return analyticsService.track({
      type: 'automation_created',
      properties: { automationId, nodeCount },
    });
  },

  /**
   * Track automation executed
   */
  automationExecuted: async (
    automationId: string,
    success: boolean,
    duration?: number
  ): Promise<void> => {
    return analyticsService.track({
      type: 'automation_executed',
      properties: { automationId, success, duration },
    });
  },

  /**
   * Track template used
   */
  templateUsed: async (templateId: string, templateName?: string): Promise<void> => {
    return analyticsService.track({
      type: 'template_used',
      properties: { templateId, templateName },
    });
  },

  /**
   * Track error
   */
  error: async (error: string, context?: string, stack?: string): Promise<void> => {
    return analyticsService.track({
      type: 'error',
      properties: { error, context, stack },
    });
  },

  /**
   * Track user action
   */
  action: async (action: string, target?: string, value?: unknown): Promise<void> => {
    return analyticsService.track({
      type: 'user_action',
      properties: { action, target, value },
    });
  },
};
