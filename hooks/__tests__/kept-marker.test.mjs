// The `Kept` marker, checked against the four ways it could let a violation through.
//
// Run: node hooks/__tests__/kept-marker.test.mjs

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..'),
      hook = join(root, 'hooks', 'check-prose.mjs');

function stop(reply) {
   const payload = JSON.stringify({ hook_event_name: 'Stop', last_assistant_message: reply });

   let out = '';

   try {
      out = execFileSync('node', [ hook ], { input: payload, encoding: 'utf8', cwd: root });
   } catch (err) {
      out = (err.stdout ?? '') + (err.stderr ?? '');
   }

   return out;
}

function blocks(reply) {
   const out = stop(reply);

   return out.includes('"decision":"block"') || out.includes('"decision": "block"');
}

// A warning with no `Kept` line now blocks, where it used to print after the turn ended.
assert.equal(blocks('The node holds content in every case.'), true, 'unanswered warning must block');

// Answering it clears that one word.
assert.equal(
   blocks('The node holds content in every case.\n\nKept "holds": the sentence quotes the spec wording.'),
   false,
   'an answered warning must clear'
);

// One answer must not clear a different word in the same reply.
assert.equal(
   blocks('The node holds content and the landscape of the app is wide.\n\nKept "holds": the spec uses this word.'),
   true,
   'an answer must not clear a word it does not name'
);

// An error is never clearable.
assert.equal(
   blocks('The value sits at the root.\n\nKept "sits at": I want to keep this phrasing here.'),
   true,
   'a Kept line must not clear an error'
);

// A bare term with no reason is not an answer.
assert.equal(
   blocks('The node holds content in every case.\n\nKept "holds": x'),
   true,
   'a reason under 15 characters must not clear'
);

// The quoted term inside the Kept line must not report itself.
assert.equal(
   blocks('Kept "holds": the wording comes straight from the published spec.'),
   false,
   'the marker must not trip its own word'
);

console.log('kept-marker: 6 passed');
