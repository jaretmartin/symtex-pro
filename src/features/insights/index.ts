/**
 * Insights Feature Exports
 *
 * ROI Dashboard and related components for tracking
 * cost savings and performance metrics.
 */

// Main dashboard
export { ROIDashboard, default as ROIDashboardDefault } from './ROIDashboard';

// Individual components
export { MetricCard, MetricGrid } from './MetricCard';
export { CostSavingsChart } from './CostSavingsChart';
export { SymbolicRatioGauge } from './SymbolicRatioGauge';
export { PatternCompilationWidget } from './PatternCompilationWidget';

// Store
export {
  useInsightsStore,
  type ROIMetric,
  type CostDataPoint,
  type PatternCompilation,
  type SymbolicRatioData,
  type TrendDirection,
} from './insights-store';
