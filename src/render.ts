
/* IMPORT */

import compile from './compile';

/* MAIN */

const render = ( template: string, context?: object ): string => {

  return compile ( template )( context );

};

/* EXPORT */

export default render;
