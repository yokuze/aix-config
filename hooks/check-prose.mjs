#!/usr/bin/env node
// Checks the agent's writing against the Plain English word lists, at the two points
// where prose reaches the user.
//
//   Stop        the reply, after it has been sent
//   PostToolUse the file just written or edited
//
// Stop cannot filter anything. It fires once the reply has already streamed to the user,
// and blocking it only stops the turn from ending, so the correction arrives as a second
// message. PostToolUse is closer to a gate: the file is already written, but the fix
// lands before the turn ends and before anyone reads it.
//
// An Edit is checked on its replacement's own lines. The rest of the file may be someone
// else's, and blocking on text this turn never touched would be wrong. A Write is checked
// whole, because every line of it is this turn's.
//
// The vale calls live in lib/prose.mjs, which the repo linter uses too, so the word lists
// and the Vue handling each have one implementation.
//
// vale reports `error` for terms with no plain use and `warning` for terms with a plain
// replacement. Only errors block. A warning has a legitimate use when quoting a spec or
// someone else's copy, so a false positive there must not stop anything.
//
// Register in ~/.claude/settings.json:
//   "Stop":        [ { "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ]
//   "PostToolUse": [ { "matcher": "Write|Edit", "hooks": [ { ...same... } ] } ]

import { existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { configFor, isChecked, isSkipped, isUnsynced, lintFiles, lintText, valeBinary } from '../lib/prose.mjs';

const VALE_FAILED = 'Prose check skipped: vale could not run. Try `vale sync` in this project.';

/**
 * Reports and stands down when the config governing this path has no rules to apply.
 *
 * A project pointing at a vale package it has not synced is the case that matters. vale
 * finds no styles, exits 0, and reports nothing, which is indistinguishable from prose
 * that passed. Better to say the check did not happen.
 */
function standDownIfUnsynced(startDir) {
   const config = configFor(startDir);

   if (!isUnsynced(config)) {
      return;
   }
   process.stdout.write(JSON.stringify({
      systemMessage: `Prose check skipped: ${config} names vale packages that are not synced. Run \`vale sync\` there.`,
   }));
   process.exit(0);
}

function readPayload() {
   try {
      return JSON.parse(readFileSync(0, 'utf8'));
   } catch {
      return {};
   }
}

function lastAssistantText(transcriptPath) {
   let lines;

   try {
      lines = readFileSync(transcriptPath, 'utf8').trim().split('\n');
   } catch {
      return '';
   }

   for (let i = lines.length - 1; i >= 0; i--) {
      let entry;

      try {
         entry = JSON.parse(lines[i]);
      } catch {
         continue;
      }
      if (entry?.message?.role !== 'assistant') {
         continue;
      }
      const content = entry.message.content;

      if (typeof content === 'string') {
         return content;
      }
      if (Array.isArray(content)) {
         return content.filter((part) => { return part.type === 'text'; })
            .map((part) => { return part.text; })
            .join('\n');
      }
   }
   return '';
}

// vale skips fenced blocks and inline spans itself. This is only for the punctuation
// counts, which are characters inside a sentence rather than words.
function punctuationProblems(text) {
   const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`\n]*`/g, ' '),
         emDashes = (prose.match(/—/g) ?? []).length,
         semicolons = (prose.match(/;/g) ?? []).length,
         problems = [];

   if (emDashes) {
      problems.push(`${emDashes} em dash(es). Write two sentences.`);
   }
   if (semicolons) {
      problems.push(`${semicolons} semicolon(s) in prose. Write two sentences.`);
   }
   return problems;
}

function report({ alerts, problems, subject }) {
   const blocked = alerts.filter((a) => { return a.Severity === 'error'; }),
         reported = alerts.filter((a) => { return a.Severity === 'warning'; }),
         notes = reported.length
            ? `\nAlso reported, your call: ${[ ...new Set(reported.map((a) => { return a.Message; })) ].join(' ')}`
            : '';

   // Each rule file words its own message, and repeating them beats one sentence written to
   // cover all of them: a British spelling and a vague term need different fixes.
   if (blocked.length) {
      problems.unshift(...new Set(blocked.map((a) => { return a.Message; })));
   }

   if (!problems.length) {
      if (notes) {
         process.stdout.write(JSON.stringify({ systemMessage: `Plain English notes.${notes}` }));
      }
      process.exit(0);
   }

   // The label test only answers a vague-term block. A misspelling or an em dash has a
   // fix that does not involve going to find a value.
   const labelTest = blocked.some((a) => { return a.Check === 'plain-english.vague'; })
      ? [
         'The test: if a sentence refers to a thing, name that thing. If it asserts a behavior,',
         'give the value or say where the behavior is defined. A sentence with neither is a label.',
         'If you do not have the value, go and measure it, then rewrite.',
      ]
      : [];

   const reason = [
      `${subject} breaks the Plain English output style.`,
      ...problems.map((p) => { return `- ${p}`; }),
      '',
      ...labelTest,
      'Send the corrected text only. Do not mention this correction or what you changed.',
   ].join('\n') + notes;

   process.stdout.write(JSON.stringify({ decision: 'block', reason }));
   process.exit(0);
}

const payload = readPayload(),
      event = payload.hook_event_name ?? 'Stop';

// A blocked reply re-enters this hook. Reporting once is the point, so stand down.
if (event === 'Stop' && payload.stop_hook_active) {
   process.exit(0);
}

if (!valeBinary()) {
   process.stdout.write(JSON.stringify({
      systemMessage: 'Prose check skipped: @vvago/vale is not installed. Run npm install in aix-config.',
   }));
   process.exit(0);
}

/**
 * The line numbers an Edit touched, as [start, end] pairs.
 *
 * An Edit replaces one passage in a file that may be mostly someone else's. Linting the
 * whole file would block on text this turn never touched, so only the replacement's own
 * lines count. Write is different: every line is this turn's, so it needs no filter.
 *
 * Returns null when the replacement cannot be located, which means the file moved on
 * since the edit. Reporting nothing beats reporting against the wrong lines.
 */
function editedRanges(content, { old_string: removed, new_string: added, replace_all: all }) {
   if (typeof added !== 'string' || !added.length) {
      return [];
   }
   const ranges = [],
         lineAt = (index) => { return content.slice(0, index).split('\n').length; },
         span = added.split('\n').length - 1;

   for (let from = 0; ; ) {
      const at = content.indexOf(added, from);

      if (at === -1) {
         break;
      }
      const start = lineAt(at);

      ranges.push([ start, start + span ]);
      if (!all) {
         break;
      }
      from = at + added.length;
   }
   return ranges.length ? ranges : (removed === undefined ? [] : null);
}

if (event === 'PostToolUse') {
   const file = payload.tool_input?.file_path ?? '';

   if (!file || isSkipped(file) || !isChecked(file) || !existsSync(file)) {
      process.exit(0);
   }

   let ranges = [];

   if (payload.tool_name === 'Edit') {
      ranges = editedRanges(readFileSync(file, 'utf8'), payload.tool_input ?? {});
      if (ranges === null || !ranges.length) {
         process.exit(0);
      }
   }

   standDownIfUnsynced(dirname(file));

   // One file, so the scope is as narrow as it gets. No directory is walked.
   const alerts = lintFiles([ file ]);

   if (alerts === null) {
      process.stdout.write(JSON.stringify({ systemMessage: VALE_FAILED }));
      process.exit(0);
   }

   const found = Object.values(alerts).flat()
      .filter((a) => { return !ranges.length || ranges.some(([ from, to ]) => { return a.Line >= from && a.Line <= to; }); });

   report({
      alerts: found,
      problems: [],
      subject: `What you wrote to ${file}`,
   });
}

standDownIfUnsynced(process.cwd());

const reply = lastAssistantText(payload.transcript_path ?? '');

if (!reply.trim()) {
   process.exit(0);
}

const alerts = lintText(reply, '.md');

if (alerts === null) {
   process.stdout.write(JSON.stringify({ systemMessage: VALE_FAILED }));
   process.exit(0);
}

report({
   alerts,
   problems: punctuationProblems(reply),
   subject: 'Your reply',
});
