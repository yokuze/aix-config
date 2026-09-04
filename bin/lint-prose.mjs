#!/usr/bin/env node
// Lints prose and code comments with vale.
//
// Usage: node bin/lint-prose.mjs [path ...]
//
// A path may be a file or a directory. Give it the narrowest scope that answers the
// question, because a directory argument is walked in full. With no arguments it walks the
// repository root, which is the slowest way to call this.
//
// Exits 1 when it finds an error-level term, so CI can fail on it.

import { collectFiles, lintFiles, valeBinary } from '../lib/prose.mjs';

if (!valeBinary()) {
   process.stderr.write('vale is not installed. Run npm install.\n');
   process.exit(1);
}

const paths = process.argv.slice(2).length ? process.argv.slice(2) : [ '.' ],
      files = collectFiles(paths);

if (!files.length) {
   process.stdout.write(`Nothing to lint in ${paths.join(', ')}\n`);
   process.exit(0);
}

const alerts = lintFiles(files);

if (alerts === null) {
   process.stderr.write('vale failed. Run it directly to see why.\n');
   process.exit(1);
}

let errors = 0,
    warnings = 0;

for (const file of Object.keys(alerts).sort()) {
   const found = alerts[file];

   if (!found?.length) {
      continue;
   }
   process.stdout.write(`\n${file}\n`);

   for (const alert of found.sort((a, b) => { return a.Line - b.Line || a.Span[0] - b.Span[0]; })) {
      process.stdout.write(`  ${`${alert.Line}:${alert.Span[0]}`.padEnd(8)} ${alert.Severity.padEnd(7)} ${alert.Message}  ${alert.Check}\n`);
      if (alert.Severity === 'error') {
         errors++;
      } else {
         warnings++;
      }
   }
}

process.stdout.write(`\n${errors} error(s), ${warnings} warning(s) in ${files.length} files.\n`);
process.exit(errors ? 1 : 0);
