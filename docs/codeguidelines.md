# Javascript Code Guide

For maximum advantage of automated tooling described below, such as
ESLint and prettier, using an editor/IDE plugin is essential. A good
plugin should:

- Highlight code detected as failing formatting/linting rules
- Offer the ability to either fix the problem automatically, or insert
  an ignore-pragma (eg: `Alt+Enter` on IntelliJ will offer automatic
  fixes and apply them when available or offer to silence the rule with
  an appropriate pragma).

## Code Formatting

prettier for code formatting wherever supported. This removes the space
for opinion on formatting related comments, reducing development
iteration time.

A list of supported editors and their
[plugins](https://prettier.io/docs/en/editors.html).

To format code manually with prettier:

```shell script
npm run lint:prettier:fix
```

## Code Style

All the ESLint. Here is our [configuration](/.eslintrc.js).

A list of supported editors and their
[plugins](https://eslint.org/docs/user-guide/integrations#editors).

Any rules / plugins that are desired to be disabled/removed or
enabled/added will go through a normal peer review process, giving some
consensus on what code style should look like.

Plus, ESLint is magic!: Current plugins include:

- Browser compatibility.
- Test formatting, style
- Copyright as file headers (including updating copyright year with
  `--fix`)
- Comment formatting for automated documentation generation
- Typescript/Javascript best practices

Disabling of rules should be done on a statement-per-statement basis.

Disabling for an entire file is ignoring the code style.

When changing an eslint rule, the commit must include all necessary
changes so linting passes.

ESLint is able to automatically fix some problems, to do so, the
following `npm script` is provided:

```shell script
npm run lint:eslint:fix
```

### const / let

`const` unless you intend to reassign the variable pointer somewhere
else. This includes objects and arrays that are mutated - the `const`
variable declaration is a signal of pointer immutability.

### Object immutability

Objects not created in-scope should never be mutated _unless absolutely
necessary_.[^1]

### Objects as parameters

Public facing functions/methods with several optional parameters should
accept a single parameter, an object. The intention of this is to
increase API backwards/forwards compatibility, code readability.

Instead of changing method signatures, deprecating or adding a property
to an existing single parameter object _should_ help reduce breaking
changes.

This is not a "hard and fast" rule - ESLint is configured to error if
there are more than two arguments to a function.

Example exemptions:

- A sort function that compares two values.
- `findXById(xId: string)`

Further reading can be found
[here](https://medium.com/@afontcu/cool-javascript-9-named-arguments-functions-that-get-and-return-objects-337b6f8cfa07).

[^1]:
    Example: generated protobuf messages that have a map type property
    expose a mutable object in order to set properties of the map. As of
    this writing, there is no way to explicitly set the object pointed
    to by the protobuf message.
