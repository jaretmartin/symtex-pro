/**
 * Central type exports
 *
 * Import types from here:
 * import type { EnhancedCognate, EnhancedSpace, Initiative } from '@/types';
 *
 * NOTE: Use canonical Symtex terminology:
 * - Cognates (not agents)
 * - Spaces (not workspaces)
 * - Initiatives (not missions/tasks)
 * - Automations (not workflows)
 * - S1 (not X83)
 */

// ============================================================================
// ENHANCED ENTITY TYPES (Canonical)
// ============================================================================

// Enhanced Cognate types with full personality, progression, templates, instances, and executions
// NOTE: This now includes all runtime types (formerly in agent.ts)
export * from './entities/cognate-enhanced';

// Enhanced Space, Project, and Initiative types
export * from './entities/space-enhanced';

// Enhanced Automation types with triggers, approval policies, and visual builder types
// NOTE: This now includes all builder types (formerly in workflow.ts)
export * from './entities/automation-enhanced';

// Ledger types for audit trail (6 W's framework)
export * from './entities/ledger';

// Symbios types for the conversational interface
export * from './entities/symbios';

// ============================================================================
// LEGACY ENTITY TYPES
// ============================================================================

// Note: These are maintained for backwards compatibility
// Prefer using enhanced types for new development

export * from './entities/mission';
export * from './entities/automation';
export * from './entities/template';
export * from './entities/user';
export * from './entities/budget';
export * from './entities/dna';
export * from './entities/cognate';
export * from './entities/space';
export * from './entities/context';
export * from './entities/narrative';
export * from './entities/chat';
export * from './entities/reasoning';
export * from './entities/command-palette';

// ============================================================================
// API TYPES
// ============================================================================

export * from './api/responses';
export * from './api/requests';

// UI Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export type Size = 'sm' | 'md' | 'lg';

export type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';

export interface IconProps {
  className?: string;
  size?: number;
}
