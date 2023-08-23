
/* IMPORT */

import compile from './compile';
import type {Options} from './types';

/* MAIN */

const render = ( template: string, context?: object, options?: Options ): string => {

  return compile ( template, options )( context );

};

/* EXPORT */

export default render;
