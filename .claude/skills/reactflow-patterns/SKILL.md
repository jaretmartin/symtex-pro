---
description: ReactFlow workflow builder patterns for LUX. Use when creating custom nodes, implementing drag-and-drop, or working with workflow state.
---

# ReactFlow Patterns for LUX Builder

## Key Files
- `src/components/lux/LuxCanvas.tsx` - Main canvas component
- `src/components/lux/NodePalette.tsx` - Drag source for nodes
- `src/components/lux/nodes/` - Custom node components
- `src/store/useWorkflowStore.ts` - Flow state management

## Custom Node Pattern

```tsx
import { Handle, Position, type NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
}

export function CustomNode({ data }: NodeProps<CustomNodeData>): JSX.Element {
  return (
    <div className="node-wrapper">
      <Handle type="target" position={Position.Top} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

## Registering Custom Nodes

In LuxCanvas.tsx, add to the nodeTypes object:

```tsx
const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  custom: CustomNode,  // Add here
};
```

## Handle Connections

- `type="target"` - Incoming connections
- `type="source"` - Outgoing connections
- Use `isConnectable` prop to control connection ability

## Layout with Dagre

Use dagre for automatic layout:
```tsx
import dagre from 'dagre';

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB' });
  // ... layout logic
};
```

## Workflow Store Integration

```tsx
const { nodes, edges, onNodesChange, onEdgesChange } = useWorkflowStore();
```
