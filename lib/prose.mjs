// Running vale, in one place.
//
// bin/lint-prose.mjs, bin/test-prose.mjs and hooks/check-prose.mjs all need the same two
// things: the binary's path, and the second pass that reads a Vue component's comments.
// Keeping those here means the Vue handling has one implementation rather than one per
// caller.

import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, isAbsolute, join, relative } from 'node:path';

const require = createRequire(import.meta.url);

export const REPO_ROOT = join(dirname(new URL(import.meta.url).pathname), '..');

// Prose in full, and comments in everything else. Matches the sections in .vale.ini.
export const PROSE = new Set([ '.md', '.mdx', '.html', '.vue' ]);

export const COMMENTS = new Set([
   '.ts', '.tsx', '.mts', '.cts', '.js', '.jsx', '.mjs', '.cjs',
   '.scss', '.sass', '.css', '.rs', '.swift', '.py', '.go', '.kt',
   '.kts', '.rb', '.sh', '.bash', '.sql', '.toml', '.yml', '.yaml',
]);

// Text with no code syntax of its own, so an em dash or a semicolon in it is prose
// punctuation and can be counted. A `.vue` or `.html` file carries script, where a
// semicolon is a statement terminator, so those stay out.
export const PUNCTUATED = new Set([ '.md', '.mdx', '.txt' ]);

// Some files name the banned words rather than use them: the word lists define them, the
// fixture exists to trip them, the test asserts which ones it trips, and the generator's
// comments cite the spellings it leaves out. Backticks exempt a word in Markdown, where
// vale skips inline code spans, but not in a source comment.
const SKIPPED = [
   /(^|\/)(styles|test-fixtures|node_modules)\//,
   /(^|\/)(test-prose|build-british)\.mjs$/,
];

export function isSkipped(file) {
   return SKIPPED.some((pattern) => { return pattern.test(file); });
}

export function isChecked(file) {
   const ext = extname(file);

   return PROSE.has(ext) || COMMENTS.has(ext);
}

/**
 * The vale binary, or null when it is not installed.
 *
 * The published package downloads it in a postinstall step, after npm has already linked
 * node_modules/.bin, so there is no symlink to rely on.
 */
export function valeBinary() {
   try {
      return join(dirname(require.resolve('@vvago/vale/package.json', { paths: [ REPO_ROOT ] })), 'bin', 'vale');
   } catch {
      return null;
   }
}

/**
 * The `.vale.ini` that governs the given directory.
 *
 * The nearest config above the path wins, so a project pointing at its own vale package
 * is linted with its own rules and its own vocabulary. This repo's config is the
 * fallback, which is what a project carrying no config of its own gets.
 *
 * vale resolves a relative `StylesPath` against the config file rather than the working
 * directory, so passing `--config` is enough. The working directory stays at REPO_ROOT,
 * where the relative paths the CLI passes are resolved.
 */
export function configFor(startDir) {
   for (let dir = startDir; dir !== dirname(dir); dir = dirname(dir)) {
      const found = join(dir, '.vale.ini');

      if (existsSync(found)) {
         return found;
      }
   }
   return join(REPO_ROOT, '.vale.ini');
}

/**
 * Whether a config names vale packages that have not been synced.
 *
 * vale exits 0 and reports nothing when its StylesPath is missing, so a project that has
 * never run `vale sync` reads exactly like clean prose. Looking for the folder is what
 * turns that silence into something a caller can say out loud.
 */
export function isUnsynced(config) {
   let text;

   try {
      text = readFileSync(config, 'utf8');
   } catch {
      return false;
   }
   if (!(/^\s*Packages\s*=\s*\S/m).test(text)) {
      return false;
   }
   const named = (/^\s*StylesPath\s*=\s*(.+?)\s*$/m).exec(text),
         path = join(dirname(config), named ? named[1] : 'styles');

   return !existsSync(path) || !readdirSync(path).length;
}

/** The config for a path that may be relative to REPO_ROOT. */
function configForFile(file) {
   return configFor(dirname(isAbsolute(file) ? file : join(REPO_ROOT, file)));
}

/**
 * Runs vale and returns its alerts, or null when vale itself failed.
 *
 * A failed run must not read as a clean pass. vale writes a runtime error to stdout for a
 * single path and to stderr for several, so both are read.
 */
export function runVale(vale, config, args, input) {
   const result = spawnSync(vale, [ '--output=JSON', `--config=${config}`, ...args ], {
      // vale resolves a relative `Packages` entry against the working directory rather
      // than against the config naming them, so it has to run beside its own config. For
      // this repo's config that is REPO_ROOT, which is where the CLI's relative paths are
      // resolved, so nothing about linting this repo changes.
      cwd: dirname(config),
      input,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
   });

   if (result.error) {
      return null;
   }

   for (const stream of [ result.stdout, result.stderr ]) {
      if (!stream?.trim()) {
         continue;
      }

      let parsed;

      try {
         parsed = JSON.parse(stream);
      } catch {
         continue;
      }
      if (typeof parsed.Code === 'string') {
         return null;
      }
      if (stream === result.stdout) {
         return parsed;
      }
   }
   return result.status === 0 ? {} : null;
}

/**
 * Every checkable file under the given paths. A path may be a file or a directory.
 *
 * A plain walk, so this works outside a git repository. Dot directories are skipped
 * whole: they hold editor and tool config, which is where vale hit frontmatter it could
 * not parse and stopped. That also means .github is not read.
 */
export function collectFiles(paths) {
   const found = [];

   function walk(dir) {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
         const full = join(dir, entry.name);

         if (entry.isDirectory()) {
            if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
               walk(full);
            }
         } else if (entry.isFile()) {
            found.push(full);
         }
      }
   }

   for (const path of paths) {
      const full = join(REPO_ROOT, path);

      let info;

      try {
         info = statSync(full);
      } catch {
         continue;
      }
      if (info.isDirectory()) {
         walk(full);
      } else {
         found.push(full);
      }
   }

   return [ ...new Set(found.map((f) => { return relative(REPO_ROOT, f); })) ]
      .filter((f) => { return isChecked(f) && !isSkipped(f); })
      .sort();
}

/**
 * Lints the given files. Returns a map of file to alerts, or null when vale failed.
 *
 * A Vue component holds three languages and vale reads one format per file. `vue = html`
 * in .vale.ini reaches the template's prose, and a second pass over the same bytes with
 * `--ext=.ts` reads the comments in the script and style blocks. `//`, `///`, `/* *``/`
 * and `/*``* *``/` are the same in TypeScript and SCSS, so one pass covers both. The bytes
 * go in on stdin, so nothing is copied and the reported line and column still point at
 * the original file.
 */
export function lintFiles(files) {
   const vale = valeBinary();

   if (!vale || !files.length) {
      return {};
   }

   const alerts = {},
         byConfig = new Map();

   // A batch has to share one config, because `--config` is per invocation.
   for (const file of files) {
      const config = configForFile(file);

      byConfig.set(config, [ ...byConfig.get(config) ?? [], file ]);
   }

   for (const [ config, group ] of byConfig) {
      // vale takes many paths at once, but not an unbounded number.
      for (let i = 0; i < group.length; i += 200) {
         const batch = runVale(vale, config, group.slice(i, i + 200));

         if (batch === null) {
            return null;
         }
         Object.assign(alerts, batch);
      }
   }

   // A caller may pass either shape: the CLI works in paths relative to the repo, the
   // hook gets an absolute path from the tool that wrote the file.
   for (const file of files.filter((f) => { return extname(f) === '.vue'; })) {
      const onDisk = isAbsolute(file) ? file : join(REPO_ROOT, file),
            second = runVale(vale, configForFile(file), [ '--ext=.ts' ], readFileSync(onDisk, 'utf8'));

      if (second === null) {
         return null;
      }
      const found = Object.values(second).flat();

      if (found.length) {
         alerts[file] = [ ...alerts[file] ?? [], ...found ];
      }
   }
   return alerts;
}

/** Lints a string rather than a file. Returns alerts, or null when vale failed. */
export function lintText(text, ext = '.md') {
   const vale = valeBinary();

   if (!vale) {
      return [];
   }
   // A reply belongs to no file, so the project the agent is working in decides the rules.
   const result = runVale(vale, configFor(process.cwd()), [ `--ext=${ext}` ], text);

   return result === null ? null : Object.values(result).flat();
}

/**
 * Em dashes and semicolons in prose, as messages. Empty when there are none.
 *
 * vale skips fenced blocks and inline spans itself, so the word lists never see code. This
 * count is for characters inside a sentence rather than words, which vale has no rule
 * for, so the same two spans are removed here first.
 */
export function punctuationProblems(text) {
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

// A heredoc opener: everything on the line up to and including `<<TAG`, then the body,
// then the tag alone on its own line. The tag may be quoted, and `<<-` is allowed.
const HEREDOC = /^([^\n]*<<-?[ \t]*(["']?)([A-Za-z_][A-Za-z0-9_]*)\2[^\n]*)\n([\s\S]*?)\n[ \t]*\3[ \t]*(?=\n|$)/gm,
      // A `>` or `>>` redirect and its target, skipping `2>`, `>&2` and `&>`.
      REDIRECT = /(?:^|[^&\d])>{1,2}[ \t]*(?:"([^"]*)"|'([^']*)'|([^\s;|&]+))/,
      // Commands that take a message or description on stdin, which is prose.
      MESSAGE_COMMAND = /\b(git commit|glab|gh)\b/;

/**
 * The heredocs in a shell command that carry prose or comments, with the vale format each
 * should be read as.
 *
 * Merge request descriptions and commit messages travel as heredocs: written to a
 * `.md` or `.txt` file, or piped straight into `git commit`, `glab` or `gh`. Those are
 * prose. A heredoc redirected to a source file is read for its comments, by that file's
 * extension. One feeding an interpreter, or written to a file of another kind, is left
 * out: the body is code or data, and a semicolon in it is not punctuation.
 */
export function heredocs(command) {
   const found = [];

   for (const [ , opener, , , body ] of command.matchAll(HEREDOC)) {
      const redirect = REDIRECT.exec(opener),
            target = redirect ? (redirect[1] ?? redirect[2] ?? redirect[3]) : null,
            ext = target === null ? null : extname(target);

      if (ext === null ? MESSAGE_COMMAND.test(opener) : PUNCTUATED.has(ext)) {
         found.push({ body, ext: '.md', prose: true });
      } else if (ext !== null && COMMENTS.has(ext)) {
         found.push({ body, ext, prose: false });
      }
   }
   return found;
}
