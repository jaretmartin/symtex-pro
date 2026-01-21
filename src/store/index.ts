/**
 * Store exports
 *
 * Import stores from here:
 * import { useCognateStore, useAutomationStore, useUIStore } from '@/store';
 *
 * TERMINOLOGY REMINDER:
 * - Cognate (not "agent")
 * - Automation (not "workflow")
 * - Space (not "workspace")
 * - Action (not "task")
 */

// === Primary Stores (use these) ===
export { useCognateStore } from './useCognateStore';
export type {
  CognateTemplate,
  CognateInstance,
  CognateExecution,
  CognateInstanceStatus,
} from './useCognateStore';

export { useAutomationStore } from './useAutomationStore';
export type { Automation } from './useAutomationStore';

export { useUIStore, useToast } from './useUIStore';
export type { Toast, Modal } from './useUIStore';

export { useMissionStore } from './useMissionStore';
export { useUserStore } from './useUserStore';
export { useSpaceStore } from './useSpaceStore';
export { useContextStore } from './useContextStore';
export { useNarrativeStore } from './useNarrativeStore';
export { useChatStore } from './useChatStore';

// New stores ported from MVP
export { useDNAStore } from './useDNAStore';
export type {
  DNAStrand,
  PersonalDNA,
  WorkDNA,
  DNAProfile,
  DNACorrection,
  DNAInsight,
} from './useDNAStore';

export { useSettingsStore } from './useSettingsStore';
export type {
  ModelConfig,
  RoutingStrategy,
  BudgetStatus,
  BudgetConfig,
  PrivacySettings,
  IntegrationStatus,
} from './useSettingsStore';

