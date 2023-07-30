
/* IMPORT */

import {grammar} from 'grammex';
import type {ExplicitRule} from 'grammex';
import type {NodeRoot, NodeEach, NodeIf, NodeWith} from './types';
import type {NodeComment, NodeEval, NodeString} from './types';
import type {NodeEachOpen, NodeEachClose, NodeIfOpen, NodeIfClose, NodeWithOpen, NodeWithClose} from './types';
import type {Node} from './types';

/* MAIN */

const Grammar = grammar<Node, ExplicitRule<NodeRoot>> ( ({ match, star, and, or }) => {

  const Comment = match ( /{{!--(.*?)--}}/, ( _, value ): NodeComment => ({ type: 'comment', value }) );

  const EachOpen = match ( /{{#each (.*?) as ([a-zA-Z$_][a-zA-Z0-9$_]*)}}/, ( _, values, value ): NodeEachOpen => ({ type: 'each.open', values, value }) );
  const EachClose = match ( /{{\/each}}/, (): NodeEachClose => ({ type: 'each.close' }) );
  const Each = and ( [EachOpen, () => Values, EachClose], ( nodes ): NodeEach => ({ type: 'each', values: nodes[0]['values'], value: nodes[0]['value'], children: nodes.slice ( 1, -1 ) }) );

  const Eval = match ( /{{([^/#{].*?)}}/, ( _, value ): NodeEval => ({ type: 'eval', value }) );

  const IfOpen = match ( /{{#if (.*?)}}/, ( _, value ): NodeIfOpen => ({ type: 'if.open', value }) );
  const IfClose = match ( /{{\/if}}/, (): NodeIfClose => ({ type: 'if.close' }) );
  const If = and ( [IfOpen, () => Values, IfClose], ( nodes ): NodeIf => ({ type: 'if', value: nodes[0]['value'], children: nodes.slice ( 1, -1 ) }));

  const String = match ( /(\{+?(?=\{\{|\{$|$})|(?:(?!{{)[^])+)/, ( _, value ): NodeString => ({ type: 'string', value }) );

  const WithOpen = match ( /{{#with (.*?)}}/, ( _, value ): NodeWithOpen => ({ type: 'with.open', value }) );
  const WithClose = match ( /{{\/with}}/, (): NodeWithClose => ({ type: 'with.close' }) );
  const With = and ( [WithOpen, () => Values, WithClose], ( nodes ): NodeWith => ({ type: 'with', value: nodes[0]['value'], children: nodes.slice ( 1, -1 ) }) );

  const Values = star ( or ([ Comment, Each, If, With, Eval, String ]) );
  const Root = and ( [Values], ( nodes ): NodeRoot => ({ type: 'root', children: nodes }) );

  return Root;

});

/* EXPORT */

export default Grammar;
