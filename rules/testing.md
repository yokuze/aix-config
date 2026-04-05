* When writing tests, prefer practical e2e tests over unit tests, but add unit tests for
  critical functionality or complex logic
* If you write tests, always run them
* Use descriptive test names that explain the expected behavior
* Group related tests with `describe()` blocks
* Add blank line before `expect` / assertion statements
* Follow the Arrange-Act-Assert pattern

## Assertion Rules

* Do NOT use `.to.be.true` or `.to.be.false`. Use `.to.strictlyEqual(true)` or
  `.to.strictlyEqual(false)` instead
* Use `.to.eql()` for deep equality comparisons
