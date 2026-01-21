/**
 * Command Palette Types
 *
 * Type definitions for the command palette system
 */

// ============================================================================
// Core Types
// ============================================================================

export type CommandCategory =
  | 'actions'
  | 'pages'
  | 'cognates'
  | 'spaces'
  | 'sops'
  | 'narratives'
  | 'settings';

export type CommandActionType = 'navigate' | 'toggle' | 'modal' | 'action';

export interface CommandAction {
  id: string;
  title: string;
  description?: string;
  category: CommandCategory;
  icon?: string;
  path?: string;
  shortcut?: string;
  action?: CommandActionType;
  toggleType?: 'darkMode' | 'sidebar';
  modalType?: string;
  keywords?: string[];
}

export interface CommandResult extends CommandAction {
  score: number;
  matchedFields: string[];
}

// ============================================================================
// State Types
// ============================================================================

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  isLoading: boolean;
  recentSearches: string[];
  results: Record<CommandCategory, CommandResult[]>;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseCommandPaletteReturn {
  // State
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  isLoading: boolean;
  recentSearches: string[];
  results: Record<CommandCategory, CommandResult[]>;
  flattenedResults: CommandResult[];
  totalResultsCount: number;

  // Actions
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectItem: (item: CommandResult) => void;
  clearRecentSearches: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;

  // Refs
  inputRef: React.RefObject<HTMLInputElement>;
  resultsContainerRef: React.RefObject<HTMLDivElement>;
  selectedItemRef: React.RefObject<HTMLButtonElement>;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface CommandItemProps {
  item: CommandResult;
  isSelected: boolean;
  query: string;
  onClick: () => void;
  onMouseEnter: () => void;
}

export interface CommandGroupProps {
  category: CommandCategory;
  count: number;
  hasMore?: boolean;
  onShowAll?: () => void;
  children: React.ReactNode;
}

export interface CommandEmptyStateProps {
  query: string;
}

export interface CommandDefaultStateProps {
  recentSearches: string[];
  onRecentClick: (search: string) => void;
  onClearRecent: () => void;
  suggestions: CommandSuggestion[];
}

export interface CommandSuggestion {
  id: string;
  title: string;
  description?: string;
  onClick: () => void;
}

// ============================================================================
// Category Configuration
// ============================================================================

export interface CategoryConfig {
  label: string;
  color: string;
}

export const CATEGORY_ORDER: CommandCategory[] = [
  'actions',
  'pages',
  'cognates',
  'sops',
  'narratives',
  'spaces',
  'settings',
];

export const CATEGORY_CONFIG: Record<CommandCategory, CategoryConfig> = {
  actions: {
    label: 'Actions',
    color: 'text-success',
  },
  pages: {
    label: 'Pages',
    color: 'text-info',
  },
  cognates: {
    label: 'Cognates',
    color: 'text-symtex-primary',
  },
  sops: {
    label: 'SOPs',
    color: 'text-symtex-gold',
  },
  narratives: {
    label: 'Narratives',
    color: 'text-symtex-accent',
  },
  spaces: {
    label: 'Spaces',
    color: 'text-warning',
  },
  settings: {
    label: 'Settings',
    color: 'text-slate-400',
  },
};
