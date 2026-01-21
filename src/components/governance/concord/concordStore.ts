/**
 * Concord Store - Zustand state management for AI-to-AI sessions
 *
 * Manages session setup, participants, live session state, and history.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  SessionTypeId,
  ConcordParticipant,
  SessionConstraints,
  ConcordSession,
  TranscriptTurn,
  SessionDynamics,
  CognateForConcord,
} from './types';
import { CONCORD_COGNATES } from './types';

// ============================================================================
// Mock Session Data
// ============================================================================

const mockTranscript: TranscriptTurn[] = [
  {
    turn: 1,
    speaker: 'cfo-cognate',
    message: "Given the current budget constraints, I propose we allocate 40% to engineering and 30% to marketing, keeping 30% in reserve for unexpected costs.",
    timestamp: '0:15',
    sentiment: 'analytical',
  },
  {
    turn: 2,
    speaker: 'marketing-cognate',
    message: "I appreciate the conservative approach, but 30% for marketing seems insufficient for Q1 campaigns. We're launching three major initiatives.",
    timestamp: '0:45',
    sentiment: 'assertive',
  },
  {
    turn: 3,
    speaker: 'eng-cognate',
    message: "I can work with 40% if we prioritize infrastructure improvements. However, I'd suggest reducing the reserve to 20% - our historical variance has been lower.",
    timestamp: '1:12',
    sentiment: 'constructive',
  },
  {
    turn: 4,
    speaker: 'product-cognate',
    message: "What if we phase the marketing spend? Front-load engineering in Q1, then increase marketing in Q2 once infrastructure is stable?",
    timestamp: '1:45',
    sentiment: 'compromising',
  },
  {
    turn: 5,
    speaker: 'cfo-cognate',
    message: "That's a reasonable phased approach. I could support reducing reserve to 25% if we implement monthly checkpoints.",
    timestamp: '2:20',
    sentiment: 'agreeable',
  },
];

const mockDynamics: SessionDynamics = {
  sessionId: 'session-001',
  consensus: 68,
  participantAlignment: [
    { cognateId: 'cfo-cognate', alignment: 75, trend: 'increasing' },
    { cognateId: 'marketing-cognate', alignment: 55, trend: 'stable' },
    { cognateId: 'eng-cognate', alignment: 80, trend: 'increasing' },
    { cognateId: 'product-cognate', alignment: 72, trend: 'increasing' },
  ],
  emergingConsensus: [
    'Phase engineering investment first',
    'Reduce reserve from 30% to 25%',
    'Implement monthly budget reviews',
  ],
  estimatedTimeRemaining: 480,
  currentTopic: 'Marketing budget allocation',
};

// ============================================================================
// Store State Interface
// ============================================================================

interface ConcordState {
  // Setup state
  sessionType: SessionTypeId;
  topic: string;
  participants: ConcordParticipant[];
  constraints: SessionConstraints;

  // Session state
  currentSession: ConcordSession | null;
  isRunning: boolean;
  elapsedTime: number;
  dynamics: SessionDynamics | null;

  // History
  sessions: ConcordSession[];

  // Available cognates
  availableCognates: CognateForConcord[];

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Setup actions
  setSessionType: (type: SessionTypeId) => void;
  setTopic: (topic: string) => void;
  setConstraints: (constraints: Partial<SessionConstraints>) => void;
  addParticipant: (cognate: CognateForConcord) => void;
  removeParticipant: (cognateId: string) => void;
  updateParticipant: (cognateId: string, updates: Partial<ConcordParticipant>) => void;
  loadTemplate: (templateId: string) => void;
  resetSetup: () => void;

  // Session actions
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => void;
  addTranscriptTurn: (turn: TranscriptTurn) => void;
  updateConsensus: (consensus: number) => void;
  setElapsedTime: (time: number) => void;
  injectHumanInput: (message: string) => void;

  // Query actions
  getParticipantInfo: (cognateId: string) => CognateForConcord | undefined;
}

// ============================================================================
// Default Values
// ============================================================================

const defaultConstraints: SessionConstraints = {
  totalBudget: '',
  consensusRequired: true,
  timeLimit: 15,
};

// ============================================================================
// Store Implementation
// ============================================================================

export const useConcordStore = create<ConcordState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        sessionType: 'strategy',
        topic: '',
        participants: [],
        constraints: { ...defaultConstraints },
        currentSession: null,
        isRunning: false,
        elapsedTime: 0,
        dynamics: null,
        sessions: [],
        availableCognates: CONCORD_COGNATES,
        isLoading: false,
        error: null,

        // Setup actions
        setSessionType: (type) => set({ sessionType: type }),

        setTopic: (topic) => set({ topic }),

        setConstraints: (updates) =>
          set((state) => ({
            constraints: { ...state.constraints, ...updates },
          })),

        addParticipant: (cognate) => {
          const { participants } = get();
          if (participants.find((p) => p.cognateId === cognate.id)) {
            return; // Already added
          }

          set({
            participants: [
              ...participants,
              {
                cognateId: cognate.id,
                name: cognate.name,
                role: cognate.role,
                avatar: cognate.avatar,
                represents: cognate.represents,
                goal: cognate.defaultGoal,
                assertiveness: cognate.personality.assertiveness,
                flexibility: cognate.personality.flexibility,
                expertise: cognate.expertise,
              },
            ],
          });
        },

        removeParticipant: (cognateId) =>
          set((state) => ({
            participants: state.participants.filter((p) => p.cognateId !== cognateId),
          })),

        updateParticipant: (cognateId, updates) =>
          set((state) => ({
            participants: state.participants.map((p) =>
              p.cognateId === cognateId ? { ...p, ...updates } : p
            ),
          })),

        loadTemplate: (templateId) => {
          const { availableCognates } = get();
          // Find template and load it
          const templates = {
            'budget-allocation': {
              type: 'allocation' as SessionTypeId,
              cognateIds: ['cfo-cognate', 'marketing-cognate', 'eng-cognate'],
              constraints: { consensusRequired: true, timeLimit: 15 },
            },
            'product-strategy': {
              type: 'strategy' as SessionTypeId,
              cognateIds: ['product-cognate', 'eng-cognate', 'marketing-cognate'],
              constraints: { consensusRequired: false, timeLimit: 20 },
            },
          };

          const template = templates[templateId as keyof typeof templates];
          if (!template) return;

          const participants = template.cognateIds
            .map((id) => availableCognates.find((c) => c.id === id))
            .filter(Boolean)
            .map((c) => ({
              cognateId: c!.id,
              name: c!.name,
              role: c!.role,
              avatar: c!.avatar,
              represents: c!.represents,
              goal: c!.defaultGoal,
              assertiveness: c!.personality.assertiveness,
              flexibility: c!.personality.flexibility,
              expertise: c!.expertise,
            }));

          set({
            sessionType: template.type,
            participants,
            constraints: { ...get().constraints, ...template.constraints },
          });
        },

        resetSetup: () =>
          set({
            sessionType: 'strategy',
            topic: '',
            participants: [],
            constraints: { ...defaultConstraints },
          }),

        // Session actions
        startSession: () => {
          const { sessionType, topic, participants, constraints, sessions } = get();

          const newSession: ConcordSession = {
            id: `session-${Date.now()}`,
            topic,
            type: sessionType,
            status: 'running',
            participants,
            constraints,
            transcript: mockTranscript, // Start with mock for demo
            consensus: 45,
            createdAt: new Date(),
            startedAt: new Date(),
          };

          set({
            currentSession: newSession,
            isRunning: true,
            elapsedTime: 0,
            dynamics: mockDynamics,
            sessions: [newSession, ...sessions],
          });
        },

        pauseSession: () =>
          set((state) => ({
            isRunning: false,
            currentSession: state.currentSession
              ? { ...state.currentSession, status: 'paused' }
              : null,
          })),

        resumeSession: () =>
          set((state) => ({
            isRunning: true,
            currentSession: state.currentSession
              ? { ...state.currentSession, status: 'running' }
              : null,
          })),

        endSession: () =>
          set((state) => ({
            isRunning: false,
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  status: 'completed',
                  completedAt: new Date(),
                }
              : null,
          })),

        addTranscriptTurn: (turn) =>
          set((state) => ({
            currentSession: state.currentSession
              ? {
                  ...state.currentSession,
                  transcript: [...state.currentSession.transcript, turn],
                }
              : null,
          })),

        updateConsensus: (consensus) =>
          set((state) => ({
            currentSession: state.currentSession
              ? { ...state.currentSession, consensus }
              : null,
            dynamics: state.dynamics ? { ...state.dynamics, consensus } : null,
          })),

        setElapsedTime: (time) => set({ elapsedTime: time }),

        injectHumanInput: (message) => {
          const { currentSession } = get();
          if (!currentSession) return;

          const turn: TranscriptTurn = {
            turn: currentSession.transcript.length + 1,
            speaker: 'human',
            message,
            timestamp: `${Math.floor(get().elapsedTime / 60)}:${String(
              get().elapsedTime % 60
            ).padStart(2, '0')}`,
            sentiment: 'neutral',
          };

          get().addTranscriptTurn(turn);
        },

        // Query actions
        getParticipantInfo: (cognateId) => {
          return get().availableCognates.find((c) => c.id === cognateId);
        },
      }),
      {
        name: 'concord-store',
        partialize: (state) => ({
          sessions: state.sessions.slice(0, 10), // Keep last 10 sessions
        }),
      }
    ),
    { name: 'ConcordStore' }
  )
);
