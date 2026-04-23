---
description: Git commit
auto_execution_mode: 1
---

Git commit, following the git commit standards in my git.md rules.

No commit message scopes.
No lengthy body messages.
No Co-Authored-By statements.

Use the most appropriate of all of the supported commit types listed in those standards.

Use the body as-needed and sparingly to describe WHY something changed, not WHAT changed.

Create cohesive commits: Group related changes into the same commit. Commits should not be
overly large, nor granular. The state of the repo in each commit should pass linting and
produce a working build.

If the current branch is not `master` or `main` and the changes are adjustments to commits
that were introduced in this branch, fixup those changes into the commits that introduced
the change. refactor/fix etc. commits that make adjustments to changes introduced in the
same branch is NEVER allowed.

If this project is a library, only use `fix` for changes that are relevant to consumers,
not development tooling fixes, etc. Otherwise, use an appropriate non-consumer-facing type
like `chore`, `refactor`, `ci`, `config`, etc.
