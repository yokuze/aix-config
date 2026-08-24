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
| `styles/plain-english/substitutions.yml` | terms with a plain replacement. Reported |
| `hooks/check-prose.mjs` | agent hook: checks replies and written files |
| `rules/writing.md` | a pointer to the output style |
| `.vale.ini` | vale's config. `@vvago/vale` is a devDependency |
| `lib/prose.mjs` | the vale calls, shared by the linter and the hook |
| `bin/lint-prose.mjs` | the linter. Takes paths, so it can be scoped |
| `docs/vale-editor-setup.md` | VS Code, Zed and Devin |

Editor setup for VS Code, Zed and Devin is in `docs/vale-editor-setup.md`.

| Command | Does |
|---|---|
| `npm run lint:prose` | lints the content directories, named explicitly |
| `node bin/lint-prose.mjs <path...>` | lints just those files or directories |
| `npm run test:prose` | checks the Vue two-pass still reads template, script and style |

`aix` 0.6.0 installs skills, MCP servers, rules and prompts. It does not install output
styles or hooks, so those two are symlinked by hand:

```bash
ln -sf "$PWD/output-styles/plain-english.md" ~/.claude/output-styles/plain-english.md
ln -sf "$PWD/hooks/check-prose.mjs" ~/.claude/hooks/check-prose.mjs
```

Then add the hook to `~/.claude/settings.json`, on both events:

```json
{
   "hooks": {
      "Stop": [ { "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ],
      "PostToolUse": [ { "matcher": "Write|Edit", "hooks": [ { "type": "command", "command": "node $HOME/.claude/hooks/check-prose.mjs" } ] } ]
   }
}
```

`PostToolUse` checks the file just written, which is the half a reply check cannot see: a
doc or a code comment written during a turn never appears in the chat. A `.vue` file gets
the second pass there too. An `Edit` is checked on its replacement's own lines, so a file
that already carries a banned term elsewhere does not block work that never touched it.

`Stop` checks the reply, and it cannot filter one. It fires after the text has streamed,
so blocking only keeps the turn open and the correction arrives as a second message. No
hook event runs before an assistant message reaches the user.

Both block on `vague.yml`, and `Stop` also blocks on em dashes and semicolons in prose.
Neither blocks on `substitutions.yml`, because those words have a legitimate use when
quoting a spec or someone else's copy, and a false positive should not stop a turn. vale
parses Markdown and source comments, so a symbol named `mechanism` is not a hit.

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
