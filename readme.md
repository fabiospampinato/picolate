# Picolate

A minimalistic and flexible templating engine, inspired by [Handlebars](https://handlebarsjs.com).

## Install

```sh
npm install --save picolate
```

## Language

The following composable building blocks are supported. Anything else that is not part of any of these building blocks is simply left untouched in the template.

#### Comment

A comment does not render anything, it gets stripped out from the template.

```hbs
{{!-- Some arbitrary comment --}}
```

#### Expression

An expression is `eval`-ed, its return value coerced into a string, and that gets interpolated in the template. Any valid JS expression can be used.

```hbs
<p>{{name}}<p>
<p>{{person.name}}<p>
```

#### Each

An each block can be used to iterate over an array, rendering the content of the block once for each value.

The `as name` part is required, you always need to provide a name to use for each iterated value.

An `else` branch is supported too, it will be rendered when the array is empty.

```hbs
{{#each people as person}}
  <p>{{person.name}} {{person.surname}}</p>
{{else}}
  <p>No people...</p>
{{/each}}
```

#### If

An if block is only rendered if its expression is truthy. Any valid JS expression can be used.

An `else` branch is supported too, it will be rendered when the condition is falsy.

```hbs
{{#if isVisible}}
  <p>Something is visible...<p>
{{else}}
  <p>Something is not visible...<p>
{{/if}}
```

#### With

A with block is conceptually analogous to a [`with`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with) statement, it adds properties of the provided object to the current scope.

An `else` branch is supported too, it will be rendered when the value is falsy.

```hbs
{{#with person}}
  <p>{{name}} {{surname}}</p>
{{else}}
  <p>No person...</p>
{{/with}}
```

## Usage

Once you have written a template there are few things that you can do with it:

```ts
import picolate from 'picolate';

// Render a template, without pre-compiling it, which is slower if you need to render it multiple times

const html = picolate.render ( '<p>{{name}}</p>', { name: 'John' } );

// Compile a template, parsing it once, which is faster if you need to render it multiple times

const template = picolate.compile ( '<p>{{name}}</p>' );
const html = template ({ name: 'John' });

// Validate that a template is valid before doing anything else with it

const isValid = picolate.validate ( '{{#if person}}<p>{{name}}</p>' ); // => false

// Parse a template into an AST, this is low-level function you might still never need

const ast = picolate.parse ( '{{#if person}}{{person.name}}{{/if}}' );
// {
//   type: 'root',
//   children: [
//     {
//       type: 'if',
//       value: 'person',
//       children: [
//         {
//           type: 'eval',
//           value: 'person.name'
//         }
//       ]
//     }
//   ]
// }

// Provide arbitrary values to the context object

import _ from 'lodash';

const html = picolate.render ( '<p>{{_.startCase ( name )}}</p>', { _: lodash, name: 'some-name' } );

// Escape interpolated values
// Values are converted to a string by passing them to the "String" function, so you can provide your own "String" function to escape values

import {escape} from 'html-escaper';

const html = picolate.render ( 'Escaped: {{`& < > " \'`}}', { String: value => escape ( String ( value ) ) } ); // Escaped: &amp; &lt; &gt; &quot; &#39;

// Compose multiple building blocks together

const template = `
  <h1>People</h1>
  {{!-- Rendering something for each person --}}
  {{#each people as person}}
    <div>
      <h2>
        <span>{{person.name}}</span>
        {{#if person.admin}}
          <span>(admin)</span>
        {{/if}}
      </h2>
    </div>
  {{/each}}
  {{!-- Rendering some fallback content if there are no people --}}
  {{#if !people.length}}
    <p>No people...</p>
  {{/if}}
`;
```

## License

MIT © Fabio Spampinato
