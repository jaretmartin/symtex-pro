/**
 * DNA Store - Personal and Work DNA strand state management
 *
 * Manages DNA profiles, strands, corrections, and learning for Cognates.
 * DNA represents learned preferences and patterns that help Cognates
 * understand and adapt to user behavior.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// Types for DNA system
export interface DNAStrand {
  id: string;
  name: string;
  category: 'personal' | 'work';
  strength: number; // 0-100
  description: string;
  lastUpdated: Date;
  dataPoints: number;
  confidence: number; // 0-100, how confident the system is in this strand
  preferences: Record<string, unknown>;
}

export interface PersonalDNA {
  communicationStyle: DNAStrand;
  workPatterns: DNAStrand;
  decisionMaking: DNAStrand;
  learningStyle: DNAStrand;
  priorities: DNAStrand;
}

export interface WorkDNA {
  industry: DNAStrand;
  roleContext: DNAStrand;
  toolPreferences: DNAStrand;
  qualityStandards: DNAStrand;
  collaborationStyle: DNAStrand;
}

export interface DNAProfile {
  userId: string;
  personal: PersonalDNA;
  work: WorkDNA;
  overallStrength: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DNACorrection {
  id: string;
  strandId: string;
  correctionType: 'positive' | 'negative' | 'neutral';
  weight: number;
  reason?: string;
  createdAt: Date;
}

export interface DNAInsight {
  id: string;
  strandId: string;
  insight: string;
  confidence: number;
  discoveredAt: Date;
}

// Helper to create default strand
const createDefaultStrand = (
  id: string,
  name: string,
  category: 'personal' | 'work',
  description: string
): DNAStrand => ({
  id,
  name,
  category,
  strength: 50,
  description,
  lastUpdated: new Date(),
  dataPoints: 0,
  confidence: 0,
  preferences: {},
});

// Default personal DNA strands (5 personal)
const createDefaultPersonalDNA = (): PersonalDNA => ({
  communicationStyle: createDefaultStrand(
    'comm-style',
    'Communication Style',
    'personal',
    'How you prefer to communicate - formal vs casual, verbose vs concise'
  ),
  workPatterns: createDefaultStrand(
    'work-patterns',
    'Work Patterns',
    'personal',
    'Your work habits, peak productivity times, and focus preferences'
  ),
  decisionMaking: createDefaultStrand(
    'decisions',
    'Decision Making',
    'personal',
    'How you approach decisions - data-driven vs intuitive, fast vs deliberate'
  ),
  learningStyle: createDefaultStrand(
    'learning',
    'Learning Style',
    'personal',
    'How you learn best - visual, hands-on, reading, or discussion'
  ),
  priorities: createDefaultStrand(
    'priorities',
    'Priorities',
    'personal',
    'What you prioritize in work and life - speed, quality, innovation, stability'
  ),
});

// Default work DNA strands (5 work)
const createDefaultWorkDNA = (): WorkDNA => ({
  industry: createDefaultStrand(
    'industry',
    'Industry Knowledge',
    'work',
    'Industry-specific terminology, regulations, and best practices'
  ),
  roleContext: createDefaultStrand(
    'role',
    'Role Context',
    'work',
    'Your role-specific responsibilities, authority level, and expectations'
  ),
  toolPreferences: createDefaultStrand(
    'tools',
    'Tool Preferences',
    'work',
    'Preferred tools, platforms, and technology stack'
  ),
  qualityStandards: createDefaultStrand(
    'quality',
    'Quality Standards',
    'work',
    'Your quality expectations, review processes, and acceptance criteria'
  ),
  collaborationStyle: createDefaultStrand(
    'collab',
    'Collaboration Style',
    'work',
    'How you collaborate - async vs sync, documentation preferences, meeting style'
  ),
});

// Helper to generate unique IDs
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface DNAState {
  // State
  profile: DNAProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  pendingCorrections: DNACorrection[];
  insights: DNAInsight[];

  // Actions
  initializeDNA: (userId: string) => void;
  applyCorrection: (correction: Omit<DNACorrection, 'id' | 'createdAt'>) => void;
  processDiscoveryResponse: (questionId: string, response: unknown) => void;
  recalculateStrength: () => void;
  getStrandById: (strandId: string) => DNAStrand | undefined;
  updateStrand: (strandId: string, updates: Partial<DNAStrand>) => void;
  getOverallStrength: () => number;
  getPendingCorrections: () => DNACorrection[];
  clearPendingCorrections: () => void;
  addInsight: (insight: Omit<DNAInsight, 'id' | 'discoveredAt'>) => void;
  getInsightsForStrand: (strandId: string) => DNAInsight[];

  // Strand learning
  recordStrandInteraction: (strandId: string, positive: boolean) => void;
  getStrandConfidence: (strandId: string) => number;
  getAllStrands: () => DNAStrand[];

  // Reset
  reset: () => void;
}

const initialState = {
  profile: null as DNAProfile | null,
  isLoading: false,
  isInitialized: false,
  pendingCorrections: [] as DNACorrection[],
  insights: [] as DNAInsight[],
};

export const useDNAStore = create<DNAState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // Reset
        reset: () => set(initialState),

        // Actions
        initializeDNA: (userId) => {
          const profile: DNAProfile = {
            userId,
            personal: createDefaultPersonalDNA(),
            work: createDefaultWorkDNA(),
            overallStrength: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          set({ profile, isInitialized: true });
        },

        applyCorrection: (correction) => {
          const newCorrection: DNACorrection = {
            ...correction,
            id: generateId(),
            createdAt: new Date(),
          };

          set((state) => {
            if (!state.profile) return state;

            // Find and update the strand
            const { personal, work } = state.profile;
            const updatedPersonal = { ...personal };
            const updatedWork = { ...work };

            // Check personal strands
            for (const key of Object.keys(personal) as (keyof PersonalDNA)[]) {
              if (personal[key].id === correction.strandId) {
                const strand = personal[key];
                const adjustment =
                  correction.correctionType === 'positive'
                    ? correction.weight * 5
                    : correction.correctionType === 'negative'
                      ? -correction.weight * 5
                      : 0;
                updatedPersonal[key] = {
                  ...strand,
                  strength: Math.max(0, Math.min(100, strand.strength + adjustment)),
                  dataPoints: strand.dataPoints + 1,
                  confidence: Math.min(100, strand.confidence + 2), // Increase confidence with each data point
                  lastUpdated: new Date(),
                };
              }
            }

            // Check work strands
            for (const key of Object.keys(work) as (keyof WorkDNA)[]) {
              if (work[key].id === correction.strandId) {
                const strand = work[key];
                const adjustment =
                  correction.correctionType === 'positive'
                    ? correction.weight * 5
                    : correction.correctionType === 'negative'
                      ? -correction.weight * 5
                      : 0;
                updatedWork[key] = {
                  ...strand,
                  strength: Math.max(0, Math.min(100, strand.strength + adjustment)),
                  dataPoints: strand.dataPoints + 1,
                  confidence: Math.min(100, strand.confidence + 2),
                  lastUpdated: new Date(),
                };
              }
            }

            return {
              profile: {
                ...state.profile,
                personal: updatedPersonal,
                work: updatedWork,
                updatedAt: new Date(),
              },
              pendingCorrections: [...state.pendingCorrections, newCorrection],
            };
          });

          // Recalculate after correction
          get().recalculateStrength();
        },

        processDiscoveryResponse: (_questionId, _response) => {
          // This would map question responses to strand updates
          // Implementation depends on discovery question structure
          // Processing discovery response: questionId, response
        },

        recalculateStrength: () => {
          set((state) => {
            if (!state.profile) return state;

            const { personal, work } = state.profile;
            const allStrands = [...Object.values(personal), ...Object.values(work)];

            const totalStrength = allStrands.reduce(
              (sum, strand) => sum + strand.strength,
              0
            );
            const overallStrength = Math.round(totalStrength / allStrands.length);

            return {
              profile: {
                ...state.profile,
                overallStrength,
                updatedAt: new Date(),
              },
            };
          });
        },

        getStrandById: (strandId) => {
          const { profile } = get();
          if (!profile) return undefined;

          // Check personal strands
          for (const strand of Object.values(profile.personal)) {
            if (strand.id === strandId) return strand;
          }

          // Check work strands
          for (const strand of Object.values(profile.work)) {
            if (strand.id === strandId) return strand;
          }

          return undefined;
        },

        updateStrand: (strandId, updates) => {
          set((state) => {
            if (!state.profile) return state;

            const { personal, work } = state.profile;
            const updatedPersonal = { ...personal };
            const updatedWork = { ...work };

            for (const key of Object.keys(personal) as (keyof PersonalDNA)[]) {
              if (personal[key].id === strandId) {
                updatedPersonal[key] = {
                  ...personal[key],
                  ...updates,
                  lastUpdated: new Date(),
                };
              }
            }

            for (const key of Object.keys(work) as (keyof WorkDNA)[]) {
              if (work[key].id === strandId) {
                updatedWork[key] = {
                  ...work[key],
                  ...updates,
                  lastUpdated: new Date(),
                };
              }
            }

            return {
              profile: {
                ...state.profile,
                personal: updatedPersonal,
                work: updatedWork,
                updatedAt: new Date(),
              },
            };
          });
        },

        getOverallStrength: () => {
          const { profile } = get();
          return profile?.overallStrength ?? 0;
        },

        getPendingCorrections: () => get().pendingCorrections,

        clearPendingCorrections: () => set({ pendingCorrections: [] }),

        addInsight: (insight) => {
          const newInsight: DNAInsight = {
            ...insight,
            id: generateId(),
            discoveredAt: new Date(),
          };
          set((state) => ({
            insights: [...state.insights, newInsight],
          }));
        },

        getInsightsForStrand: (strandId) => {
          return get().insights.filter((i) => i.strandId === strandId);
        },

        recordStrandInteraction: (strandId, positive) => {
          const correction: Omit<DNACorrection, 'id' | 'createdAt'> = {
            strandId,
            correctionType: positive ? 'positive' : 'negative',
            weight: 1,
            reason: 'Automatic learning from interaction',
          };
          get().applyCorrection(correction);
        },

        getStrandConfidence: (strandId) => {
          const strand = get().getStrandById(strandId);
          return strand?.confidence ?? 0;
        },

        getAllStrands: () => {
          const { profile } = get();
          if (!profile) return [];
          return [
            ...Object.values(profile.personal),
            ...Object.values(profile.work),
          ];
        },
      }),
      {
        name: 'symtex-dna-store',
        partialize: (state) => ({
          profile: state.profile,
          insights: state.insights,
          isInitialized: state.isInitialized,
        }),
      }
    ),
    { name: 'DNAStore' }
  )
);
