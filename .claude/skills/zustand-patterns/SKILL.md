---
description: Zustand state management patterns. Use when creating stores, managing application state, or optimizing component subscriptions.
---

# Zustand Patterns for Symtex

## Store Template

All stores in this project use the `devtools` middleware:

```tsx
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StoreState {
  // State
  items: Item[];
  selected: Item | null;

  // Actions
  setItems: (items: Item[]) => void;
  selectItem: (item: Item | null) => void;
}

export const useStore = create<StoreState>()(
  devtools(
    (set) => ({
      items: [],
      selected: null,
      setItems: (items) => set({ items }),
      selectItem: (selected) => set({ selected }),
    }),
    { name: 'StoreName' }
  )
);
```

## Selector Pattern (Performance)

Always use selective subscriptions to avoid unnecessary re-renders:

```tsx
// GOOD - Only re-renders when items change
const items = useStore((state) => state.items);

// AVOID - Re-renders on any state change
const { items, selected } = useStore();
```

## Multiple Selectors

```tsx
const items = useStore((state) => state.items);
const selected = useStore((state) => state.selected);
const setItems = useStore((state) => state.setItems);
```

## Cross-Store Communication

For one-time reads from another store:

```tsx
const handleAction = () => {
  const otherData = useOtherStore.getState().data;
  // Use otherData...
};
```

## Derived State

Compute derived values in selectors:

```tsx
const activeItems = useStore((state) =>
  state.items.filter(item => item.isActive)
);
```

## Existing Stores

- `useUIStore` - UI state (sidebar, modals)
- `useWorkflowStore` - ReactFlow workflow state
- Check `src/store/` for all available stores
