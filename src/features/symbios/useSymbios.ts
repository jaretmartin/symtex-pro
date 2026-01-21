/**
 * useSymbios Hook
 *
 * Custom hook providing convenient access to Symbios functionality.
 * Combines store actions with computed values and utilities.
 */

import { useCallback, useMemo } from 'react';
import { useSymbiosStore } from './symbios-store';
import type {
  SymbiosMessage,
  SymbiosAttachment,
  SymbiosSuggestion,
  RoutingStats,
} from './symbios-store';

/**
 * Return type for the useSymbios hook
 */
export interface UseSymbiosReturn {
  // State
  isOpen: boolean;
  isMinimized: boolean;
  messages: SymbiosMessage[];
  isTyping: boolean;
  isStreaming: boolean;
  suggestions: SymbiosSuggestion[];
  routingStats: RoutingStats;
  ariaStatus: 'online' | 'busy' | 'away' | 'offline';
  unreadCount: number;

  // Computed
  messageCount: number;
  hasMessages: boolean;
  symbolicPercentage: number;
  neuralPercentage: number;
  estimatedCostSavings: number;
  lastMessage: SymbiosMessage | null;
  userMessages: SymbiosMessage[];
  assistantMessages: SymbiosMessage[];
  pendingApprovals: SymbiosMessage[];

  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
  minimize: () => void;
  maximize: () => void;
  send: (content: string, attachments?: SymbiosAttachment[]) => void;
  clear: () => void;
  approve: (messageId: string) => void;
  reject: (messageId: string) => void;

  // Utilities
  formatCost: (cost: number) => string;
  formatLatency: (ms: number) => string;
}

/**
 * useSymbios - Main hook for Symbios integration
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOpen, toggle, send, messages, symbolicPercentage } = useSymbios();
 *
 *   return (
 *     <div>
 *       <button onClick={toggle}>
 *         {isOpen ? 'Close' : 'Open'} Chat
 *       </button>
 *       <p>Messages: {messages.length}</p>
 *       <p>Symbolic routing: {symbolicPercentage}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useSymbios(): UseSymbiosReturn {
  // Get store state and actions
  const {
    isOpen,
    isMinimized,
    messages,
    isTyping,
    isStreaming,
    suggestions,
    routingStats,
    ariaStatus,
    unreadCount,
    setOpen,
    setMinimized,
    toggleOpen,
    sendMessage,
    clearMessages,
    approveMessage,
    rejectMessage,
    getCostSavings,
  } = useSymbiosStore();

  // Computed values
  const messageCount = messages.length;
  const hasMessages = messages.length > 0;

  const symbolicPercentage = useMemo(() => {
    const total = routingStats.symbolic + routingStats.neural;
    return total > 0 ? Math.round((routingStats.symbolic / total) * 100) : 0;
  }, [routingStats.symbolic, routingStats.neural]);

  const neuralPercentage = useMemo(() => {
    return 100 - symbolicPercentage;
  }, [symbolicPercentage]);

  const estimatedCostSavings = useMemo(() => {
    return getCostSavings();
  }, [getCostSavings]);

  const lastMessage = useMemo(() => {
    return messages.length > 0 ? messages[messages.length - 1] : null;
  }, [messages]);

  const userMessages = useMemo(() => {
    return messages.filter((m) => m.role === 'user');
  }, [messages]);

  const assistantMessages = useMemo(() => {
    return messages.filter((m) => m.role === 'assistant');
  }, [messages]);

  const pendingApprovals = useMemo(() => {
    return messages.filter(
      (m) => m.requiresApproval && m.approvalStatus === 'pending'
    );
  }, [messages]);

  // Actions
  const open = useCallback(() => setOpen(true), [setOpen]);
  const close = useCallback(() => setOpen(false), [setOpen]);
  const toggle = useCallback(() => toggleOpen(), [toggleOpen]);
  const minimize = useCallback(() => setMinimized(true), [setMinimized]);
  const maximize = useCallback(() => setMinimized(false), [setMinimized]);

  const send = useCallback(
    (content: string, attachments?: SymbiosAttachment[]) => {
      sendMessage(content, attachments);
    },
    [sendMessage]
  );

  const clear = useCallback(() => clearMessages(), [clearMessages]);

  const approve = useCallback(
    (messageId: string) => approveMessage(messageId),
    [approveMessage]
  );

  const reject = useCallback(
    (messageId: string) => rejectMessage(messageId),
    [rejectMessage]
  );

  // Utilities
  const formatCost = useCallback((cost: number): string => {
    if (cost < 0.01) {
      return `$${cost.toFixed(3)}`;
    }
    return `$${cost.toFixed(2)}`;
  }, []);

  const formatLatency = useCallback((ms: number): string => {
    if (ms < 1000) {
      return `${Math.round(ms)}ms`;
    }
    return `${(ms / 1000).toFixed(1)}s`;
  }, []);

  return {
    // State
    isOpen,
    isMinimized,
    messages,
    isTyping,
    isStreaming,
    suggestions,
    routingStats,
    ariaStatus,
    unreadCount,

    // Computed
    messageCount,
    hasMessages,
    symbolicPercentage,
    neuralPercentage,
    estimatedCostSavings,
    lastMessage,
    userMessages,
    assistantMessages,
    pendingApprovals,

    // Actions
    open,
    close,
    toggle,
    minimize,
    maximize,
    send,
    clear,
    approve,
    reject,

    // Utilities
    formatCost,
    formatLatency,
  };
}

/**
 * useSymbiosShortcuts - Keyboard shortcuts for Symbios
 *
 * @example
 * ```tsx
 * function App() {
 *   useSymbiosShortcuts();
 *   return <SymbiosChat />;
 * }
 * ```
 */
export function useSymbiosShortcuts(): void {
  const { toggle, isOpen, close } = useSymbios();

  // Set up keyboard shortcuts
  useCallback(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      // Cmd/Ctrl + K to toggle
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggle();
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        close();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggle, isOpen, close]);
}

export default useSymbios;
