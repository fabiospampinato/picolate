
/* IMPORT */

import {describe} from 'fava';
import picobar from '../dist/index.js';

/* MAIN */

describe ( 'Picobar', () => {

  describe ( 'tokenize', it => {

    it ( 'supports comment', t => {

      t.deepEqual ( picobar.tokenize ( '{{!----}}' ), [{ type: 'comment', value: '' }] );
      t.deepEqual ( picobar.tokenize ( '{{!-- foo --}}' ), [{ type: 'comment', value: ' foo ' }] );

    });

    it ( 'supports each', t => {

      t.deepEqual ( picobar.tokenize ( '{{#each people as person}}foo{{/each}}' ), [{ type: 'each.open', values: 'people', value: 'person' }, { type: 'string', value: 'foo' }, { type: 'each.close' }] );
      t.deepEqual ( picobar.tokenize ( '{{#each get(people).asArray() as person}}foo{{/each}}' ), [{ type: 'each.open', values: 'get(people).asArray()', value: 'person' }, { type: 'string', value: 'foo' }, { type: 'each.close' }] );
      t.deepEqual ( picobar.tokenize ( '{{#each people as person}}{{#each person as part}}foo{{/each}}{{/each}}' ), [{ type: 'each.open', values: 'people', value: 'person' }, { type: 'each.open', values: 'person', value: 'part' }, { type: 'string', value: 'foo' }, { type: 'each.close' }, { type: 'each.close' }] );

    });

    it ( 'supports eval', t => {

      t.deepEqual ( picobar.tokenize ( '{{foo}}' ), [{ type: 'eval', value: 'foo' }] );
      t.deepEqual ( picobar.tokenize ( '{{!foo}}' ), [{ type: 'eval', value: '!foo' }] );
      t.deepEqual ( picobar.tokenize ( '{{foo.bar}}' ), [{ type: 'eval', value: 'foo.bar' }] );
      t.deepEqual ( picobar.tokenize ( '{{foo + bar}}' ), [{ type: 'eval', value: 'foo + bar' }] );
      t.deepEqual ( picobar.tokenize ( '{{ foo({bar}) }}' ), [{ type: 'eval', value: ' foo({bar}) ' }] );

    });

    it ( 'supports if', t => {

      t.deepEqual ( picobar.tokenize ( '{{#if foo}}bar{{/if}}' ), [{ type: 'if.open', value: 'foo' }, { type: 'string', value: 'bar' }, { type: 'if.close' }] );
      t.deepEqual ( picobar.tokenize ( '{{#if !foo.bar}}bar{{/if}}' ), [{ type: 'if.open', value: '!foo.bar' }, { type: 'string', value: 'bar' }, { type: 'if.close' }] );
      t.deepEqual ( picobar.tokenize ( '{{#if foo}}{{#if bar}}baz{{/if}}{{/if}}' ), [{ type: 'if.open', value: 'foo' }, { type: 'if.open', value: 'bar' }, { type: 'string', value: 'baz' }, { type: 'if.close' }, { type: 'if.close' }] );

    });

    it ( 'supports string', t => {

      t.deepEqual ( picobar.tokenize ( 'foo' ), [{ type: 'string', value: 'foo' }] );
      t.deepEqual ( picobar.tokenize ( 'foo.bar' ), [{ type: 'string', value: 'foo.bar' }] );

    });

    it ( 'supports with', t => {

      t.deepEqual ( picobar.tokenize ( '{{#with foo}}bar{{/with}}' ), [{ type: 'with.open', value: 'foo' }, { type: 'string', value: 'bar' }, { type: 'with.close' }] );
      t.deepEqual ( picobar.tokenize ( '{{#with foo}}{{#with bar}}baz{{/with}}{{/with}}' ), [{ type: 'with.open', value: 'foo' }, { type: 'with.open', value: 'bar' }, { type: 'string', value: 'baz' }, { type: 'with.close' }, { type: 'with.close' }] );

    });

  });

  describe ( 'render', it => {

    it ( 'supports comment', t => {

      t.is ( picobar.render ( '{{!----}}' ), '' );
      t.is ( picobar.render ( '{{!-- foo --}}' ), '' );

    });

    it ( 'supports each', t => {

      t.is ( picobar.render ( '{{#each people as person}}foo{{/each}}', { people: [1, 2, 3] } ), 'foofoofoo' );
      t.is ( picobar.render ( '{{#each people as person}}{{person}}{{/each}}', { people: [1, 2, 3] } ), '123' );
      t.is ( picobar.render ( '{{#each people as person}}{{person.name}}{{/each}}', { people: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] } ), 'abc' );
      t.is ( picobar.render ( '{{#each people as person}}{{people.length}}{{person.name}}{{/each}}', { people: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] } ), '3a3b3c' );
      t.is ( picobar.render ( '{{#each people as person}}{{#each person.kids as kid}}{{kid.toUpperCase()}}{{/each}}{{/each}}', { people: [{ kids: ['a', 'b', 'c'] }, { kids: ['1', '2', '3'] }] } ), 'ABC123' );

    });

    it ( 'supports eval', t => {

      t.is ( picobar.render ( '{{foo}}', { foo: 123 } ), '123' );
      t.is ( picobar.render ( '{{foo}}', { foo: 123n } ), '123' );
      t.is ( picobar.render ( '{{foo}}', { foo: 'abc' } ), 'abc' );
      t.is ( picobar.render ( '{{foo}}', { foo: false } ), 'false' );
      t.is ( picobar.render ( '{{foo}}', { foo: true } ), 'true' );
      t.is ( picobar.render ( '{{!foo}}', { foo: true } ), 'false' );
      t.is ( picobar.render ( '{{foo.bar}}', { foo: { bar: 123 } } ), '123' );
      t.is ( picobar.render ( '{{foo + bar}}', { foo: 1, bar: 2 } ), '3' );
      t.is ( picobar.render ( '{{ foo({bar}) }}', { foo: o => o.bar * 2, bar: 10 } ), '20' );

    });

    it ( 'supports if', t => {

      t.is ( picobar.render ( '{{#if foo}}bar{{/if}}', { foo: true } ), 'bar' );
      t.is ( picobar.render ( '{{#if foo}}bar{{/if}}', { foo: false } ), '' );
      t.is ( picobar.render ( '{{#if !foo.bar}}bar{{/if}}', { foo: { bar: true } } ), '' );
      t.is ( picobar.render ( '{{#if !foo.bar}}bar{{/if}}', { foo: { bar: false } } ), 'bar' );
      t.is ( picobar.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: true, bar: true } ), 'leftbazright' );
      t.is ( picobar.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: true, bar: false } ), 'leftright' );
      t.is ( picobar.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: false, bar: true } ), '' );
      t.is ( picobar.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: false, bar: false } ), '' );

    });

    it ( 'supports string', t => {

      t.is ( picobar.render ( 'foo' ), 'foo' );
      t.is ( picobar.render ( 'foo.bar' ), 'foo.bar' );

    });

    it ( 'supports with', t => {

      t.is ( picobar.render ( '{{#with person}}{{name}} {{surname}}{{/with}}', { person: { name: 'foo', surname: 'bar' } } ), 'foo bar' );
      t.is ( picobar.render ( '{{#with person}}left{{#with kid}}{{name}} {{surname}}{{/with}}right{{/with}}', { person: { kid: { name: 'foo', surname: 'bar' } } } ), 'leftfoo barright' );

    });

  });

});
