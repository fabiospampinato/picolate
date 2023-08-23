
/* IMPORT */

import {describe} from 'fava';
import {escape} from 'html-escaper';
import picolate from '../dist/index.js';

/* MAIN */

describe ( 'Picolate', () => {

  describe ( 'parse', it => {

    it ( 'supports comment', t => {

      t.deepEqual ( picolate.parse ( '{{!----}}' ), { type: 'root', children: [{ type: 'comment', value: '' }] } );
      t.deepEqual ( picolate.parse ( '{{!-- foo --}}' ), { type: 'root', children: [{ type: 'comment', value: ' foo ' }] } );

    });

    it ( 'supports each', t => {

      t.deepEqual ( picolate.parse ( '{{#each people as person}}foo{{/each}}' ), { type: 'root', children: [{ type: 'each', children: [{ type: 'each.branch.true', values: 'people', value: 'person', children: [{ type: 'string', value: 'foo' }] }, undefined] }] } );
      t.deepEqual ( picolate.parse ( '{{#each get(people).asArray() as person}}foo{{/each}}' ), { type: 'root', children: [{ type: 'each', children: [{ type: 'each.branch.true', values: 'get(people).asArray()', value: 'person', children: [{ type: 'string', value: 'foo' }] }, undefined] }] } );
      t.deepEqual ( picolate.parse ( '{{#each people as person}}{{#each person as part}}foo{{/each}}{{/each}}' ), { type: 'root', children: [{ type: 'each', children: [{ type: 'each.branch.true', values: 'people', value: 'person', children: [{ type: 'each', children: [{ type: 'each.branch.true', values: 'person', value: 'part', children: [{ type: 'string', value: 'foo' }] }, undefined] }] }, undefined] }] } );

      t.deepEqual ( picolate.parse ( '{{#each people as person}}foo{{else}}bar{{/each}}' ), { type: 'root', children: [{ type: 'each', children: [{ type: 'each.branch.true', values: 'people', value: 'person', children: [{ type: 'string', value: 'foo' }] }, { type: 'each.branch.false', children: [{ type: 'string', value: 'bar' }] }] }] } );

    });

    it ( 'supports eval', t => {

      t.deepEqual ( picolate.parse ( '{{foo}}' ), { type: 'root', children: [{ type: 'eval', value: 'foo' }] } );
      t.deepEqual ( picolate.parse ( '{{!foo}}' ), { type: 'root', children: [{ type: 'eval', value: '!foo' }] } );
      t.deepEqual ( picolate.parse ( '{{foo.bar}}' ), { type: 'root', children: [{ type: 'eval', value: 'foo.bar' }] } );
      t.deepEqual ( picolate.parse ( '{{foo + bar}}' ), { type: 'root', children: [{ type: 'eval', value: 'foo + bar' }] } );
      t.deepEqual ( picolate.parse ( '{{ foo({bar}) }}' ), { type: 'root', children: [{ type: 'eval', value: ' foo({bar}) ' }] } );

    });

    it ( 'supports if', t => {

      t.deepEqual ( picolate.parse ( '{{#if foo}}bar{{/if}}' ), { type: 'root', children: [{ type: 'if', children: [{ type: 'if.branch.true', value: 'foo', children: [{ type: 'string', value: 'bar' }] }, undefined] }] } );
      t.deepEqual ( picolate.parse ( '{{#if !foo.bar}}bar{{/if}}' ), { type: 'root', children: [{ type: 'if', children: [{ type: 'if.branch.true', value: '!foo.bar', children: [{ type: 'string', value: 'bar' }] }, undefined] }] } );
      t.deepEqual ( picolate.parse ( '{{#if foo}}{{#if bar}}baz{{/if}}{{/if}}' ), { type: 'root', children: [{ type: 'if', children: [{ type: 'if.branch.true', value: 'foo', children: [{ type: 'if', children: [{ type: 'if.branch.true', value: 'bar', children: [{ type: 'string', value: 'baz' }] }, undefined] }] }, undefined] }] } );

      t.deepEqual ( picolate.parse ( '{{#if foo}}bar{{else}}baz{{/if}}' ), { type: 'root', children: [{ type: 'if', children: [{ type: 'if.branch.true', value: 'foo', children: [{ type: 'string', value: 'bar' }] }, { type: 'if.branch.false', children: [{ type: 'string', value: 'baz' }] }] }] } );

    });

    it ( 'supports string', t => {

      t.deepEqual ( picolate.parse ( 'foo' ), { type: 'root', children: [{ type: 'string', value: 'foo' }] } );
      t.deepEqual ( picolate.parse ( 'foo.bar' ), { type: 'root', children: [{ type: 'string', value: 'foo.bar' }] } );

    });

    it ( 'supports with', t => {

      t.deepEqual ( picolate.parse ( '{{#with foo}}bar{{/with}}' ), { type: 'root', children: [{ type: 'with', children: [{ type: 'with.branch.true', value: 'foo', children: [{ type: 'string', value: 'bar' }] }, undefined] }] } );
      t.deepEqual ( picolate.parse ( '{{#with foo}}{{#with bar}}baz{{/with}}{{/with}}' ), { type: 'root', children: [{ type: 'with', children: [{ type: 'with.branch.true', value: 'foo', children: [{ type: 'with', children: [{ type: 'with.branch.true', value: 'bar', children: [{ type: 'string', value: 'baz' }] }, undefined] }] }, undefined] }] } );

      t.deepEqual ( picolate.parse ( '{{#with foo}}bar{{else}}baz{{/with}}' ), { type: 'root', children: [{ type: 'with', children: [{ type: 'with.branch.true', value: 'foo', children: [{ type: 'string', value: 'bar' }] }, { type: 'with.branch.false', children: [{ type: 'string', value: 'baz' }] }] }] } );

    });

  });

  describe ( 'render', it => {

    it ( 'supports comment', t => {

      t.is ( picolate.render ( '{{!----}}' ), '' );
      t.is ( picolate.render ( '{{!-- foo --}}' ), '' );

    });

    it ( 'supports each', t => {

      t.is ( picolate.render ( '{{#each people as person}}foo{{/each}}', { people: [1, 2, 3] } ), 'foofoofoo' );
      t.is ( picolate.render ( '{{#each people as person}}{{person}}{{/each}}', { people: [1, 2, 3] } ), '123' );
      t.is ( picolate.render ( '{{#each people as person}}{{person.name}}{{/each}}', { people: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] } ), 'abc' );
      t.is ( picolate.render ( '{{#each people as person}}{{people.length}}{{person.name}}{{/each}}', { people: [{ name: 'a' }, { name: 'b' }, { name: 'c' }] } ), '3a3b3c' );
      t.is ( picolate.render ( '{{#each people as person}}{{#each person.kids as kid}}{{kid.toUpperCase()}}{{/each}}{{/each}}', { people: [{ kids: ['a', 'b', 'c'] }, { kids: ['1', '2', '3'] }] } ), 'ABC123' );

      t.is ( picolate.render ( '{{#each people as person}}foo{{else}}bar{{/each}}', { people: [1, 2, 3] } ), 'foofoofoo' );
      t.is ( picolate.render ( '{{#each people as person}}foo{{else}}bar{{/each}}', { people: [] } ), 'bar' );
      t.is ( picolate.render ( '{{#each people as person}}foo{{else}}bar{{/each}}', { people: undefined } ), 'bar' );

    });

    it ( 'supports eval', t => {

      t.is ( picolate.render ( '{{foo}}', { foo: 123 } ), '123' );
      t.is ( picolate.render ( '{{foo}}', { foo: 123n } ), '123' );
      t.is ( picolate.render ( '{{foo}}', { foo: 'abc' } ), 'abc' );
      t.is ( picolate.render ( '{{foo}}', { foo: false } ), 'false' );
      t.is ( picolate.render ( '{{foo}}', { foo: true } ), 'true' );
      t.is ( picolate.render ( '{{!foo}}', { foo: true } ), 'false' );
      t.is ( picolate.render ( '{{foo.bar}}', { foo: { bar: 123 } } ), '123' );
      t.is ( picolate.render ( '{{foo + bar}}', { foo: 1, bar: 2 } ), '3' );
      t.is ( picolate.render ( '{{ foo({bar}) }}', { foo: o => o.bar * 2, bar: 10 } ), '20' );

    });

    it ( 'supports if', t => {

      t.is ( picolate.render ( '{{#if foo}}bar{{/if}}', { foo: true } ), 'bar' );
      t.is ( picolate.render ( '{{#if foo}}bar{{/if}}', { foo: false } ), '' );
      t.is ( picolate.render ( '{{#if !foo.bar}}bar{{/if}}', { foo: { bar: true } } ), '' );
      t.is ( picolate.render ( '{{#if !foo.bar}}bar{{/if}}', { foo: { bar: false } } ), 'bar' );
      t.is ( picolate.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: true, bar: true } ), 'leftbazright' );
      t.is ( picolate.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: true, bar: false } ), 'leftright' );
      t.is ( picolate.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: false, bar: true } ), '' );
      t.is ( picolate.render ( '{{#if foo}}left{{#if bar}}baz{{/if}}right{{/if}}', { foo: false, bar: false } ), '' );

      t.is ( picolate.render ( '{{#if foo}}bar{{else}}baz{{/if}}', { foo: true } ), 'bar' );
      t.is ( picolate.render ( '{{#if foo}}bar{{else}}baz{{/if}}', { foo: false } ), 'baz' );

    });

    it ( 'supports string', t => {

      t.is ( picolate.render ( 'foo' ), 'foo' );
      t.is ( picolate.render ( 'foo.bar' ), 'foo.bar' );

    });

    it ( 'supports with', t => {

      t.is ( picolate.render ( '{{#with person}}{{name}} {{surname}}{{/with}}', { person: { name: 'foo', surname: 'bar' } } ), 'foo bar' );
      t.is ( picolate.render ( '{{#with person}}left{{#with kid}}{{name}} {{surname}}{{/with}}right{{/with}}', { person: { kid: { name: 'foo', surname: 'bar' } } } ), 'leftfoo barright' );

      t.is ( picolate.render ( '{{#with person}}{{name}} {{surname}}{{else}}Nobody...{{/with}}', { person: { name: 'foo', surname: 'bar' } } ), 'foo bar' );
      t.is ( picolate.render ( '{{#with person}}{{name}} {{surname}}{{else}}Nobody...{{/with}}', { person: undefined } ), 'Nobody...' );

    });

    it ( 'supports manual escaping', t => {

      t.is ( picolate.render ( '& < > " \'' ), '& < > " \'' );
      t.is ( picolate.render ( '& < > " \'', { String: escape } ), '& < > " \'' );

      t.is ( picolate.render ( '{{`& < > " \'`}}' ), '& < > " \'' );
      t.is ( picolate.render ( '{{`& < > " \'`}}', { String: escape } ), '&amp; &lt; &gt; &quot; &#39;' );

    });

    it ( 'supports newlines', t => {

      t.is ( picolate.render ( '{{foo}}\n{{bar}}', { foo: 1, bar: 2 } ), '1\n2' );

    });

    it ( 'supports extra braces', t => {

      t.is ( picolate.render ( '{{{foo}}}', { foo: '123' } ), '{123}' );
      t.is ( picolate.render ( '{{{{foo}}}}', { foo: '123' } ), '{{123}}' );
      t.is ( picolate.render ( '{{{{', {} ), '{{{{' );
      t.is ( picolate.render ( '{{{{{{{{{{{{', {} ), '{{{{{{{{{{{{' );
      t.is ( picolate.render ( '}}}}', {} ), '}}}}' );
      t.is ( picolate.render ( '}}}}}}}}}}}}', {} ), '}}}}}}}}}}}}' );

    });

    it ( 'supports custom delimiters', t => {

      const options = { delimiters: ['[[', ']]'] };

      t.is ( picolate.render ( '[[!----]]', {}, options ), '' );
      t.is ( picolate.render ( '[[#each people as person]]foo[[/each]]', { people: [1, 2, 3] }, options ), 'foofoofoo' );
      t.is ( picolate.render ( '[[foo]]', { foo: 123 }, options ), '123' );
      t.is ( picolate.render ( '[[#if foo]]bar[[/if]]', { foo: true }, options ), 'bar' );
      t.is ( picolate.render ( 'foo', {}, options ), 'foo' );
      t.is ( picolate.render ( '[[#with person]][[name]] [[surname]][[/with]]', { person: { name: 'foo', surname: 'bar' } }, options ), 'foo bar' );
      t.is ( picolate.render ( '[[foo]]\n[[bar]]', { foo: 1, bar: 2 }, options ), '1\n2' );
      // t.is ( picolate.render ( '[[[foo]]]', { foo: '123' }, options ), '{123}' ); //FIXME: Tricky with custom delimiters

    });

  });

  describe ( 'validate', it => {

    it ( 'detects improperly closed elements', t => {

      t.false ( picolate.validate ( '{{!--' ) );
      t.false ( picolate.validate ( '{{!--foo' ) );

      t.false ( picolate.validate ( '{{#each people as person}}foo' ) );
      t.false ( picolate.validate ( '{{#each people as person}}foo{{/if}}' ) );
      t.false ( picolate.validate ( '{{#each people as person}}foo{{/with}}' ) );

      t.false ( picolate.validate ( '{{foo' ) );

      t.false ( picolate.validate ( '{{#if person}}foo' ) );
      t.false ( picolate.validate ( '{{#if person}}foo{{/each}}' ) );
      t.false ( picolate.validate ( '{{#if person}}foo{{/with}}' ) );

      t.false ( picolate.validate ( '{{#width person}}foo' ) );
      t.false ( picolate.validate ( '{{#width person}}foo{{/each}}' ) );
      t.false ( picolate.validate ( '{{#width person}}foo{{/if}}' ) );

    });

    it ( 'supports custom delimiters', t => {

      const options = { delimiters: ['[[', ']]'] };

      t.true ( picolate.validate ( '[[foo]]', options ) );
      t.true ( picolate.validate ( '[[foo {{ bar]]', options ) );

      t.false ( picolate.validate ( '[[!--', options ) );
      t.false ( picolate.validate ( '[[foo', options ) );

    });

  });

});
