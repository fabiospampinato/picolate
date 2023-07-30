
/* IMPORT */

import benchmark from 'benchloop';
import picolate from '../dist/index.js';

/* HELPERS */

const TEMPLATE = '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}';
const COMPILED = picolate.compile ( TEMPLATE );
const CONTEXT = { foo: true, bar: true };

/* MAIN */

benchmark.config ({
  iterations: 10_000
});

benchmark ({
  name: 'picolate.compile',
  fn: () => {
    picolate.compile ( TEMPLATE );
  }
});

benchmark ({
  name: 'picolate.parse',
  fn: () => {
    picolate.parse ( TEMPLATE );
  }
});

benchmark ({
  name: 'picolate.render',
  fn: () => {
    picolate.render ( TEMPLATE, CONTEXT );
  }
});

benchmark ({
  name: 'picolate.validate',
  fn: () => {
    picolate.validate ( TEMPLATE );
  }
});

benchmark.summary ();
