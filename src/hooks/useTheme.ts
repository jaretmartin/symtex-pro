/**
 * useTheme Hook
 *
 * Manages theme state with system preference detection and persistence.
 * Integrates with useUserStore for preference persistence.
 */

import { useEffect, useCallback } from 'react';
import { useUserStore } from '@/store';

export type Theme = 'light' | 'dark' | 'system';

/**
 * Get the system's preferred color scheme
 */
function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Apply the theme to the document
 */
function applyTheme(theme: Theme): void {
  if (typeof document === 'undefined') return;

  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme;
  const root = document.documentElement;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Get the resolved (effective) theme based on current setting
 */
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

/**
 * Custom hook for managing theme state
 *
 * Features:
 * - Persists theme preference via useUserStore (localStorage)
 * - Detects system preference when set to 'system'
 * - Listens for system preference changes in real-time
 * - Applies theme by toggling .dark class on document.documentElement
 *
 * @example
 * const { theme, setTheme, resolvedTheme } = useTheme();
 *
 * // theme can be 'light', 'dark', or 'system'
 * // resolvedTheme is always 'light' or 'dark' (resolved system preference)
 */
export function useTheme() {
  const { preferences, updatePreferences } = useUserStore();
  const theme = preferences.theme as Theme;

  const setTheme = useCallback(
    (newTheme: Theme) => {
      updatePreferences({ theme: newTheme });
      applyTheme(newTheme);
    },
    [updatePreferences]
  );

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      applyTheme('system');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return {
    /** Current theme setting ('light', 'dark', or 'system') */
    theme,
    /** Update the theme preference */
    setTheme,
    /** The resolved theme (always 'light' or 'dark') */
    resolvedTheme: getResolvedTheme(theme),
    /** Whether the current resolved theme is dark */
    isDark: getResolvedTheme(theme) === 'dark',
  };
}

/**
 * Initialize theme before React renders (prevents flash of wrong theme)
 * Call this synchronously before ReactDOM.createRoot()
 */
export function initializeTheme(): void {
  const STORAGE_KEY = 'symtex-user-store';

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let theme: Theme = 'dark'; // Default to dark

    if (stored) {
      const parsed = JSON.parse(stored);
      theme = parsed.state?.preferences?.theme || 'dark';
    }

    applyTheme(theme);
  } catch {
    // If localStorage is unavailable, default to dark
    applyTheme('dark');
  }
}
