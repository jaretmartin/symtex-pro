/**
 * Custom Hooks
 *
 * Reusable React hooks for state management and UI behavior.
 */

export { useTreeExpansion } from './useTreeExpansion';
export { useCommandPalette, CATEGORY_ORDER } from './useCommandPalette';
export { useTheme, initializeTheme } from './useTheme';
export type { Theme } from './useTheme';

// Shared utility hooks
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useKeyboardShortcut, useCrossPlatformShortcut } from './useKeyboardShortcut';
