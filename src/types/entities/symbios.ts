/**
 * Symbios Entity Types
 *
 * Symbios is the main conversational interface in Symtex.
 * It handles message routing between symbolic (S1) and neural (AI) processing,
 * and provides contextual quick actions and suggestions.
 */

// ============================================================================
// ROUTING TYPES
// ============================================================================

/**
 * The processing path for a message
 * - symbolic: Processed by Symtex Core (deterministic, rule-based)
 * - neural: Processed by Symtex Conductor (AI-powered)
 * - hybrid: Both symbolic and neural processing
 */
export type RoutingPath = 'symbolic' | 'neural' | 'hybrid';

/**
 * Reason for routing decision
 */
export type RoutingReason =
  | 'sop_match' // Matched an SOP rule
  | 'pattern_match' // Matched a defined pattern
  | 'command' // User issued a command
  | 'context_aware' // Based on current context
  | 'fallback' // Default routing
  | 'user_preference' // User explicitly chose
  | 'complexity' // Based on message complexity
  | 'domain'; // Based on domain expertise

/**
 * Confidence level for routing decisions
 */
export interface RoutingConfidence {
  /** Confidence score (0-1) */
  score: number;
  /** Explanation for the confidence level */
  explanation?: string;
  /** Alternative routing paths considered */
  alternatives?: Array<{
    path: RoutingPath;
    score: number;
  }>;
}

/**
 * Routing information for a message
 */
export interface RoutingInfo {
  /** The processing path chosen */
  path: RoutingPath;
  /** Reason for this routing decision */
  reason: RoutingReason;
  /** Confidence in the routing decision */
  confidence: RoutingConfidence;
  /** SOP ID if routed via SOP */
  sopId?: string;
  /** SOP name if routed via SOP */
  sopName?: string;
  /** Pattern that matched (if any) */
  matchedPattern?: string;
  /** Processing time in milliseconds */
  processingTime?: number;
  /** Model used (for neural routing) */
  model?: string;
}

// ============================================================================
// MESSAGE TYPES
// ============================================================================

/**
 * Role of the message sender
 */
export type SymbiosRole = 'user' | 'assistant' | 'system' | 'cognate';

/**
 * Status of a Symbios message
 */
export type SymbiosMessageStatus =
  | 'pending' // Message is being processed
  | 'routing' // Determining processing path
  | 'processing' // Being processed by engine
  | 'delivered' // Successfully delivered
  | 'error' // Error occurred
  | 'cancelled'; // User cancelled

/**
 * Message sentiment (for analytics)
 */
export type MessageSentiment = 'positive' | 'neutral' | 'negative' | 'mixed';

/**
 * Type of message content
 */
export type MessageContentType =
  | 'text'
  | 'code'
  | 'markdown'
  | 'command'
  | 'file'
  | 'image'
  | 'structured';

/**
 * An attachment in a Symbios message
 */
export interface SymbiosAttachment {
  /** Attachment ID */
  id: string;
  /** File name */
  name: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size: number;
  /** URL to access the attachment */
  url: string;
  /** Thumbnail URL (for images) */
  thumbnailUrl?: string;
  /** Content preview (for text files) */
  preview?: string;
}

/**
 * Tool call made by the assistant
 */
export interface ToolCall {
  /** Tool call ID */
  id: string;
  /** Tool name */
  name: string;
  /** Input parameters */
  input: Record<string, unknown>;
  /** Output/result */
  output?: unknown;
  /** Status */
  status: 'pending' | 'running' | 'completed' | 'failed';
  /** Duration in milliseconds */
  duration?: number;
  /** Error message if failed */
  error?: string;
}

/**
 * Symbios Message interface
 *
 * A message in the Symbios conversational interface with full
 * routing information and metadata.
 */
export interface SymbiosMessage {
  /** Unique identifier */
  id: string;
  /** Conversation ID this message belongs to */
  conversationId: string;

  // =========================================================================
  // Content
  // =========================================================================

  /** Message sender role */
  role: SymbiosRole;
  /** Message content */
  content: string;
  /** Content type */
  contentType: MessageContentType;
  /** Attachments */
  attachments?: SymbiosAttachment[];
  /** Tool calls made */
  toolCalls?: ToolCall[];

  // =========================================================================
  // Routing
  // =========================================================================

  /** Routing information */
  routing: RoutingInfo;

  // =========================================================================
  // Context
  // =========================================================================

  /** Cognate ID that sent/generated this message */
  cognateId?: string;
  /** Cognate name */
  cognateName?: string;
  /** Space ID context */
  spaceId?: string;
  /** Project ID context */
  projectId?: string;
  /** Initiative ID context */
  initiativeId?: string;

  // =========================================================================
  // Metadata
  // =========================================================================

  /** Message status */
  status: SymbiosMessageStatus;
  /** Timestamp */
  timestamp: Date;
  /** Whether the message is pinned */
  isPinned: boolean;
  /** Whether the message is bookmarked */
  isBookmarked: boolean;
  /** Reaction/feedback */
  feedback?: 'positive' | 'negative';
  /** Sentiment analysis */
  sentiment?: MessageSentiment;
  /** Parent message ID (for threading) */
  parentId?: string;
  /** Thread depth (0 = top level) */
  threadDepth?: number;
  /** Reference to reasoning trace */
  reasoningTraceId?: string;
  /** Tokens used (for AI messages) */
  tokens?: {
    input: number;
    output: number;
    total: number;
  };
}

// ============================================================================
// QUICK ACTIONS
// ============================================================================

/**
 * Category of quick action
 */
export type QuickActionCategory =
  | 'common' // Frequently used actions
  | 'contextual' // Based on current context
  | 'suggested' // AI-suggested actions
  | 'recent' // Recently used
  | 'pinned'; // User-pinned actions

/**
 * A quick action suggestion
 */
export interface QuickAction {
  /** Action ID */
  id: string;
  /** Display label */
  label: string;
  /** Description */
  description?: string;
  /** Icon identifier */
  icon: string;
  /** Action category */
  category: QuickActionCategory;
  /** The action to perform (command, message, or callback) */
  action:
    | { type: 'command'; command: string }
    | { type: 'message'; message: string }
    | { type: 'navigate'; path: string }
    | { type: 'callback'; callbackId: string };
  /** Keyboard shortcut (if any) */
  shortcut?: string;
  /** Whether this action is currently available */
  isAvailable: boolean;
  /** Relevance score (for sorting) */
  relevance?: number;
  /** Usage count */
  usageCount: number;
  /** Last used timestamp */
  lastUsedAt?: Date;
}

/**
 * Quick action suggestion context
 */
export interface QuickActionContext {
  /** Current Space ID */
  spaceId?: string;
  /** Current Project ID */
  projectId?: string;
  /** Active Cognate ID */
  cognateId?: string;
  /** Recent message content */
  recentMessage?: string;
  /** Selected text (if any) */
  selectedText?: string;
  /** Current route/page */
  currentRoute?: string;
}

// ============================================================================
// CONVERSATION TYPES
// ============================================================================

/**
 * Type of Symbios conversation
 */
export type SymbiosConversationType =
  | 'general' // General chat
  | 'initiative' // Focused on an Initiative
  | 'automation' // Automation-related
  | 'review' // Code/content review
  | 'debug' // Debugging session
  | 'onboarding'; // Onboarding flow

/**
 * Conversation summary
 */
export interface ConversationSummary {
  /** Summary text */
  text: string;
  /** Key topics discussed */
  topics: string[];
  /** Actions taken */
  actionsTaken: string[];
  /** Generated at timestamp */
  generatedAt: Date;
}

/**
 * Symbios Conversation interface
 */
export interface SymbiosConversation {
  /** Unique identifier */
  id: string;
  /** Conversation title */
  title: string;
  /** Conversation type */
  type: SymbiosConversationType;

  /** Messages in the conversation */
  messages: SymbiosMessage[];

  /** Primary Cognate for this conversation */
  primaryCognateId?: string;
  /** Participating Cognate IDs */
  participatingCognates: string[];

  /** Space context */
  spaceId?: string;
  /** Project context */
  projectId?: string;
  /** Initiative context */
  initiativeId?: string;

  /** Conversation summary */
  summary?: ConversationSummary;

  /** Tags for organization */
  tags: string[];

  /** Whether the conversation is pinned */
  isPinned: boolean;
  /** Whether the conversation is archived */
  isArchived: boolean;
  /** Whether the conversation is starred */
  isStarred: boolean;

  /** Unread message count */
  unreadCount: number;

  /** Created timestamp */
  createdAt: Date;
  /** Updated timestamp */
  updatedAt: Date;
  /** Last message timestamp */
  lastMessageAt?: Date;
}

// ============================================================================
// SYMBIOS STATE
// ============================================================================

/**
 * Current state of the Symbios interface
 */
export interface SymbiosState {
  /** Active conversation ID */
  activeConversationId?: string;
  /** Active Cognate ID */
  activeCognateId?: string;
  /** Current input draft */
  inputDraft: string;
  /** Pending attachments */
  pendingAttachments: SymbiosAttachment[];
  /** Whether AI is currently responding */
  isGenerating: boolean;
  /** Current processing stage */
  processingStage?: 'routing' | 'processing' | 'generating';
  /** Available quick actions */
  quickActions: QuickAction[];
  /** Error message (if any) */
  error?: string;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Determine the routing path for a message
 */
export function determineRoutingPath(
  content: string,
  context: QuickActionContext
): {
  path: RoutingPath;
  reason: RoutingReason;
} {
  // Command detection
  if (content.startsWith('/')) {
    return { path: 'symbolic', reason: 'command' };
  }

  // Simple heuristics - in production this would be more sophisticated
  const isSimpleQuery = content.length < 50 && !content.includes('?');
  const hasContext = context.spaceId || context.projectId;

  if (isSimpleQuery && hasContext) {
    return { path: 'symbolic', reason: 'pattern_match' };
  }

  return { path: 'neural', reason: 'fallback' };
}

/**
 * Generate default quick actions
 */
export function getDefaultQuickActions(): QuickAction[] {
  return [
    {
      id: 'qa-new-initiative',
      label: 'New Initiative',
      description: 'Create a new strategic objective',
      icon: 'target',
      category: 'common',
      action: { type: 'command', command: '/new initiative' },
      isAvailable: true,
      usageCount: 0,
    },
    {
      id: 'qa-new-automation',
      label: 'New Automation',
      description: 'Create a new automated sequence',
      icon: 'zap',
      category: 'common',
      action: { type: 'command', command: '/new automation' },
      isAvailable: true,
      usageCount: 0,
    },
    {
      id: 'qa-help',
      label: 'Help',
      description: 'Get help with Symtex',
      icon: 'help-circle',
      category: 'common',
      action: { type: 'command', command: '/help' },
      shortcut: '?',
      isAvailable: true,
      usageCount: 0,
    },
  ];
}

/**
 * Create a new Symbios message
 */
export function createSymbiosMessage(
  partial: Pick<SymbiosMessage, 'id' | 'conversationId' | 'role' | 'content'> &
    Partial<SymbiosMessage>
): SymbiosMessage {
  return {
    contentType: 'text',
    routing: {
      path: 'neural',
      reason: 'fallback',
      confidence: { score: 1 },
    },
    status: 'pending',
    timestamp: new Date(),
    isPinned: false,
    isBookmarked: false,
    ...partial,
  };
}

/**
 * Create a new Symbios conversation
 */
export function createSymbiosConversation(
  partial: Pick<SymbiosConversation, 'id' | 'title'> & Partial<SymbiosConversation>
): SymbiosConversation {
  const now = new Date();

  return {
    type: 'general',
    messages: [],
    participatingCognates: [],
    tags: [],
    isPinned: false,
    isArchived: false,
    isStarred: false,
    unreadCount: 0,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}
