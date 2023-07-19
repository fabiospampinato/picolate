
/* IMPORT */

import tokenize from './tokenize';

/* MAIN */

const stringize = ( c, t, o ): void => {

  new Function ( 'c', 't', 'o', 'stringize', /* javascript */`
    with ( c ) {
      outer:
      for ( let i = 0, l = t.length; i < l; ) {
        const token = t[i];
        if ( token.type === 'string' ) {
          o.push ( token.value );
        } else if ( token.type === 'eval' ) {
          o.push ( String ( eval ( token.value ) ) );
        } else if ( token.type === 'if.open' ) {
          const isTruthy = !!eval ( token.value );
          if ( !isTruthy ) {
            let count = 1;
            for ( let ti = i + 1, tl = t.length; ti < tl; ti++ ) {
              const tt = t[ti];
              if ( tt.type === 'if.open' ) count++;
              if ( tt.type === 'if.close' ) count--;
              if ( !count ) {
                i = ti;
                continue outer;
              }
            }
          }
        } else if ( token.type === 'each.open' ) {
          const values = eval ( token.values );
          let ii = 0;
          let count = 1;
          for ( let ti = i + 1, tl = t.length; ti < tl; ti++ ) {
            const tt = t[ti];
            if ( tt.type === 'each.open' ) count++;
            if ( tt.type === 'each.close' ) count--;
            if ( !count ) {
              ii = ti;
              break;
            }
          }
          const subtokens = t.slice ( i + 1, ii );
          for ( const value of values ) {
            stringize ( { ...c, [token.value]: value }, subtokens, o, stringize );
          }
          i = ii;
          continue outer;
        } else if ( token.type === 'with.open' ) {
          const cc = eval ( token.value );
          let ii = 0;
          let count = 1;
          for ( let ti = i + 1, tl = t.length; ti < tl; ti++ ) {
            const tt = t[ti];
            if ( tt.type === 'with.open' ) count++;
            if ( tt.type === 'with.close' ) count--;
            if ( !count ) {
              ii = ti;
              break;
            }
          }
          const subtokens = t.slice ( i + 1, ii );
          stringize ( { ...c, ...cc }, subtokens, o, stringize );
          i = ii;
          continue outer;
        }
        i++;
      }
    }
  `)( c, t, o, stringize );

};

const compile = ( template: string ): (( context?: object ) => string) => {

  const tokens = tokenize ( template );

  return ( context: object = {} ): string => {

    const output: string[] = [];

    stringize ( context, tokens, output );

    return output.join ( '' );

  };

};

/* EXPORT */

export default compile;
