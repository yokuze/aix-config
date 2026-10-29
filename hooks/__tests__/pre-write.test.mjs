// The Write and Edit check, now that it runs before the tool rather than after it.
//
// Run: node hooks/__tests__/pre-write.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
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

// A commit heredoc saved in a shell script is checked as the command it is. Linting the
// script as code read only its comments, so writing the command to a script and running
// that skipped the Bash check.
const commit = 'git commit -F - <<\'EOF\'\nfix: handle the case\n\nIt failed; it passes.\nEOF\n',
      cleanCommit = 'git commit -F - <<\'EOF\'\nfix: handle the case\n\nIt failed. It passes.\nEOF\n';

assert.equal(
   blocks(pre('Write', { file_path: join(root, 'tmp', 'commit.sh'), content: `#!/bin/bash\n${commit}` })),
   true,
   'a Write of a script holding a commit heredoc with a semicolon must block'
);

assert.equal(
   blocks(pre('Write', { file_path: join(root, 'tmp', 'commit'), content: `#!/usr/bin/env bash\n${commit}` })),
   true,
   'a script with no extension is found by its shebang'
);

assert.equal(
   blocks(pre('Write', { file_path: join(root, 'tmp', 'commit.sh'), content: `#!/bin/bash\n${cleanCommit}` })),
   false,
   'a script with a clean commit heredoc must pass'
);

assert.equal(
   blocks(pre('Bash', { command: `cat > "$TMPDIR/commit.sh" <<'SH'\n${commit}SH` })),
   true,
   'a heredoc that writes a script is checked as the commands in it'
);

// A script that exists before the command, written by any route, is read when it runs.
const jobDir = mkdtempSync(join(tmpdir(), 'pre-write-')),
      script = join(jobDir, 'commit.sh');

writeFileSync(script, `#!/bin/bash\n${commit}`);

function preWithJobDir(command) {
   const payload = JSON.stringify({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command } });

   return execFileSync('node', [ hook ], {
      input: payload,
      encoding: 'utf8',
      cwd: root,
      env: { ...process.env, CLAUDE_JOB_DIR: jobDir },
   });
}

try {
   assert.equal(blocks(preWithJobDir(`bash ${script}`)), true, 'running a script with bash must read it');
   assert.equal(blocks(preWithJobDir(`cd /tmp && ${script}`)), true, 'running a script by path must read it');
   assert.equal(
      blocks(preWithJobDir('bash "$CLAUDE_JOB_DIR/commit.sh"')),
      true,
      'a script path holding an environment variable is expanded'
   );
   assert.equal(blocks(preWithJobDir(`cat ${script}`)), false, 'reading a script without running it must pass');
} finally {
   rmSync(jobDir, { recursive: true, force: true });
}

console.log('pre-write: 14 passed');
