## Core Principles

* Readability and clarity over brevity
* Follow existing patterns in the codebase before inventing new ones
* Do deep research to find existing libraries (NPM, GitHub, Cargo, etc.) that solve
  problems instead of writing code
   * Code writing is a last resort
* Separate formatting-only changes from functional changes

## Working Habits

* Be critical and thorough. Prefer truth and direct feedback over politeness
* Look around and use existing patterns and code when possible. Look for:
   * Similar components and use their patterns
   * Library code you can reuse
   * Existing dependencies from package.json or Cargo.toml that you should use
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
* Files exporting classes: PascalCase.js (e.g., `User.js`)
* Files exporting functions/objects: kebab-case.js (e.g., `my-function.js`)
* Tests: `ClassTheyAreTesting.test.js`
* Avoid magic numbers and define constants
* When it has an acronym or initialism, use all lowercase or all caps, never mixed-case:
   * `url` or `URL`, _never_ `Url`
   * `id` or `ID`, _never_ `Id`. Prefer `ID` over `id` when writing docs/sentences
      unless documenting a third-party entity or when specifically referring to a code
      object with that exact casing (parameter, variable, etc.)

## Formatting Rules

### Indentation

* **3 spaces** (never tabs)
* Wrapped lines: indent one level from first line
* Chained functions: indent one level from chain start

### Braces & Structure

* Opening brace at end of line (K&R style)
* Always use braces for conditionals/loops (even single line)
* One blank line between unrelated statements
* One-two blank lines between functions

### Spacing & Operators

* Space after control structures: `if (condition)`
* No space between function name and parenthesis: `myFunction()`
* No space between `catch` and parentheses: `catch(error) {`
* Space around operators (except unary: `!`, `++`, `--`)
* Space after commas in arrays/arguments
* Spaces inside array brackets: `[ 'item' ]` and object braces: `{ key: 'value' }`
* Empty arrays/objects: no spaces (`[]`, `{}`)
* Multi-line arrays/objects: always trailing comma

## Control Structures

* Avoid deep nesting (low cyclomatic complexity)
* Most common case in `if` (not `else`)
* Use positive logic over negative
* Break complex conditions into variables/functions
* Check error conditions early with early returns
* Do not add defensive empty checks before operations that naturally handle empty inputs

## Variable Best Practices

* Declare in lowest possible scope
* Declare at top of scope before statements
* Initialized variables before uninitialized
* Avoid modifying input parameters (except immediate sanitization)
* Always sanitize user input
* Prefer immutability (`readonly`, `as const`, `const`)

## Function Documentation

* Document the function purpose in JSDoc format
* Document types or parameters if they are not obvious from the code
* Omit JSDoc entirely when the function name already conveys its purpose
   (e.g., do not add `/** Creates the foo */` to `createFoo()`)
* Add JSDoc comments to enum values when the name alone doesn't convey the
   domain-specific meaning

## Comments

* Only add a comment if:
   * The code's rationale is not obvious from naming/context
   * The comment answers "why," NOT "what" or "how"
   * The surrounding code uses comments in a similar way
* Do not comment on types, parameters, or usage that are clear from code or naming
* Use ASCII in comments, never unicode symbols

## File Standards

* End with newline character (not blank line)
* No Windows line endings
* No commented-out code without reason
* Ternary operator only for simple conditions

## Front-End Development

* Pay attention to the current version of the component, and use a similar pattern as
  set by existing elements
* Consider accessibility / a11y
* Create reusable components rather than ad-hoc solutions

## Library Usage

* Use existing libraries to the fullest extent possible
* Always verify function signatures before using
