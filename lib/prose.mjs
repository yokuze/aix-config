// Running vale, in one place.
//
// bin/lint-prose.mjs, bin/test-prose.mjs and hooks/check-prose.mjs all need the same two
// things: the binary's path, and the second pass that reads a Vue component's comments.
// Keeping those here means the Vue handling has one implementation rather than one per
// caller.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
import { dirname, extname, isAbsolute, join, relative } from 'node:path';

const require = createRequire(import.meta.url);

export const REPO_ROOT = join(dirname(new URL(import.meta.url).pathname), '..');

/**
 * Extensions vale never sees, because opening them buys nothing.
 *
 * Two kinds: bytes that are not text at all, and generated text no person reads. Every
 * other extension is checked, and .vale.ini decides which rules apply to it. Which of
 * the two files an extension belongs in: a format vale could read, such as `.json`, goes
 * in the skip section of .vale.ini, where a project can override it. A `.png` goes here.
 *
 * The old arrangement was the other way around, an allowlist of extensions to check, and
 * it let a commit message written to a `.txt` file reach a repository unread.
 */
const NOT_TEXT = new Set([
   // Images and other art
   '.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.bmp', '.tif', '.tiff',
   '.ico', '.icns', '.heic', '.heif', '.psd', '.ai', '.sketch', '.fig', '.xcf',
   // Documents that are not plain text
   '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.key', '.numbers', '.pages',
   // Archives and disk images
   '.zip', '.gz', '.tgz', '.bz2', '.xz', '.zst', '.tar', '.7z', '.rar', '.dmg', '.iso',
   // Fonts
   '.woff', '.woff2', '.ttf', '.ttc', '.otf', '.eot',
   // Audio and video
   '.mp3', '.m4a', '.wav', '.aiff', '.flac', '.ogg', '.opus',
   '.mp4', '.m4v', '.mov', '.avi', '.mkv', '.webm', '.wmv',
   // Compiled and packaged code
   '.wasm', '.so', '.dylib', '.dll', '.exe', '.o', '.a', '.node', '.class', '.jar',
   '.pyc', '.pyo', '.rlib', '.rmeta', '.pdb', '.apk', '.aab', '.ipa', '.pkg', '.deb', '.rpm',
   // Databases and columnar data
   '.db', '.sqlite', '.sqlite3', '.mdb', '.realm', '.parquet', '.avro', '.orc',
   '.arrow', '.feather', '.npy', '.npz', '.pkl', '.pickle', '.bin', '.dat',
   // Keys and certificates held as bytes
   '.p12', '.pfx', '.jks', '.keystore',
   // Generated text nobody reads
   '.map', '.min',
]);

// Text with no code syntax of its own, so an em dash or a semicolon in it is prose
// punctuation and can be counted. A `.vue` or `.html` file includes script, where a
// semicolon is a statement terminator, so those stay out.
export const PUNCTUATED = new Set([ '.md', '.mdx', '.txt', '.rst', '.adoc' ]);

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
   return !NOT_TEXT.has(extname(file).toLowerCase());
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
 * fallback, which is what a project with no config of its own gets.
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
 * Every file under a local vale package's `styles/`, keyed by its path once synced.
 *
 * A package is a directory holding `.vale.ini` and `styles/`. `vale sync` copies that
 * `styles/` tree into the consumer's StylesPath, so the relative path inside the package
 * is the relative path inside StylesPath. A package named by URL or by a bundled name is
 * not a directory here and produces nothing.
 */
function packagedStyles(dir) {
   const root = join(dir, 'styles'),
         found = new Map();

   function walk(from) {
      for (const entry of readdirSync(from, { withFileTypes: true })) {
         const full = join(from, entry.name);

         if (entry.isDirectory()) {
            walk(full);
         } else if (entry.isFile()) {
            found.set(relative(root, full), full);
         }
      }
   }

   try {
      walk(root);
   } catch {
      return new Map();
   }
   return found;
}

/**
 * What is wrong with a config's synced packages, as a sentence, or null when nothing is.
 *
 * Two failures read exactly like clean prose. vale exits 0 and reports nothing when its
 * StylesPath is missing, so a project that has never run `vale sync` looks like a pass.
 * A project that synced once and has an old copy looks like a pass too, and that one is
 * worse: it reports real alerts, just not the current set of them.
 *
 * `vale sync` does not refresh a package that is already in StylesPath. It reports
 * success and leaves the old files, so editing a rule upstream has no effect on any
 * consumer until StylesPath is deleted. The returned sentence says that, because the
 * command that looks like the fix is not the fix.
 *
 * The comparison is by content rather than by timestamp. A branch switch upstream rewrites
 * timestamps without changing a rule, and `vale sync` does not preserve them either.
 */
export function syncProblem(config) {
   let text;

   try {
      text = readFileSync(config, 'utf8');
   } catch {
      return null;
   }
   const packages = (/^\s*Packages\s*=\s*(.+?)\s*$/m).exec(text);

   if (!packages) {
      return null;
   }
   const named = (/^\s*StylesPath\s*=\s*(.+?)\s*$/m).exec(text),
         stylesPath = join(dirname(config), named ? named[1] : 'styles');

   if (!existsSync(stylesPath) || !readdirSync(stylesPath).length) {
      return `${config} names vale packages that are not synced. Run \`vale sync\` there.`;
   }

   // Left to right, so a later package's copy of a path is the one that should be on disk.
   const expected = new Map();

   for (const entry of packages[1].split(',')) {
      const dir = isAbsolute(entry.trim()) ? entry.trim() : join(dirname(config), entry.trim());

      for (const [ path, source ] of packagedStyles(dir)) {
         expected.set(path, { source, dir });
      }
   }

   for (const [ path, { source, dir } ] of expected) {
      const synced = join(stylesPath, path);

      if (existsSync(synced) && readFileSync(synced).equals(readFileSync(source))) {
         continue;
      }
      return `${stylesPath} has an old copy of ${dir}. \`vale sync\` will not replace it. `
         + `Delete ${stylesPath} and sync again, or run the setup script the project documents.`;
   }
   return null;
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
 * Extensions vale has no comment syntax for, and the extension to read them as instead.
 *
 * Vale reads a file it does not recognize as one long sentence, so a listed word in a
 * string literal is reported the same as one in a paragraph. It knows `.js` and `.ts` but
 * not `.mjs`, `.cjs`, `.mts` or `.cts`, which is every file in bin/, lib/ and hooks/.
 *
 * A `[formats]` alias does not fix this. `mjs = js` in .vale.ini makes vale report nothing
 * at all for a `.mjs` file, because that section maps an extension onto a markup format
 * rather than onto a comment syntax.
 *
 * Kotlin, shell, SQL, SCSS, YAML, TOML and Terraform have no comment syntax in vale
 * either, and no near neighbor to borrow one from, so they stay read in full.
 */
const READ_AS = new Map([
   [ '.mjs', '.js' ],
   [ '.cjs', '.js' ],
   [ '.mts', '.ts' ],
   [ '.cts', '.ts' ],
]);

// The prose in a source file that vale never reads. It reads a file's comments and
// nothing else, so a test's name, an assertion's message, a thrown error, a command's own
// help text and a log line all go unchecked, and each of those is read more often than
// most documentation.
//
// Every pattern calls the sentence it finds `prose` and the quote that holds it `q`, so
// one shape reads a single-quoted, double-quoted or backtick string. Each has the `d` flag
// because the mask below needs the string's offsets, not its text.
//
// `OWN_CALL` keeps a method on something else out, so `regex.test('...')` and
// `page.expect('...')` are not read. `NESTED_ARG` allows one level of parentheses in the
// value an assertion compares.
//
// Two shapes are out of reach of a regex and stay unread: a name behind a second call,
// such as `it.each([1, 2])('retries %i times')`, and an assertion whose value nests more
// than one level of parentheses.
const QUOTED = String.raw`(?<q>['"\`])(?<prose>(?:\\.|(?!\k<q>)[^\\])*)\k<q>`,
      OWN_CALL = String.raw`(?<![.\w$])`,
      NESTED_ARG = String.raw`(?:[^()]|\([^()]*\))*`,
      // A flag or name argument, which is what a help string follows.
      FLAG_ARG = String.raw`(?:'[^']*'|"[^"]*")`;

const SOURCE_STRINGS = [
   // A test's name, in vitest, jest, mocha and Playwright.
   `${OWN_CALL}(?:describe|context|it|test|specify|bench)(?:\\.[A-Za-z]+)*\\s*\\(\\s*${QUOTED}`,
   // An assertion's message, printed beside the values it compared.
   `${OWN_CALL}(?:expect|assert)(?:\\.[A-Za-z]+)*\\s*\\(${NESTED_ARG},\\s*${QUOTED}\\s*\\)`,
   // The message in a thrown error or a Rust panic, which is what a person sees when the
   // program stops.
   `(?:new\\s+\\w*Error|panic!|unreachable!|todo!|unimplemented!|raise\\s+\\w+)\\s*\\(\\s*${QUOTED}`,
   // A command line's own documentation: commander's `.description()` and `.option()`,
   // clap's `help =` and `about =`. Documentation that ships inside the binary.
   `\\.(?:description|summary|usage|addHelpText)\\s*\\(\\s*${QUOTED}`,
   `\\.(?:option|requiredOption|argument|command)\\s*\\(\\s*${FLAG_ARG}\\s*,\\s*${QUOTED}`,
   `${OWN_CALL}(?:help|about|long_about|long_help)\\s*=\\s*${QUOTED}`,
   // A log line, read by whoever is working out what went wrong.
   `${OWN_CALL}(?:log|logger|console|tracing)\\.[A-Za-z]+\\s*\\(\\s*${QUOTED}`,
   `${OWN_CALL}(?:info|warn|error|debug|trace)!\\s*\\(\\s*${QUOTED}`,
].map((source) => { return new RegExp(source, 'dg'); });

// A prompt body assigned to a name has no call to anchor on, and reading every quote in a
// file is not reliable: an apostrophe in a comment opens a string that never closes. A file
// says so itself with a `prose-lint: strings` comment on its own line, and then every
// string that follows an assignment, a comma, an opening bracket or a line start is read.
const OPT_IN = /^[ \t]*(?:\/\/|#|\/\*)[ \t]*prose-lint:[ \t]*strings\b/m,
      ASSIGNED = new RegExp(String.raw`(?<=(?:^|[=+,([])[ \t]*)${QUOTED}`, 'dgm');

const SOURCE_EXT = new Set([
   '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts', '.vue', '.rs', '.swift',
]);

/**
 * The file's text with every character replaced by a space, except the sentences the
 * patterns above find. Empty when the file holds none.
 *
 * Masking rather than extracting keeps every offset, so vale's line and column point at
 * the source file and the hook's Edit filter compares the same numbers it always has.
 *
 * The result is read as `.txt`. Markdown reads a line indented four spaces as a code
 * block and a test name is always indented, so `.md` would skip nearly all of them. Plain
 * text has no code span either, so backtick spans are masked here to stop a reported term
 * inside `--force-flag` from counting.
 */
export function stringShadow(source) {
   const out = source.split('').map((ch) => { return ch === '\n' ? '\n' : ' '; });

   let found = false;

   for (const pattern of OPT_IN.test(source) ? [ ...SOURCE_STRINGS, ASSIGNED ] : SOURCE_STRINGS) {
      for (const match of source.matchAll(pattern)) {
         const span = match.indices?.groups?.prose;

         if (!span) {
            continue;
         }
         for (let i = span[0]; i < span[1]; i++) {
            out[i] = source[i];
         }
         found = true;
      }
   }

   return found ? out.join('').replace(/`[^`\n]*`/g, (span) => { return ' '.repeat(span.length); }) : '';
}

/**
 * Lints a file's bytes under a different extension. Returns alerts, or null when vale
 * failed.
 *
 * The bytes go in on stdin, so nothing is copied and the reported line and column still
 * point at the original file.
 *
 * `text` replaces the file's own bytes, which is how the masked source in `stringShadow`
 * is linted under the line numbers of the file it came from.
 *
 * A caller may pass either shape: the CLI works in paths relative to the repo, the hook
 * gets an absolute path from the tool that wrote the file.
 */
function readAs(vale, file, ext, text) {
   const onDisk = isAbsolute(file) ? file : join(REPO_ROOT, file),
         result = runVale(vale, configForFile(file), [ `--ext=${ext}` ], text ?? readFileSync(onDisk, 'utf8'));

   return result === null ? null : Object.values(result).flat();
}

/**
 * Lints the masked sources in `shadows` (file to text). Returns a map of the same files to
 * their alerts, or null when vale failed.
 *
 * vale reads one document from stdin, so one run per file costs a process start each: 210ms
 * against 9ms per file when vale is handed a list of paths. The masks are written to a temp
 * directory and passed as paths instead, which is one run per config rather than per file.
 *
 * The temp path decides nothing. `--config` is passed for the source file, so a project
 * with its own .vale.ini still governs its own strings.
 */
function lintShadows(vale, shadows) {
   if (shadows.size === 0) {
      return new Map();
   }

   const dir = mkdtempSync(join(tmpdir(), 'prose-shadow-')),
         byConfig = new Map(),
         source = new Map(),
         found = new Map();

   try {
      let n = 0;

      for (const [ file, text ] of shadows) {
         const path = join(dir, `${n++}.txt`),
               config = configForFile(file);

         writeFileSync(path, text);
         source.set(path, file);
         byConfig.set(config, [ ...byConfig.get(config) ?? [], path ]);
      }

      for (const [ config, paths ] of byConfig) {
         for (let i = 0; i < paths.length; i += 200) {
            const batch = runVale(vale, config, paths.slice(i, i + 200));

            if (batch === null) {
               return null;
            }
            for (const [ path, alerts ] of Object.entries(batch)) {
               // `Vale.Repetition` reports a word typed twice in a row. The mask leaves
               // only spaces between two sentences, so the same word in two different test
               // names reads as a repeat. The word lists are what this pass is for.
               const words = alerts.filter((alert) => { return alert.Check !== 'Vale.Repetition'; }),
                     file = source.get(isAbsolute(path) ? path : join(dirname(config), path));

               if (file && words.length) {
                  found.set(file, [ ...found.get(file) ?? [], ...words ]);
               }
            }
         }
      }
   } finally {
      rmSync(dir, { recursive: true, force: true });
   }

   return found;
}

/**
 * Lints the given files. Returns a map of file to alerts, or null when vale failed.
 *
 * Two kinds of file take a `readAs` pass instead of a path. A Vue component holds three
 * languages and vale reads one format per file: `vue = html` in .vale.ini reaches the
 * template's prose, and a second pass with `--ext=.ts` adds the comments in the script
 * and style blocks. `//`, `///`, `/* *``/` and `/*``* *``/` are the same in TypeScript and
 * SCSS, so one pass covers both. A READ_AS extension takes the pass instead of a path
 * pass, because reading it under its own extension gives the wrong answer rather than a
 * partial one.
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
      if (READ_AS.has(extname(file))) {
         continue;
      }
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

   for (const file of files.filter((f) => { return READ_AS.has(extname(f)) || extname(f) === '.vue'; })) {
      const found = readAs(vale, file, READ_AS.get(extname(file)) ?? '.ts');

      if (found === null) {
         return null;
      }
      if (found.length) {
         alerts[file] = [ ...alerts[file] ?? [], ...found ];
      }
   }

   const shadows = new Map();

   for (const file of files.filter((f) => { return SOURCE_EXT.has(extname(f)); })) {
      const onDisk = isAbsolute(file) ? file : join(REPO_ROOT, file),
            shadow = stringShadow(readFileSync(onDisk, 'utf8'));

      if (shadow) {
         shadows.set(file, shadow);
      }
   }

   const fromStrings = lintShadows(vale, shadows);

   if (fromStrings === null) {
      return null;
   }
   for (const [ file, found ] of fromStrings) {
      alerts[file] = [ ...alerts[file] ?? [], ...found ];
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
      MESSAGE_COMMAND = /\b(git commit|glab|gh)\b/,
      // A message flag, at the end of the text read so far in the current command. The
      // quoted string after one is prose.
      //
      // The second alternative is the forge APIs: `gh api -f body='...'` and `glab api
      // --field body="..."` put a review comment on the command line under a field name
      // rather than a message flag, which is how a comment reaches a colleague unread.
      MESSAGE_FLAG = new RegExp('(?:^|\\s)(?:'
         + '(?:-[mdbt]|--(?:message|description|body|title|notes))\\s*=?'
         + '|(?:-f|-F|--field|--raw-field)\\s+(?:body|note|description|title|message)\\s*='
         + ')\\s*$'),
      // A flag whose value is a path holding the message: `git commit -F msg.txt`, `gh pr
      // create --body-file body.md`. The file is read from disk, because nothing else in
      // this hook ever sees it. A `-F body=...` is the forge API form above, not a path.
      MESSAGE_FILE = /(?:^|\s)(?:-F|--file|--body-file|--description-file|--notes-file|--message-file)[ \t=]+(?:"([^"]*)"|'([^']*)'|([^\s;|&]+))/g,
      // Commands whose message flags hold prose. Looser than MESSAGE_COMMAND, because
      // `git -c commit.gpgsign=false commit -m` puts an option between the two words.
      // The flag itself is the evidence here, so the command name only has to rule out
      // an unrelated `-d` or `-m`, such as `curl -d` or `grep -m`.
      MESSAGE_ARG_COMMAND = /\b(?:git|glab|gh)\b/,
      // Shell characters that end one command and start the next.
      SEPARATORS = '\n;&|(){}';

/**
 * The quoted string starting at `start`, and the index just past its closing quote.
 *
 * Inside double quotes the shell drops a backslash before `$`, a backtick, `"` or `\`,
 * and drops a backslashed newline whole. vale has to read the text git receives, not the
 * text the tool call spells, so those are undone here. A single-quoted string has no
 * escapes at all.
 */
function quoted(command, start) {
   const quote = command[start],
         escaped = '$`"\\\n';

   let text = '',
       i = start + 1;

   while (i < command.length) {
      const char = command[i];

      if (char === quote) {
         return { text, end: i + 1 };
      }
      if (quote === '"' && char === '\\' && escaped.includes(command[i + 1])) {
         text += command[i + 1] === '\n' ? '' : command[i + 1];
         i += 2;
         continue;
      }
      text += char;
      i++;
   }
   return { text, end: i };
}

/**
 * The message arguments in a shell command, in the same shape as a heredoc body.
 *
 * `git commit -m "..."`, `glab mr create --description "..."` and `gh pr create --body
 * "..."` put prose on the command line, where the heredoc parser never sees it. That is
 * how a commit message reaches a repository unread.
 *
 * The scan runs outside the quotes, so a `-m` inside a message body is text rather than a
 * flag, and a `grep -m` chained after a commit is not a message.
 */
function messageArgs(command) {
   const found = [];

   let read = '',
       i = 0;

   while (i < command.length) {
      const char = command[i];

      if (char !== '"' && char !== '\'') {
         read = SEPARATORS.includes(char) ? '' : read + char;
         i++;
         continue;
      }

      const { text, end } = quoted(command, i);

      if (MESSAGE_FLAG.test(read) && MESSAGE_ARG_COMMAND.test(read)) {
         found.push({ body: text, ext: '.md', prose: true });
      }
      // The argument is read, so the flag is spent. Standing in for it keeps the second
      // quoted word in `-m "subject" "elsewhere"` from counting as a message too.
      read += ' arg';
      i = end;
   }
   return found;
}

/**
 * The prose and the comments in a shell command, with the vale format each should be read
 * as. Heredoc bodies, message arguments and the contents of a message file all come back.
 *
 * Merge request descriptions and commit messages reach a forge two ways. As a heredoc: written
 * to a `.md` or `.txt` file, or piped straight into `git commit`, `glab` or `gh`. Or as a
 * quoted argument to `-m`, `--description` or `--body`. Both are prose.
 *
 * A heredoc redirected to a file is read under that file's extension, so vale reads a
 * source file's comments and reports nothing for a format the skip section in .vale.ini
 * names. One feeding an interpreter is left out: the body is code, and a semicolon in it
 * is not punctuation.
 */
function messageFiles(command) {
   if (!MESSAGE_ARG_COMMAND.test(command)) {
      return [];
   }

   const found = [];

   for (const [ , doubled, singled, bare ] of command.matchAll(MESSAGE_FILE)) {
      const target = doubled ?? singled ?? bare;

      // `-F body=...` is a field, not a file. A path holding a shell variable cannot be
      // expanded here, and `existsSync` reports it missing, so both are left alone.
      if (!target || target.includes('=') || !existsSync(target) || !isChecked(target)) {
         continue;
      }

      const ext = extname(target);

      found.push({ body: readFileSync(target, 'utf8'), ext: PUNCTUATED.has(ext) ? '.md' : ext, prose: PUNCTUATED.has(ext) });
   }

   return found;
}

export function proseIn(command) {
   const found = [];

   for (const [ , opener, , , body ] of command.matchAll(HEREDOC)) {
      const redirect = REDIRECT.exec(opener),
            target = redirect ? (redirect[1] ?? redirect[2] ?? redirect[3]) : null,
            ext = target === null ? null : extname(target);

      if (ext === null ? MESSAGE_COMMAND.test(opener) : PUNCTUATED.has(ext)) {
         found.push({ body, ext: '.md', prose: true });
      } else if (ext !== null && isChecked(target)) {
         found.push({ body, ext, prose: false });
      }
   }
   return [ ...found, ...messageArgs(command), ...messageFiles(command) ];
}
