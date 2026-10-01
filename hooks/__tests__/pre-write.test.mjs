// The Write and Edit check, now that it runs before the tool rather than after it.
//
// Run: node hooks/__tests__/pre-write.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'),
      hook = join(root, 'hooks', 'check-prose.mjs'),
      // A filename that does not exist, in a directory that does. The old check read the
      // saved file and stood down when it was absent, so a first Write to a new path went
      // unread. The directory has to be real, because `standDownIfUnsynced` walks up from
      // it to find the governing `.vale.ini`.
      absent = join(root, 'not-a-real-file.md');

function pre(toolName, toolInput) {
   const payload = JSON.stringify({
      hook_event_name: 'PreToolUse',
      tool_name: toolName,
      tool_input: toolInput,
   });

   try {
      return execFileSync('node', [ hook ], { input: payload, encoding: 'utf8', cwd: root });
   } catch (err) {
      return (err.stdout ?? '') + (err.stderr ?? '');
   }
}

// A PreToolUse denial is `permissionDecision: deny`, not the `decision: block` that Stop
// returns. The two events do not share an output format.
function blocks(out) {
   return /"permissionDecision"\s*:\s*"deny"/.test(out);
}

assert.equal(existsSync(absent), false, 'the fixture path must not exist');

// A banned word in a Write is caught before anything is saved.
assert.equal(
   blocks(pre('Write', { file_path: absent, content: '# Notes\n\nThe guardrails help here.\n' })),
   true,
   'a Write holding a banned word must block'
);

// The file never existed, so nothing was created by the check.
assert.equal(existsSync(absent), false, 'the check must not create the file');

// Clean text passes.
assert.equal(
   blocks(pre('Write', { file_path: absent, content: '# Notes\n\nThe two tests cover it.\n' })),
   false,
   'clean text must pass'
);

// An Edit is read from its replacement, not from the file on disk.
assert.equal(
   blocks(pre('Edit', { file_path: absent, old_string: 'a', new_string: 'It sits at the root.' })),
   true,
   'an Edit replacement holding a banned word must block'
);

assert.equal(
   blocks(pre('Edit', { file_path: absent, old_string: 'a', new_string: 'The value is 3.' })),
   false,
   'a clean Edit replacement must pass'
);

// A skipped extension is still skipped.
assert.equal(
   blocks(pre('Write', { file_path: join(root, 'x.json'), content: '{ "a": "the guardrails help" }\n' })),
   false,
   'a skipped extension must pass'
);

console.log('pre-write: 6 passed');
