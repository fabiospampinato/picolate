
/* IMPORT */

import benchmark from 'benchloop';
import picobar from '../dist/index.js';

/* HELPERS */

const TEMPLATE = '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}';
const COMPILED = picobar.compile ( TEMPLATE );
const CONTEXT = { foo: true, bar: true };

/* MAIN */

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 10_000,
  log: 'compact'
});

benchmark ({
  name: 'picobar.tokenize',
  fn: () => {
    picobar.tokenize ( TEMPLATE );
  }
});

benchmark ({
  name: 'picobar.compile',
  fn: () => {
    picobar.compile ( TEMPLATE );
  }
});

benchmark ({
  name: 'picobar.render',
  fn: () => {
    picobar.render ( TEMPLATE, CONTEXT );
  }
});

benchmark ({
  name: 'picobar.compile+picobar.render',
  fn: () => {
    COMPILED ( CONTEXT );
  }
});

benchmark.summary ();
