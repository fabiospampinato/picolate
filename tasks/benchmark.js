
/* IMPORT */

import benchmark from 'benchloop';
import picolate from '../dist/index.js';

/* HELPERS */

const TEMPLATE = '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}';
const COMPILED = picolate.compile ( TEMPLATE );
const CONTEXT = { foo: true, bar: true };

/* MAIN */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 10_000,
  log: 'compact'
});

benchmark ({
  name: 'picolate.tokenize',
  fn: () => {
    picolate.tokenize ( TEMPLATE );
  }
});

benchmark ({
  name: 'picolate.compile',
  fn: () => {
    picolate.compile ( TEMPLATE );
  }
});

benchmark ({
  name: 'picolate.render',
  fn: () => {
    picolate.render ( TEMPLATE, CONTEXT );
  }
});

benchmark ({
  name: 'picolate.compile+picolate.render',
  fn: () => {
    COMPILED ( CONTEXT );
  }
});

benchmark.summary ();
