
/* IMPORT */

import parse from './parse';
import type {Options} from './types';

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
//         const [branchTrue, branchFalse] = node.children;
//         const values = eval ( branchTrue.values );
//         if ( values?.length ) {
//           for ( const value of values ) {
//             evaluate ( { ...context, [branchTrue.value]: value }, branchTrue.children, output, evaluate );
//           }
//         } else {
//           evaluate ( context, branchFalse.children, output, evaluate );
//         }
//       } else if ( type === 'if' ) {
//         const [branchTrue, branchFalse] = node.children;
//         const condition = eval ( branchTrue.value );
//         if ( condition ) {
//           evaluate ( context, branchTrue.children, output, evaluate );
//         } else if ( branchFalse ) {
//           evaluate ( context, branchFalse.children, output, evaluate );
//         }
//       } else if ( type === 'with' ) {
//         const [branchTrue, branchFalse] = node.children;
//         const branchContext = eval ( branchTrue.value );
//         if ( branchContext ) {
//           evaluate ( { ...context, ...branchContext }, branchTrue.children, output, evaluate );
//         } else if ( branchFalse ) {
//           evaluate ( context, branchFalse.children, output, evaluate );
//         }
//       }
//     }
//   }
// `);

const evaluate = new Function ( 'c', 'n', 'o', 'e', `with(c)for(const m of n){const t=m.type;if(t==="eval")o.push(String(eval(m.value)));else if(t==="string")o.push(m.value);else if(t==="each"){const[y,n]=m.children,v=eval(y.values);if(v?.length)for(const l of v)e({...c,[y.value]:l},y.children,o,e);else e(c,n.children,o,e)}else if(t==="if"){const[y,n]=m.children,w=eval(y.value);w?e(c,y.children,o,e):n&&e(c,n.children,o,e)}else if(t==="with"){const[y,n]=m.children,cc=eval(y.value);cc?e({...c,...cc},y.children,o,e):n&&e(c,n.children,o,e)}}` );

/* MAIN */

const compile = ( template: string, options?: Options ): (( context?: object ) => string) => {

  const nodes = parse ( template, options ).children;

  return ( context: object = {} ): string => {

    const output: string[] = [];

    evaluate ( context, nodes, output, evaluate );

    return output.join ( '' );

  };

};

/* EXPORT */

export default compile;
