/**
 * Settings Store - Model routing and configuration state management
 *
 * Manages AI model configurations, routing strategies, budget tracking,
 * privacy settings, and integration status for Symtex.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types
export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'local' | 'other';
  enabled: boolean;
  costPer1kTokens: number;
  maxTokens: number;
  capabilities: string[];
}

export type RoutingStrategy =
  | 'cost-optimized'    // Minimize cost while maintaining quality
  | 'quality-first'     // Prioritize best model for the action
  | 'speed-first'       // Fastest response time
  | 'privacy-first'     // Prefer local/private models
  | 'balanced'          // Balance all factors equally
  | 'local-only'        // Only use local models
  | 'custom';           // User-defined weights

export type BudgetStatus = 'ok' | 'warning' | 'alert' | 'exceeded';

export interface BudgetConfig {
  monthlyLimit: number;
  used: number;
  warningThreshold: number; // Percentage (e.g., 70)
  alertThreshold: number;   // Percentage (e.g., 90)
  resetDate: Date;
}

export interface PrivacySettings {
  allowCloudProcessing: boolean;
  allowDataCollection: boolean;
  localOnlyMode: boolean;
  encryptLocalData: boolean;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  lastSync: Date | null;
  error: string | null;
}

// Default models (Cognate-compatible)
const defaultModels: ModelConfig[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'openai',
    enabled: true,
    costPer1kTokens: 0.03,
    maxTokens: 8192,
    capabilities: ['reasoning', 'coding', 'analysis', 'creative'],
  },
  {
    id: 'claude-opus-4-5',
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    enabled: true,
    costPer1kTokens: 0.015,
    maxTokens: 200000,
    capabilities: ['reasoning', 'coding', 'analysis', 'long-context', 'cognate-orchestration'],
  },
  {
    id: 'claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    enabled: true,
    costPer1kTokens: 0.003,
    maxTokens: 200000,
    capabilities: ['reasoning', 'coding', 'fast', 'cognate-action'],
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'google',
    enabled: false,
    costPer1kTokens: 0.001,
    maxTokens: 32000,
    capabilities: ['reasoning', 'multimodal'],
  },
  {
    id: 'local-llama',
    name: 'Local LLaMA',
    provider: 'local',
    enabled: false,
    costPer1kTokens: 0,
    maxTokens: 4096,
    capabilities: ['offline', 'privacy'],
  },
];

// Default integrations
const defaultIntegrations: IntegrationStatus[] = [
  {
    id: 'gmail',
    name: 'Gmail',
    icon: 'mail',
    connected: false,
    lastSync: null,
    error: null,
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    icon: 'calendar',
    connected: false,
    lastSync: null,
    error: null,
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: 'message-square',
    connected: false,
    lastSync: null,
    error: null,
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: 'file-text',
    connected: false,
    lastSync: null,
    error: null,
  },
  {
    id: 'drive',
    name: 'Google Drive',
    icon: 'hard-drive',
    connected: false,
    lastSync: null,
    error: null,
  },
];

interface SettingsState {
  // State
  models: ModelConfig[];
  routingStrategy: RoutingStrategy;
  customRoutingWeights: Record<string, number>;
  budget: BudgetConfig;
  privacy: PrivacySettings;
  integrations: IntegrationStatus[];

  // Model actions
  updateModelConfig: (id: string, config: Partial<ModelConfig>) => void;
  toggleModel: (id: string) => void;
  addModel: (model: ModelConfig) => void;
  removeModel: (id: string) => void;
  getEnabledModels: () => ModelConfig[];
  getModelById: (id: string) => ModelConfig | undefined;
  getModelsByCapability: (capability: string) => ModelConfig[];

  // Routing actions
  setRoutingStrategy: (strategy: RoutingStrategy) => void;
  setCustomWeights: (weights: Record<string, number>) => void;
  getOptimalModel: (capabilities: string[]) => ModelConfig | undefined;

  // Budget actions
  updateBudget: (updates: Partial<BudgetConfig>) => void;
  recordUsage: (amount: number) => void;
  getBudgetStatus: () => BudgetStatus;
  getBudgetRemaining: () => number;
  getBudgetPercentUsed: () => number;
  resetBudget: () => void;

  // Privacy actions
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  isCloudProcessingAllowed: () => boolean;

  // Integration actions
  updateIntegration: (id: string, status: Partial<IntegrationStatus>) => void;
  connectIntegration: (id: string) => void;
  disconnectIntegration: (id: string) => void;
  getConnectedIntegrations: () => IntegrationStatus[];

  // Reset
  reset: () => void;
}

const initialBudget: BudgetConfig = {
  monthlyLimit: 50,
  used: 0,
  warningThreshold: 70,
  alertThreshold: 90,
  resetDate: new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ),
};

const initialPrivacy: PrivacySettings = {
  allowCloudProcessing: true,
  allowDataCollection: false,
  localOnlyMode: false,
  encryptLocalData: true,
};

const initialState = {
  models: defaultModels,
  routingStrategy: 'balanced' as RoutingStrategy,
  customRoutingWeights: {
    cost: 0.25,
    quality: 0.25,
    speed: 0.25,
    privacy: 0.25,
  },
  budget: initialBudget,
  privacy: initialPrivacy,
  integrations: defaultIntegrations,
};

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // Reset
        reset: () => set(initialState),

        // Model actions
        updateModelConfig: (id, config) => {
          set((state) => ({
            models: state.models.map((m) =>
              m.id === id ? { ...m, ...config } : m
            ),
          }));
        },

        toggleModel: (id) => {
          set((state) => ({
            models: state.models.map((m) =>
              m.id === id ? { ...m, enabled: !m.enabled } : m
            ),
          }));
        },

        addModel: (model) => {
          set((state) => ({
            models: [...state.models, model],
          }));
        },

        removeModel: (id) => {
          set((state) => ({
            models: state.models.filter((m) => m.id !== id),
          }));
        },

        getEnabledModels: () => {
          return get().models.filter((m) => m.enabled);
        },

        getModelById: (id) => {
          return get().models.find((m) => m.id === id);
        },

        getModelsByCapability: (capability) => {
          return get().models.filter(
            (m) => m.enabled && m.capabilities.includes(capability)
          );
        },

        // Routing actions
        setRoutingStrategy: (strategy) => {
          set({ routingStrategy: strategy });
        },

        setCustomWeights: (weights) => {
          set({ customRoutingWeights: weights });
        },

        getOptimalModel: (capabilities) => {
          const { models, routingStrategy, privacy } = get();

          // Filter by privacy settings first
          let eligible = models.filter((m) => m.enabled);
          if (privacy.localOnlyMode || routingStrategy === 'local-only') {
            eligible = eligible.filter((m) => m.provider === 'local');
          }

          // Filter by required capabilities
          if (capabilities.length > 0) {
            eligible = eligible.filter((m) =>
              capabilities.every((cap) => m.capabilities.includes(cap))
            );
          }

          if (eligible.length === 0) return undefined;

          // Sort by strategy
          switch (routingStrategy) {
            case 'cost-optimized':
              eligible.sort((a, b) => a.costPer1kTokens - b.costPer1kTokens);
              break;
            case 'quality-first':
              // Assume higher cost = higher quality for simplicity
              eligible.sort((a, b) => b.costPer1kTokens - a.costPer1kTokens);
              break;
            case 'speed-first':
              // Prefer smaller context windows as proxy for speed
              eligible.sort((a, b) => a.maxTokens - b.maxTokens);
              break;
            case 'privacy-first':
              // Prefer local, then by cost
              eligible.sort((a, b) => {
                if (a.provider === 'local' && b.provider !== 'local') return -1;
                if (a.provider !== 'local' && b.provider === 'local') return 1;
                return a.costPer1kTokens - b.costPer1kTokens;
              });
              break;
            default:
              // Balanced - no specific sort, just return first eligible
              break;
          }

          return eligible[0];
        },

        // Budget actions
        updateBudget: (updates) => {
          set((state) => ({
            budget: { ...state.budget, ...updates },
          }));
        },

        recordUsage: (amount) => {
          set((state) => ({
            budget: { ...state.budget, used: state.budget.used + amount },
          }));
        },

        getBudgetStatus: () => {
          const { budget } = get();
          const percentage = (budget.used / budget.monthlyLimit) * 100;

          if (percentage >= 100) return 'exceeded';
          if (percentage >= budget.alertThreshold) return 'alert';
          if (percentage >= budget.warningThreshold) return 'warning';
          return 'ok';
        },

        getBudgetRemaining: () => {
          const { budget } = get();
          return Math.max(0, budget.monthlyLimit - budget.used);
        },

        getBudgetPercentUsed: () => {
          const { budget } = get();
          return Math.min(100, (budget.used / budget.monthlyLimit) * 100);
        },

        resetBudget: () => {
          set((state) => ({
            budget: {
              ...state.budget,
              used: 0,
              resetDate: new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                1
              ),
            },
          }));
        },

        // Privacy actions
        updatePrivacy: (settings) => {
          set((state) => ({
            privacy: { ...state.privacy, ...settings },
          }));
        },

        isCloudProcessingAllowed: () => {
          const { privacy } = get();
          return privacy.allowCloudProcessing && !privacy.localOnlyMode;
        },

        // Integration actions
        updateIntegration: (id, status) => {
          set((state) => ({
            integrations: state.integrations.map((i) =>
              i.id === id ? { ...i, ...status } : i
            ),
          }));
        },

        connectIntegration: (id) => {
          set((state) => ({
            integrations: state.integrations.map((i) =>
              i.id === id
                ? { ...i, connected: true, lastSync: new Date(), error: null }
                : i
            ),
          }));
        },

        disconnectIntegration: (id) => {
          set((state) => ({
            integrations: state.integrations.map((i) =>
              i.id === id
                ? { ...i, connected: false, lastSync: null, error: null }
                : i
            ),
          }));
        },

        getConnectedIntegrations: () => {
          return get().integrations.filter((i) => i.connected);
        },
      }),
      {
        name: 'symtex-settings-store',
        partialize: (state) => ({
          models: state.models,
          routingStrategy: state.routingStrategy,
          customRoutingWeights: state.customRoutingWeights,
          budget: state.budget,
          privacy: state.privacy,
          integrations: state.integrations,
        }),
      }
    ),
    { name: 'SettingsStore' }
  )
);

// Export types for use in other modules
export type { SettingsState };
