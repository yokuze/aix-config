---
title: Mobile game pattern library
slug: mobile-game-pattern-library
category: index
platforms: [ios, android]
tags: [mobile-games, ux, ui, mechanics, research]
---
updated: 2026-07-23

# Mobile game pattern library

This library turns game mechanics, mobile UI conventions, and current design guidance into implementation notes for a match-3 puzzle game. Each pattern is a standalone document with searchable YAML front matter.

## Querying the library

Examples with `rg`:

```bash
# Find every pattern about accessibility
rg -l 'tags:.*accessibility|accessibility' docs/mobile-game-patterns

# List modern UI patterns
rg -l '^category: ui-pattern$' docs/mobile-game-patterns

# Find patterns related to retention without opening every file
rg -l 'retention|appointment|live-ops' docs/mobile-game-patterns

# Find patterns that need an ethical review
rg -l '^ethical_risk: (medium|high)$' docs/mobile-game-patterns
```

## Front matter contract

Every pattern has `title`, `slug`, `category`, `platforms`, `tags`, `updated`, `sources`, and `related_patterns`. Newer patterns also carry `source_type`, `maturity`, and `ethical_risk`.

The folders are deliberately plain:

- `mechanics/` contains the complete UI-Patterns game-mechanics list.
- `ui/` contains touch, layout, feedback, and session UI patterns.
- `principles/` contains rules that should shape every screen.
- `trends/` contains current product patterns worth evaluating, not blindly copying.
- `references/` contains the visual index and locally stored reference images.

## Coverage

The original UI-Patterns list contributes 19 mechanics. Modern mobile research adds touch ergonomics, adaptive HUDs, safe-area layout, multimodal feedback, interruption recovery, contextual onboarding, accessibility, reduced motion, ethical monetization, performance as UX, live-ops event hubs, and short-session design.

Start with [the visual reference index](references/visual-reference-index.md) when working from rendered examples.
