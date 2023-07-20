
/* IMPORT */

import parse from './parse';
import type {Node} from './types';

/* HELPERS */

const execute = ( context: object, nodes: Node[], output: string[] ): void => {

  new Function ( 'context', 'nodes', 'output', 'execute', /* javascript */`
    with ( context ) {
      for ( const node of nodes ) {
        const type = node.type;
        if ( type === 'eval' ) {
          output.push ( String ( eval ( node.value ) ) );
        } else if ( type === 'string' ) {
          output.push ( node.value );
        } else if ( type === 'each.open' ) {
          const values = eval ( node.values );
          for ( const value of values ) {
            execute ( { ...context, [node.value]: value }, node.children, output, execute );
          }
        } else if ( type === 'if.open' ) {
          if ( eval ( node.value ) ) {
            execute ( context, node.children, output, execute );
          }
        } else if ( type === 'with.open' ) {
          const nodeContext = eval ( node.value );
          execute ( { ...context, ...nodeContext }, node.children, output, execute );
        }
      }
    }
  `)( context, nodes, output, execute );

};

/* MAIN */

const compile = ( template: string ): (( context?: object ) => string) => {

  const nodes = parse ( template ).children;

  return ( context: object = {} ): string => {

    const output: string[] = [];

    execute ( context, nodes, output );

    return output.join ( '' );

  };

};

/* EXPORT */

export default compile;
