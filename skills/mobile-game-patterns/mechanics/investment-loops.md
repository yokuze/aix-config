---
title: Investment Loops
slug: investment-loops
category: game-mechanics
subcategory: gameplay-design
source_type: ui-patterns
platforms: [ios, android]
tags: [retention, stored-value, customization, progression, habit-loop]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/investment-loops
  - https://dl.acm.org/doi/10.1145/1541948.1541999
  - https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/2155-buddy-adventure/
related_patterns: [periodic-events, collection, levels, appointment-dynamic]
---

# Investment Loops

## Summary

A player puts effort, choice, information, or care into the game now, and that work increases the value of a future session. The healthy version builds ownership and continuity. It does not make leaving feel like punishment.

## Problem

Isolated sessions can feel disposable. Without persistent consequences, players have little reason to care about a chosen character, built space, social group, or long-term goal.

## How it works

An action stores value: upgrading a village changes later strategy; choosing and caring for a companion unlocks perks; arranging a space makes it personally meaningful. That stored value creates future options and a natural return point. UI-Patterns describes investments of time, effort, money, or information that set up later rewards and triggers.

## Mobile-game application

Show the future consequence before asking for commitment. Keep investments understandable in short sessions and let players revise choices. Local notifications may remind players about a result, but they should be opt-in, accurate, and quiet by default.

## Implementation guidance

- Define what value persists after each action: utility, expression, relationship, mastery, or social commitment.
- Show the next payoff and its timing in plain language.
- Provide safe respec, rename, reorder, and undo paths.
- Make returning useful even when the player missed the expected time.
- Separate cosmetic ownership from power where competitive fairness matters.

## Examples

- *Clash of Clans* turns building placement and upgrades into a persistent village that changes later defense and attack options.
- *Pokémon GO* Buddy Adventure awards affection hearts for shared activities; higher Buddy Levels persist and unlock perks such as Catch Assist and a Best Buddy ribbon.

## Risks and anti-patterns

The loop becomes coercive when sunk cost, decay, or social guilt is the main return trigger. Excessive timers, fragile streaks, irreversible early choices, and paid acceleration can crowd out play.

## Accessibility and ethics

Support players who cannot return on a fixed schedule. Never make a purchased or carefully built asset silently expire. Give notification controls by event type, and explain data use when the investment includes location or contacts.

## Metrics

Measure return after investment, value-feature use, revision and regret rates, notification opt-out, missed-timer recovery, and retention without notifications. Pair revenue with well-being signals such as unusually long sessions and repeated late-night returns.

## Applying this pattern

Persistent value could live in a bakery that players decorate with rewards from puzzle mastery. Upgrades should unlock expression or alternate puzzle choices, not merely bigger numbers. Let players rearrange freely.

## References

- [UI-Patterns: Investment Loops](https://ui-patterns.com/patterns/investment-loops)
- [Fogg: A Behavior Model for Persuasive Design](https://dl.acm.org/doi/10.1145/1541948.1541999)
- [Pokémon GO Help: Buddy Adventure](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/2155-buddy-adventure/)
