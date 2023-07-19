
/* MAIN */

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

export type {TokenComment, TokenEachOpen, TokenEachClose, TokenEval, TokenIfOpen, TokenIfClose, TokenString, TokenWithOpen, TokenWithClose, Token};
