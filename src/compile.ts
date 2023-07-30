
/* IMPORT */

import parse from './parse';

/* HELPERS */

//TODO: This function is generated just to bail out of strict mode, which is needed just because "with" is used, maybe it could be done more nicely

// const evaluate = new Function ( 'context', 'nodes', 'output', 'evaluate', /* javascript */`
//   with ( context ) {
//     for ( const node of nodes ) {
//       const type = node.type;
//       if ( type === 'eval' ) {
//         output.push ( String ( eval ( node.value ) ) );
//       } else if ( type === 'string' ) {
//         output.push ( node.value );
//       } else if ( type === 'each' ) {
//         const values = eval ( node.values );
//         for ( const value of values ) {
//           evaluate ( { ...context, [node.value]: value }, node.children, output, evaluate );
//         }
//       } else if ( type === 'if' ) {
//         if ( eval ( node.value ) ) {
//           evaluate ( context, node.children, output, evaluate );
//         }
//       } else if ( type === 'with' ) {
//         const nodeContext = eval ( node.value );
//         evaluate ( { ...context, ...nodeContext }, node.children, output, evaluate );
//       }
//     }
//   }
// `);

const evaluate = new Function ( 'c', 'n', 'o', 'e', `with(c)for(const m of n){const t=m.type;if(t==="eval")o.push(String(eval(m.value)));else if(t==="string")o.push(m.value);else if(t==="each"){const w=eval(m.values);for(const v of w)e({...c,[m.value]:v},m.children,o,e)}else if(t==="if")eval(m.value)&&e(c,m.children,o,e);else if(t==="with"){const mc=eval(m.value);e({...c,...mc},m.children,o,e)}}` );

/* MAIN */

const compile = ( template: string ): (( context?: object ) => string) => {

  const nodes = parse ( template ).children;

  return ( context: object = {} ): string => {

    const output: string[] = [];

    evaluate ( context, nodes, output, evaluate );

    return output.join ( '' );

  };

};

/* EXPORT */

export default compile;
