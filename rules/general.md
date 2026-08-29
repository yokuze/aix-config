## Core Principles

* Do deep research to find libraries (NPM, GitHub, Cargo, etc.) that solve problems
  instead of writing code
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

## Naming Conventions

* PascalCase for classes
* camelCase for variables, instance functions, and methods
* snake_case for static functions
* kebab-case for file and directory names
* UPPERCASE for environment variables
* Files exporting classes: PascalCase.js (e.g., `User.ts`)
* Files exporting functions/objects: kebab-case.js (e.g., `my-function.ts`)
* Tests: `ClassTheyAreTesting.test.ts`
* Avoid magic numbers and define constants
* Do not export a type alias that is used once inside its own file

## Formatting Rules

* **3 spaces** (never tabs)
* One blank line between unrelated statements

## Control Structures

* Avoid deep nesting (keep low cyclomatic complexity)
* Most common case in first `if`
* Positive logic over negative e.g. `if (isToday)` vs `if (!isFuture && !isPast)`
* Break complex conditions into variables/functions
* Check error conditions early with early returns
* Ternary operator only for simple conditions

## Variable Best Practices

* Declare in lowest possible scope
* Declare at top of scope before statements
* Avoid modifying input parameters (except immediate sanitization)
* Always sanitize user input
* Prefer immutability (`readonly`, `as const`, `const`)

## Documentation

* Use en-US spelling and grammar for all code and documentation. Do not use British
  English spelling.
* JSDocs are required for all public APIs and for key internal functions
* No useless comments e.g. do not add `/** Creates the foo */` to `createFoo()`
   * Only add a comment if:
      * The code's rationale is not obvious from naming/context
      * The comment answers "why," NOT "what" or "how"
* Do not comment on types, parameters, or usage that are clear from code or naming
* Use ASCII in comments, never unicode symbols
* No commented-out code

## Front-End Development

* Pay attention to the current version of the component, and use a similar pattern as
  set by existing elements
* Consider accessibility / a11y
