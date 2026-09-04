# aix-config

[AIX](https://github.com/a1st-dev/aix) config, skills, and prompts.

## Set up a New Repo

```bash
npx @a1st/aix install https://github.com/yokuze/aix-config/blob/main/ai.json
```

## Writing style

One test decides whether a sentence is worth sending. If it refers to a thing, name that
thing. If it asserts a behavior, give the value or say where the behavior is defined. A
sentence with neither is a label, and a label reads as an explanation while carrying none.

| File | Holds |
|---|---|
| `output-styles/plain-english.md` | the rules, and the only copy of them |
| `styles/plain-english/vague.yml` | terms with no plain use. Blocked |
| `styles/plain-english/jargon.yml` | terms with several plain uses. Blocked |
| `styles/plain-english/substitutions.yml` | terms with a plain replacement. Reported |
| `styles/plain-english/british.yml` | British spellings. Blocked. Generated |
| `hooks/check-prose.mjs` | agent hook: checks replies, written files and Bash heredocs |
| `rules/writing.md` | a pointer to the output style |
| `.vale.ini` | vale's config. `@vvago/vale` is a devDependency |
| `lib/prose.mjs` | the vale calls, and which `.vale.ini` governs a path |
| `bin/lint-prose.mjs` | the linter. Takes paths, so it can be scoped |
| `bin/build-british.mjs` | rebuilds `british.yml` from VarCon |
| `docs/vale-editor-setup.md` | VS Code, Zed and Devin |

Editor setup for VS Code, Zed and Devin is in `docs/vale-editor-setup.md`.

| Command | Does |
|---|---|
| `npm run lint:prose` | lints the content directories, named explicitly |
| `node bin/lint-prose.mjs <path...>` | lints just those files or directories |
| `npm run test:prose` | checks the Vue two-pass, the heredoc parser and the hook's three events |
| `npm run build:british` | refetches VarCon and rewrites `british.yml` |

`aix` 0.6.0 installs skills, MCP servers, rules and prompts. It does not install output
styles, hooks or vale, so those are set up by hand:

```bash
npm install
ln -sf "$PWD/output-styles/plain-english.md" ~/.claude/output-styles/plain-english.md
ln -sf "$PWD/hooks/check-prose.mjs" ~/.claude/hooks/check-prose.mjs
ln -sfn "$PWD" ~/.claude/vale
```

`npm install` fetches the vale binary, at `node_modules/@vvago/vale/bin/vale`. The hook
shells out to it, and so does `vale-ls`, which has no vale of its own. The last link is how
a language server or another project finds this config, and that binary, when a workspace
carries no `.vale.ini`. Without the install, `vale-ls` logs "Vale CLI not installed!" and
reports nothing.

Then add the hook to `~/.claude/settings.json`, on all three events:

```json
{
   "hooks": {
      "Stop": [ { "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ],
      "PostToolUse": [ { "matcher": "Write|Edit", "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ],
      "PreToolUse": [ { "matcher": "Bash", "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ]
   }
}
```

`PostToolUse` checks the file just written, which is the half a reply check cannot see: a
doc or a code comment written during a turn never appears in the chat. A `.vue` file gets
the second pass there too. An `Edit` is checked on its replacement's own lines, so a file
that already carries a banned term elsewhere does not block work that never touched it.

`PreToolUse` checks the heredocs in a Bash command before it runs, and a denied command
does not run. Merge request descriptions and commit messages travel that way, written to a
`.md` or `.txt` file or piped into `git commit`, `glab` or `gh`, and neither of the other
two events sees them. A heredoc written to a source file is read for its comments. One
feeding an interpreter is code and is left alone.

`Stop` checks the reply, and it cannot filter one. It fires after the text has streamed,
so blocking only keeps the turn open and the correction arrives as a second message. No
hook event runs before an assistant message reaches the user. The reply comes from the
payload's `last_assistant_message`. The hook blocks at most twice per prompt, counting in
the session's scratchpad, so the corrected reply is checked too and the turn still ends.

The rules come from the nearest `.vale.ini` above the file being checked, or above the
working directory for a reply. A project that points at its own vale package is therefore
checked with its own rules and its own vocabulary, and this repo's config is the fallback
for a project carrying none. When that project's packages are not synced, vale cannot run
and the hook says so rather than passing the text silently.

All three block on `vague.yml`, `jargon.yml` and `british.yml`, and on `Vale.Repetition`,
which catches a word typed twice in a row. They also block on em dashes and semicolons in
prose: the reply, a `.md` or `.mdx` file, and a prose heredoc, where a semicolon is not a
statement terminator. None blocks on `substitutions.yml`, because those words have a
legitimate use when quoting a spec or someone else's copy, and a false positive should not
stop a turn. vale parses Markdown and source comments, so a symbol named `mechanism` is not
a hit, and a `colourScheme` in backticks is not one either.

## Using these rules in another project

`.vale.ini` and `styles/` together are a vale package, and vale accepts a local directory
as a package. Nothing needs building, zipping or publishing: another project names this
checkout and runs `vale sync`.

```ini
StylesPath = .vale-styles
MinAlertLevel = warning

Packages = /absolute/path/to/aix-config
```

`vale sync` copies `.vale.ini` and `styles/` into that project's `StylesPath` and ignores
the rest of this repo, so a sync is four files and 72K rather than a copy of the skills.
The generated `StylesPath` belongs in that project's `.gitignore`.

Four things about that path decide whether it works, and each one fails quietly:

* **It has to be absolute.** vale resolves a relative `Packages` entry against the working
  directory, not against the `.vale.ini` holding it, and the linter and the hook both run
  beside their own config rather than beside the project being checked.
* **`~` and `$HOME` are not expanded.** Write the path out.
* **It must not be a symlink.** vale fails to derive a package name from one, recurses,
  and dies with `fatal error: stack overflow`. Resolve the link first, with `pwd -P`.
* **Package folder basenames must differ.** vale names each synced config after the
  package folder's basename, so two packages in folders of the same name overwrite each
  other's config. The loser takes its rules with it and vale still exits 0, which reads as
  clean prose.

Because that path is machine-specific, a project sharing a repo with other people should
generate its `.vale.ini` rather than commit one, and git-ignore the result. A short setup
script that resolves this checkout and writes the file keeps every checkout path out of
the tree. When the file is missing, the hook walks up, finds nothing, and falls back to
this repo's config, so an unconfigured clone gets these rules rather than none.

A project with terminology of its own does not add words here. It puts a `Vocab` in a
package of its own and names both packages in order, general first. vale applies the
layers left to right and the last one wins, so a word accepted downstream overrides a rule
from here without touching the word lists. Private terminology stays in the private
package, which is the point of the split.

## After you edit a file here

What reaches Claude Code, and when:

| Edited | Reaches Claude Code |
|---|---|
| `styles/plain-english/*.yml` | next tool call. The hook re-reads them every time |
| `.vale.ini` | next tool call, same reason |
| `output-styles/plain-english.md` | next session. Symlinked, but read once at startup |
| `hooks/check-prose.mjs` | next tool call. Symlinked |
| `rules/*.md` | **only after installing.** See below |

`~/.claude/rules/` holds copies rather than symlinks, so a rule edited here does not reach
a session until it is installed:

```bash
npx @a1st/aix install --only rules --target claude-code --user
```

Add `--dry-run` first to see what it would change.

Do not symlink `~/.claude/rules/` to skip that step. The next `aix install` replaces the
symlink with a copy, so the rule would go stale again with nothing to show it happened.
