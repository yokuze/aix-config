---
title: Adaptive HUD
slug: adaptive-hud
category: ui-pattern
subcategory: game-state
source_type: modern-research
platforms: [ios, android]
tags: [hud, responsive-layout, hierarchy, gameplay]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
  - https://developer.apple.com/design/human-interface-guidelines/layout
related_patterns: [safe-area-layout, readable-gameplay, thumb-reachable-controls]
---

# Adaptive HUD

An adaptive HUD shows only the information needed for the current decision and rearranges it for the device, orientation, and game phase.

## How it works

Separate HUD content into priorities: match objective and turns are primary; score deltas and streak feedback are temporary; settings are tertiary. Layout by relative constraints instead of fixed coordinates. Collapse low-priority items before shrinking text.

Marvel Snap keeps turn state, score stakes, and end-turn action visible while card detail appears contextually. Monument Valley strips its play view down to the puzzle and a few necessary controls. The visual density differs, but both protect the current decision.

## Implementation guidance

- Define compact, regular, and expanded HUD compositions.
- Anchor to safe areas, not raw screen edges.
- Animate state changes from their source so players can follow cause and effect.
- Avoid status icons that require memorizing color alone.
- Freeze or simplify nonessential HUD animation during board cascades.

## Risks and measures

A HUD can become a dashboard laid over the game. It can also hide needed information in the name of minimalism. Measure glance time, objective recall, wrong-action rate, and whether players can explain why the score changed.

## Applying this pattern

The active objective, remaining turns, and score belong in the gameplay scene. The HUD should yield visual attention to cookie swaps and cascades, then show a concise score explanation after the board settles.
