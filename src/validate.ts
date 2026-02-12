
/* IMPORT */

import {validate} from 'grammex';
import {makeGrammar} from './grammar';

/* MAIN */

const _validate = ( template: string ): boolean => {

  return validate ( template, makeGrammar (), { memoization: false, silent: true } );

};

/* EXPORT */

export default _validate;
