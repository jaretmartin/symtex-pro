/**
 * Symbios Store - Conversational Interface State Management
 *
 * Manages the Symbios chat state including messages, routing statistics,
 * and Aria integration. Symbios is the primary conversational interface
 * for interacting with Cognates.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Routing type for message processing
 * - symbolic: Fast, deterministic routing via S1/Core patterns
 * - neural: Complex routing via Conductor (LLM)
 */
export type RoutingType = 'symbolic' | 'neural';

/**
 * Message role in the conversation
 */
export type SymbiosMessageRole = 'user' | 'assistant' | 'system';

/**
 * Status of a message
 */
export type SymbiosMessageStatus = 'pending' | 'sent' | 'delivered' | 'error';

/**
 * Attachment type for rich messages
 */
export interface SymbiosAttachment {
  id: string;
  type: 'file' | 'image' | 'code' | 'link';
  name: string;
  url?: string;
  content?: string;
  mimeType?: string;
}

/**
 * Citation reference in assistant messages
 */
export interface SymbiosCitation {
  id: string;
  sourceType: 'sop' | 'knowledge' | 'document' | 'web';
  title: string;
  url?: string;
  snippet?: string;
}

/**
 * Routing information for a message
 */
export interface SymbiosRouting {
  type: RoutingType;
  patternId?: string;
  patternName?: string;
  confidence?: number;
  estimatedCost: number;
  latencyMs?: number;
}

/**
 * A single message in the Symbios conversation
 */
export interface SymbiosMessage {
  id: string;
  role: SymbiosMessageRole;
  content: string;
  status: SymbiosMessageStatus;
  createdAt: string;
  routing?: SymbiosRouting;
  attachments?: SymbiosAttachment[];
  citations?: SymbiosCitation[];
  cognateId?: string;
  cognateName?: string;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  metadata?: Record<string, unknown>;
}

/**
 * Quick action suggestion
 */
export interface SymbiosSuggestion {
  id: string;
  label: string;
  action: string;
  icon?: string;
  category?: 'quick' | 'contextual' | 'follow-up';
}

/**
 * Routing statistics for analytics
 */
export interface RoutingStats {
  symbolic: number;
  neural: number;
  totalCost: number;
  avgLatencyMs: number;
}

/**
 * Symbios store state
 */
interface SymbiosState {
  // UI State
  isOpen: boolean;
  isMinimized: boolean;
  unreadCount: number;

  // Conversation State
  messages: SymbiosMessage[];
  activeConversationId: string | null;
  isTyping: boolean;
  isStreaming: boolean;

  // Suggestions
  suggestions: SymbiosSuggestion[];

  // Analytics
  routingStats: RoutingStats;

  // Aria presence
  ariaStatus: 'online' | 'busy' | 'away' | 'offline';

  // Actions - UI
  toggleOpen: () => void;
  setOpen: (isOpen: boolean) => void;
  setMinimized: (isMinimized: boolean) => void;
  clearUnread: () => void;

  // Actions - Messages
  sendMessage: (content: string, attachments?: SymbiosAttachment[]) => void;
  addMessage: (message: SymbiosMessage) => void;
  updateMessage: (id: string, updates: Partial<SymbiosMessage>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;

  // Actions - Typing
  setTyping: (isTyping: boolean) => void;
  setStreaming: (isStreaming: boolean) => void;

  // Actions - Suggestions
  setSuggestions: (suggestions: SymbiosSuggestion[]) => void;
  clearSuggestions: () => void;

  // Actions - Approval
  approveMessage: (id: string) => void;
  rejectMessage: (id: string) => void;

  // Actions - Analytics
  updateRoutingStats: (routing: SymbiosRouting) => void;

  // Computed
  getSymbolicPercentage: () => number;
  getCostSavings: () => number;
}

// Generate unique IDs
const generateId = (): string => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Mock response data for demo
const mockResponses: Record<string, Partial<SymbiosMessage>> = {
  email: {
    content: `I've drafted the email for you:\n\n**Subject:** Q4 Performance Review Meeting\n\nHi Team,\n\nI'd like to schedule our Q4 performance review meeting for next week. Please let me know your availability between Tuesday and Thursday.\n\nBest regards`,
    routing: {
      type: 'symbolic',
      patternId: 'email_draft_v2',
      patternName: 'Professional Email Template',
      confidence: 0.94,
      estimatedCost: 0.002,
      latencyMs: 45,
    },
  },
  creative: {
    content: `Here's a creative approach for your marketing campaign:\n\n**Campaign Concept: "Unlock Your Potential"**\n\nThe campaign centers on transformation stories - real users sharing their journey from chaos to clarity using Symtex. We'd use a visual metaphor of locked doors gradually opening, revealing organized, beautiful spaces.\n\n**Key Elements:**\n- User testimonial videos (30-60 seconds)\n- Before/after Automation visualizations\n- Interactive demo microsite\n- Social media countdown series`,
    routing: {
      type: 'neural',
      confidence: 0.87,
      estimatedCost: 0.045,
      latencyMs: 2300,
    },
    citations: [
      {
        id: 'cite_1',
        sourceType: 'knowledge',
        title: 'Marketing Best Practices 2024',
        snippet: 'Transformation narratives increase engagement by 340%...',
      },
    ],
  },
  approval: {
    content: `I've prepared an automation to handle the weekly report generation. This will:\n\n1. Aggregate data from Sales, Marketing, and Product\n2. Generate visual charts using our standard templates\n3. Compile into a PDF report\n4. Send to the executive team every Monday at 9 AM\n\n**Estimated time saved:** 4 hours/week\n\nDo you want me to activate this automation?`,
    routing: {
      type: 'symbolic',
      patternId: 'report_automation_v1',
      patternName: 'Weekly Report Generator',
      confidence: 0.91,
      estimatedCost: 0.008,
      latencyMs: 120,
    },
    requiresApproval: true,
    approvalStatus: 'pending',
  },
};

// Initial mock messages for demo
const initialMessages: SymbiosMessage[] = [
  {
    id: 'msg_initial_1',
    role: 'assistant',
    content: 'Hello! I\'m Aria, your Symbios assistant. I can help you with tasks, answer questions, and coordinate with your Cognates. What would you like to work on today?',
    status: 'delivered',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    cognateName: 'Aria',
    routing: {
      type: 'symbolic',
      patternId: 'greeting_v1',
      patternName: 'Initial Greeting',
      confidence: 1.0,
      estimatedCost: 0.001,
      latencyMs: 12,
    },
  },
  {
    id: 'msg_initial_2',
    role: 'user',
    content: 'Can you draft an email to schedule a Q4 performance review meeting with my team?',
    status: 'delivered',
    createdAt: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 'msg_initial_3',
    role: 'assistant',
    content: mockResponses.email.content!,
    status: 'delivered',
    createdAt: new Date(Date.now() - 3400000).toISOString(),
    cognateName: 'Aria',
    routing: mockResponses.email.routing,
  },
  {
    id: 'msg_initial_4',
    role: 'user',
    content: 'I need some creative ideas for a marketing campaign for our new product launch',
    status: 'delivered',
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
  {
    id: 'msg_initial_5',
    role: 'assistant',
    content: mockResponses.creative.content!,
    status: 'delivered',
    createdAt: new Date(Date.now() - 2300000).toISOString(),
    cognateName: 'Aria',
    routing: mockResponses.creative.routing,
    citations: mockResponses.creative.citations,
  },
  {
    id: 'msg_initial_6',
    role: 'user',
    content: 'Set up an automation for weekly report generation',
    status: 'delivered',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'msg_initial_7',
    role: 'assistant',
    ...mockResponses.approval,
    status: 'delivered',
    createdAt: new Date(Date.now() - 1100000).toISOString(),
    cognateName: 'Aria',
  } as SymbiosMessage,
];

// Initial suggestions
const initialSuggestions: SymbiosSuggestion[] = [
  { id: 'sug_1', label: 'Check my tasks', action: 'show_tasks', category: 'quick' },
  { id: 'sug_2', label: 'Draft an email', action: 'draft_email', category: 'quick' },
  { id: 'sug_3', label: 'Create automation', action: 'create_automation', category: 'contextual' },
  { id: 'sug_4', label: 'View analytics', action: 'view_analytics', category: 'quick' },
];

// Calculate initial routing stats
const calculateInitialStats = (messages: SymbiosMessage[]): RoutingStats => {
  let symbolic = 0;
  let neural = 0;
  let totalCost = 0;
  let totalLatency = 0;
  let routedCount = 0;

  messages.forEach((msg) => {
    if (msg.routing) {
      if (msg.routing.type === 'symbolic') {
        symbolic++;
      } else {
        neural++;
      }
      totalCost += msg.routing.estimatedCost;
      if (msg.routing.latencyMs) {
        totalLatency += msg.routing.latencyMs;
        routedCount++;
      }
    }
  });

  return {
    symbolic,
    neural,
    totalCost,
    avgLatencyMs: routedCount > 0 ? totalLatency / routedCount : 0,
  };
};

const initialState = {
  isOpen: false,
  isMinimized: false,
  unreadCount: 1,
  messages: initialMessages,
  activeConversationId: 'conv_default',
  isTyping: false,
  isStreaming: false,
  suggestions: initialSuggestions,
  routingStats: calculateInitialStats(initialMessages),
  ariaStatus: 'online' as const,
};

export const useSymbiosStore = create<SymbiosState>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // UI Actions
      toggleOpen: (): void => {
        set((state) => ({
          isOpen: !state.isOpen,
          isMinimized: false,
          unreadCount: state.isOpen ? state.unreadCount : 0,
        }));
      },

      setOpen: (isOpen): void => {
        set({
          isOpen,
          isMinimized: false,
          unreadCount: isOpen ? 0 : get().unreadCount,
        });
      },

      setMinimized: (isMinimized): void => {
        set({ isMinimized });
      },

      clearUnread: (): void => {
        set({ unreadCount: 0 });
      },

      // Message Actions
      sendMessage: (content, attachments): void => {
        const userMessage: SymbiosMessage = {
          id: generateId(),
          role: 'user',
          content,
          status: 'delivered',
          createdAt: new Date().toISOString(),
          attachments,
        };

        set((state) => ({
          messages: [...state.messages, userMessage],
          isTyping: true,
        }));

        // Simulate AI response after a delay
        setTimeout(() => {
          const { addMessage, setTyping, updateRoutingStats, setSuggestions } = get();

          // Determine response type based on content
          let response: Partial<SymbiosMessage>;
          const lowerContent = content.toLowerCase();

          if (lowerContent.includes('email') || lowerContent.includes('draft')) {
            response = mockResponses.email;
          } else if (
            lowerContent.includes('creative') ||
            lowerContent.includes('idea') ||
            lowerContent.includes('marketing')
          ) {
            response = mockResponses.creative;
          } else if (
            lowerContent.includes('automation') ||
            lowerContent.includes('automate') ||
            lowerContent.includes('setup')
          ) {
            response = mockResponses.approval;
          } else {
            // Default response
            response = {
              content: `I understand you're asking about "${content.slice(0, 50)}...". Let me help you with that. Based on your request, I can suggest a few approaches. Would you like me to elaborate on any specific aspect?`,
              routing: {
                type: Math.random() > 0.5 ? 'symbolic' : 'neural',
                patternId: 'general_response_v1',
                patternName: 'General Response Handler',
                confidence: 0.78,
                estimatedCost: Math.random() > 0.5 ? 0.003 : 0.025,
                latencyMs: Math.random() > 0.5 ? 80 : 1500,
              },
            };
          }

          const assistantMessage: SymbiosMessage = {
            id: generateId(),
            role: 'assistant',
            content: response.content!,
            status: 'delivered',
            createdAt: new Date().toISOString(),
            cognateName: 'Aria',
            routing: response.routing,
            citations: response.citations,
            requiresApproval: response.requiresApproval,
            approvalStatus: response.approvalStatus,
          };

          addMessage(assistantMessage);
          setTyping(false);

          if (assistantMessage.routing) {
            updateRoutingStats(assistantMessage.routing);
          }

          // Update suggestions based on context
          const newSuggestions: SymbiosSuggestion[] = [
            { id: 'sug_follow_1', label: 'Tell me more', action: 'elaborate', category: 'follow-up' },
            { id: 'sug_follow_2', label: 'Try something else', action: 'reset', category: 'follow-up' },
            { id: 'sug_follow_3', label: 'Save this', action: 'save', category: 'contextual' },
          ];
          setSuggestions(newSuggestions);
        }, 1500 + Math.random() * 1000);
      },

      addMessage: (message): void => {
        set((state) => ({
          messages: [...state.messages, message],
          unreadCount: state.isOpen ? state.unreadCount : state.unreadCount + 1,
        }));
      },

      updateMessage: (id, updates): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        }));
      },

      deleteMessage: (id): void => {
        set((state) => ({
          messages: state.messages.filter((msg) => msg.id !== id),
        }));
      },

      clearMessages: (): void => {
        set({
          messages: [initialMessages[0]], // Keep the greeting
          routingStats: { symbolic: 1, neural: 0, totalCost: 0.001, avgLatencyMs: 12 },
        });
      },

      // Typing Actions
      setTyping: (isTyping): void => {
        set({ isTyping });
      },

      setStreaming: (isStreaming): void => {
        set({ isStreaming });
      },

      // Suggestion Actions
      setSuggestions: (suggestions): void => {
        set({ suggestions });
      },

      clearSuggestions: (): void => {
        set({ suggestions: [] });
      },

      // Approval Actions
      approveMessage: (id): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, approvalStatus: 'approved' } : msg
          ),
        }));
      },

      rejectMessage: (id): void => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, approvalStatus: 'rejected' } : msg
          ),
        }));
      },

      // Analytics Actions
      updateRoutingStats: (routing): void => {
        set((state) => {
          const newStats = { ...state.routingStats };
          if (routing.type === 'symbolic') {
            newStats.symbolic++;
          } else {
            newStats.neural++;
          }
          newStats.totalCost += routing.estimatedCost;

          const totalRouted = newStats.symbolic + newStats.neural;
          if (routing.latencyMs) {
            newStats.avgLatencyMs =
              (state.routingStats.avgLatencyMs * (totalRouted - 1) + routing.latencyMs) /
              totalRouted;
          }

          return { routingStats: newStats };
        });
      },

      // Computed
      getSymbolicPercentage: (): number => {
        const { routingStats } = get();
        const total = routingStats.symbolic + routingStats.neural;
        return total > 0 ? (routingStats.symbolic / total) * 100 : 0;
      },

      getCostSavings: (): number => {
        const { routingStats } = get();
        // Estimate savings: symbolic costs ~$0.003, neural ~$0.03 average
        const symbolicActualCost = routingStats.symbolic * 0.003;
        const savedFromSymbolic = routingStats.symbolic * 0.03 - symbolicActualCost;
        return savedFromSymbolic;
      },
    }),
    { name: 'SymbiosStore' }
  )
);
