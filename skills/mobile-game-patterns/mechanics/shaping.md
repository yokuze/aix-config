---
title: Shaping
slug: shaping
category: game-mechanics
subcategory: fundamentals-of-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [onboarding, learning, difficulty, reinforcement, mastery]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/shaping
  - https://www.ncbi.nlm.nih.gov/books/NBK470326/
related_patterns: [fixed-rewards, appropriate-challenge, unlock-features]
---

# Shaping

## Summary

Shaping teaches a complex behavior by reinforcing successive approximations. The game first rewards a small, reachable action, then raises the standard until the player can perform the full skill.

## Problem

A complete mechanic can ask too much at once, especially on a small touch screen. Long explanations do not build timing, perception, or confidence.

## How it works

Define the final behavior, identify simpler actions that resemble it, and reinforce them in order. Earlier approximations stop receiving special treatment once the next step is understood. This is operant shaping, not merely splitting a tutorial into pages.

## Mobile-game application

Teach one gesture with a safe board, then a meaningful choice, then a board where the same move competes with alternatives. Fade pointers and free boosters as competence appears. Let an experienced player skip the sequence.

## Implementation guidance

Instrument the target behavior, common errors, retries, hint use, and time between perception and action. Advance from evidence, not only elapsed steps. If a player struggles, restore one scaffold at a time. Test the tutorial one-handed and with interrupted sessions.

## Examples

- **Candy Crush Saga:** early levels isolate basic matching before introducing blockers and compound interactions. It is a familiar shaping sequence, though exact level layouts change.
- **Angry Birds:** opening stages introduce the slingshot and simple materials before levels demand combined bird abilities and more precise trajectories.

## Risks and anti-patterns

Over-scaffolding produces tutorial obedience rather than transferable skill. A hand cursor that taps the answer teaches following, not reading the board. Do not punish experimentation or keep repeating instructions after the player demonstrates mastery.

## Accessibility and ethics

Allow replay, skip, slower demonstrations, and input alternatives. Explain the purpose of a gesture in words. Avoid using rewards to train compulsive store visits or notification permissions; shape play skills, not surrender of privacy.

## Metrics

Track first-attempt success after prompts disappear, error type, hint dependence, tutorial skip, delayed-session recall, and retention after the first unassisted challenge.

## Applying this pattern

Start with a board where the only meaningful action forms one word or connection. Next ask the player to choose between two valid moves, then introduce the first genuinely tactical tradeoff. Reward understanding with immediate board response, not a shower of unrelated currency.

## References

- [UI-Patterns: Shaping](https://ui-patterns.com/patterns/shaping)
- [NCBI Bookshelf: Operant Conditioning](https://www.ncbi.nlm.nih.gov/books/NBK470326/)
