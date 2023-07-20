
/* MAIN */

type NodeRoot = { type: 'root', children: Node[] };
type NodeComment = { type: 'comment', value: string };
type NodeEach = { type: 'each.open', values: string, value: string, children: Node[] };
type NodeEval = { type: 'eval', value: string };
type NodeIf = { type: 'if.open', value: string, children: Node[] };
type NodeString = { type: 'string', value: string };
type NodeWith = { type: 'with.open', value: string, children: Node[] };
type NodeParent = NodeRoot | NodeEach | NodeIf | NodeWith;
type NodeChild = NodeComment | NodeEval | NodeString;
type Node = NodeRoot | NodeComment | NodeEach | NodeEval | NodeIf | NodeString | NodeWith;

type TokenComment = { type: 'comment', value: string };
type TokenEachOpen = { type: 'each.open', values: string, value: string };
type TokenEachClose = { type: 'each.close' };
type TokenEval = { type: 'eval', value: string };
type TokenIfOpen = { type: 'if.open', value: string };
type TokenIfClose = { type: 'if.close' };
type TokenString = { type: 'string', value: string };
type TokenWithOpen = { type: 'with.open', value: string };
type TokenWithClose = { type: 'with.close' };
type Token = TokenComment | TokenEachOpen | TokenEachClose | TokenEval | TokenIfOpen | TokenIfClose | TokenString | TokenWithOpen | TokenWithClose;

/* EXPORT */

export type {NodeRoot, NodeComment, NodeEach, NodeEval, NodeIf, NodeString, NodeWith, NodeParent, NodeChild, Node};
export type {TokenComment, TokenEachOpen, TokenEachClose, TokenEval, TokenIfOpen, TokenIfClose, TokenString, TokenWithOpen, TokenWithClose, Token};
