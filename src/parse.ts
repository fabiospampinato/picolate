
/* IMPORT */

import {parse} from 'grammex';
import {makeGrammar} from './grammar';
import type {NodeRoot} from './types';
import type {Options} from './types';

/* MAIN */

const _parse = ( template: string, options?: Options ): NodeRoot => {

  return parse ( template, makeGrammar ( options ), { memoization: false } )[0];

};

/* EXPORT */

export default _parse;
