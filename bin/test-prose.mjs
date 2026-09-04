#!/usr/bin/env node
// Checks the parts of the prose tooling that are ours rather than vale's:
//
//   * a Vue component is read in full: the template's prose, a `///` comment in the script
//     block, and a `//` comment in the SCSS style block. vale reads one format per file, so
//     covering all three is the behavior lib/prose.mjs adds
//   * the heredoc parser tells prose and comments from code
//   * the hook blocks on each of its three events, and a Stop block is bounded per prompt

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { REPO_ROOT, heredocs, lintFiles, punctuationProblems, valeBinary } from '../lib/prose.mjs';

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

const matched = Object.values(alerts).flat().map((a) => { return a.Match; }).sort();

assert.deepEqual(matched, [ 'comprehensive', 'robust', 'seamless' ]);
process.stdout.write(`Vue two-pass reads template, script and style comments: ${matched.join(', ')}\n`);

// Four heredocs: a description written to a .md file, a commit message piped to git, a
// Python script, and a TypeScript file. The first two are prose, the third is code and is
// skipped, the fourth is read for its comment.
const COMMAND = [
   'cat > "$T/mr-body.md" <<\'EOF\'',
   'A robust plan — really.',
   'EOF',
   'git commit -S -q -F - <<\'EOF\'',
   'feat: add the thing',
   '',
   'Body; with a semicolon.',
   'EOF',
   'python3 - <<\'PYEOF\' > out.json',
   'x = 1; y = 2',
   'PYEOF',
   'cat > lib/a.ts <<EOF',
   '// a seamless helper',
   'const a = 1;',
   'EOF',
].join('\n');

assert.deepEqual(
   heredocs(COMMAND).map((d) => { return [ d.ext, d.prose, d.body.split('\n').length ]; }),
   [ [ '.md', true, 1 ], [ '.md', true, 3 ], [ '.ts', false, 2 ] ],
);
assert.deepEqual(heredocs('echo "no heredoc here" > notes.md'), []);
assert.deepEqual(
   punctuationProblems('One — two; and `x — y;` in code'),
   [ '1 em dash(es). Write two sentences.', '1 semicolon(s) in prose. Write two sentences.' ],
);
process.stdout.write('Heredoc parser keeps prose and comments, skips code\n');

function runHook(input) {
   const result = spawnSync(process.execPath, [ join(REPO_ROOT, 'hooks', 'check-prose.mjs') ], {
      cwd: REPO_ROOT,
      input: JSON.stringify(input),
      encoding: 'utf8',
   });

   assert.equal(result.status, 0, result.stderr);
   return result.stdout ? JSON.parse(result.stdout) : {};
}

const scratch = mkdtempSync(join(tmpdir(), 'check-prose-')),
      stop = (extra) => {
         return runHook({
            hook_event_name: 'Stop',
            scratchpad_dir: scratch,
            prompt_id: 'prompt-1',
            last_assistant_message: 'The fix — again — is in; done.',
            ...extra,
         });
      };

assert.equal(stop({ stop_hook_active: false }).decision, 'block', 'first reply blocks');
assert.equal(stop({ stop_hook_active: true }).decision, 'block', 'the corrected reply is checked too');
assert.equal(stop({ stop_hook_active: true }).decision, undefined, 'and then the hook stands down');
assert.equal(stop({ stop_hook_active: false, prompt_id: 'prompt-2', last_assistant_message: 'Done.' }).decision, undefined);
process.stdout.write('Stop blocks twice per prompt, then stands down\n');

const denied = runHook({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: COMMAND } });

assert.equal(denied.hookSpecificOutput?.permissionDecision, 'deny');
assert.match(denied.hookSpecificOutput.permissionDecisionReason, /robust/);
assert.match(denied.hookSpecificOutput.permissionDecisionReason, /seamless/);
assert.match(denied.hookSpecificOutput.permissionDecisionReason, /1 em dash/);
assert.match(denied.hookSpecificOutput.permissionDecisionReason, /1 semicolon/);
assert.deepEqual(
   runHook({ hook_event_name: 'PreToolUse', tool_name: 'Bash', tool_input: { command: 'python3 - <<\'PY\'\nx = 1; y = 2\nPY' } }),
   {},
);
process.stdout.write('PreToolUse denies a prose heredoc and leaves code alone\n');
