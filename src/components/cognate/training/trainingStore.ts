/**
 * Training Store - Zustand state management for Shadow Mode Training
 *
 * Manages boot camp progress, personality configuration, style library,
 * and training session state.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  BootCampWeek,
  CommunicationStyle,
  StyleFilters,
  TrainingPersonalityValues,
  TrainingStats,
  TrainingSkill,
  ExtendedTrainingSession,
  TrainingCognate,
  TrainingMethod,
} from './types';
import { BOOT_CAMP_WEEKS, TRAINING_PERSONALITY_TRAITS } from './types';

// =============================================================================
// Mock Data
// =============================================================================

const mockStyles: CommunicationStyle[] = [
  {
    id: 'style-001',
    name: 'Professional Formal',
    category: 'communication',
    description: 'Corporate-appropriate language with formal structure and tone',
    adoptionRate: 94,
    examples: 'Dear valued client, I am pleased to inform you...',
    tags: ['Corporate', 'Email', 'B2B'],
  },
  {
    id: 'style-002',
    name: 'Technical Documentation',
    category: 'technical',
    description: 'Clear, precise technical writing with proper terminology',
    adoptionRate: 87,
    examples: 'The API endpoint accepts JSON payloads with...',
    tags: ['Docs', 'API', 'Engineering'],
  },
  {
    id: 'style-003',
    name: 'Friendly Casual',
    category: 'communication',
    description: 'Warm, approachable tone suitable for customer interactions',
    adoptionRate: 91,
    examples: 'Hey there! Great question - let me help you with that...',
    tags: ['Support', 'Chat', 'B2C'],
  },
  {
    id: 'style-004',
    name: 'Creative Storytelling',
    category: 'creative',
    description: 'Engaging narrative style with vivid descriptions',
    adoptionRate: 78,
    examples: 'Imagine a world where productivity flows effortlessly...',
    tags: ['Marketing', 'Content', 'Brand'],
  },
  {
    id: 'style-005',
    name: 'Executive Summary',
    category: 'business',
    description: 'Concise, data-driven reporting for leadership audiences',
    adoptionRate: 89,
    examples: 'Q4 results exceeded projections by 23%, driven by...',
    tags: ['Reports', 'C-Suite', 'Analytics'],
  },
  {
    id: 'style-006',
    name: 'Code Review',
    category: 'technical',
    description: 'Constructive feedback style for pull request reviews',
    adoptionRate: 82,
    examples: 'Consider extracting this logic into a reusable util...',
    tags: ['Engineering', 'Feedback', 'PR'],
  },
  {
    id: 'style-007',
    name: 'Empathetic Support',
    category: 'support',
    description: 'Understanding and supportive tone for sensitive situations',
    adoptionRate: 95,
    examples: 'I completely understand how frustrating this must be...',
    tags: ['Customer Care', 'Escalation', 'Retention'],
  },
  {
    id: 'style-008',
    name: 'Sales Persuasion',
    category: 'business',
    description: 'Compelling language designed to drive conversions',
    adoptionRate: 76,
    examples: 'Join over 10,000 teams who have transformed their...',
    tags: ['Sales', 'Conversion', 'CTA'],
  },
  {
    id: 'style-009',
    name: 'Technical Troubleshooting',
    category: 'technical',
    description: 'Step-by-step diagnostic and resolution guidance',
    adoptionRate: 88,
    examples: 'First, let us verify your configuration by running...',
    tags: ['Support', 'Debug', 'IT'],
  },
  {
    id: 'style-010',
    name: 'Brand Voice',
    category: 'creative',
    description: 'Consistent brand personality across all communications',
    adoptionRate: 84,
    examples: 'At Symtex, we believe in empowering your Automations...',
    tags: ['Branding', 'Consistency', 'Voice'],
  },
  {
    id: 'style-011',
    name: 'Motivational Leadership',
    category: 'leadership',
    description: 'Inspiring and encouraging communication for team leadership',
    adoptionRate: 81,
    examples: 'I am proud of what we have accomplished together...',
    tags: ['Management', 'Team', 'Motivation'],
  },
  {
    id: 'style-012',
    name: 'Active Listening Response',
    category: 'support',
    description: 'Responses that demonstrate understanding and validation',
    adoptionRate: 92,
    examples: 'I hear what you are saying, and that makes sense...',
    tags: ['Empathy', 'Validation', 'Communication'],
  },
];

const mockCognates: TrainingCognate[] = [
  {
    id: 'cog-001',
    name: 'Sales Assistant',
    avatar: '01',
    shadowProgress: 68,
    currentWeek: 3,
    stats: {
      totalSessions: 24,
      totalHours: 48.5,
      patternsLearned: 156,
      stylesApplied: 12,
      overallProgress: 68,
      currentWeek: 3,
    },
  },
  {
    id: 'cog-002',
    name: 'Support Cognate',
    avatar: '02',
    shadowProgress: 100,
    currentWeek: 6,
    stats: {
      totalSessions: 42,
      totalHours: 84,
      patternsLearned: 312,
      stylesApplied: 28,
      overallProgress: 100,
      currentWeek: 6,
    },
  },
  {
    id: 'cog-003',
    name: 'Research Analyst',
    avatar: '03',
    shadowProgress: 25,
    currentWeek: 2,
    stats: {
      totalSessions: 8,
      totalHours: 16,
      patternsLearned: 45,
      stylesApplied: 4,
      overallProgress: 25,
      currentWeek: 2,
    },
  },
];

// =============================================================================
// Store State Interface
// =============================================================================

interface TrainingState {
  // Data
  cognates: TrainingCognate[];
  selectedCognateId: string | null;
  bootCampWeeks: BootCampWeek[];
  styles: CommunicationStyle[];
  sessions: ExtendedTrainingSession[];
  currentSession: ExtendedTrainingSession | null;

  // Personality
  personality: TrainingPersonalityValues;
  originalPersonality: TrainingPersonalityValues;

  // Session state
  isSessionActive: boolean;

  // Filters
  styleFilters: StyleFilters;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  // Cognate Actions
  selectCognate: (id: string) => void;
  getSelectedCognate: () => TrainingCognate | null;

  // Boot Camp Actions
  updateWeekProgress: (week: number, progress: number) => void;
  completeWeek: (week: number) => void;
  unlockWeek: (week: number) => void;
  getBootCampWeeksForCognate: () => BootCampWeek[];

  // Session Actions
  toggleSession: () => void;
  startSession: (method: TrainingMethod, title: string) => void;
  endSession: () => void;
  updateSessionProgress: (skills: TrainingSkill[]) => void;
  addSession: (session: ExtendedTrainingSession) => void;

  // Personality Actions
  setPersonalityTrait: (traitId: string, value: number) => void;
  savePersonality: () => void;
  resetPersonality: () => void;
  hasPersonalityChanges: () => boolean;

  // Style Actions
  applyStyle: (styleId: string) => void;
  removeStyle: (styleId: string) => void;
  setStyleFilters: (filters: Partial<StyleFilters>) => void;
  resetStyleFilters: () => void;
  getFilteredStyles: () => CommunicationStyle[];

  // Loading Actions
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;

  // Stats
  getTrainingStats: () => TrainingStats | null;
}

// =============================================================================
// Default Values
// =============================================================================

const defaultPersonality = TRAINING_PERSONALITY_TRAITS.reduce(
  (acc, trait) => ({ ...acc, [trait.id]: trait.default }),
  {} as TrainingPersonalityValues
);

const defaultStyleFilters: StyleFilters = {
  search: '',
  category: 'all',
  tags: [],
};

const defaultSession: ExtendedTrainingSession = {
  id: 'session-001',
  cognateId: 'cog-001',
  method: 'shadow_training',
  title: 'Communication Style Calibration',
  startedAt: new Date('2026-01-06T09:30:00Z'),
  completedAt: null,
  durationMs: 127 * 60 * 1000, // 127 minutes
  xpEarned: 0,
  itemsProcessed: 47,
  status: 'in_progress',
  skillsImproved: [],
  skills: [
    { name: 'Tone Matching', progress: 85, target: 95 },
    { name: 'Response Length', progress: 72, target: 90 },
    { name: 'Vocabulary Adoption', progress: 91, target: 95 },
    { name: 'Context Awareness', progress: 68, target: 85 },
  ],
  interactions: 47,
  corrections: 8,
  accuracy: 83,
};

// =============================================================================
// Store Implementation
// =============================================================================

export const useTrainingStore = create<TrainingState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cognates: mockCognates,
        selectedCognateId: 'cog-001',
        bootCampWeeks: BOOT_CAMP_WEEKS.map((week, index) => ({
          ...week,
          status: index < 2 ? 'completed' : index === 2 ? 'current' : 'locked',
          progress: index < 2 ? 100 : index === 2 ? 68 : 0,
        })),
        styles: mockStyles,
        sessions: [],
        currentSession: defaultSession,
        personality: { ...defaultPersonality },
        originalPersonality: { ...defaultPersonality },
        isSessionActive: true,
        styleFilters: defaultStyleFilters,
        isLoading: false,
        isSaving: false,
        error: null,

        // Cognate Actions
        selectCognate: (id) => {
          const cognate = get().cognates.find((c) => c.id === id);
          if (!cognate) return;

          // Update boot camp weeks based on cognate progress
          const weeks = BOOT_CAMP_WEEKS.map((week, index) => ({
            ...week,
            status:
              index + 1 < cognate.currentWeek
                ? 'completed'
                : index + 1 === cognate.currentWeek
                  ? 'current'
                  : 'locked',
            progress:
              index + 1 < cognate.currentWeek
                ? 100
                : index + 1 === cognate.currentWeek
                  ? Math.round((cognate.shadowProgress % (100 / 6)) * 6)
                  : 0,
          })) as BootCampWeek[];

          set({ selectedCognateId: id, bootCampWeeks: weeks });
        },

        getSelectedCognate: () => {
          const { cognates, selectedCognateId } = get();
          return cognates.find((c) => c.id === selectedCognateId) || null;
        },

        // Boot Camp Actions
        updateWeekProgress: (week, progress) => {
          set((state) => ({
            bootCampWeeks: state.bootCampWeeks.map((w) =>
              w.week === week ? { ...w, progress: Math.min(100, Math.max(0, progress)) } : w
            ),
          }));
        },

        completeWeek: (week) => {
          set((state) => ({
            bootCampWeeks: state.bootCampWeeks.map((w) =>
              w.week === week
                ? { ...w, status: 'completed', progress: 100 }
                : w.week === week + 1
                  ? { ...w, status: 'current' }
                  : w
            ),
          }));
        },

        unlockWeek: (week) => {
          set((state) => ({
            bootCampWeeks: state.bootCampWeeks.map((w) =>
              w.week === week ? { ...w, status: 'current' } : w
            ),
          }));
        },

        getBootCampWeeksForCognate: () => {
          return get().bootCampWeeks;
        },

        // Session Actions
        toggleSession: () => {
          const { isSessionActive, currentSession } = get();
          if (currentSession) {
            set({
              isSessionActive: !isSessionActive,
              currentSession: {
                ...currentSession,
                status: isSessionActive ? 'paused' : 'in_progress',
              },
            });
          }
        },

        startSession: (method, title) => {
          const { selectedCognateId, sessions } = get();
          if (!selectedCognateId) return;

          const newSession: ExtendedTrainingSession = {
            id: `session-${Date.now()}`,
            cognateId: selectedCognateId,
            method,
            title,
            startedAt: new Date(),
            completedAt: null,
            durationMs: 0,
            xpEarned: 0,
            itemsProcessed: 0,
            status: 'in_progress',
            skillsImproved: [],
            skills: [],
            interactions: 0,
            corrections: 0,
            accuracy: 0,
          };

          set({
            currentSession: newSession,
            isSessionActive: true,
            sessions: [newSession, ...sessions],
          });
        },

        endSession: () => {
          const { currentSession, sessions } = get();
          if (!currentSession) return;

          const completedSession: ExtendedTrainingSession = {
            ...currentSession,
            completedAt: new Date(),
            status: 'completed',
          };

          set({
            currentSession: null,
            isSessionActive: false,
            sessions: sessions.map((s) =>
              s.id === completedSession.id ? completedSession : s
            ),
          });
        },

        updateSessionProgress: (skills) => {
          const { currentSession } = get();
          if (!currentSession) return;

          set({
            currentSession: {
              ...currentSession,
              skills,
              interactions: currentSession.interactions + 1,
            },
          });
        },

        addSession: (session) => {
          set((state) => ({
            sessions: [session, ...state.sessions],
          }));
        },

        // Personality Actions
        setPersonalityTrait: (traitId, value) => {
          set((state) => ({
            personality: {
              ...state.personality,
              [traitId]: Math.min(100, Math.max(0, value)),
            },
          }));
        },

        savePersonality: () => {
          const { personality } = get();
          set({
            originalPersonality: { ...personality },
            isSaving: false,
          });
        },

        resetPersonality: () => {
          const { originalPersonality } = get();
          set({
            personality: { ...originalPersonality },
          });
        },

        hasPersonalityChanges: () => {
          const { personality, originalPersonality } = get();
          return Object.keys(personality).some(
            (key) => personality[key] !== originalPersonality[key]
          );
        },

        // Style Actions
        applyStyle: (styleId) => {
          set((state) => ({
            styles: state.styles.map((s) =>
              s.id === styleId ? { ...s, isActive: true } : s
            ),
          }));
        },

        removeStyle: (styleId) => {
          set((state) => ({
            styles: state.styles.map((s) =>
              s.id === styleId ? { ...s, isActive: false } : s
            ),
          }));
        },

        setStyleFilters: (filters) => {
          set((state) => ({
            styleFilters: { ...state.styleFilters, ...filters },
          }));
        },

        resetStyleFilters: () => {
          set({ styleFilters: defaultStyleFilters });
        },

        getFilteredStyles: () => {
          const { styles, styleFilters } = get();

          return styles.filter((style) => {
            // Category filter
            if (styleFilters.category !== 'all' && style.category !== styleFilters.category) {
              return false;
            }

            // Search filter
            if (styleFilters.search) {
              const searchLower = styleFilters.search.toLowerCase();
              const matchesSearch =
                style.name.toLowerCase().includes(searchLower) ||
                style.description.toLowerCase().includes(searchLower) ||
                style.tags.some((tag) => tag.toLowerCase().includes(searchLower));
              if (!matchesSearch) return false;
            }

            // Tag filter
            if (styleFilters.tags.length > 0) {
              const hasMatchingTag = styleFilters.tags.some((tag) =>
                style.tags.includes(tag)
              );
              if (!hasMatchingTag) return false;
            }

            return true;
          });
        },

        // Loading Actions
        setLoading: (isLoading) => set({ isLoading }),
        setSaving: (isSaving) => set({ isSaving }),
        setError: (error) => set({ error, isLoading: false }),

        // Stats
        getTrainingStats: () => {
          const cognate = get().getSelectedCognate();
          return cognate?.stats || null;
        },
      }),
      {
        name: 'training-store',
        partialize: (state) => ({
          selectedCognateId: state.selectedCognateId,
          personality: state.personality,
          originalPersonality: state.originalPersonality,
          styleFilters: state.styleFilters,
        }),
      }
    ),
    { name: 'TrainingStore' }
  )
);
