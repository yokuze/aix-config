## Core Principles

* Readability and clarity over brevity
* Follow existing patterns in the codebase before inventing new ones
* Do deep research to find existing libraries (NPM, GitHub, Cargo, etc.) that solve
  problems instead of writing code
   * Write new code only as a last resort
* Separate formatting-only changes from functional changes
* Be critical and thorough. Prefer truth and direct feedback over politeness
* Look around and use existing patterns and code when possible. Look for:
   * Similar components and use their patterns
   * Library code you can reuse
   * Existing dependencies from package.json or Cargo.toml that you should use
* ALWAYS ask yourself: Can I make this a reusable function/component?
* Always consider the developer experience:
   * Am I placing a burden on the developer with this change?
   * Is it as easy to use / execute / import / configure as possible?
* When making _any_ changes:
   * Consider the impact on other parts of the codebase
      * What tests, documentation, etc. needs to be updated?
      * Search for other files that should be changed after what you just did
   * How has the context changed now that I've made this change?
      * Should I refactor the code to introduce an abstraction to make it more
         maintainable?
      * Should I delete anything that's now unused?
* Check your work after you finish a task:
   * Did I address everything I was asked to?
   * Run `npm run standards` (or `tsc` / `eslint` / `commitlint` / `markdownlint` /
      `cargo lint-clippy && cargo lint-fmt` as appropriate)
   * Test significant changes by:
      * Running the tests
      * Running the app and manually testing the changes (Tauri MCP/CLI or Playwright MCP/CLI)

## Naming Conventions (General)

* Use PascalCase for classes
* Use camelCase for variables, instance functions, and methods
* Use snake_case for static functions
* Use kebab-case for file and directory names
* Use UPPERCASE for environment variables
* Files exporting classes: PascalCase.js (e.g., `User.ts`)
* Files exporting functions/objects: kebab-case.js (e.g., `my-function.ts`)
* Tests: `ClassTheyAreTesting.test.ts`
* Avoid magic numbers and define constants
* Name a helper for the specific thing it does, not the broad capability it reaches. If
  the implementation is one API call, put that API in the name. `manual-popover.ts` that
  sets `popover="manual"`, not `top-layer.ts`. An abstract name promises generality the
  code does not have, and hides what every caller has to handle
* Do not export a type alias that is used once inside its own file. Inline it

## Formatting Rules

* **3 spaces** (never tabs)
* One blank line between unrelated statements

## Control Structures

* Avoid deep nesting (keep low cyclomatic complexity)
* Most common case in `if` (not `else`)
* Use positive logic over negative e.g. `if (isToday)` vs `if (!isFuture && !isPast)`
* Break complex conditions into variables/functions
* Check error conditions early with early returns
* Do not add defensive empty checks before operations that naturally handle empty inputs
* Ternary operator only for simple conditions

## Variable Best Practices

* Declare in lowest possible scope
* Declare at top of scope before statements
* Avoid modifying input parameters (except immediate sanitization)
* Always sanitize user input
* Prefer immutability (`readonly`, `as const`, `const`)

## Documentation

* Use en-US spelling and grammar for all code and documentation
* JSDocs are required for all public APIs, and for any key internal functions
* No useless comments e.g. do not add `/** Creates the foo */` to `createFoo()`
   * Only add a comment if:
      * The code's rationale is not obvious from naming/context
      * The comment answers "why," NOT "what" or "how"
      * The surrounding code uses comments in a similar way
* Do not comment on types, parameters, or usage that are clear from code or naming
* Use ASCII in comments, never unicode symbols
* No commented-out code

## Front-End Development

* Pay attention to the current version of the component, and use a similar pattern as
  set by existing elements
* Consider accessibility / a11y
