// Reports every word-list token that matches lowercase and misses the same text
// capitalized. Vale applies `ignorecase: true` to a token written as plain words, and
// misses one holding a regex construct such as `\s` or `?` when the first letter is a
// capital. A violation at the start of a sentence is still a violation.
//
// Two vale runs, not two per token: one file of lowercase samples and one of capitalized
// samples, each token on its own line, compared by line number.
//
// Run: node bin/check-token-case.mjs

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import RandExp from 'randexp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..'),
      styles = join(root, 'styles', 'plain-english'),
      vale = join(root, 'node_modules', '@vvago', 'vale', 'bin', 'vale');

// A token is a regular expression. RandExp builds one string it matches, which is the
// text to feed vale in both cases.
function sample(token) {
   const gen = new RandExp(token.replace(/\\\\/g, '\\'));

   gen.max = 1;
   return gen.gen();
}

function tokensIn(file) {
   const text = readFileSync(join(styles, file), 'utf8'),
         out = [];

   for (const line of text.split('\n')) {
      const listed = /^\s{2}-\s+(.+?)\s*$/.exec(line),
            keyed = /^\s{2}(?!#)(.+?):\s+\S/.exec(line);

      if (listed) {
         out.push(listed[1].replace(/^["']|["']$/g, ''));
      } else if (keyed && !/^(extends|message|level|ignorecase|swap|tokens)$/.test(keyed[1])) {
         out.push(keyed[1].replace(/^["']|["']$/g, ''));
      }
   }
   return out;
}

const cases = [];

for (const file of readdirSync(styles).filter((f) => { return f.endsWith('.yml'); })) {
   for (const token of tokensIn(file)) {
      let text = '';

      try {
         text = sample(token);
      } catch {
         continue;
      }
      if (!text || !/^[a-zA-Z]/.test(text)) {
         continue;
      }
      cases.push({ file, token, text });
   }
}

const dir = mkdtempSync(join(tmpdir(), 'tokencase-')),
      // One sentence per line, so a line number maps back to one token. The wrapper words
      // are plain, so any alert on the line comes from the sample.
      lower = cases.map((c) => { return `It says ${c.text[0].toLowerCase()}${c.text.slice(1)} here.`; }),
      upper = cases.map((c) => { return `${c.text[0].toUpperCase()}${c.text.slice(1)} here it says.`; });

function linesWithAlerts(body) {
   const file = join(dir, 'probe.md');

   writeFileSync(file, body.join('\n') + '\n');

   let raw = '';

   try {
      raw = execFileSync(vale, [ `--config=${join(root, '.vale.ini')}`, '--output=JSON', file ],
         { encoding: 'utf8', cwd: root, maxBuffer: 64 * 1024 * 1024 });
   } catch (err) {
      raw = err.stdout ?? '';
   }

   const hit = new Set();

   try {
      for (const alerts of Object.values(JSON.parse(raw))) {
         for (const a of alerts) {
            hit.add(a.Line);
         }
      }
   } catch {
      // No JSON means no alerts.
   }
   return hit;
}

const lowerHits = linesWithAlerts(lower),
      upperHits = linesWithAlerts(upper);

rmSync(dir, { recursive: true, force: true });

const misses = cases
   .map((c, i) => { return { ...c, line: i + 1 }; })
   .filter((c) => { return lowerHits.has(c.line) && !upperHits.has(c.line); });

console.log(`${cases.length} tokens sampled across ${new Set(cases.map((c) => { return c.file; })).size} files`);

if (misses.length) {
   console.log(`\n${misses.length} miss a capitalized match:\n`);
   for (const m of misses) {
      console.log(`  ${m.file}: ${m.token}   (matches "${m.text}", misses it capitalized)`);
   }
   process.exit(1);
}
console.log('every token matches in both cases');
