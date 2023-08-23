
/* IMPORT */

import {validate} from 'grammex';
import {makeGrammar} from './grammar';
import type {Options} from './types';

/* MAIN */

const _validate = ( template: string, options?: Options ): boolean => {

  return validate ( template, makeGrammar ( options ), { memoization: false, silent: true } );

};

/* EXPORT */

export default _validate;
