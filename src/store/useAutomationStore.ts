/**
 * Automation Store - Zustand state management for LUX Builder
 *
 * Handles automation nodes, edges, undo/redo history, and persistence.
 *
 * Terminology:
 * - Automation = Visual flow/process (NOT "workflow")
 * - Node = Step in the automation
 * - Edge = Connection between nodes
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Node, Edge } from 'reactflow';
import type { HistorySnapshot } from '@/types';

// Automation type (replaces Workflow)
export interface Automation {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  status: 'draft' | 'published' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

interface AutomationState {
  // Automation data
  nodes: Node[];
  edges: Edge[];
  automationName: string;
  automationId: string | null;
  automationStatus: 'draft' | 'published' | 'archived';

  // State flags
  isDirty: boolean;
  isExecuting: boolean;
  isSaving: boolean;

  // History for undo/redo
  undoStack: HistorySnapshot[];
  redoStack: HistorySnapshot[];

  // Actions - Node/Edge management
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void;
  addEdge: (edge: Edge) => void;
  removeEdge: (edgeId: string) => void;

  // Actions - Automation metadata
  setAutomationName: (name: string) => void;
  setAutomationId: (id: string | null) => void;
  setAutomationStatus: (status: 'draft' | 'published' | 'archived') => void;

  // Actions - History
  saveSnapshot: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;

  // Actions - Persistence
  loadAutomation: (automation: Automation) => void;
  reset: () => void;
  markClean: () => void;
  markDirty: () => void;

  // Actions - Execution
  setExecuting: (isExecuting: boolean) => void;
  setSaving: (isSaving: boolean) => void;

  // Computed
  getAutomation: () => Automation;

  // === DEPRECATED: Backwards-compatible aliases ===
  // These will be removed in a future version
  /** @deprecated Use automationName instead */
  workflowName: string;
  /** @deprecated Use automationId instead */
  workflowId: string | null;
  /** @deprecated Use automationStatus instead */
  workflowStatus: 'draft' | 'published' | 'archived';
  /** @deprecated Use setAutomationName instead */
  setWorkflowName: (name: string) => void;
  /** @deprecated Use setAutomationId instead */
  setWorkflowId: (id: string | null) => void;
  /** @deprecated Use loadAutomation instead */
  loadWorkflow: (workflow: Automation) => void;
}

const MAX_HISTORY_SIZE = 50;

const initialState = {
  nodes: [] as Node[],
  edges: [] as Edge[],
  automationName: 'Untitled Automation',
  automationId: null as string | null,
  automationStatus: 'draft' as const,
  isDirty: false,
  isExecuting: false,
  isSaving: false,
  undoStack: [] as HistorySnapshot[],
  redoStack: [] as HistorySnapshot[],
  // Deprecated aliases (will be computed getters in the store)
  workflowName: 'Untitled Automation',
  workflowId: null as string | null,
  workflowStatus: 'draft' as const,
};

export const useAutomationStore = create<AutomationState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        ...initialState,

        // Node/Edge management
        setNodes: (nodes) => {
          const state = get();
          if (JSON.stringify(state.nodes) !== JSON.stringify(nodes)) {
            state.saveSnapshot();
            set({ nodes, isDirty: true, redoStack: [] });
          }
        },

        setEdges: (edges) => {
          const state = get();
          if (JSON.stringify(state.edges) !== JSON.stringify(edges)) {
            state.saveSnapshot();
            set({ edges, isDirty: true, redoStack: [] });
          }
        },

        addNode: (node) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: [...state.nodes, node],
            isDirty: true,
            redoStack: [],
          });
        },

        removeNode: (nodeId) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: state.nodes.filter((n) => n.id !== nodeId),
            edges: state.edges.filter(
              (e) => e.source !== nodeId && e.target !== nodeId
            ),
            isDirty: true,
            redoStack: [],
          });
        },

        updateNodeData: (nodeId, data) => {
          const state = get();
          state.saveSnapshot();
          set({
            nodes: state.nodes.map((node) =>
              node.id === nodeId
                ? { ...node, data: { ...node.data, ...data } }
                : node
            ),
            isDirty: true,
            redoStack: [],
          });
        },

        addEdge: (edge) => {
          const state = get();
          state.saveSnapshot();
          set({
            edges: [...state.edges, edge],
            isDirty: true,
            redoStack: [],
          });
        },

        removeEdge: (edgeId) => {
          const state = get();
          state.saveSnapshot();
          set({
            edges: state.edges.filter((e) => e.id !== edgeId),
            isDirty: true,
            redoStack: [],
          });
        },

        // Automation metadata
        setAutomationName: (automationName) => {
          set({ automationName, isDirty: true });
        },

        setAutomationId: (automationId) => {
          set({ automationId });
        },

        setAutomationStatus: (automationStatus) => {
          set({ automationStatus, isDirty: true });
        },

        // History management
        saveSnapshot: () => {
          const { nodes, edges, undoStack } = get();
          const snapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };
          set({
            undoStack: [...undoStack.slice(-(MAX_HISTORY_SIZE - 1)), snapshot],
          });
        },

        undo: () => {
          const { undoStack, nodes, edges, redoStack } = get();
          if (undoStack.length === 0) return;

          const previous = undoStack[undoStack.length - 1];
          const currentSnapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };

          set({
            nodes: previous.nodes,
            edges: previous.edges,
            undoStack: undoStack.slice(0, -1),
            redoStack: [...redoStack, currentSnapshot],
            isDirty: true,
          });
        },

        redo: () => {
          const { redoStack, nodes, edges, undoStack } = get();
          if (redoStack.length === 0) return;

          const next = redoStack[redoStack.length - 1];
          const currentSnapshot: HistorySnapshot = {
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            timestamp: Date.now(),
          };

          set({
            nodes: next.nodes,
            edges: next.edges,
            redoStack: redoStack.slice(0, -1),
            undoStack: [...undoStack, currentSnapshot],
            isDirty: true,
          });
        },

        canUndo: () => get().undoStack.length > 0,
        canRedo: () => get().redoStack.length > 0,

        clearHistory: () => {
          set({ undoStack: [], redoStack: [] });
        },

        // Persistence
        loadAutomation: (automation) => {
          set({
            nodes: automation.nodes,
            edges: automation.edges,
            automationName: automation.name,
            automationId: automation.id,
            automationStatus: automation.status,
            isDirty: false,
            undoStack: [],
            redoStack: [],
          });
        },

        reset: () => {
          set(initialState);
        },

        markClean: () => {
          set({ isDirty: false });
        },

        markDirty: () => {
          set({ isDirty: true });
        },

        // Execution state
        setExecuting: (isExecuting) => {
          set({ isExecuting });
        },

        setSaving: (isSaving) => {
          set({ isSaving });
        },

        // Computed
        getAutomation: () => {
          const { nodes, edges, automationName, automationId, automationStatus } = get();
          return {
            id: automationId || `automation-${Date.now()}`,
            name: automationName,
            nodes,
            edges,
            status: automationStatus,
          };
        },

        // === DEPRECATED: Backwards-compatible aliases ===
        // Computed getters that mirror the new names
        get workflowName() {
          return get().automationName;
        },
        get workflowId() {
          return get().automationId;
        },
        get workflowStatus() {
          return get().automationStatus;
        },
        setWorkflowName: (name: string) => {
          set({ automationName: name, isDirty: true });
        },
        setWorkflowId: (id: string | null) => {
          set({ automationId: id });
        },
        loadWorkflow: (workflow: Automation) => {
          set({
            nodes: workflow.nodes,
            edges: workflow.edges,
            automationName: workflow.name,
            automationId: workflow.id,
            automationStatus: workflow.status,
            isDirty: false,
            undoStack: [],
            redoStack: [],
          });
        },
      }),
      {
        name: 'symtex-automation-store',
        partialize: (state) => ({
          // Only persist automation data, not UI state
          nodes: state.nodes,
          edges: state.edges,
          automationName: state.automationName,
          automationId: state.automationId,
        }),
      }
    ),
    { name: 'AutomationStore' }
  )
);

// Note: Automation interface is exported directly above via 'export interface'
