* ALWAYS be very careful to only write test that are absolutely necessary and  
  that provably test a practical scenario. Do not over-specify or write too
  many tests.
* Prefer practical e2e tests over unit tests. Use unit tests for critical
  functionality or complex logic
* Always run the tests you write
* Group related tests with `describe()` blocks
* Add blank line before `expect` / assertion statements
* Follow the Arrange-Act-Assert pattern
* Do NOT use `.to.be.true` or `.to.be.false`. Use `.to.strictlyEqual(true)` or
  `.to.strictlyEqual(false)` instead
* Use `.to.eql()` for deep equality comparisons
