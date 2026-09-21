#!/usr/bin/env node
// Checks the parts of the prose tooling that are ours rather than vale's:
//
//   * a Vue component is read in full: the template's prose, a `///` comment in the script
//     block, and a `//` comment in the SCSS style block. vale reads one format per file, so
//     covering all three is the behavior lib/prose.mjs adds
//   * a source file's strings are read where they are prose: a test name, an assertion
//     message, a thrown error, a command's help text, a log line, and every string in a
//     file that opts in. Each is reported at the line and column of the call it sits in
//   * the command parser reads heredocs, `-m`-style message arguments, a forge API's
//     `-f body=` field and the contents of a `-F` message file, and tells prose and
//     comments from code
//   * every extension is checked except the data formats .vale.ini names and the binary
//     ones lib/prose.mjs never opens
//   * the hook blocks on each of its three events, and a Stop block is bounded per prompt
//   * a consumer whose synced copy of a package is missing or out of date is reported,
//     because vale exits 0 and says nothing in both cases
//   * every sentence in test-fixtures/escaped.ts, each one copied from the commit it
//     reached before a rule caught it, is reported at the severity that would have
//     stopped it
//   * the recorded command in test-fixtures/escaped-command.txt, a script heredoc that
//     writes a source file, is read as that file

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import {
   REPO_ROOT, isChecked, lintFiles, lintText, proseIn, punctuationProblems, syncProblem, valeBinary,
} from '../lib/prose.mjs';

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

/** Every alert in one file as `line:column term`, in the order they appear. */
function locate(file) {
   const found = lintFiles([ file ]);

   if (found === null) {
      process.stderr.write('vale failed.\n');
      process.exit(1);
   }

   return Object.values(found).flat()
      .map((a) => { return `${a.Line}:${a.Span[0]} ${a.Match}`; })
      .sort((a, b) => { return Number.parseInt(a, 10) - Number.parseInt(b, 10); });
}

// A source file's strings are what vale never reads. The pass masks the rest of the file
// and lints what is left, so the reported line and column still point at the call. Seven
// shapes are read here: a describe name, a test name, an assertion message, a
// `.description()`, an `.option()` help string, a log line and a thrown error. The fixture
// also holds a file path, a code span and a regex, none of which this pass reads.
const located = locate('test-fixtures/sample.test.ts');

assert.deepEqual(located, [
   '5:15 seamless',
   '6:18 robust',
   '9:35 comprehensive',
   '15:25 cutting-edge',
   '16:43 pivotal',
   '20:21 vital',
   '21:26 crucial',
]);
process.stdout.write(`Source strings read seven call shapes: ${located.length} terms\n`);

// A prompt body assigned to a name has no call to anchor on, so the file opts in with a
// `prose-lint: strings` comment. The assignment, the `+` continuation and the array element
// are all read.
const opted = locate('test-fixtures/sample-prompt.ts');

assert.deepEqual(opted, [ '7:40 seamless', '8:23 robust', '12:13 comprehensive' ]);
process.stdout.write(`An opted-in file has every string read: ${opted.join(', ')}\n`);

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

// A review comment posted through a forge API carries its text in a field rather than a
// message flag, and a commit message given as a path is only on disk. Both reach a person.
assert.deepEqual(
   proseIn("gh api repos/o/r/issues/1/comments -f body='A seamless comment'").map((d) => { return d.body; }),
   [ 'A seamless comment' ],
);
assert.deepEqual(
   proseIn('glab api --method POST projects/1/notes --field body="A robust note"').map((d) => { return d.body; }),
   [ 'A robust note' ],
);

const messagePath = join(mkdtempSync(join(tmpdir(), 'prose-message-')), 'msg.txt');

writeFileSync(messagePath, 'fix: a seamless change\n');
assert.deepEqual(
   proseIn(`git commit -F ${messagePath}`).map((d) => { return [ d.ext, d.prose, d.body.trim() ]; }),
   [ [ '.md', true, 'fix: a seamless change' ] ],
);
// A path that does not exist, one holding a shell variable, and a `-F` that names a field
// rather than a file are all left alone. So is a `-F` on an unrelated command.
assert.deepEqual(proseIn('git commit -F /nope/missing.txt'), []);
assert.deepEqual(proseIn('git commit -F "$MSG_PATH"'), []);
assert.deepEqual(proseIn('grep -F pattern notes.txt'), []);
process.stdout.write('Command parser reads a forge API field and a message file\n');

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

// A consumer of a vale package, so the three states of its synced copy can be compared:
// never synced, an old copy, and current. `vale sync` reports success without replacing a
// package already in StylesPath, which is the state that used to read as a clean pass.
const pkg = mkdtempSync(join(tmpdir(), 'prose-package-')),
      consumer = mkdtempSync(join(tmpdir(), 'prose-consumer-')),
      consumerConfig = join(consumer, '.vale.ini'),
      styles = join(consumer, 'copied');

mkdirSync(join(pkg, 'styles', 'plain-english'), { recursive: true });
writeFileSync(join(pkg, 'styles', 'plain-english', 'vague.yml'), 'tokens:\n  - robust\n');
writeFileSync(consumerConfig, `StylesPath = copied\nPackages = ${pkg}\n`);

assert.match(syncProblem(consumerConfig), /not synced/, 'a missing StylesPath is reported');

mkdirSync(join(styles, 'plain-english'), { recursive: true });
writeFileSync(join(styles, 'plain-english', 'vague.yml'), 'tokens:\n  - robust\n');

assert.equal(syncProblem(consumerConfig), null, 'a current copy is silent');

writeFileSync(join(pkg, 'styles', 'plain-english', 'vague.yml'), 'tokens:\n  - robust\n  - seamless\n');

assert.match(syncProblem(consumerConfig), /old copy/, 'an old copy is reported');
assert.match(syncProblem(consumerConfig), /will not replace it/, 'and says why a re-sync is not the fix');
assert.equal(syncProblem(join(REPO_ROOT, '.vale.ini')), null, 'a config naming no packages is silent');
process.stdout.write('A missing or out-of-date copy of a vale package is reported\n');

// Every recorded miss, at the severity that would have stopped it.
//
// A rule verified only against a fresh one-line example is how the first entry escaped:
// the pattern matched the example and could not cross the line break in the real file.
// Adding a rule in response to a miss means adding that text here.
const escaped = lintFiles([ 'test-fixtures/escaped.ts' ]);

if (escaped === null) {
   process.stderr.write('vale failed.\n');
   process.exit(1);
}

assert.deepEqual(
   Object.values(escaped).flat()
      .map((a) => { return `${a.Line} ${a.Severity} ${a.Check} ${JSON.stringify(a.Match)}`; })
      .sort(),
   [
      '13 error plain-english.jargon "names\\nthe"',
      '22 error plain-english.vague "underscores\\nthe"',
   ],
);
process.stdout.write(`Every recorded miss is caught: ${Object.values(escaped).flat().length} of them\n`);

// The recorded command, read as the file its script writes.
//
// A `python3 - <<'PY'` that edits a file has no redirect and no message flag, so nothing
// in the parser saw it and no Write or Edit ran. That was the last route to a commit
// that reached no event.
const recorded = proseIn(readFileSync(join(REPO_ROOT, 'test-fixtures/escaped-command.txt'), 'utf8')),
      script = recorded.filter((c) => { return c.ext === '.ts'; });

assert.equal(script.length, 1, 'the script resolves to the one file it writes');
assert.equal(script[0].prose, false, 'a .ts target is read for its comments');

const scriptAlerts = (lintText(script[0].body, script[0].ext) ?? [])
   .filter((a) => { return a.Severity === 'error'; })
   .map((a) => { return a.Match; })
   .sort();

assert.deepEqual(scriptAlerts, [ 'carries', 'surface' ]);
process.stdout.write(`A script heredoc is read as the file it writes: ${scriptAlerts.join(', ')}\n`);

// A one-sentence doc comment is shorter than any character floor, and it is still prose.
// Found while checking the rule above against a real command rather than a written
// example, which is the second time a length assumption hid a miss.
const SHORT = [
   "python3 - <<'PY'",
   'import pathlib',
   "p = pathlib.Path('src/a.ts')",
   'p.write_text("""/** A robust plan. */""")',
   'PY',
].join('\n');

assert.deepEqual(proseIn(SHORT).map((d) => { return [ d.ext, d.body ]; }), [ [ '.ts', '/** A robust plan. */' ] ]);
// A path and a bare identifier are not content, so neither reaches vale.
assert.deepEqual(proseIn("python3 - <<'PY'\nimport pathlib\npathlib.Path('src/a.ts').write_text('x')\nPY"), []);
process.stdout.write('A short doc comment in a script is read, a path in one is not\n');
