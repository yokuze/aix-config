# aix-config

Shared [AIX](https://github.com/a1st-dev/aix) configuration, skills, MCP servers, rules, and prose quality tools.

## Installation

Install all configuration into a project with AIX:

```bash
npx @a1st/aix install https://github.com/yokuze/aix-config/blob/main/ai.json
```

Or install specific sections globally

```bash
# Install all sections globally
npx @a1st/aix install --user

# Or install specific sections
npx @a1st/aix install --only rules --user
npx @a1st/aix install --only skills --user
npx @a1st/aix install --only agents --user
npx @a1st/aix install --only hooks --user
```

## Repository Structure

* `skills/`: Reusable agent skills (`app-store-readiness`, `learn`, `new-repo-setup`, etc.)
* `agents/`: AIX subagent definitions (`app-store-readiness`, `write-app-store-copy`)
* `rules/`: Agent guidelines for Git, TypeScript, Vue, Tauri, testing, and prose
* `prompts/`: Standard workflow prompts (`plan`, `implement-plan`, `commit`, etc.)
* `styles/`: Vale prose linter rules for plain English, banned jargon, and US spelling
* `hooks/`: Agent lifecycle hooks (e.g., `check-prose.mjs`)
* `lib/` and `bin/`: CLI tooling and tests for prose verification

## Prose Linting & Hooks

This repository includes a Vale-based plain-English prose checker that flags vague
language, jargon, and British spellings in documentation, comments, and agent outputs.

### Setup

Install the Vale binary and dependencies:

```bash
npm install
```

Configure hooks and output styles for Claude Code:

```bash
# Install prose checking hooks
npx @a1st/aix install --only hooks --user

# Link output style and Vale configuration
ln -sf "$PWD/output-styles/plain-english.md" ~/.claude/output-styles/plain-english.md
ln -sfn "$PWD" ~/.claude/vale
```

### CLI Commands

* `node bin/lint-prose.mjs <paths...>`: Lint specific files or directories
* `npm run lint:prose`: Lint all repository content directories
* `npm run test:prose`: Run unit tests for prose checking logic
* `npm run build:british`: Rebuild the British English word list from VarCon

For editor integration (VS Code, Zed, Devin), see [`docs/vale-editor-setup.md`](./docs/vale-editor-setup.md).
