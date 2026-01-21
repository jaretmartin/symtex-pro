import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  /** Require Ctrl key (Windows/Linux) */
  ctrl?: boolean;
  /** Require Meta/Cmd key (macOS) */
  meta?: boolean;
  /** Require Shift key */
  shift?: boolean;
  /** Require Alt/Option key */
  alt?: boolean;
  /** Prevent default browser behavior */
  preventDefault?: boolean;
  /** Stop event propagation */
  stopPropagation?: boolean;
  /** Only trigger when these element types are NOT focused */
  ignoreInputs?: boolean;
}

/**
 * useKeyboardShortcut - Registers a keyboard shortcut handler
 *
 * Provides a declarative way to handle keyboard shortcuts with modifier keys.
 * Automatically handles cleanup on unmount.
 *
 * @param key - The key to listen for (e.g., 'k', 'Enter', 'Escape')
 * @param callback - The function to call when the shortcut is triggered
 * @param options - Configuration for modifier keys and behavior
 *
 * @example
 * ```tsx
 * // Simple shortcut: Cmd/Ctrl + K to open search
 * useKeyboardShortcut('k', openSearch, { meta: true });
 *
 * // With multiple modifiers: Cmd/Ctrl + Shift + P for command palette
 * useKeyboardShortcut('p', openCommandPalette, { meta: true, shift: true });
 *
 * // Escape to close modal (ignoring when typing in inputs)
 * useKeyboardShortcut('Escape', closeModal, { ignoreInputs: true });
 * ```
 */
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  options: ShortcutOptions = {}
): void {
  const {
    ctrl = false,
    meta = false,
    shift = false,
    alt = false,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = false,
  } = options;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Check if we should ignore the event when inputs are focused
      if (ignoreInputs) {
        const target = event.target as HTMLElement;
        const tagName = target.tagName.toLowerCase();
        const isEditable =
          target.isContentEditable ||
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select';

        if (isEditable) {
          return;
        }
      }

      // Normalize the key for comparison (handle case-insensitivity)
      const pressedKey = event.key.toLowerCase();
      const targetKey = key.toLowerCase();

      // Check if the pressed key matches
      if (pressedKey !== targetKey) {
        return;
      }

      // Check modifier keys
      const ctrlMatch = ctrl ? event.ctrlKey : !event.ctrlKey;
      const metaMatch = meta ? event.metaKey : !event.metaKey;
      const shiftMatch = shift ? event.shiftKey : !event.shiftKey;
      const altMatch = alt ? event.altKey : !event.altKey;

      // All conditions must match
      if (ctrlMatch && metaMatch && shiftMatch && altMatch) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback();
      }
    },
    [key, callback, ctrl, meta, shift, alt, preventDefault, stopPropagation, ignoreInputs]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Utility: Create cross-platform shortcut (Cmd on Mac, Ctrl on Windows/Linux)
 */
export function useCrossPlatformShortcut(
  key: string,
  callback: () => void,
  options: Omit<ShortcutOptions, 'ctrl' | 'meta'> = {}
): void {
  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  useKeyboardShortcut(key, callback, {
    ...options,
    meta: isMac,
    ctrl: !isMac,
  });
}
