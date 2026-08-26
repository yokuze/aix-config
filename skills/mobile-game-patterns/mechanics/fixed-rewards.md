---
title: Fixed rewards
slug: fixed-rewards
category: game-mechanics
subcategory: fundamentals-of-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [rewards, progression, predictability, feedback]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Fixed-rewards
  - https://support.clashroyale.com/hc/en-us/articles/49484914760603-Gems-Gold
related_patterns: [variable-rewards, goal-gradient-effect, unlock-features]
---

# Fixed rewards

## Summary

A fixed reward is promised for a known action, threshold, or time. The player can see the bargain: finish the level, earn three stars, or complete the daily goal and receive the stated prize.

## Problem

Players need dependable goals and clear feedback that effort produced a useful result. Pure randomness makes planning difficult and can make success feel arbitrary.

## How it works

The game states a condition and honors it consistently. Rewards may be points, currency, praise, access, completion credit, or prolonged play. Predictability lets the player decide whether the effort is worthwhile.

## Mobile-game application

Use fixed rewards for first wins, chapter completion, tutorial steps, difficulty medals, and collection milestones. Show the reward beside the condition before play. Award it promptly, then return control quickly.

## Implementation guidance

Keep reward definitions in data rather than screen code. Make the preview and grant read the same record. Handle reconnects idempotently so a reward is neither lost nor duplicated. If values change in a live economy, preserve already-started offers or explain the change plainly.

## Examples

- **Clash Royale:** Supercell documents gold for the first daily battles, a fixed condition players can plan around.
- **Candy Crush Saga:** level completion advances the player to the next map node; stars provide a stable performance result even though boosters and events can add other reward layers.

## Risks and anti-patterns

Small rewards lose meaning when every tap produces one. Misleading previews, silently changing thresholds, delayed grants, and currencies with no visible use break trust. A fixed daily reward can also become a chore if missing one creates a large loss.

## Accessibility and ethics

State both the requirement and reward in text. Do not rely on animation or sound to confirm the grant. Let the player inspect reward history and recover after an interrupted connection. Avoid punitive streak resets.

## Metrics

Measure goal starts and completions, time to reward, grant failures, reward-use rate, abandonment near thresholds, and whether rewards change level replay rather than simply adding claim taps.

## Applying this pattern

Good candidates are a named cosmetic for clearing a chapter, a fixed star total for a bakery theme, and a clearly previewed practice milestone. The completion panel should say exactly what was earned and why.

## References

- [UI-Patterns: Fixed rewards](https://ui-patterns.com/patterns/Fixed-rewards)
- [Clash Royale: Gems & Gold](https://support.clashroyale.com/hc/en-us/articles/49484914760603-Gems-Gold)
