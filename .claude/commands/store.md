---
description: Generate Zustand store following Pro patterns
argument-hint: StoreName
allowed-tools: Read, Write
---

Generate a Zustand store with devtools middleware.

## Reference Pattern
Read `src/store/useUIStore.ts` for the project pattern.

## Template
```tsx
/**
 * ${name} Store - Brief description
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ${name}State {
  // State properties
  items: ${type}[];
  selected: ${type} | null;
  isLoading: boolean;

  // Actions
  setItems: (items: ${type}[]) => void;
  selectItem: (item: ${type} | null) => void;
  setLoading: (loading: boolean) => void;
}

export const use${name}Store = create<${name}State>()(
  devtools(
    (set) => ({
      // Initial state
      items: [],
      selected: null,
      isLoading: false,

      // Actions
      setItems: (items) => set({ items }),
      selectItem: (selected) => set({ selected }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: '${name}Store' }
  )
);
```

## Post-creation
1. Export from `src/store/index.ts` if it exists
2. Run `pnpm build` to verify
