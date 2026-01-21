import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  const TEST_KEY = 'test-key';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('initialization', () => {
    it('should return initial value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'default')
      );

      const [value] = result.current;
      expect(value).toBe('default');
    });

    it('should return stored value when localStorage has data', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify('stored'));

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'default')
      );

      const [value] = result.current;
      expect(value).toBe('stored');
    });

    it('should handle complex objects', () => {
      const complexObject = {
        name: 'test',
        count: 42,
        nested: { enabled: true },
      };
      localStorage.setItem(TEST_KEY, JSON.stringify(complexObject));

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, { name: '', count: 0, nested: { enabled: false } })
      );

      const [value] = result.current;
      expect(value).toEqual(complexObject);
    });

    it('should return initial value for invalid JSON', () => {
      localStorage.setItem(TEST_KEY, 'not-valid-json');
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'default')
      );

      const [value] = result.current;
      expect(value).toBe('default');
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('setValue', () => {
    it('should update state and localStorage with direct value', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'initial')
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('updated');
      });

      const [value] = result.current;
      expect(value).toBe('updated');
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify('updated'));
    });

    it('should support functional updates', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 10)
      );

      act(() => {
        const [, setValue] = result.current;
        setValue((prev) => prev + 5);
      });

      const [value] = result.current;
      expect(value).toBe(15);
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(15));
    });

    it('should handle arrays', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string[]>(TEST_KEY, [])
      );

      act(() => {
        const [, setValue] = result.current;
        setValue(['item1', 'item2']);
      });

      const [value] = result.current;
      expect(value).toEqual(['item1', 'item2']);
    });

    it('should dispatch storage event', () => {
      const eventSpy = vi.fn();
      window.addEventListener('storage', eventSpy);

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'initial')
      );

      act(() => {
        const [, setValue] = result.current;
        setValue('updated');
      });

      expect(eventSpy).toHaveBeenCalled();

      window.removeEventListener('storage', eventSpy);
    });
  });

  describe('removeValue', () => {
    it('should remove value from localStorage and reset to initial', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify('stored'));

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'default')
      );

      // Verify stored value is loaded
      expect(result.current[0]).toBe('stored');

      act(() => {
        const [, , removeValue] = result.current;
        removeValue();
      });

      const [value] = result.current;
      expect(value).toBe('default');
      expect(localStorage.getItem(TEST_KEY)).toBeNull();
    });
  });

  describe('cross-tab synchronization', () => {
    it('should update when storage event is received', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'initial')
      );

      // Simulate storage event from another tab
      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: TEST_KEY,
            newValue: JSON.stringify('from-other-tab'),
          })
        );
      });

      const [value] = result.current;
      expect(value).toBe('from-other-tab');
    });

    it('should reset to initial when storage is cleared', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify('stored'));

      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'default')
      );

      expect(result.current[0]).toBe('stored');

      // Simulate storage being cleared
      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: TEST_KEY,
            newValue: null,
          })
        );
      });

      expect(result.current[0]).toBe('default');
    });

    it('should ignore storage events for different keys', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, 'initial')
      );

      act(() => {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'different-key',
            newValue: JSON.stringify('should-not-change'),
          })
        );
      });

      const [value] = result.current;
      expect(value).toBe('initial');
    });
  });

  describe('key changes', () => {
    it('should read new value when key changes', () => {
      localStorage.setItem('key-1', JSON.stringify('value-1'));
      localStorage.setItem('key-2', JSON.stringify('value-2'));

      const { result, rerender } = renderHook(
        ({ key }) => useLocalStorage(key, 'default'),
        { initialProps: { key: 'key-1' } }
      );

      expect(result.current[0]).toBe('value-1');

      rerender({ key: 'key-2' });

      expect(result.current[0]).toBe('value-2');
    });
  });

  describe('type safety', () => {
    it('should work with boolean values', () => {
      const { result } = renderHook(() =>
        useLocalStorage(TEST_KEY, false)
      );

      act(() => {
        const [, setValue] = result.current;
        setValue(true);
      });

      expect(result.current[0]).toBe(true);
      expect(localStorage.getItem(TEST_KEY)).toBe('true');
    });

    it('should work with null values', () => {
      const { result } = renderHook(() =>
        useLocalStorage<string | null>(TEST_KEY, null)
      );

      expect(result.current[0]).toBeNull();

      act(() => {
        const [, setValue] = result.current;
        setValue('not-null');
      });

      expect(result.current[0]).toBe('not-null');
    });
  });
});
