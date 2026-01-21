/**
 * Symbios Feature - Conversational Interface with Aria Routing
 *
 * Symbios is the primary conversational interface for interacting with
 * Cognates (AI workers). It features intelligent routing between symbolic
 * (fast, pattern-based) and neural (LLM) processing.
 *
 * @module features/symbios
 */

// Store
export {
  useSymbiosStore,
  type RoutingType,
  type SymbiosMessageRole,
  type SymbiosMessageStatus,
  type SymbiosAttachment,
  type SymbiosCitation,
  type SymbiosRouting,
  type SymbiosMessage,
  type SymbiosSuggestion,
  type RoutingStats,
} from './symbios-store';

// Components
export {
  SymbiosChat,
  SymbiosChatPanel,
  SymbiosChatModal,
} from './SymbiosChat';

export {
  SymbiosFloatingButton,
  SymbiosMinimizedBar,
} from './SymbiosFloatingButton';

export {
  SymbiosMessage as SymbiosMessageComponent,
  TypingIndicator,
} from './SymbiosMessage';

export {
  SymbiosInput,
  QuickActionButton,
} from './SymbiosInput';

export {
  SymbiosSuggestions,
  SymbiosSuggestionCard,
  SymbiosEmptyState,
} from './SymbiosSuggestions';

export {
  SymbiosRoutingIndicator,
  SymbiosRoutingBadge,
  SymbiosRoutingStats,
} from './SymbiosRoutingIndicator';

// Hooks
export {
  useSymbios,
  useSymbiosShortcuts,
  type UseSymbiosReturn,
} from './useSymbios';
