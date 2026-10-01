// The positive check: a reply whose long sentences state no symbol, file, value or
// condition is blocked, even when every word in it is allowed.
//
// Run: node hooks/__tests__/evidence.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evidenceProblems } from '../../lib/evidence.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'),
      hook = join(root, 'hooks', 'check-prose.mjs');

function stop(reply) {
   const payload = JSON.stringify({ hook_event_name: 'Stop', last_assistant_message: reply });

   try {
      return execFileSync('node', [ hook ], { input: payload, encoding: 'utf8', cwd: root });
   } catch (err) {
      return (err.stdout ?? '') + (err.stderr ?? '');
   }
}

// Four sentences, every word allowed by the vale lists, no symbol, file, value or
// condition in any of them. This is what the word lists alone score 0 errors on.
const FLUFF = [
   'The change improves the overall structure of the module and makes the behavior much',
   'more predictable for anyone reading it later. It was important to align the',
   'implementation with what the tests expect, and the result is a cleaner separation that',
   'should serve us well going forward. There were a few considerations here, but on',
   'balance this approach seemed like the right call.',
].join('\n');

const CONCRETE = [
   '`updateTopURL` (`tab-stack.ts:114`) assigns `fullPath` and leaves `path`, so a root',
   'entry that `useSelectedTab` decorated with `#tab=` never equaled `rootPath`.',
   '',
   'The full app suite reports 431 files and 7217 passed, with 3 todo.',
].join('\n');

// One bare sentence in an otherwise concrete reply is a connective, not the failure.
const ONE_BARE = [
   '`_refreshRootEntry` now compares `root.path === tabDef.rootPath`, which is the field',
   '`updateTopURL` leaves alone.',
   '',
   'It seemed like the better of the two ways to go about solving this particular problem.',
].join('\n');

assert.equal(evidenceProblems(FLUFF).length, 3, 'three long sentences state no fact');
assert.equal(evidenceProblems(CONCRETE).length, 0, 'concrete prose is not reported');
assert.equal(evidenceProblems(ONE_BARE).length, 0, 'a single bare sentence is under the share');

const fenced = [ '```', 'const x = 1;', '```', '', FLUFF ].join('\n');

assert.equal(evidenceProblems(fenced).length, 3, 'a fenced block does not excuse the prose after it');

const blocked = stop(FLUFF);

assert.match(blocked, /"decision":"block"/, 'the Stop hook blocks a reply that states no fact');
assert.match(blocked, /States no fact/, 'the reason names the failing sentences');

assert.equal(stop(CONCRETE).trim(), '', 'the Stop hook passes concrete prose silently');

console.log('evidence.test.mjs: 7 assertions passed');
