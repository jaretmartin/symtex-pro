import { describe, it, expect, beforeEach } from 'vitest';
import { useCognateStore } from '../useCognateStore';
import type { Cognate } from '@/types';

describe('useCognateStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useCognateStore.getState().reset();
  });

  describe('initial state', () => {
    it('should have cognates in initial state', () => {
      const state = useCognateStore.getState();
      expect(state.cognates).toBeDefined();
      expect(Array.isArray(state.cognates)).toBe(true);
    });

    it('should have mock cognates with correct structure', () => {
      const state = useCognateStore.getState();
      expect(state.cognates.length).toBeGreaterThan(0);

      const cognate = state.cognates[0];
      expect(cognate).toHaveProperty('id');
      expect(cognate).toHaveProperty('name');
      expect(cognate).toHaveProperty('description');
      expect(cognate).toHaveProperty('status');
      expect(cognate).toHaveProperty('createdAt');
      expect(cognate).toHaveProperty('updatedAt');
    });

    it('should have no selected cognate initially', () => {
      const state = useCognateStore.getState();
      expect(state.selectedCognate).toBeNull();
    });

    it('should have SOPs in initial state', () => {
      const state = useCognateStore.getState();
      expect(state.sops).toBeDefined();
      expect(Array.isArray(state.sops)).toBe(true);
    });

    it('should have default SOP filters', () => {
      const state = useCognateStore.getState();
      expect(state.sopFilters).toEqual({
        search: '',
        statuses: [],
        tags: [],
      });
    });

    it('should have grid as default view mode', () => {
      const state = useCognateStore.getState();
      expect(state.viewMode).toBe('grid');
    });
  });

  describe('addCognate action', () => {
    it('should add a new cognate to the list', () => {
      const initialCount = useCognateStore.getState().cognates.length;

      const newCognate: Cognate = {
        id: 'test-cognate-1',
        name: 'Test Cognate',
        description: 'A test cognate for unit testing',
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sopCount: 0,
        activeSOPCount: 0,
        tags: ['test'],
      };

      useCognateStore.getState().addCognate(newCognate);

      const state = useCognateStore.getState();
      expect(state.cognates.length).toBe(initialCount + 1);
      expect(state.cognates.find(c => c.id === 'test-cognate-1')).toEqual(newCognate);
    });

    it('should preserve existing cognates when adding new one', () => {
      const existingCognates = [...useCognateStore.getState().cognates];

      const newCognate: Cognate = {
        id: 'test-cognate-2',
        name: 'Another Test Cognate',
        description: 'Another test cognate',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sopCount: 5,
        activeSOPCount: 3,
        tags: ['test', 'active'],
      };

      useCognateStore.getState().addCognate(newCognate);

      const state = useCognateStore.getState();
      existingCognates.forEach(existing => {
        expect(state.cognates.find(c => c.id === existing.id)).toEqual(existing);
      });
    });
  });

  describe('updateCognate action', () => {
    it('should update an existing cognate', () => {
      const state = useCognateStore.getState();
      const cognateToUpdate = state.cognates[0];
      const originalName = cognateToUpdate.name;

      useCognateStore.getState().updateCognate(cognateToUpdate.id, {
        name: 'Updated Name',
      });

      const updatedState = useCognateStore.getState();
      const updatedCognate = updatedState.cognates.find(c => c.id === cognateToUpdate.id);

      expect(updatedCognate).toBeDefined();
      expect(updatedCognate?.name).toBe('Updated Name');
      expect(updatedCognate?.name).not.toBe(originalName);
    });

    it('should update the updatedAt timestamp', () => {
      const state = useCognateStore.getState();
      const cognateToUpdate = state.cognates[0];
      const originalUpdatedAt = cognateToUpdate.updatedAt;

      // Small delay to ensure timestamp difference
      useCognateStore.getState().updateCognate(cognateToUpdate.id, {
        description: 'New description',
      });

      const updatedState = useCognateStore.getState();
      const updatedCognate = updatedState.cognates.find(c => c.id === cognateToUpdate.id);

      expect(updatedCognate?.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('should not modify other cognates when updating one', () => {
      const state = useCognateStore.getState();
      if (state.cognates.length < 2) return; // Skip if not enough cognates

      const firstCognate = state.cognates[0];
      const secondCognate = state.cognates[1];
      const secondCognateOriginal = { ...secondCognate };

      useCognateStore.getState().updateCognate(firstCognate.id, {
        name: 'Only First Updated',
      });

      const updatedState = useCognateStore.getState();
      const unchangedCognate = updatedState.cognates.find(c => c.id === secondCognate.id);

      expect(unchangedCognate?.name).toBe(secondCognateOriginal.name);
      expect(unchangedCognate?.description).toBe(secondCognateOriginal.description);
    });

    it('should handle partial updates', () => {
      const state = useCognateStore.getState();
      const cognateToUpdate = state.cognates[0];

      useCognateStore.getState().updateCognate(cognateToUpdate.id, {
        status: 'paused',
        tags: ['updated', 'paused'],
      });

      const updatedState = useCognateStore.getState();
      const updatedCognate = updatedState.cognates.find(c => c.id === cognateToUpdate.id);

      expect(updatedCognate?.status).toBe('paused');
      expect(updatedCognate?.tags).toEqual(['updated', 'paused']);
      // Original fields should still exist
      expect(updatedCognate?.id).toBe(cognateToUpdate.id);
      expect(updatedCognate?.sopCount).toBe(cognateToUpdate.sopCount);
    });
  });

  describe('removeCognate action', () => {
    it('should remove a cognate from the list', () => {
      const state = useCognateStore.getState();
      const initialCount = state.cognates.length;
      const cognateToRemove = state.cognates[0];

      useCognateStore.getState().removeCognate(cognateToRemove.id);

      const updatedState = useCognateStore.getState();
      expect(updatedState.cognates.length).toBe(initialCount - 1);
      expect(updatedState.cognates.find(c => c.id === cognateToRemove.id)).toBeUndefined();
    });

    it('should clear selected cognate if removed cognate was selected', () => {
      const state = useCognateStore.getState();
      const cognateToRemove = state.cognates[0];

      useCognateStore.getState().selectCognate(cognateToRemove);
      expect(useCognateStore.getState().selectedCognate?.id).toBe(cognateToRemove.id);

      useCognateStore.getState().removeCognate(cognateToRemove.id);

      expect(useCognateStore.getState().selectedCognate).toBeNull();
    });
  });

  describe('selectCognate action', () => {
    it('should set the selected cognate', () => {
      const state = useCognateStore.getState();
      const cognateToSelect = state.cognates[0];

      useCognateStore.getState().selectCognate(cognateToSelect);

      expect(useCognateStore.getState().selectedCognate).toEqual(cognateToSelect);
    });

    it('should allow clearing the selection', () => {
      const state = useCognateStore.getState();
      const cognateToSelect = state.cognates[0];

      useCognateStore.getState().selectCognate(cognateToSelect);
      useCognateStore.getState().selectCognate(null);

      expect(useCognateStore.getState().selectedCognate).toBeNull();
    });
  });

  describe('setCognateStatus action', () => {
    it('should update cognate status', () => {
      const state = useCognateStore.getState();
      const cognate = state.cognates[0];

      useCognateStore.getState().setCognateStatus(cognate.id, 'paused');

      const updatedCognate = useCognateStore.getState().cognates.find(c => c.id === cognate.id);
      expect(updatedCognate?.status).toBe('paused');
    });
  });

  describe('reset action', () => {
    it('should reset store to initial state', () => {
      // Make some changes
      const newCognate: Cognate = {
        id: 'to-be-reset',
        name: 'Will Be Reset',
        description: 'This cognate will be removed on reset',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sopCount: 0,
        activeSOPCount: 0,
        tags: [],
      };

      useCognateStore.getState().addCognate(newCognate);
      useCognateStore.getState().selectCognate(newCognate);
      useCognateStore.getState().setViewMode('list');

      // Reset
      useCognateStore.getState().reset();

      const state = useCognateStore.getState();
      expect(state.selectedCognate).toBeNull();
      expect(state.viewMode).toBe('grid');
      expect(state.cognates.find(c => c.id === 'to-be-reset')).toBeUndefined();
    });
  });
});
