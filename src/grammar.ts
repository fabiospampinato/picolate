
/* IMPORT */

import once from 'function-once';
import {grammar} from 'grammex';
import type {ExplicitRule} from 'grammex';
import type {NodeRoot} from './types';
import type {NodeComment, NodeEval, NodeString} from './types';
import type {NodeEach, NodeEachOpen, NodeEachBranchTrue, NodeEachBranchFalse} from './types';
import type {NodeIf, NodeIfOpen, NodeIfBranchTrue, NodeIfBranchFalse} from './types';
import type {NodeWith, NodeWithOpen, NodeWithBranchTrue, NodeWithBranchFalse} from './types';
import type {Node} from './types';

/* MAIN */

//TODO: Make grammex type-safe and delete the type assertions
//TODO: Support {{else if ...}}

const makeGrammar = once (() => {

  return grammar<Node, ExplicitRule<NodeRoot>> ( ({ match, optional, star, and, or }) => {

    /* REGEXES */

    const commentRe = /{{!--(.*?)--}}/;
    const evalRe = /{{((?!else}})[^/#{].*?)}}/;
    const stringRe = /(\{+?(?=\{\{|\{$|$})|(?:(?!{{)[^])+)/;

    const eachOpenRe = /{{#each (.*?) as ([a-zA-Z$_][a-zA-Z0-9$_]*)}}/;
    const eachCloseRe = /{{\/each}}/;
    const eachElseRe = /{{else}}/;

    const ifOpenRe = /{{#if (.*?)}}/;
    const ifCloseRe = /{{\/if}}/;
    const ifElseRe = /{{else}}/;

    const withOpenRe = /{{#with (.*?)}}/;
    const withCloseRe = /{{\/with}}/;
    const withElseRe = /{{else}}/;

    /* RULES */

    const Comment = match ( commentRe, ( _, value ): NodeComment => ({ type: 'comment', value }) );
    const Eval = match ( evalRe, ( _, value ): NodeEval => ({ type: 'eval', value }) );
    const String = match ( stringRe, ( _, value ): NodeString => ({ type: 'string', value }) );

    const EachOpen = match ( eachOpenRe, ( _, values, value ): NodeEachOpen => ({ type: 'each.open', values, value }) );
    const EachClose = match ( eachCloseRe );
    const EachElse = match ( eachElseRe );
    const EachBranchTrue = and ( [EachOpen, () => Values], ( nodes ): NodeEachBranchTrue => ({ type: 'each.branch.true', values: nodes[0]['values'], value: nodes[0]['value'], children: nodes.slice ( 1 ) }) );
    const EachBranchFalse = and ( [EachElse, () => Values], ( nodes ): NodeEachBranchFalse => ({ type: 'each.branch.false', children: nodes }) );
    const Each = and ( [EachBranchTrue, optional ( EachBranchFalse ), EachClose], ( nodes ): NodeEach => ({ type: 'each', children: [nodes[0] as any, nodes[1] as any] }) );

    const IfOpen = match ( ifOpenRe, ( _, value ): NodeIfOpen => ({ type: 'if.open', value }) );
    const IfClose = match ( ifCloseRe );
    const IfElse = match ( ifElseRe );
    const IfBranchTrue = and ( [IfOpen, () => Values], ( nodes ): NodeIfBranchTrue => ({ type: 'if.branch.true', value: nodes[0]['value'], children: nodes.slice ( 1 ) }) );
    const IfBranchFalse = and ( [IfElse, () => Values], ( nodes ): NodeIfBranchFalse => ({ type: 'if.branch.false', children: nodes }) );
    const If = and ( [IfBranchTrue, optional ( IfBranchFalse ), IfClose], ( nodes ): NodeIf => ({ type: 'if', children: [nodes[0] as any, nodes[1] as any] }) );

    const WithOpen = match ( withOpenRe, ( _, value ): NodeWithOpen => ({ type: 'with.open', value }) );
    const WithClose = match ( withCloseRe );
    const WithElse = match ( withElseRe );
    const WithBranchTrue = and ( [WithOpen, () => Values], ( nodes ): NodeWithBranchTrue => ({ type: 'with.branch.true', value: nodes[0]['value'], children: nodes.slice ( 1 ) }) );
    const WithBranchFalse = and ( [WithElse, () => Values], ( nodes ): NodeWithBranchFalse => ({ type: 'with.branch.false', children: nodes }) );
    const With = and ( [WithBranchTrue, optional ( WithBranchFalse ), WithClose], ( nodes ): NodeWith => ({ type: 'with', children: [nodes[0] as any, nodes[1] as any] }) );

    const Values = star ( or ([ Comment, Eval, String, Each, If, With ]) );
    const Root = and ( [Values], ( nodes ): NodeRoot => ({ type: 'root', children: nodes }) );

    return Root;

  });

});

/* EXPORT */

export {makeGrammar};
