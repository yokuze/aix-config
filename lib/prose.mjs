// Running vale, in one place.
//
// bin/lint-prose.mjs, bin/test-prose.mjs and hooks/check-prose.mjs all need the same two
// things: the binary's path, and the second pass that reads a Vue component's comments.
// Keeping those here means the Vue handling has one implementation rather than one per
// caller.

import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
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
// fixture exists to trip them, and the test asserts which ones it trips.
const SKIPPED = [
   /(^|\/)(styles|test-fixtures|node_modules)\//,
   /(^|\/)test-prose\.mjs$/,
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
 * Runs vale and returns its alerts, or null when vale itself failed.
 *
 * A failed run must not read as a clean pass. vale writes a runtime error to stdout for a
 * single path and to stderr for several, so both are read.
 */
export function runVale(vale, args, input) {
   const result = spawnSync(vale, [ '--output=JSON', ...args ], {
      cwd: REPO_ROOT,
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

   const alerts = {};

   // vale takes many paths at once, but not an unbounded number.
   for (let i = 0; i < files.length; i += 200) {
      const batch = runVale(vale, files.slice(i, i + 200));

      if (batch === null) {
         return null;
      }
      Object.assign(alerts, batch);
   }

   // A caller may pass either shape: the CLI works in paths relative to the repo, the
   // hook gets an absolute path from the tool that wrote the file.
   for (const file of files.filter((f) => { return extname(f) === '.vue'; })) {
      const onDisk = isAbsolute(file) ? file : join(REPO_ROOT, file),
            second = runVale(vale, [ '--ext=.ts' ], readFileSync(onDisk, 'utf8'));

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
   const result = runVale(vale, [ `--ext=${ext}` ], text);

   return result === null ? null : Object.values(result).flat();
}
