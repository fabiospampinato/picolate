
/* MAIN */

type NodeRoot = { type: 'root', children: Node[] };

type NodeComment = { type: 'comment', value: string };
type NodeEval = { type: 'eval', value: string };
type NodeString = { type: 'string', value: string };

type NodeEach = { type: 'each', children: [NodeEachBranchTrue, NodeEachBranchFalse?] };
type NodeEachOpen = { type: 'each.open', values: string, value: string };
type NodeEachBranchTrue = { type: 'each.branch.true', values: string, value: string, children: Node[] };
type NodeEachBranchFalse = { type: 'each.branch.false', children: Node[] };

type NodeIf = { type: 'if', children: [NodeIfBranchTrue, NodeIfBranchFalse?] };
type NodeIfOpen = { type: 'if.open', value: string };
type NodeIfBranchTrue = { type: 'if.branch.true', value: string, children: Node[] };
type NodeIfBranchFalse = { type: 'if.branch.false', children: Node[] };

type NodeWith = { type: 'with', children: [NodeWithBranchTrue, NodeWithBranchFalse?] };
type NodeWithOpen = { type: 'with.open', value: string };
type NodeWithBranchTrue = { type: 'with.branch.true', value: string, children: Node[] };
type NodeWithBranchFalse = { type: 'with.branch.false', children: Node[] };

type Node = NodeRoot | NodeComment | NodeEval | NodeString | NodeEach | NodeEachOpen | NodeEachBranchTrue | NodeEachBranchFalse | NodeIf | NodeIfOpen | NodeIfBranchTrue | NodeIfBranchFalse | NodeWith | NodeWithOpen | NodeWithBranchTrue | NodeWithBranchFalse;

type Options = {
  delimiters?: [start: string, end: string]
};

/* EXPORT */

export type {NodeRoot};
export type {NodeComment, NodeEval, NodeString};
export type {NodeEach, NodeEachOpen, NodeEachBranchTrue, NodeEachBranchFalse};
export type {NodeIf, NodeIfOpen, NodeIfBranchTrue, NodeIfBranchFalse};
export type {NodeWith, NodeWithOpen, NodeWithBranchTrue, NodeWithBranchFalse};
export type {Node};
export type {Options};
