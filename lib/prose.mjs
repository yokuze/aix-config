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
