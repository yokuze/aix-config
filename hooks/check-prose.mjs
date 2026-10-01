#!/usr/bin/env node
// Checks the agent's writing against the Plain English word lists, at the three points
// where prose leaves the session.
//
//   Stop          the reply, after it has been sent
//   SubagentStop  a subagent's report, which its parent reads and often quotes
//   PreToolUse    a Bash command's prose, and a Write or Edit, before either one runs
//
// Stop cannot filter anything. It fires once the reply has already streamed to the user,
// and blocking it only stops the turn from ending, so the correction arrives as a second
// message. The reply comes from `last_assistant_message` in the payload. The transcript
// file is the fallback, and in a long session it can lag the reply, which read as a pass.
//
// SubagentStop is the same check on the same payload fields, for the report a subagent
// hands back. Stop never sees that text, because by the time the turn ends
// `last_assistant_message` is the parent's own reply.
//
// A Stop block is bounded per prompt rather than by `stop_hook_active`. Claude Code sets
// that flag on every Stop after a block, for the rest of the turn, and standing down on it
// meant the corrected reply went unread. The count of blocks lives in the session's
// scratchpad, keyed by prompt, and the hook stops after MAX_BLOCKS_PER_PROMPT.
//
// PreToolUse is the only event that runs before the text is saved or the command runs, so
// a denied write leaves no file behind and a denied command never executes. It reads the
// tool's own input, which is this turn's text and nobody else's: `content` for a Write,
// `new_string` for an Edit. Reading the saved file instead meant linting lines this turn
// never touched, then filtering them back out by line number.
//
// Merge request descriptions and commit messages sit inside Bash commands, which Stop
// never sees. They arrive as a heredoc or as a quoted argument to `-m`, `--description`
// or `--body`. lib/prose.mjs reads both, and decides which bodies are prose, which are
// comments, and which are code to leave alone.
//
// The vale calls live in lib/prose.mjs, which the repo linter uses too, so the word lists
// and the Vue handling each have one implementation.
//
// vale reports `error` for terms with no plain use and `warning` for terms with a plain
// replacement. On a file or a command, only errors block, because a warning has a
// legitimate use when quoting a spec or someone else's copy. On a reply, an unanswered
// warning blocks too: see `keptTerms`.
//
// Register in ~/.claude/settings.json:
//   "Stop":         [ { "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ]
//   "SubagentStop": [ { "hooks": [ { ...same... } ] } ]
//   "PreToolUse":   [ { "matcher": "Bash|Write|Edit", "hooks": [ { ...same... } ] } ]

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join } from 'node:path';
import {
   PUNCTUATED,
   configFor,
   isChecked,
   isSkipped,
   lintText,
   proseIn,
   punctuationProblems,
   syncProblem,
   trackerProblems,
   valeBinary,
} from '../lib/prose.mjs';
import { evidenceProblems } from '../lib/evidence.mjs';

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

/** Stops the tool call, or the turn, with the reason. Each event has its own output fields. */
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
 * Reports and stands down when the config governing this path cannot apply current rules.
 *
 * A project pointing at a vale package it has not synced, or holding an old copy of one,
 * is the case that matters. vale exits 0 either way, which is indistinguishable from
 * prose that passed. Better to say the check did not happen.
 */
function standDownIfUnsynced(startDir) {
   const problem = syncProblem(configFor(startDir));

   if (!problem) {
      return;
   }
   write({ systemMessage: `Prose check skipped: ${problem}` });
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

function report({ alerts, problems, subject, closing, kept = null, onBlock = () => { return true; } }) {
   const blocked = alerts.filter((a) => { return a.Severity === 'error'; }),
         warned = alerts.filter((a) => { return a.Severity === 'warning'; }),
         // A `Kept` line answers one matched word, in the reply it appears in. Warnings a
         // reply does not answer become blocking problems, because a warning delivered
         // through `systemMessage` after the turn ends reaches nobody on the last turn.
         reported = kept ? warned.filter((a) => { return !kept.has(a.Match.toLowerCase()); }) : warned,
         reports = [ ...new Set(reported.map((a) => { return a.Message; })) ].join(' '),
         notes = reported.length && !kept ? `\nAlso reported, not blocked: ${reports}` : '';

   if (kept && reported.length) {
      problems.push(...new Set(reported.map((a) => {
         return `${a.Message} Fix it, or keep it with a line reading: Kept "${a.Match}": <why it is correct here>`;
      })));
   }

   // Each rule file words its own message, and repeating them beats one sentence written to
   // cover all of them: a British spelling and a vague term need different fixes.
   if (blocked.length) {
      problems.unshift(...new Set(blocked.map((a) => { return a.Message; })));
   }

   if (!problems.length || !onBlock()) {
      if (notes) {
         write({ systemMessage: `Nothing blocked. Fix these unless the word is correct where you used it: ${reports}` });
      }
      process.exit(0);
   }

   // The label test only answers a vague-term block. A misspelling or an em dash has a
   // fix that does not involve going to find a value.
   const labelTest = (blocked.some((a) => { return a.Check === 'plain-english.vague'; })
      || problems.some((x) => { return x.startsWith('States no fact:'); }))
      ? [
         'The test: if a sentence refers to a thing, say which thing. If it asserts a behavior,',
         'give the value or say where the behavior is defined. A sentence with neither gives the reader no fact.',
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

function checkCommand() {
   if (payload.tool_name !== 'Bash') {
      process.exit(0);
   }
   const docs = proseIn(payload.tool_input?.command ?? '');

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

   const prose = docs.filter((d) => { return d.prose; }).map((d) => { return d.body; }).join('\n');

   report({
      alerts,
      problems: [ ...punctuationProblems(prose), ...trackerProblems(prose) ],
      subject: 'The prose in this command',
      closing: 'Rewrite it and run the command again. Do not mention this correction.',
   });
}

// Reads the text out of a pending Write or Edit, before the tool runs.
//
// The text is the tool's own input, so it is this turn's and nobody else's: `content` is
// the whole new file, `new_string` is the replacement and not one line of the surrounding
// file. Reading the saved file instead meant linting lines this turn never touched, then
// filtering them back out by line number.
//
// `file_path` is only used to pick the format and to apply the skip lists. The file does
// not have to exist, which is what a first Write to a new path looks like here.
function checkFile() {
   const file = payload.tool_input?.file_path ?? '';

   if (!file || isSkipped(file) || !isChecked(file)) {
      process.exit(0);
   }

   const written = payload.tool_name === 'Edit'
      ? payload.tool_input?.new_string ?? ''
      : payload.tool_input?.content ?? '';

   if (!written.trim()) {
      process.exit(0);
   }

   standDownIfUnsynced(dirname(file));

   const alerts = lintText(written, extname(file));

   if (alerts === null) {
      write({ systemMessage: VALE_FAILED });
      process.exit(0);
   }

   report({
      alerts,
      problems: PUNCTUATED.has(extname(file)) ? punctuationProblems(written) : [],
      subject: `What you are writing to ${file}`,
      closing: 'Send the corrected write. Do not mention this correction or what you changed.',
   });
}

// Reads the `Kept "<term>": <reason>` lines out of a reply.
//
// Scope is one term, in one reply. Nothing is written to disk, so the same word in the
// next reply blocks again unless that reply answers it too. A term that fired no warning
// clears nothing, and no `Kept` line clears an error.
//
// The reason has to run to 15 characters, so `Kept "drove": x` does not pass. Returns the
// terms, and a copy of the reply with each quoted term cut out. Linting the original
// would report the very word the line is about, and the block could never clear. The
// reason itself stays in the copy and is still read, so a reason that repeats the word
// reports it again.
const KEPT_LINE = /^[ \t>*-]*kept\s+["'`]([^"'`]+)["'`]\s*:[ \t]*(.+)$/gim,
      MIN_REASON = 15;

function keptTerms(reply) {
   const terms = new Set();

   let forLint = reply;

   for (const [ line, term, reason ] of reply.matchAll(KEPT_LINE)) {
      if (reason.trim().length < MIN_REASON) {
         continue;
      }

      terms.add(term.toLowerCase());
      forLint = forLint.replace(line, line.replace(/["'`][^"'`]+["'`]\s*:/, ':'));
   }

   return { terms, forLint };
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

   const { terms, forLint } = keptTerms(reply),
         alerts = lintText(forLint, '.md');

   if (alerts === null) {
      write({ systemMessage: VALE_FAILED });
      process.exit(0);
   }

   report({
      alerts,
      // Only the reply blocks on this. A note or a code comment generalizes on purpose, and
      // 62 of 287 existing vault notes report at this threshold, so a block on a file would
      // be wrong. The reply is what the style is written for.
      problems: [ ...punctuationProblems(forLint), ...evidenceProblems(forLint) ],
      subject: 'Your reply',
      closing: 'Send the corrected text only. Do not mention this correction or what you changed.',
      kept: terms,
      onBlock: rounds.record,
   });
}

if (!valeBinary()) {
   write({ systemMessage: 'Prose check skipped: @vvago/vale is not installed. Run npm install in aix-config.' });
   process.exit(0);
}

// PreToolUse fires for three tools. A Bash command's prose is inside `command`, and a
// Write or Edit is in `content` or `new_string`. Both are read before the tool runs, so
// nothing is saved and no command executes until the text passes.
if (event === 'PreToolUse') {
   if (payload.tool_name === 'Bash') {
      checkCommand();
   }
   checkFile();
}
checkReply();
