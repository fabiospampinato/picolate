
/* IMPORT */

import {match, lazy, star, and, or} from 'grammex';
import type {TokenComment, TokenEachOpen, TokenEachClose, TokenEval, TokenIfOpen, TokenIfClose, TokenString, TokenWithOpen, TokenWithClose} from './types';

/* MAIN */

const Comment = match ( /{{!--(.*?)--}}/, ( _, value ): TokenComment => ({ type: 'comment', value }) );

const EachOpen = match ( /{{#each (.*?) as ([a-zA-Z$_][a-zA-Z0-9$_]*)}}/, ( _, values, value ): TokenEachOpen => ({ type: 'each.open', values, value }) );
const EachContent = lazy ( () => Grammar );
const EachClose = match ( /{{\/each}}/, (): TokenEachClose => ({ type: 'each.close' }) );
const Each = and ([ EachOpen, EachContent, EachClose ]);

const Eval = match ( /{{([^/#].*?)}}/, ( _, value ): TokenEval => ({ type: 'eval', value }) );

const IfOpen = match ( /{{#if (.*?)}}/, ( _, value ): TokenIfOpen => ({ type: 'if.open', value }) );
const IfContent = lazy ( () => Grammar );
const IfClose = match ( /{{\/if}}/, (): TokenIfClose => ({ type: 'if.close' }) );
const If = and ([ IfOpen, IfContent, IfClose ]);

const String = match ( /((?:(?!{{)[^])+)/, ( _, value ): TokenString => ({ type: 'string', value }) );

const WithOpen = match ( /{{#with (.*?)}}/, ( _, value ): TokenWithOpen => ({ type: 'with.open', value }) );
const WithContent = lazy ( () => Grammar );
const WithClose = match ( /{{\/with}}/, (): TokenWithClose => ({ type: 'with.close' }) );
const With = and ([ WithOpen, WithContent, WithClose ]);

const Grammar = star ( or<any, unknown> ([ Comment, Each, If, With, Eval, String ]) ); //FIXME: For whatever reason it doesn't like what should be the correct tyoe, or<Token, unknown>

/* EXPORT */

export default Grammar;
