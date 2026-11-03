* Always use `npm` instead of `pnpm` or `yarn`
* Always use the `--save-exact` flag when installing a dependency
* Use the `-y` flag with `npx` when running a command
* Use project-defined `npm` scripts instead of equivalent CLI commands
* ABSOLUTELY DO NOT introduce new dependencies without verifying the license is
  admissible (see dependency-licenses.md)
* To install dependencies in a folder that already has `node_modules`, run
  `npm ci --dry-run && npm i --no-save`. `npm ci --dry-run` exits 1 when
  `package.json` and `package-lock.json` disagree. `npm i --no-save` then installs the
  locked versions, keeps `node_modules`, and does not write either file. Use plain
  `npm ci` only when `node_modules` does not exist or a package in it is damaged
