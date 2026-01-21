/**
 * DNA System Feature
 *
 * The DNA System represents the user's AI profile - their preferences,
 * patterns, and context that personalize AI interactions.
 *
 * 10 DNA Strands:
 * - Personal (5): Communication, Work Patterns, Decision Making, Learning Style, Priorities
 * - Work (5): Industry Knowledge, Role Context, Tool Preferences, Quality Standards, Collaboration Style
 */

// Main components
export { default as DNAHelixViz } from './DNAHelixViz';
export { default as DNAStrengthGauge } from './DNAStrengthGauge';
export { default as StrandCard } from './StrandCard';
export { default as DNADashboard } from './DNADashboard';

// Store and types
export {
  useDNAStore,
  type DNAStrandData,
  type DNACategory,
  type DNAProfile,
} from './dna-store';
