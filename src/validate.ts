
/* IMPORT */

import {validate} from 'grammex';
import Grammar from './grammar';

/* MAIN */

const _validate = ( template: string ): boolean => {

  return validate ( template, Grammar, { memoization: false } );

};

/* EXPORT */

export default _validate;
