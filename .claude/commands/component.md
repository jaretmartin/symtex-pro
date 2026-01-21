---
description: Generate React component following Pro patterns
argument-hint: ComponentName [--ui|--feature|--route]
allowed-tools: Read, Write, Glob
---

Generate a TypeScript React component for Pro.

## Location by flag:
- `--ui`: src/components/ui/
- `--feature`: src/components/<feature>/
- `--route`: src/routes/
- (default): src/components/

## Steps
1. Read an existing component for reference pattern
2. Generate component with proper TypeScript types
3. Follow project conventions from .claude/rules/react-components.md

## Template
```tsx
/**
 * ${name} - Brief description
 */

import { type ComponentHTMLAttributes } from 'react';

interface ${name}Props extends ComponentHTMLAttributes<HTMLDivElement> {
  // Add custom props here
}

export function ${name}({ ...props }: ${name}Props): JSX.Element {
  return (
    <div {...props}>
      {/* Content */}
    </div>
  );
}
```

## Verification
Run `pnpm build` to verify no TypeScript errors.
