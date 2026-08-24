#!/usr/bin/env node
// Checks that a Vue component is read in full: the template's prose, a `///` comment in
// the script block, and a `//` comment in the SCSS style block.
//
// vale reads one format per file, so covering all three is the behavior lib/prose.mjs
// adds and the part worth pinning.

import { lintFiles, valeBinary } from '../lib/prose.mjs';

if (!valeBinary()) {
   process.stderr.write('vale is not installed. Run npm install.\n');
   process.exit(1);
}

const FIXTURE = 'test-fixtures/sample.vue',
      alerts = lintFiles([ FIXTURE ]);

if (alerts === null) {
   process.stderr.write('vale failed.\n');
   process.exit(1);
}

const matched = Object.values(alerts).flat().map((a) => { return a.Match; }).sort(),
      expected = [ 'comprehensive', 'robust', 'seamless' ];

if (JSON.stringify(matched) !== JSON.stringify(expected)) {
   process.stderr.write(`expected ${expected.join(', ')}\n     got ${matched.join(', ') || '(nothing)'}\n`);
   process.exit(1);
}
process.stdout.write(`Vue two-pass reads template, script and style comments: ${matched.join(', ')}\n`);
