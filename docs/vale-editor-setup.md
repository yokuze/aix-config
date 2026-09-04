# Vale in your editor

The word lists in `styles/plain-english/` are the only copy of them. Everything below
points a different tool at the same files, so a term added there reaches all of them.

Two separate things share the name:

* **Vale**, the CLI. Installed here as `@vvago/vale`. Used by `npm run lint:prose` and by
  the Claude Code hooks, which check both a reply and a file the agent just wrote.
* **vale-ls**, the language server. Gives live diagnostics as you type. Published only as
  a GitHub release archive, so each editor below installs or locates it separately.

## What each setup covers

`vale-ls` reads `.vale.ini` and applies one format per file extension. `.vue` maps to
`html`, so an editor reports the template's prose and stops there.

Comments in the `<script>` and `<style>` blocks need a second pass over the same bytes
with `--ext=.ts`. `bin/lint-prose.mjs` does that, and so does the Claude Code
`PostToolUse` hook for a file it just wrote. Run `npm run lint:prose` for full coverage
of the whole repo.

| Where | Markdown and MDX | Vue template | Vue script and style comments |
|---|---|---|---|
| Editor (vale-ls) | yes | yes | no |
| `npm run lint:prose` | yes | yes | yes |
| Claude Code hooks | yes | yes | yes |

## Install vale-ls

`vale-ls` is not on npm or crates.io. Download the archive for your platform from
<https://github.com/errata-ai/vale-ls/releases> and put the binary on your `PATH`.

| Platform | Asset |
|---|---|
| macOS, Apple silicon | `vale-ls-aarch64-apple-darwin.zip` |
| macOS, Intel | `vale-ls-x86_64-apple-darwin.zip` |
| Linux and WSL, x86_64 | `vale-ls-x86_64-unknown-linux-gnu.zip` |
| Linux and WSL, arm64 | `vale-ls-aarch64-unknown-linux-gnu.zip` |
| Windows, x86_64 | `vale-ls-x86_64-pc-windows-gnu.zip` |

WSL reports itself as Linux, so take the Linux asset there. Do not point a WSL editor at a
Windows `.exe` across `/mnt/c`, because the process starts but reads Windows paths and
finds no `.vale.ini`.

## VS Code

Install the **Vale VSCode** extension (`ChrisChinchilla.vale-vscode`), then add this to
your workspace `.vscode/settings.json`:

```json
{
   "vale.valeCLI.config": "${workspaceFolder}/.vale.ini",
   "vale.valeCLI.path": "${workspaceFolder}/node_modules/@vvago/vale/bin/vale",
   "vale.enableSpellcheck": false,
   "vale.doNotShowWarningForFileToBeSaved": true
}
```

Pointing `valeCLI.path` at the local package means the editor uses the same version the
CLI and the hooks use. On Windows, add `.exe` to that path.

To use the language server instead of the CLI, set `"vale.server.provideFixes": true` and
leave `valeCLI.path` unset, which makes the extension look for `vale-ls` on your `PATH`.

Add the file types the extension checks:

```json
{
   "vale.valeCLI.minAlertLevel": "warning",
   "files.associations": { "*.mdx": "markdown" }
}
```

## Zed

Zed reads language servers from `settings.json` (`cmd-,`). Add:

```json
{
   "lsp": {
      "vale-ls": {
         "binary": { "path": "vale-ls", "arguments": [] },
         "settings": { "configPath": ".vale.ini", "syncOnStartup": true }
      }
   },
   "languages": {
      "Markdown": { "language_servers": [ "vale-ls", "..." ] },
      "Vue.js": { "language_servers": [ "vale-ls", "..." ] },
      "HTML": { "language_servers": [ "vale-ls", "..." ] }
   }
}
```

The `"..."` keeps Zed's own servers for those languages and adds `vale-ls` alongside them.
Give `binary.path` an absolute path if `vale-ls` is not on the `PATH` Zed inherits, which
is common when Zed is started from the Dock rather than a shell.

Zed has no MDX language by default. Either install an MDX extension and add `"MDX"` to
`languages`, or add `"*.mdx"` to the Markdown file types:

```json
{ "file_types": { "Markdown": [ "mdx" ] } }
```

## Devin

Devin has no LSP client, so give it the CLI. Add the check to the repo's setup and lint
commands in your Devin configuration:

```bash
# Setup
npm install

# Lint everything
npm run lint:prose

# Lint one directory, which is faster and usually what a task needs
node bin/lint-prose.mjs docs
```

`bin/lint-prose.mjs` takes any number of files or directories. A directory argument is
walked in full, so name the narrowest scope that answers the question. With no arguments
it walks the repository root, which is the slowest way to call it.

`npm run lint:prose` exits non-zero when it finds an error-level term, which is what makes
it usable as a gate.

To have Devin see the rules rather than only the failures, point its instructions at
`output-styles/plain-english.md`. The failure message names the term and the check, and
the style file holds the reasoning behind them.

## Adding or changing a term

`Vale.Repetition` is on in both `.vale.ini` sections. It catches a word typed twice in a
row, and it ships inside the vale binary, so there is no rule file to edit and no
`vale sync` to run.

Edit `styles/plain-english/vague.yml` for terms with no plain use, or
`styles/plain-english/substitutions.yml` for terms with a replacement. Both are Vale rule
files, so every tool above picks the change up with no further step.

`styles/plain-english/british.yml` is generated. `bin/build-british.mjs` derives its 2286
British spellings from VarCon, keeping the words at SCOWL level 50 and below and dropping
any spelling that American dictionaries prefer. Add a word to `substitutions.yml` rather
than to it, and run `npm run build:british` to pick up a new VarCon release.

## Why not vale's spelling check

vale has a [`spelling`](https://docs.vale.sh/checks/spelling) extension point, and reading
the docs it looks like the answer. It is not, and the numbers say why. Measured against
this repo's 82 files and against all 2286 words in `british.yml`:

| Dictionary | Rejects, of 2286 | False positives here |
|---|---|---|
| vale's built-in `en_US-web` | 317 | 0 |
| `LibreOffice/dictionaries` `en_US` | 2281 | 242 words |
| `wooorm/dictionaries` `en` | 2281 | 242 words |
| SCOWL `en_US-large` | 2192 | 209 words |
| `en_US` plus 16k cspell tech terms and camelCase filters | 2281 | 105 words |
| SCOWL `en_US-large`, same additions | 2192 | 80 words |

vale's own dictionary holds the British forms, so it passes `colour`, `behaviour`,
`organise` and `centre`. A replacement dictionary rejects almost every British spelling,
but then rejects `Tauri`, `oxlint`, `subagent`, `replayable` and 238 other words that are
not misspelled. Every step that cuts the false positives accepts more British spellings,
because one dial moves both: `en_US-large` gives back 25 real words and 89 British ones.

`british.yml` sits outside that trade. It carries 2286 spellings, hits none of this
repo's words, and names the American spelling instead of asking "did you mean". What it
does not do is catch ordinary typos, which is a different job and no rule here does it.

Run `npm run test:prose` afterwards. It checks that a Vue component is still read in full:
the template's prose, a `///` comment in the script block, and a `//` comment in the SCSS
style block.
