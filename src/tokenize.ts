
/* IMPORT */

import {parse} from 'grammex';
import Grammar from './grammar';
import type {Token} from './types';

/* MAIN */

const tokenize = ( template: string ): Token[] => {

  return parse ( template, Grammar, {} );

};

/* EXPORT */

export default tokenize;
