---
paths:
  - "**/*.ts"
  - "**/*.js"
  - "**/*.mjs"
  - "**/*.cjs"
  - "**/*.vue"
---

Follow these standards:

* https://github.com/silvermine/silvermine-info/raw/refs/heads/master/coding-standards/typescript.md
* https://raw.githubusercontent.com/silvermine/silvermine-info/refs/heads/master/coding-standards.md

## Core Principles

* Use `let` and `const` instead of `var`
* Prefer `const` for immutable variables
* Group consecutive declarations in one statement; avoid separate `const` for simple,
  related assignments
* Avoid multi-line `const` declarations (complex objects get their own block)
* Use template literals when they improve readability; avoid multi-line template literals
* Use `String()` for explicit string conversion
* Prefer `async/await` over Promise chaining
* Use `Promise.all()` for concurrent async operations
* Use English for all code and documentation
* Always wrap comments to utilize the full line length
* Code must be 140 characters or less; comments must be 91 characters or less
* Use early returns to reduce indentation

## ABSOLUTELY DO NOT

* ABSOLUTELY DO NOT use `any` in TypeScript code
* ABSOLUTELY DO NOT use `as` typecasts to fix type narrowing issues; use or implement
  proper type guard functions instead
* ABSOLUTELY DO NOT use `do-while` loops, `for-in` loops, nested ternary operators, or
  multiline template literals

## Style

BAD: DO NOT DO THIS
```typescript
const a = 1;

const b = 2;

const c = 3;
```

GOOD:
```typescript
const a = 1,
      b = 2,
      c = 3;
```

## Naming Conventions

* Use PascalCase for classes
* Use camelCase for variables, functions, and methods
* Use snake_case for static functions
* Use kebab-case for file and directory names
* Use UPPERCASE for environment variables
* Avoid magic numbers and define constants
* Use `memo` as the accumulator in reduce functions
* Acronyms: ALL_CAPS except when first letter of camelCase property
   * Good: `id`, `assetID`, `lank`, `contentLANK`, `getAWSRole`
   * Bad: `assetId`, `contentLank`, `getAwsRole`
* Function naming:
   * Return single value: `get` + column name
   * Return single record: `get` + table name
   * Return multiple rows: `list` + table name
   * No return: strong verb + noun
   * Boolean: start with "is" (e.g., `isPublished`)

## Functions & Logic

* Avoid deeply nested blocks by using early returns and extracting logic
* Use higher-order functions (map, filter, reduce) to simplify logic
* Arrow function parameters must have parentheses and explicit returns (good: `(a) => {
  return value; }`, bad: `a => a.value`)
* No implicit returns in arrow functions; no arrow functions as class properties
* Use arrow functions for simple cases (<3 instructions), named functions otherwise
* Use default parameter values instead of null/undefined checks
* Use RO-RO (Receive Object, Return Object) for passing and returning multiple parameters
* Use rest parameters instead of `arguments`
* Point-free style: when a callback is simply a direct function reference, pass it
  directly (good: `rules.map(lankFromRule)`, bad: `rules.map((rule) => { return
  lankFromRule(rule); })`)

## Destructuring

* Basic object/array destructuring: yes
* Array destructuring with rest: yes
* Object destructuring with rest: avoid (risky)
* Array destructuring with ignores: use with caution
* Renaming while destructuring: yes
* Deep data destructuring: avoid (not readable)

## Types (TypeScript)

* No implicit `any` types; never use `any`
* Explicit types for exported variables
* Explicit return types for functions
* Use primitive types (`string`, `number`, `boolean`)
* No space between variable and colon; one space between colon and type
* Reuse existing type definitions (e.g., Zod-inferred types) rather than duplicating
* Never use `as` casts to fix type narrowing issues; use proper type guards

## TypeScript Features

* Rest parameters: yes
* Spread operator: yes
* Default parameters: yes
* Iterators and generators: use with caution
* Parameter properties: yes (private only)

## Data Handling

* Avoid excessive use of primitive types; encapsulate data in composite types
* Prefer immutability:
   * Use `readonly` for immutable properties
   * Use `as const` for literals that never change

## Error Handling

* Prefer `instanceof` for error checking
* Be cautious with string-based error checks

## Imports

* If a `process.env` value must be set before an import, place the assignment at the top
  of the file, before imports
* When `process.env` values come from CLI args: import arg parser first, parse args,
  assign `process.env`, then import everything else
