
/* IMPORT */

import parse from './parse';

/* HELPERS */

//TODO: This function is generated just to bail out of strict mode, which is needed just because "with" is used, maybe it could be done more nicely

// const execute = new Function ( 'context', 'nodes', 'output', 'execute', /* javascript */`
//   with ( context ) {
//     for ( const node of nodes ) {
//       const type = node.type;
//       if ( type === 'eval' ) {
//         output.push ( String ( eval ( node.value ) ) );
//       } else if ( type === 'string' ) {
//         output.push ( node.value );
//       } else if ( type === 'each.open' ) {
//         const values = eval ( node.values );
//         for ( const value of values ) {
//           execute ( { ...context, [node.value]: value }, node.children, output, execute );
//         }
//       } else if ( type === 'if.open' ) {
//         if ( eval ( node.value ) ) {
//           execute ( context, node.children, output, execute );
//         }
//       } else if ( type === 'with.open' ) {
//         const nodeContext = eval ( node.value );
//         execute ( { ...context, ...nodeContext }, node.children, output, execute );
//       }
//     }
//   }
// `);

const execute = new Function ( 'c', 'n', 'o', 'e', `with(c)for(const m of n){const t=m.type;if(t==="eval")o.push(String(eval(m.value)));else if(t==="string")o.push(m.value);else if(t==="each.open"){const w=eval(m.values);for(const v of w)e({...c,[m.value]:v},m.children,o,e)}else if(t==="if.open")eval(m.value)&&e(c,m.children,o,e);else if(t==="with.open"){const mc=eval(m.value);e({...c,...mc},m.children,o,e)}}` );

/* MAIN */

const compile = ( template: string ): (( context?: object ) => string) => {

  const nodes = parse ( template ).children;

  return ( context: object = {} ): string => {

    const output: string[] = [];

    execute ( context, nodes, output, execute );

    return output.join ( '' );

  };

};

/* EXPORT */

export default compile;
