
/* IMPORT */

import {parse} from 'grammex';
import {makeGrammar} from './grammar';
import type {NodeRoot} from './types';

/* MAIN */

const _parse = ( template: string ): NodeRoot => {

  return parse ( template, makeGrammar (), { memoization: false } )[0];

};

/* EXPORT */

export default _parse;
