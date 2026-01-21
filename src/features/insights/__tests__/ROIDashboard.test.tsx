import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ROIDashboard } from '../ROIDashboard';
import { useInsightsStore } from '../insights-store';
import type { ROIMetric, CostDataPoint, SymbolicRatioData, PatternCompilation } from '../insights-store';

// Mock child components to isolate ROIDashboard testing
vi.mock('../MetricCard', () => ({
  MetricGrid: ({ metrics }: { metrics: ROIMetric[] }) => (
    <div data-testid="metric-grid">
      {metrics.map((m) => (
        <div key={m.id} data-testid={`metric-${m.id}`}>
          <span>{m.label}</span>
          <span>{m.value}</span>
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../CostSavingsChart', () => ({
  CostSavingsChart: ({ data }: { data: CostDataPoint[] }) => (
    <div data-testid="cost-savings-chart">
      Cost Chart with {data.length} data points
    </div>
  ),
}));

vi.mock('../SymbolicRatioGauge', () => ({
  SymbolicRatioGauge: ({ data }: { data: SymbolicRatioData }) => (
    <div data-testid="symbolic-ratio-gauge">
      Symbolic: {data.symbolic}%
    </div>
  ),
}));

vi.mock('../PatternCompilationWidget', () => ({
  PatternCompilationWidget: ({ patterns, totalCompiled }: { patterns: PatternCompilation[]; totalCompiled: number }) => (
    <div data-testid="pattern-compilation-widget">
      {patterns.length} patterns, {totalCompiled} total compiled
    </div>
  ),
}));

// Mock the UI Select component
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: { children: React.ReactNode; value: string; onValueChange: (v: string) => void }) => (
    <div data-testid="select">{children}</div>
  ),
  SelectTrigger: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <button role="combobox" className={className}>{children}</button>
  ),
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-value={value}>{children}</div>
  ),
  SelectValue: () => <span>Last 6 months</span>,
}));

// Mock the store
vi.mock('../insights-store', () => ({
  useInsightsStore: vi.fn(),
}));

// Mock data
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
];

const mockSymbolicRatio: SymbolicRatioData = {
  symbolic: 89,
  neural: 11,
  totalRequests: 14832,
  symbolicRequests: 13200,
  neuralRequests: 1632,
  lastUpdated: new Date(),
};

const mockPatterns: PatternCompilation[] = [
  {
    id: 'pc-001',
    patternName: 'customer-greeting',
    sourcePath: '/narratives/support/greetings',
    convertedFrom: 'neural',
    timestamp: new Date(),
    executionCount: 1247,
    timeSaved: 0.8,
  },
  {
    id: 'pc-002',
    patternName: 'ticket-classification',
    sourcePath: '/narratives/support/triage',
    convertedFrom: 'neural',
    timestamp: new Date(),
    executionCount: 892,
    timeSaved: 2.3,
  },
];

const createMockStore = (overrides = {}) => ({
  metrics: mockMetrics,
  costData: mockCostData,
  symbolicRatio: mockSymbolicRatio,
  patterns: mockPatterns,
  totalPatternsCompiled: 156,
  isLoading: false,
  timeRange: '6m' as const,
  setTimeRange: vi.fn(),
  loadMockData: vi.fn(),
  ...overrides,
});

describe('ROIDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders the dashboard title', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('ROI Dashboard')).toBeInTheDocument();
    });

    it('renders the dashboard subtitle', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('Track your return on investment with Symtex')).toBeInTheDocument();
    });

    it('calls loadMockData on mount', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(mockStore.loadMockData).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('shows loading skeleton when isLoading is true', () => {
      const mockStore = createMockStore({ isLoading: true });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(<ROIDashboard />);

      // Check for loading skeleton elements
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('does not show dashboard content when loading', () => {
      const mockStore = createMockStore({ isLoading: true });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.queryByText('ROI Dashboard')).not.toBeInTheDocument();
    });
  });

  describe('metrics display', () => {
    it('renders the metric grid', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('metric-grid')).toBeInTheDocument();
    });

    it('displays Time Saved metric', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('metric-time-saved')).toBeInTheDocument();
      expect(screen.getByText('Time Saved')).toBeInTheDocument();
      expect(screen.getByText('47h/month')).toBeInTheDocument();
    });

    it('displays Cost Avoided metric', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('metric-cost-avoided')).toBeInTheDocument();
      expect(screen.getByText('Cost Avoided')).toBeInTheDocument();
      expect(screen.getByText('$1,650/month')).toBeInTheDocument();
    });

    it('displays Actual Spend metric', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('metric-actual-spend')).toBeInTheDocument();
      expect(screen.getByText('Actual Spend')).toBeInTheDocument();
      expect(screen.getByText('$127/month')).toBeInTheDocument();
    });

    it('displays ROI Multiplier metric', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('metric-roi-multiplier')).toBeInTheDocument();
      expect(screen.getByText('ROI Multiplier')).toBeInTheDocument();
      expect(screen.getByText('12.4x')).toBeInTheDocument();
    });
  });

  describe('charts and widgets', () => {
    it('renders cost savings chart', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('cost-savings-chart')).toBeInTheDocument();
      expect(screen.getByText('Cost Chart with 3 data points')).toBeInTheDocument();
    });

    it('renders symbolic ratio gauge', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('symbolic-ratio-gauge')).toBeInTheDocument();
      expect(screen.getByText('Symbolic: 89%')).toBeInTheDocument();
    });

    it('renders pattern compilation widget', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTestId('pattern-compilation-widget')).toBeInTheDocument();
      expect(screen.getByText('2 patterns, 156 total compiled')).toBeInTheDocument();
    });
  });

  describe('summary footer', () => {
    it('displays the summary message', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('Symtex is saving you significant time and money')).toBeInTheDocument();
    });

    it('displays total savings', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      // Total savings from mockCostData: 2655 + 2922 + 3094 = 8671
      expect(screen.getByText('$8,671')).toBeInTheDocument();
    });

    it('displays time range context in summary for 6m', () => {
      const mockStore = createMockStore({ timeRange: '6m' });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('Based on 6 months of usage data')).toBeInTheDocument();
    });

    it('displays time range context for non-6m ranges', () => {
      const mockStore = createMockStore({ timeRange: '30d' });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('Based on 30d of usage data')).toBeInTheDocument();
    });
  });

  describe('action buttons', () => {
    it('renders refresh button', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTitle('Refresh data')).toBeInTheDocument();
    });

    it('renders export button', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByTitle('Export report')).toBeInTheDocument();
    });

    it('calls loadMockData when refresh button is clicked', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);

      const refreshButton = screen.getByTitle('Refresh data');
      fireEvent.click(refreshButton);

      // loadMockData is called on mount and on refresh
      expect(mockStore.loadMockData).toHaveBeenCalledTimes(2);
    });
  });

  describe('time range selector', () => {
    it('renders time range selector', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  describe('className prop', () => {
    it('applies custom className', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      const { container } = render(<ROIDashboard className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('accessibility', () => {
    it('has accessible labels on action buttons', () => {
      const mockStore = createMockStore();
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);

      expect(screen.getByLabelText('Refresh ROI data')).toBeInTheDocument();
      expect(screen.getByLabelText('Export ROI report')).toBeInTheDocument();
    });
  });

  describe('empty state handling', () => {
    it('handles empty metrics gracefully', () => {
      const mockStore = createMockStore({ metrics: [] });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      // Should still render the dashboard structure
      expect(screen.getByText('ROI Dashboard')).toBeInTheDocument();
      expect(screen.getByTestId('metric-grid')).toBeInTheDocument();
    });

    it('handles empty cost data gracefully', () => {
      const mockStore = createMockStore({ costData: [] });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      // Total savings should be $0
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('handles empty patterns gracefully', () => {
      const mockStore = createMockStore({ patterns: [], totalPatternsCompiled: 0 });
      (useInsightsStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockStore);

      render(<ROIDashboard />);
      expect(screen.getByText('0 patterns, 0 total compiled')).toBeInTheDocument();
    });
  });
});
