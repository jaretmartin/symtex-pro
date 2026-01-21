/**
 * Insights Store - ROI Dashboard State Management
 *
 * Manages metrics, cost savings data, symbolic ratio, and pattern compilation data
 * for the ROI Dashboard feature.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// ============================================================================
// TYPES
// ============================================================================

export type TrendDirection = 'up' | 'down' | 'stable';

export interface ROIMetric {
  id: string;
  label: string;
  value: string;
  previousValue?: string;
  trend: TrendDirection;
  trendPercent?: number;
  description?: string;
  icon: 'clock' | 'dollar' | 'dollar-off' | 'multiply' | 'zap' | 'cpu';
}

export interface CostDataPoint {
  month: string;
  withoutSymtex: number;
  withSymtex: number;
  savings: number;
}

export interface PatternCompilation {
  id: string;
  patternName: string;
  sourcePath: string;
  convertedFrom: 'neural' | 'manual';
  timestamp: Date;
  executionCount: number;
  timeSaved: number; // seconds per execution
}

export interface SymbolicRatioData {
  symbolic: number; // percentage
  neural: number; // percentage
  totalRequests: number;
  symbolicRequests: number;
  neuralRequests: number;
  lastUpdated: Date;
}

// ============================================================================
// STATE INTERFACE
// ============================================================================

interface InsightsState {
  // Data
  metrics: ROIMetric[];
  costData: CostDataPoint[];
  symbolicRatio: SymbolicRatioData;
  patterns: PatternCompilation[];
  totalPatternsCompiled: number;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Time range
  timeRange: '7d' | '30d' | '90d' | '6m' | '1y';

  // Actions
  setMetrics: (metrics: ROIMetric[]) => void;
  setCostData: (data: CostDataPoint[]) => void;
  setSymbolicRatio: (ratio: SymbolicRatioData) => void;
  setPatterns: (patterns: PatternCompilation[]) => void;
  setTimeRange: (range: InsightsState['timeRange']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadMockData: () => void;

  // Computed
  getTotalSavings: () => number;
  getAverageROI: () => number;
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockMetrics: ROIMetric[] = [
  {
    id: 'time-saved',
    label: 'Time Saved',
    value: '47h/month',
    previousValue: '41h/month',
    trend: 'up',
    trendPercent: 14.6,
    description: 'Hours saved through Cognate automation',
    icon: 'clock',
  },
  {
    id: 'cost-avoided',
    label: 'Cost Avoided',
    value: '$1,650/month',
    previousValue: '$1,420/month',
    trend: 'up',
    trendPercent: 16.2,
    description: 'Labor costs avoided via symbolic processing',
    icon: 'dollar',
  },
  {
    id: 'actual-spend',
    label: 'Actual Spend',
    value: '$127/month',
    previousValue: '$143/month',
    trend: 'down',
    trendPercent: -11.2,
    description: 'Current Symtex platform cost',
    icon: 'dollar-off',
  },
  {
    id: 'roi-multiplier',
    label: 'ROI Multiplier',
    value: '12.4x',
    previousValue: '9.9x',
    trend: 'up',
    trendPercent: 25.3,
    description: 'Return on investment ratio',
    icon: 'multiply',
  },
];

const mockCostData: CostDataPoint[] = [
  { month: 'Aug 2025', withoutSymtex: 2850, withSymtex: 195, savings: 2655 },
  { month: 'Sep 2025', withoutSymtex: 3100, withSymtex: 178, savings: 2922 },
  { month: 'Oct 2025', withoutSymtex: 3250, withSymtex: 156, savings: 3094 },
  { month: 'Nov 2025', withoutSymtex: 3400, withSymtex: 142, savings: 3258 },
  { month: 'Dec 2025', withoutSymtex: 3650, withSymtex: 135, savings: 3515 },
  { month: 'Jan 2026', withoutSymtex: 3800, withSymtex: 127, savings: 3673 },
];

const mockSymbolicRatio: SymbolicRatioData = {
  symbolic: 89,
  neural: 11,
  totalRequests: 14832,
  symbolicRequests: 13200,
  neuralRequests: 1632,
  lastUpdated: new Date(),
};

const now = new Date();
const mockPatterns: PatternCompilation[] = [
  {
    id: 'pc-001',
    patternName: 'customer-greeting',
    sourcePath: '/narratives/support/greetings',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
    executionCount: 1247,
    timeSaved: 0.8,
  },
  {
    id: 'pc-002',
    patternName: 'ticket-classification',
    sourcePath: '/narratives/support/triage',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    executionCount: 892,
    timeSaved: 2.3,
  },
  {
    id: 'pc-003',
    patternName: 'invoice-extraction',
    sourcePath: '/narratives/finance/documents',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    executionCount: 456,
    timeSaved: 4.7,
  },
  {
    id: 'pc-004',
    patternName: 'meeting-summary',
    sourcePath: '/narratives/productivity/meetings',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000), // 2 days ago
    executionCount: 234,
    timeSaved: 12.5,
  },
  {
    id: 'pc-005',
    patternName: 'email-response-template',
    sourcePath: '/narratives/communication/email',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000), // 3 days ago
    executionCount: 1891,
    timeSaved: 1.2,
  },
  {
    id: 'pc-006',
    patternName: 'data-validation-rule',
    sourcePath: '/narratives/data/validation',
    convertedFrom: 'manual',
    timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000), // 4 days ago
    executionCount: 3456,
    timeSaved: 0.3,
  },
  {
    id: 'pc-007',
    patternName: 'report-generation',
    sourcePath: '/narratives/analytics/reports',
    convertedFrom: 'neural',
    timestamp: new Date(now.getTime() - 120 * 60 * 60 * 1000), // 5 days ago
    executionCount: 127,
    timeSaved: 45.0,
  },
  {
    id: 'pc-008',
    patternName: 'approval-process',
    sourcePath: '/narratives/governance/approvals',
    convertedFrom: 'manual',
    timestamp: new Date(now.getTime() - 168 * 60 * 60 * 1000), // 7 days ago
    executionCount: 89,
    timeSaved: 8.5,
  },
];

// ============================================================================
// STORE
// ============================================================================

export const useInsightsStore = create<InsightsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      metrics: [],
      costData: [],
      symbolicRatio: {
        symbolic: 0,
        neural: 0,
        totalRequests: 0,
        symbolicRequests: 0,
        neuralRequests: 0,
        lastUpdated: new Date(),
      },
      patterns: [],
      totalPatternsCompiled: 0,
      isLoading: false,
      error: null,
      timeRange: '6m',

      // Actions
      setMetrics: (metrics) => {
        set({ metrics });
      },

      setCostData: (costData) => {
        set({ costData });
      },

      setSymbolicRatio: (symbolicRatio) => {
        set({ symbolicRatio });
      },

      setPatterns: (patterns) => {
        set({ patterns, totalPatternsCompiled: 156 }); // Total compiled, not just recent
      },

      setTimeRange: (timeRange) => {
        set({ timeRange });
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error, isLoading: false });
      },

      loadMockData: () => {
        set({
          metrics: mockMetrics,
          costData: mockCostData,
          symbolicRatio: mockSymbolicRatio,
          patterns: mockPatterns,
          totalPatternsCompiled: 156,
          isLoading: false,
          error: null,
        });
      },

      // Computed
      getTotalSavings: () => {
        const { costData } = get();
        return costData.reduce((total, point) => total + point.savings, 0);
      },

      getAverageROI: () => {
        const { costData } = get();
        if (costData.length === 0) return 0;
        const totalWithout = costData.reduce((sum, p) => sum + p.withoutSymtex, 0);
        const totalWith = costData.reduce((sum, p) => sum + p.withSymtex, 0);
        return totalWith > 0 ? totalWithout / totalWith : 0;
      },
    }),
    { name: 'InsightsStore' }
  )
);
