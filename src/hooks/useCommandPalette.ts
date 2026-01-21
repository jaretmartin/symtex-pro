/**
 * useCommandPalette Hook
 *
 * Manages command palette state, keyboard navigation, and search functionality.
 * Handles global keyboard shortcut (Cmd/Ctrl+K), recent searches persistence,
 * and result navigation.
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fuzzySearch } from '../lib/fuzzy-search';

// ============================================================================
// Types
// ============================================================================

export type CommandCategory =
  | 'actions'
  | 'pages'
  | 'cognates'
  | 'governance'
  | 'settings';

export interface CommandAction {
  id: string;
  title: string;
  description?: string;
  category: CommandCategory;
  icon?: string;
  path?: string;
  shortcut?: string;
  action?: 'navigate' | 'toggle' | 'modal';
  toggleType?: 'darkMode' | 'companion';
  modalType?: string;
}

export interface CommandResult extends CommandAction {
  score: number;
  matchedFields: string[];
}

export interface UseCommandPaletteReturn {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  isLoading: boolean;
  recentSearches: string[];
  results: Record<CommandCategory, CommandResult[]>;
  flattenedResults: CommandResult[];
  totalResultsCount: number;
  setQuery: (query: string) => void;
  setSelectedIndex: (index: number) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  selectItem: (item: CommandResult) => void;
  clearRecentSearches: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  resultsContainerRef: React.RefObject<HTMLDivElement>;
  selectedItemRef: React.RefObject<HTMLButtonElement>;
}

// ============================================================================
// Constants
// ============================================================================

const RECENT_SEARCHES_KEY = 'symtex_pro_command_palette_recent';
const MAX_RECENT_SEARCHES = 5;
const MAX_RESULTS_PER_CATEGORY = 8;
const SEARCH_DEBOUNCE_MS = 100;

export const CATEGORY_ORDER: CommandCategory[] = [
  'actions',
  'pages',
  'cognates',
  'governance',
  'settings',
];

// ============================================================================
// Pro-Specific Pages & Actions
// ============================================================================

const mockPages: CommandAction[] = [
  { id: 'page-home', title: 'Home', description: 'Dashboard overview', category: 'pages', path: '/' },
  { id: 'page-missions', title: 'Missions', description: 'Active and completed missions', category: 'pages', path: '/missions' },
  { id: 'page-cognates', title: 'Cognates', description: 'Manage AI workers', category: 'pages', path: '/studio/cognates' },
  { id: 'page-narratives', title: 'Narratives', description: 'Story-driven automations', category: 'pages', path: '/studio/narratives' },
  { id: 'page-automations', title: 'Automations', description: 'Automated processes', category: 'pages', path: '/studio/automations' },
  { id: 'page-sops', title: 'SOPs', description: 'Standard Operating Procedures', category: 'pages', path: '/studio/sops' },
  { id: 'page-knowledge', title: 'Knowledge Library', description: 'Documents and context', category: 'pages', path: '/library/knowledge' },
  { id: 'page-templates', title: 'Templates', description: 'Reusable templates', category: 'pages', path: '/library/templates' },
  { id: 'page-knowledge-graph', title: 'Knowledge Graph 3D', description: '3D visualization of knowledge', category: 'pages', path: '/library/knowledge-graph' },
  { id: 'page-settings', title: 'Settings', description: 'App configuration', category: 'pages', path: '/settings' },
];

const mockActions: CommandAction[] = [
  { id: 'action-new-cognate', title: 'Create Cognate', description: 'Train a new AI worker', category: 'actions', path: '/studio/cognates/new', shortcut: 'C', action: 'navigate' },
  { id: 'action-new-mission', title: 'New Mission', description: 'Create a new mission', category: 'actions', path: '/missions/new', shortcut: 'M', action: 'navigate' },
  { id: 'action-new-sop', title: 'New SOP', description: 'Create a Standard Operating Procedure', category: 'actions', path: '/studio/sops/new', shortcut: 'S', action: 'navigate' },
  { id: 'action-dark-mode', title: 'Toggle Dark Mode', description: 'Switch theme', category: 'actions', shortcut: 'T', action: 'toggle', toggleType: 'darkMode' },
];

const mockGovernance: CommandAction[] = [
  { id: 'gov-command-center', title: 'Command Center', description: 'System overview and controls', category: 'governance', path: '/governance/command' },
  { id: 'gov-policies', title: 'Governance Policies', description: 'Manage system policies', category: 'governance', path: '/governance/policies' },
  { id: 'gov-concord', title: 'Concord Sessions', description: 'AI-to-AI debate sessions', category: 'governance', path: '/governance/concord' },
  { id: 'gov-audit', title: 'Audit Log', description: 'System audit trail', category: 'governance', path: '/governance/audit' },
];

const mockCognates: CommandAction[] = [
  { id: 'cognate-sales', title: 'Sales Assistant', description: 'L2 Drafter - Sales support', category: 'cognates', path: '/studio/cognates/cog-001', icon: '🤝' },
  { id: 'cognate-support', title: 'Support Cognate', description: 'L4 Chief of Staff - Customer support', category: 'cognates', path: '/studio/cognates/cog-002', icon: '💬' },
  { id: 'cognate-analyst', title: 'Research Analyst', description: 'L1 Suggester - Data analysis', category: 'cognates', path: '/studio/cognates/cog-003', icon: '📊' },
];

const mockSettings: CommandAction[] = [
  { id: 'setting-profile', title: 'Profile Settings', description: 'Update your profile', category: 'settings', path: '/settings' },
  { id: 'setting-api-keys', title: 'API Keys', description: 'Manage API access', category: 'settings', path: '/settings#api' },
  { id: 'setting-privacy', title: 'Privacy & Data', description: 'Privacy controls', category: 'settings', path: '/settings#privacy' },
];

// ============================================================================
// Hook Implementation
// ============================================================================

export function useCommandPalette(): UseCommandPaletteReturn {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, MAX_RECENT_SEARCHES));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const trimmed = searchQuery.trim();
    setRecentSearches((prev) => {
      const updated = [
        trimmed,
        ...prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase()),
      ].slice(0, MAX_RECENT_SEARCHES);

      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      return updated;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Search results computation
  const results = useMemo(() => {
    if (!query || query.trim() === '') {
      return {
        actions: [],
        pages: [],
        cognates: [],
        governance: [],
        settings: [],
      };
    }

    const allItems = [
      ...mockActions,
      ...mockPages,
      ...mockCognates,
      ...mockGovernance,
      ...mockSettings,
    ];

    const searchResults = fuzzySearch(query, allItems as { id: string; title: string; description?: string }[], {
      limit: MAX_RESULTS_PER_CATEGORY * 5,
    });

    const categorized: Record<CommandCategory, CommandResult[]> = {
      actions: [],
      pages: [],
      cognates: [],
      governance: [],
      settings: [],
    };

    searchResults
      .filter((r) => r.score > 0)
      .forEach((result) => {
        const category = result.category as CommandCategory;
        if (categorized[category] && categorized[category].length < MAX_RESULTS_PER_CATEGORY) {
          categorized[category].push(result as unknown as CommandResult);
        }
      });

    return categorized;
  }, [query]);

  const flattenedResults = useMemo(() => {
    const items: CommandResult[] = [];
    CATEGORY_ORDER.forEach((category) => {
      const categoryResults = results[category] || [];
      items.push(...categoryResults);
    });
    return items;
  }, [results]);

  const totalResultsCount = flattenedResults.length;

  // Loading state simulation
  useEffect(() => {
    if (query) {
      setIsLoading(true);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      searchTimeoutRef.current = setTimeout(() => {
        setIsLoading(false);
      }, SEARCH_DEBOUNCE_MS);
    } else {
      setIsLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query]);

  // Reset state on open/close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current && resultsContainerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((i) => Math.min(i + 1, flattenedResults.length - 1));
          break;

        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((i) => Math.max(i - 1, 0));
          break;

        case 'Enter':
          e.preventDefault();
          if (flattenedResults[selectedIndex]) {
            selectItem(flattenedResults[selectedIndex]);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;

        case 'Tab':
          e.preventDefault();
          break;
      }
    },
    [isOpen, flattenedResults, selectedIndex]
  );

  // Item selection handler
  const selectItem = useCallback(
    (item: CommandResult) => {
      if (query) {
        saveRecentSearch(query);
      }

      switch (item.action) {
        case 'toggle':
          if (item.toggleType === 'darkMode') {
            document.documentElement.classList.toggle('dark');
          }
          break;

        case 'modal':
          // Open modal: item.modalType
          break;

        case 'navigate':
        default:
          if (item.path) {
            navigate(item.path);
          }
          break;
      }

      setIsOpen(false);
    },
    [query, saveRecentSearch, navigate]
  );

  return {
    isOpen,
    query,
    selectedIndex,
    isLoading,
    recentSearches,
    results,
    flattenedResults,
    totalResultsCount,
    setQuery,
    setSelectedIndex,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(!isOpen),
    selectItem,
    clearRecentSearches,
    handleKeyDown,
    inputRef,
    resultsContainerRef,
    selectedItemRef,
  };
}
