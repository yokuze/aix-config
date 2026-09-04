---
title: Unlock features
slug: unlock-features
category: game-mechanics
subcategory: gameplay-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [progressive-disclosure, exploration, onboarding, progression]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Unlock-features
  - https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/101-how-do-i-level-up-and-earn-medals/
  - https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/5256-what-are-weekly-challenges-and-how-do-i-participate/
related_patterns: [privileges, shaping, levels, fixed-rewards]
---

# Unlock features

## Summary

Feature unlocking reveals modes, tools, spaces, or content after a player reaches a known milestone. It is both a reward and a form of progressive disclosure.

## Problem

Showing every system on the first screen overwhelms a new player. Hiding everything indefinitely makes the game feel thin and arbitrary.

## How it works

The player sees a locked capability, its value, and the requirement. Reaching the milestone opens it permanently or for a clearly stated period. The best unlock sequence follows growing competence rather than padding session count.

## Mobile-game application

Unlock mechanics after the player understands their prerequisites: challenges after basic play, a level editor after several solved boards, or social play after naming and safety setup. Tease only a few nearby unlocks on a small screen.

## Implementation guidance

Store unlock state durably and grant it idempotently. Deep links and notifications must respect the same eligibility check. On unlock, explain what changed and offer "try now" plus "later." Do not force a long tour.

## Examples

- **Pokémon GO:** progression locks some capabilities. For example, Niantic documents Weekly Challenges as available from Trainer Level 13 and Candy XL collection from Level 31.
- **Candy Crush Saga:** new blockers and episode areas appear along the level map as earlier play establishes the basic match loop.

## Risks and anti-patterns

Locking basic settings, accessibility, account recovery, or core social safety is unacceptable. Excessive locks make the early game feel fake. A feature teased without a clear requirement can look like a paywall even when it is not.

## Accessibility and ethics

Accessibility options must be available immediately. Locked cards need text labels and requirements, not only dimming or padlocks. Never require ad tracking, contacts, or purchases to unlock ordinary play.

## Metrics

Track time-to-unlock, comprehension after unlock, first use, continued use, early churn, support questions, and how often players reach a feature but ignore it.

## Applying this pattern

Create the board only after mode selection, consistent with the game’s architecture direction. Unlock new board concepts when the previous one has been demonstrated, while settings, reduced motion, practice, and input help stay available from the start.

## References

- [UI-Patterns: Unlock Features](https://ui-patterns.com/patterns/Unlock-features)
- [Pokémon GO Help: leveling and medals](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/101-how-do-i-level-up-and-earn-medals/)
- [Pokémon GO Help: Weekly Challenges](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/5256-what-are-weekly-challenges-and-how-do-i-participate/)
