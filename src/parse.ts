
/* IMPORT */

import tokenize from './tokenize';
import type {NodeRoot, NodeParent} from './types';

/* MAIN */

const parse = ( template: string ): NodeRoot => {

  const tokens = tokenize ( template );
  const root: NodeRoot = { type: 'root', children: [] };
  const queue: NodeParent[] = [root];

  for ( const token of tokens ) {

    const {type} = token;

    if ( type === 'each.open' || type === 'if.open' || type === 'with.open' ) {

      const node: NodeParent = { ...token, children: [] };

      queue[0].children.push ( node );
      queue.unshift ( node );

    } else if ( type === 'each.close' || type === 'if.close' || type === 'with.close' ) {

      queue.shift ();

    } else {

      queue[0].children.push ( token );

    }

  }

  return root;

};

/* EXPORT */

export default parse;
