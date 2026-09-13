#!/usr/bin/env node
// Checks the parts of the prose tooling that are ours rather than vale's:
//
//   * a Vue component is read in full: the template's prose, a `///` comment in the script
//     block, and a `//` comment in the SCSS style block. vale reads one format per file, so
//     covering all three is the behavior lib/prose.mjs adds
//   * a test file's names and assertion messages are read, at the line and column of the
//     call they sit in, and the strings around them are not
//   * the command parser reads heredocs and `-m`-style message arguments, and tells prose
//     and comments from code
//   * every extension is checked except the data formats .vale.ini names and the binary
//     ones lib/prose.mjs never opens
//   * the hook blocks on each of its three events, and a Stop block is bounded per prompt

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { REPO_ROOT, isChecked, lintFiles, proseIn, punctuationProblems, valeBinary } from '../lib/prose.mjs';

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

// A test file's names and assertion messages are strings, which vale never reads. The
// source-string pass masks the rest of the file and lints what is left, so the reported
// line and column still point at the call. The fixture also holds a file path, a code span
// and a `new Error` message, none of which this pass reads.
const SOURCE_FIXTURE = 'test-fixtures/sample.test.ts',
      sourceAlerts = lintFiles([ SOURCE_FIXTURE ]);

if (sourceAlerts === null) {
   process.stderr.write('vale failed.\n');
   process.exit(1);
}

const located = Object.values(sourceAlerts).flat()
   .map((a) => { return `${a.Line}:${a.Span[0]} ${a.Match}`; })
   .sort();

assert.deepEqual(located, [ '5:15 seamless', '6:18 robust', '9:35 comprehensive' ]);
process.stdout.write(`Source strings read test names and assertion messages: ${located.join(', ')}\n`);

// Four heredocs: a description written to a .md file, a commit message piped to git, a
// Python script whose output is redirected to a .json file, and a TypeScript file. The
// first two are prose. The last two are read under the extension they are written to, and
// the skip section in .vale.ini is what leaves the .json body alone.
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
   proseIn(COMMAND).map((d) => { return [ d.ext, d.prose, d.body.split('\n').length ]; }),
   [ [ '.md', true, 1 ], [ '.md', true, 3 ], [ '.json', false, 1 ], [ '.ts', false, 2 ] ],
);
assert.deepEqual(proseIn('echo "no heredoc here" > notes.md'), []);

// A commit message given to `-m` rather than on stdin. `git -c ... commit` puts an option
// between the two words, and the shell has already removed the backslashes, so the body
// vale reads is the body git receives.
assert.deepEqual(
   proseIn('git -c commit.gpgsign=false commit -q -m "feat: add it\n\nIt shares a \\`track\\`."')
      .map((d) => { return d.body; }),
   [ 'feat: add it\n\nIt shares a `track`.' ],
);
assert.deepEqual(
   proseIn('gh pr create --title "Add it" --body \'A robust plan\'').map((d) => { return d.body; }),
   [ 'Add it', 'A robust plan' ],
);
// A flag inside a message body is text, and a `-d` on another command is not a message.
assert.deepEqual(proseIn('git commit -m "pass -m to set it"').map((d) => { return d.body; }), [ 'pass -m to set it' ]);
assert.deepEqual(proseIn('curl -d \'{"seamless": true}\' https://example.com'), []);
assert.deepEqual(
   punctuationProblems('One — two; and `x — y;` in code'),
   [ '1 em dash(es). Write two sentences.', '1 semicolon(s) in prose. Write two sentences.' ],
);
process.stdout.write('Command parser keeps prose and comments, skips code\n');

// The default is that everything counts as prose. A commit message written to a `.txt`
// file reached a repository unread while this was an allowlist of extensions.
const scratch = mkdtempSync(join(tmpdir(), 'check-prose-'));

for (const [ name, blocks ] of [
   [ 'msg.txt', true ],
   [ 'Dockerfile', true ],
   [ 'notes.rake', true ],
   [ 'data.json', false ],
   [ 'chart.svg', false ],
]) {
   const file = join(scratch, name);

   writeFileSync(file, '# a plan that carries the count\n');
   assert.equal(isChecked(file), true, `${name} is text`);
   assert.equal(Object.keys(lintFiles([ file ])).length > 0, blocks, `${name} alerts: ${blocks}`);
}
assert.equal(isChecked(join(scratch, 'icon.png')), false, 'a binary file never reaches vale');
process.stdout.write('Every extension is checked except data and binary formats\n');

function runHook(input) {
   const result = spawnSync(process.execPath, [ join(REPO_ROOT, 'hooks', 'check-prose.mjs') ], {
      cwd: REPO_ROOT,
      input: JSON.stringify(input),
      encoding: 'utf8',
   });

   assert.equal(result.status, 0, result.stderr);
   return result.stdout ? JSON.parse(result.stdout) : {};
}

const stop = (extra) => {
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

const inline = runHook({
   hook_event_name: 'PreToolUse',
   tool_name: 'Bash',
   tool_input: { command: 'git commit -q -m "feat: add it\n\nThe field carries the count."' },
});

assert.equal(inline.hookSpecificOutput?.permissionDecision, 'deny');
assert.match(inline.hookSpecificOutput.permissionDecisionReason, /carries/);
process.stdout.write('PreToolUse denies a commit message given to -m\n');
