
/* MAIN */

type NodeRoot = { type: 'root', children: Node[] };
type NodeComment = { type: 'comment', value: string };
type NodeEach = { type: 'each', values: string, value: string, children: Node[] };
type NodeEachOpen = { type: 'each.open', values: string, value: string };
type NodeEachClose = { type: 'each.close' };
type NodeEval = { type: 'eval', value: string };
type NodeIf = { type: 'if', value: string, children: Node[] };
type NodeIfOpen = { type: 'if.open', value: string };
type NodeIfClose = { type: 'if.close' };
type NodeString = { type: 'string', value: string };
type NodeWith = { type: 'with', value: string, children: Node[] };
type NodeWithOpen = { type: 'with.open', value: string };
type NodeWithClose = { type: 'with.close' };
type NodeParent = NodeRoot | NodeEach | NodeIf | NodeWith;
type NodePrimitive = NodeComment | NodeEval | NodeString;
type NodeExternal = NodeParent | NodePrimitive;
type NodeInternal = NodeEachOpen | NodeEachClose | NodeIfOpen | NodeIfClose | NodeWithOpen | NodeWithClose;
type Node = NodeExternal | NodeInternal;

/* EXPORT */

export type {NodeRoot, NodeEach, NodeIf, NodeWith};
export type {NodeComment, NodeEval, NodeString};
export type {NodeEachOpen, NodeEachClose, NodeIfOpen, NodeIfClose, NodeWithOpen, NodeWithClose};
export type {NodeParent, NodePrimitive, NodeExternal, NodeInternal, Node};
