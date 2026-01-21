---
description: Generate ReactFlow custom node for LUX Builder
argument-hint: NodeTypeName
allowed-tools: Read, Write
---

Generate a custom ReactFlow node for the LUX workflow builder.

## Reference
Read `src/components/lux/nodes/TriggerNode.tsx` for the pattern.

## Steps
1. Create node in `src/components/lux/nodes/${name}Node.tsx`
2. Register in `src/components/lux/LuxCanvas.tsx` nodeTypes object

## Template
```tsx
/**
 * ${name}Node - Brief description
 */

import { Handle, Position, type NodeProps } from 'reactflow';
import { IconName } from 'lucide-react';

interface ${name}NodeData {
  label: string;
  // Add custom data properties
}

export function ${name}Node({ data }: NodeProps<${name}NodeData>): JSX.Element {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />

      <div className="flex items-center">
        <IconName className="w-4 h-4 mr-2" />
        <div className="font-bold">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" />
    </div>
  );
}
```

## Registration
Add to nodeTypes in LuxCanvas.tsx:
```tsx
const nodeTypes = {
  // existing nodes...
  ${name}: ${name}Node,
};
```
