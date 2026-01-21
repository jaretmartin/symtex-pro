/**
 * DNA Store - Zustand state management for DNA System
 *
 * Manages DNA strands (personal + work) with strength, confidence, and data points.
 * 10 strands total: 5 personal + 5 work.
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// DNA strand categories
export type DNACategory = 'personal' | 'work';

// Strand interface with full metadata
export interface DNAStrandData {
  id: string;
  name: string;
  category: DNACategory;
  strength: number; // 0-100
  confidence: number; // 0-100 (how certain we are about the data)
  dataPoints: number; // Number of data points collected
  description: string;
  color: string;
  icon: string;
  lastUpdated: string;
  insights?: string[];
  recommendations?: string[];
}

// Overall DNA profile
export interface DNAProfile {
  overallStrength: number;
  overallConfidence: number;
  lastAnalysis: string;
  totalDataPoints: number;
}

interface DNAState {
  // Data
  strands: DNAStrandData[];
  profile: DNAProfile;

  // UI State
  selectedStrandId: string | null;
  isAnalyzing: boolean;
  showHelixAnimation: boolean;

  // Actions
  setStrands: (strands: DNAStrandData[]) => void;
  updateStrand: (id: string, updates: Partial<DNAStrandData>) => void;
  selectStrand: (id: string | null) => void;
  setAnalyzing: (analyzing: boolean) => void;
  toggleHelixAnimation: () => void;
  refreshAnalysis: () => Promise<void>;

  // Computed
  getStrandsByCategory: (category: DNACategory) => DNAStrandData[];
  getWeakStrands: () => DNAStrandData[];
  getStrongStrands: () => DNAStrandData[];
}

// Initial DNA strands data
const initialStrands: DNAStrandData[] = [
  // Personal strands (5)
  {
    id: 'communication',
    name: 'Communication',
    category: 'personal',
    strength: 78,
    confidence: 92,
    dataPoints: 347,
    description: 'How you prefer to communicate and receive information',
    color: '#3b82f6',
    icon: 'MessageSquare',
    lastUpdated: '2 hours ago',
    insights: ['Prefers concise bullet points', 'Responds well to visual aids'],
    recommendations: ['Try more structured formats for complex topics'],
  },
  {
    id: 'work-patterns',
    name: 'Work Patterns',
    category: 'personal',
    strength: 85,
    confidence: 88,
    dataPoints: 523,
    description: 'Your productivity rhythms and work habits',
    color: '#8b5cf6',
    icon: 'Clock',
    lastUpdated: '1 day ago',
    insights: ['Peak productivity: 9-11 AM', 'Prefers deep work blocks'],
    recommendations: ['Schedule complex tasks in morning slots'],
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    category: 'personal',
    strength: 72,
    confidence: 75,
    dataPoints: 156,
    description: 'How you approach decisions and evaluate options',
    color: '#22c55e',
    icon: 'Scale',
    lastUpdated: '3 days ago',
    insights: ['Data-driven approach', 'Seeks multiple perspectives'],
    recommendations: ['Consider adding more intuition-based checkpoints'],
  },
  {
    id: 'learning-style',
    name: 'Learning Style',
    category: 'personal',
    strength: 68,
    confidence: 82,
    dataPoints: 234,
    description: 'How you best absorb and retain new information',
    color: '#f59e0b',
    icon: 'BookOpen',
    lastUpdated: '5 days ago',
    insights: ['Visual learner', 'Prefers hands-on examples'],
    recommendations: ['Request more diagrams and code samples'],
  },
  {
    id: 'priorities',
    name: 'Priorities',
    category: 'personal',
    strength: 81,
    confidence: 90,
    dataPoints: 412,
    description: 'What matters most to you in work and life',
    color: '#ef4444',
    icon: 'Star',
    lastUpdated: '12 hours ago',
    insights: ['Values efficiency highly', 'Quality over speed'],
    recommendations: ['Balance perfectionism with pragmatism'],
  },
  // Work strands (5)
  {
    id: 'industry-knowledge',
    name: 'Industry Knowledge',
    category: 'work',
    strength: 74,
    confidence: 85,
    dataPoints: 289,
    description: 'Your domain expertise and industry context',
    color: '#06b6d4',
    icon: 'Building',
    lastUpdated: '4 hours ago',
    insights: ['Strong in SaaS', 'Growing fintech expertise'],
    recommendations: ['Add more competitor analysis data'],
  },
  {
    id: 'role-context',
    name: 'Role Context',
    category: 'work',
    strength: 89,
    confidence: 94,
    dataPoints: 567,
    description: 'Understanding of your role and responsibilities',
    color: '#ec4899',
    icon: 'User',
    lastUpdated: '1 hour ago',
    insights: ['Technical leadership focus', 'Cross-functional collaboration'],
    recommendations: ['Document more stakeholder interactions'],
  },
  {
    id: 'tool-preferences',
    name: 'Tool Preferences',
    category: 'work',
    strength: 91,
    confidence: 96,
    dataPoints: 823,
    description: 'Your preferred tools and technologies',
    color: '#a855f7',
    icon: 'Wrench',
    lastUpdated: '30 minutes ago',
    insights: ['VS Code power user', 'Prefers CLI over GUI'],
    recommendations: ['Explore new AI coding assistants'],
  },
  {
    id: 'quality-standards',
    name: 'Quality Standards',
    category: 'work',
    strength: 83,
    confidence: 87,
    dataPoints: 345,
    description: 'Your expectations for work quality and output',
    color: '#14b8a6',
    icon: 'CheckCircle',
    lastUpdated: '2 days ago',
    insights: ['High code review standards', 'Values documentation'],
    recommendations: ['Define more explicit quality metrics'],
  },
  {
    id: 'collaboration-style',
    name: 'Collaboration Style',
    category: 'work',
    strength: 76,
    confidence: 79,
    dataPoints: 198,
    description: 'How you work with others and contribute to teams',
    color: '#f97316',
    icon: 'Users',
    lastUpdated: '1 week ago',
    insights: ['Async-first preference', 'Clear documentation advocate'],
    recommendations: ['Try more pair programming sessions'],
  },
];

// Calculate profile from strands
function calculateProfile(strands: DNAStrandData[]): DNAProfile {
  const avgStrength = strands.reduce((acc, s) => acc + s.strength, 0) / strands.length;
  const avgConfidence = strands.reduce((acc, s) => acc + s.confidence, 0) / strands.length;
  const totalDataPoints = strands.reduce((acc, s) => acc + s.dataPoints, 0);

  return {
    overallStrength: Math.round(avgStrength),
    overallConfidence: Math.round(avgConfidence),
    lastAnalysis: new Date().toISOString(),
    totalDataPoints,
  };
}

export const useDNAStore = create<DNAState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        strands: initialStrands,
        profile: calculateProfile(initialStrands),
        selectedStrandId: null,
        isAnalyzing: false,
        showHelixAnimation: true,

        // Actions
        setStrands: (strands) =>
          set({
            strands,
            profile: calculateProfile(strands),
          }),

        updateStrand: (id, updates) =>
          set((state) => {
            const newStrands = state.strands.map((s) =>
              s.id === id ? { ...s, ...updates, lastUpdated: 'Just now' } : s
            );
            return {
              strands: newStrands,
              profile: calculateProfile(newStrands),
            };
          }),

        selectStrand: (id) => set({ selectedStrandId: id }),

        setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),

        toggleHelixAnimation: () =>
          set((state) => ({ showHelixAnimation: !state.showHelixAnimation })),

        refreshAnalysis: async () => {
          set({ isAnalyzing: true });
          // Simulate analysis delay
          await new Promise((resolve) => setTimeout(resolve, 2000));
          // Slightly randomize values to simulate new analysis
          set((state) => {
            const newStrands = state.strands.map((s) => ({
              ...s,
              strength: Math.max(0, Math.min(100, s.strength + (Math.random() - 0.5) * 10)),
              confidence: Math.max(0, Math.min(100, s.confidence + (Math.random() - 0.5) * 5)),
              dataPoints: s.dataPoints + Math.floor(Math.random() * 10),
              lastUpdated: 'Just now',
            }));
            return {
              strands: newStrands,
              profile: calculateProfile(newStrands),
              isAnalyzing: false,
            };
          });
        },

        // Computed
        getStrandsByCategory: (category) => {
          const { strands } = get();
          return strands.filter((s) => s.category === category);
        },

        getWeakStrands: () => {
          const { strands } = get();
          return strands.filter((s) => s.strength < 70).sort((a, b) => a.strength - b.strength);
        },

        getStrongStrands: () => {
          const { strands } = get();
          return strands.filter((s) => s.strength >= 80).sort((a, b) => b.strength - a.strength);
        },
      }),
      {
        name: 'symtex-dna',
        partialize: (state) => ({
          strands: state.strands,
          profile: state.profile,
        }),
      }
    ),
    { name: 'DNAStore' }
  )
);
