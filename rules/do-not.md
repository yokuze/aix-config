
* ABSOLUTELY DO NOT create ad-hoc test scripts. If you absolutely must, clean up those
  files when you're done
* ABSOLUTELY DO NOT ignore "pre-existing" TypeScript or linting errors, failing tests, or
  out of date documentation. If you see them, fix them before proceeding
* ABSOLUTELY DO NOT use `@deprecated` on anything unless you are explicitly asked to.
  Always fully refactor and delete old code as-needed instead of deprecating it
* ABSOLUTELY DO NOT implement functionality that already exists in a library or package,
  especially if that package is already installed in the project. Examples: parsing,
  validation, formatting
* ABSOLUTELY DO NOT disable linting rules (ESLint, oxlint, clippy, etc.) in the config to
  get around linting errors. Fix the underlying issues
* ABSOLUTELY DO NOT instruct me to do things like "run the dev server and test it out,"
  "run the tests," "install this module", or anything else that you can do yourself as
  part of the task
