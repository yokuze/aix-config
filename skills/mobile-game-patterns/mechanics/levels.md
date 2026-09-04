---
title: Levels
slug: levels
category: game-mechanics
subcategory: gameplay-design
source_type: ui-patterns
platforms: [ios, android]
tags: [stages, progression, difficulty-curve, mastery, level-map]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Levels
  - https://ustwogames.co.uk/games/monument-valley/
related_patterns: [appropriate-challenge, progress-visualization, unlock-features, storytelling]
---

# Levels

## Summary

Levels divide a long play journey into bounded challenges with a readable beginning, goal, and ending. They teach, test, pace, and provide natural stopping points for mobile sessions.

## Problem

A continuous system can hide progress and overwhelm new players. Without clear boundaries, it is hard to introduce rules, recover from failure, compare mastery, or leave the game at a satisfying moment.

## How it works

Each level selects a small set of mechanics, establishes a goal, and ends with feedback. Across a sequence, known ideas return in new combinations and difficulty grows with skill. The map, chapter list, or stage selector communicates both current position and future possibility.

## Mobile-game application

Keep restart fast and preserve state when the app backgrounds. A stage-select screen should make status, cost, goals, and locked state distinct. Design for short sessions without forcing every level to be short; checkpoints can serve longer narrative stages.

## Implementation guidance

- Give each level a design sentence: "teach X while reinforcing Y."
- Record objective, constraints, expected duration, novelty, and difficulty separately.
- Reuse mechanics before combining them; do not teach through a wall of text.
- Make completion, mastery, and collection separate states.
- Support replay without making players navigate the whole map.

## Examples

- *Candy Crush Saga* presents discrete boards with move limits and objectives on a long map. Stars and progression communicate completion beyond a binary win.
- *Monument Valley* groups self-contained spatial puzzles into named chapters, using chapter boundaries for narrative pacing and distinctive visual ideas.

## Risks and anti-patterns

Numbered stages can become filler when each exists only to lengthen a map. Energy limits, arbitrary difficulty spikes, and three-star perfection requirements can turn a clean structure into pressure. A giant map may make progress feel insignificant.

## Accessibility and ethics

Allow replayable tutorials, assists, relaxed timing, and alternatives to precision input. Clearly label optional mastery goals. Never make accessibility assists reduce rewards or block progression.

## Metrics

Track starts, completion, attempts, restart latency, exit point, replay, mastery-goal uptake, and session boundaries by level. Investigate extreme outliers and qualitative failure reasons before tuning solely from win rate.

## Applying this pattern

Treat a level as an authored teaching and performance unit, not merely a generated board seed. Store its lesson, target duration, failure modes, and hint strategy in data. The world map should show a modest local path rather than an endless conveyor belt.

## References

- [UI-Patterns: Levels](https://ui-patterns.com/patterns/Levels)
- [ustwo games: Monument Valley](https://ustwogames.co.uk/games/monument-valley/)
