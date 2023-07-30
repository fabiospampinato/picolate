
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';
import type {NodeRoot} from './types';

/* MAIN */

const _parse = ( template: string ): NodeRoot => {

  return parse ( template, Grammar, { memoization: false } )[0];

};

/* EXPORT */

export default _parse;
