Refer to this when running git commands:

   * https://raw.githubusercontent.com/silvermine/silvermine-info/refs/heads/master/commit-history.md
   * https://raw.githubusercontent.com/silvermine/standardization/refs/heads/master/commitlint.js

## ABSOLUTELY DO NOT

* ABSOLUTELY DO NOT `git push` without express permission
* ABSOLUTELY DO NOT include `Co-Authored-By` statements in git commit messages

## Commit Message Format

Commits must follow the Conventional Commits specification:

```text
<type>(<scope>): <subject> (#issue)

[optional body]

[optional footer]
```

## Type (Required)

   * `feat:` — New feature
   * `fix:` — Bug fix
   * `docs:` — Documentation changes
   * `style:` — Code style changes (formatting, white-space, etc.)
   * `refactor:` — Code refactoring without behavior changes
   * `perf:` — Performance improvements
   * `test:` — Adding or updating tests
   * `build:` — Changes to build system or dependencies
   * `ci:` — CI/CD configuration changes
   * `chore:` — Maintenance tasks
   * `config:` — Configuration changes
   * `revert:` — Revert a previous commit

# Scoped Commits

These are the ONLY two kinds fo scoped commits allowed

* `sub(feat):` — Sub-commit of a larger feature
* `sub(fix):` — Sub-commit of a larger fix

## Subject Line Requirements

* **72 characters maximum** for the full header (type + scope + subject + issue)
* Use imperative mood ("add feature" not "added feature" or "adds feature")
* Lowercase start (except proper nouns)
* Do not end with a period
* Include issue number in format `(#xxxxx)` at the end
* If multiple issues, include additional numbers in the body/footer instead
* Describe **what** the commit does, not what was wrong

## Body Requirements

* Separate from subject with a blank line
* **90 characters maximum** per line
* Explain **why** — but only if the subject doesn't fully explain the commit on its own
* Bodies are discouraged for simple commits. Only add a body when you have a reason to
  explain why the change was made
* Describe the outcome or behavior change, not the implementation mechanism
* Prefer plain language over technical jargon
* Use markdown formatting for lists

## Footer

* Blank line before footer
* Breaking changes: start with `BREAKING CHANGE:` (case-sensitive)
* Extra ticket references: `Closes #123`, `Fixes #456`

## Commit Content

* Each commit is a cohesive unit of work — independently reviewable
* No "fix review stuff" commits — squash/rebase into the original commits
* Renames/moves in separate commits from content changes
* Import updates can be included with file moves

## Examples

Subject-only (preferred):

```text
fix: handle expired tokens in auth refresh flow (#12345)
```

With body (only when needed):

```text
refactor: replace API request queue with streaming pipeline

The queue-based approach caused memory pressure under high concurrency
because it buffered entire responses before forwarding.
```
