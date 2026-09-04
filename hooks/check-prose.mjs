#!/usr/bin/env node
// Checks the agent's writing against the Plain English word lists, at the three points
// where prose leaves the session.
//
//   Stop        the reply, after it has been sent
//   PostToolUse the file just written or edited
//   PreToolUse  a heredoc inside a Bash command, before the command runs
//
// Stop cannot filter anything. It fires once the reply has already streamed to the user,
// and blocking it only stops the turn from ending, so the correction arrives as a second
// message. The reply comes from `last_assistant_message` in the payload. The transcript
// file is the fallback, and in a long session it can lag the reply, which read as a pass.
//
// A Stop block is bounded per prompt rather than by `stop_hook_active`. Claude Code sets
// that flag on every Stop after a block, for the rest of the turn, and standing down on it
// meant the corrected reply went unread. The count of blocks lives in the session's
// scratchpad, keyed by prompt, and the hook stops after MAX_BLOCKS_PER_PROMPT.
//
// PostToolUse runs after the write, but the fix lands before the turn ends and before
// anyone reads the file. An Edit is checked on its replacement's own lines. The rest of
// the file may be someone else's, and blocking on text this turn never touched would be
// wrong. A Write is checked whole, because every line of it is this turn's.
//
// PreToolUse is the one event that runs before the text lands. Merge request descriptions
// and commit messages travel as heredocs in Bash commands, which the other two events
// never see, and a denied command does not run. lib/prose.mjs decides which heredocs are
// prose, which are comments, and which are code to leave alone.
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
//   "PreToolUse":  [ { "matcher": "Bash", "hooks": [ { ...same... } ] } ]

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import {
   PUNCTUATED,
   configFor,
   heredocs,
   isChecked,
   isSkipped,
   isUnsynced,
   lintFiles,
   lintText,
   punctuationProblems,
   valeBinary,
} from '../lib/prose.mjs';

const VALE_FAILED = 'Prose check skipped: vale could not run. Try `vale sync` in this project.',
      MAX_BLOCKS_PER_PROMPT = 2;

function readPayload() {
   try {
      return JSON.parse(readFileSync(0, 'utf8'));
   } catch {
      return {};
   }
}

const payload = readPayload(),
      event = payload.hook_event_name ?? 'Stop';

function write(output) {
   process.stdout.write(JSON.stringify(output));
}

/** Stops the tool call, or the turn, with the reason. Each event has its own shape. */
function deny(reason) {
   if (event === 'PreToolUse') {
      write({
         hookSpecificOutput: {
            hookEventName: 'PreToolUse',
            permissionDecision: 'deny',
            permissionDecisionReason: reason,
         },
      });
      return;
   }
   write({ decision: 'block', reason });
}

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
   write({
      systemMessage: `Prose check skipped: ${config} names vale packages that are not synced. Run \`vale sync\` there.`,
   });
   process.exit(0);
}

/** The reply, read from the transcript. For a Claude Code that sends no `last_assistant_message`. */
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

/**
 * How many times this hook has blocked the reply to the current prompt, and a way to
 * record one more.
 *
 * `record` returns false when the block must not happen: the count could not be written
 * and the turn is already a re-reply, which is the one case that could loop.
 */
function blockCounter() {
   const dir = payload.scratchpad_dir ?? tmpdir(),
         file = join(dir, `check-prose-blocks-${payload.prompt_id ?? payload.session_id ?? 'unknown'}`);

   let count = 0;

   try {
      count = Number(readFileSync(file, 'utf8')) || 0;
   } catch {
      // No file yet: nothing has been blocked for this prompt.
   }

   return {
      count,
      record() {
         try {
            mkdirSync(dir, { recursive: true });
            writeFileSync(file, String(count + 1));
            return true;
         } catch {
            return !payload.stop_hook_active;
         }
      },
   };
}

function report({ alerts, problems, subject, closing, onBlock = () => { return true; } }) {
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

   if (!problems.length || !onBlock()) {
      if (notes) {
         write({ systemMessage: `Plain English notes.${notes}` });
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
      closing,
   ].join('\n') + notes;

   deny(reason);
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

function checkHeredocs() {
   if (payload.tool_name !== 'Bash') {
      process.exit(0);
   }
   const docs = heredocs(payload.tool_input?.command ?? '');

   if (!docs.length) {
      process.exit(0);
   }
   standDownIfUnsynced(process.cwd());

   const alerts = [];

   for (const doc of docs) {
      const found = lintText(doc.body, doc.ext);

      if (found === null) {
         write({ systemMessage: VALE_FAILED });
         process.exit(0);
      }
      alerts.push(...found);
   }

   report({
      alerts,
      problems: punctuationProblems(docs.filter((d) => { return d.prose; }).map((d) => { return d.body; }).join('\n')),
      subject: 'The heredoc in this command',
      closing: 'Rewrite the heredoc and run the command again. Do not mention this correction.',
   });
}

function checkFile() {
   const file = payload.tool_input?.file_path ?? '';

   if (!file || isSkipped(file) || !isChecked(file) || !existsSync(file)) {
      process.exit(0);
   }

   // For a Write the whole file is this turn's text. For an Edit only the replacement is.
   let ranges = [],
       written = readFileSync(file, 'utf8');

   if (payload.tool_name === 'Edit') {
      ranges = editedRanges(written, payload.tool_input ?? {});
      if (ranges === null || !ranges.length) {
         process.exit(0);
      }
      written = payload.tool_input.new_string;
   }

   standDownIfUnsynced(dirname(file));

   // One file, so the scope is as narrow as it gets. No directory is walked.
   const alerts = lintFiles([ file ]);

   if (alerts === null) {
      write({ systemMessage: VALE_FAILED });
      process.exit(0);
   }

   const found = Object.values(alerts).flat()
      .filter((a) => { return !ranges.length || ranges.some(([ from, to ]) => { return a.Line >= from && a.Line <= to; }); });

   report({
      alerts: found,
      problems: PUNCTUATED.has(extname(file)) ? punctuationProblems(written) : [],
      subject: `What you wrote to ${file}`,
      closing: 'Fix the file. Do not mention this correction or what you changed.',
   });
}

function checkReply() {
   const rounds = blockCounter();

   if (payload.stop_hook_active && rounds.count >= MAX_BLOCKS_PER_PROMPT) {
      process.exit(0);
   }

   standDownIfUnsynced(process.cwd());

   const reply = payload.last_assistant_message ?? lastAssistantText(payload.transcript_path ?? '');

   if (!reply.trim()) {
      process.exit(0);
   }

   const alerts = lintText(reply, '.md');

   if (alerts === null) {
      write({ systemMessage: VALE_FAILED });
      process.exit(0);
   }

   report({
      alerts,
      problems: punctuationProblems(reply),
      subject: 'Your reply',
      closing: 'Send the corrected text only. Do not mention this correction or what you changed.',
      onBlock: rounds.record,
   });
}

if (!valeBinary()) {
   write({ systemMessage: 'Prose check skipped: @vvago/vale is not installed. Run npm install in aix-config.' });
   process.exit(0);
}

if (event === 'PreToolUse') {
   checkHeredocs();
}
if (event === 'PostToolUse') {
   checkFile();
}
checkReply();
