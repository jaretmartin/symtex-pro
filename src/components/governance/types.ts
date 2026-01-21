/**
 * Command Center / Governance Types
 *
 * Types for the admin governance dashboard including system health,
 * mission monitoring, token usage, and Cognate distribution.
 */

import type { AutonomyLevel } from '../cognate/types';

// =============================================================================
// System Health
// =============================================================================

export type SystemStatus = 'healthy' | 'degraded' | 'critical';

export interface SystemHealth {
  overall: number; // 0-100 percentage
  status: SystemStatus;
  uptime: string;
  lastIncident: string;
  components: SystemComponent[];
}

export interface SystemComponent {
  name: string;
  status: SystemStatus;
  latency?: number;
  errorRate?: number;
}

// =============================================================================
// Live Mission Types (Command Center specific)
// =============================================================================

export type LiveMissionStatus = 'running' | 'paused' | 'stuck' | 'queued' | 'complete';

export interface LiveMission {
  id: string;
  name: string;
  cognateName: string;
  cognateAvatar: string;
  autonomyLevel: AutonomyLevel;
  owner: string;
  status: LiveMissionStatus;
  progress: number;
  actionsCompleted: number;
  actionsPending: number;
  stuckReason?: string;
  pauseReason?: string;
  startedAt: string;
  estimatedCompletion?: string;
}

export interface MissionFilter {
  status: LiveMissionStatus | 'all';
}

// =============================================================================
// Cognate Status Overview
// =============================================================================

export interface CognateStatusOverview {
  total: number;
  active: number;
  paused: number;
  training: number;
  byLevel: CognatesByLevel;
}

export type CognatesByLevel = Record<`L${0 | 1 | 2 | 3 | 4}`, number>;

// =============================================================================
// Token Usage
// =============================================================================

export interface TokenUsageToday {
  used: number;
  limit: number;
  cost: number;
}

export interface TeamTokenUsage {
  team: string;
  used: number;
  limit: number;
  percentage: number;
}

export interface TokenUsageOverview {
  today: TokenUsageToday;
  byTeam: TeamTokenUsage[];
  projectedMonthly: number;
  budgetLimit: number;
}

// =============================================================================
// Quick Stats
// =============================================================================

export interface QuickStats {
  actionsToday: {
    total: number;
    blocked: number;
    approved: number;
  };
  missionsActive: number;
  pendingApprovals: number;
}

// =============================================================================
// Audit Events
// =============================================================================

export type AuditEventStatus = 'success' | 'blocked' | 'pending' | 'failed';

export interface AuditEvent {
  id: string;
  action: string;
  status: AuditEventStatus;
  timestamp: string;
  actor?: string;
  details?: string;
}

// =============================================================================
// Props Interfaces
// =============================================================================

export interface SystemHealthGaugeProps {
  health: number;
  status: SystemStatus;
  className?: string;
}

export interface LiveMissionFeedProps {
  missions: LiveMission[];
  onPause?: (missionId: string) => void;
  onResume?: (missionId: string) => void;
  onStop?: (missionId: string) => void;
  onView?: (missionId: string) => void;
  className?: string;
}

export interface CognateDistributionProps {
  distribution: CognatesByLevel;
  total: number;
  className?: string;
}

export interface QuickActionsProps {
  onPauseAll?: () => void;
  onEmergencyStop?: () => void;
  onExportAudit?: () => void;
  className?: string;
}

export interface TokenUsageChartProps {
  usage: TokenUsageOverview;
  className?: string;
}

// =============================================================================
// Constants
// =============================================================================

export const SYSTEM_STATUS_CONFIG: Record<
  SystemStatus,
  { label: string; color: string; bgColor: string }
> = {
  healthy: { label: 'Healthy', color: 'text-green-400', bgColor: 'bg-green-500/20' },
  degraded: { label: 'Degraded', color: 'text-amber-400', bgColor: 'bg-amber-500/20' },
  critical: { label: 'Critical', color: 'text-red-400', bgColor: 'bg-red-500/20' },
};

export const MISSION_STATUS_CONFIG: Record<
  LiveMissionStatus,
  { label: string; color: string; bgColor: string; icon: string }
> = {
  running: {
    label: 'Running',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: 'play',
  },
  paused: {
    label: 'Paused',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/20',
    icon: 'pause',
  },
  stuck: {
    label: 'Stuck',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: 'alert-triangle',
  },
  queued: {
    label: 'Queued',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/20',
    icon: 'clock',
  },
  complete: {
    label: 'Complete',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: 'check-circle',
  },
};

export const LEVEL_COLORS: Record<string, { bar: string; text: string }> = {
  L0: { bar: 'bg-slate-500', text: 'text-slate-400' },
  L1: { bar: 'bg-blue-500', text: 'text-blue-400' },
  L2: { bar: 'bg-green-500', text: 'text-green-400' },
  L3: { bar: 'bg-purple-500', text: 'text-purple-400' },
  L4: { bar: 'bg-amber-500', text: 'text-amber-400' },
};
