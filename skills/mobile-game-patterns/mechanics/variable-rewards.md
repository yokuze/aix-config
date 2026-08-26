---
title: Variable rewards
slug: variable-rewards
category: game-mechanics
subcategory: fundamentals-of-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [rewards, randomness, loot, reinforcement, retention, ethics]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Variable-rewards
  - https://support.clashroyale.com/hc/en-us/articles/49484957630619-Information-About-Discounts-Offers-and-Drop-Rates
  - https://developer.apple.com/app-store/review/guidelines/
related_patterns: [fixed-rewards, delighters, goal-gradient-effect]
---

# Variable rewards

## Summary

A variable reward changes in timing, amount, or type. The player knows an action can pay off, but not exactly what the payoff will be. Random drops, shuffled bonus choices, and upgrade rolls all use this pattern.

## Problem

Repeated play can become predictable before the underlying game has run out of depth. A bounded amount of uncertainty can keep rewards interesting and make repeated actions feel less mechanical.

## How it works

Variable-ratio schedules reward after an uncertain number of actions; variable-interval schedules make a reward available after an uncertain time. Games also vary the contents of an otherwise predictable reward. UI-Patterns argues that variable schedules avoid the obvious pause after a fixed reward, but that behavioral power is exactly why this mechanic needs restraint.

## Mobile-game application

- Randomize optional bonuses, cosmetic drops, or which of several equivalent boosters appears.
- Show rarity, possible contents, and duplicate handling before a player spends.
- Pair bad-luck protection with visible progress so a streak of misses has a limit.
- Keep the core puzzle outcome skill-based. Random rewards should decorate or widen play, not quietly decide it.

## Implementation guidance

Define a server-authoritative reward table, eligibility rules, disclosed probabilities, duplicate conversion, and a maximum miss count. Log the table version with every roll. Separate anticipation animation from the result calculation; the reveal must never imply that tapping differently changes a predetermined outcome. Give players a reduced-motion reveal and a one-tap skip.

## Examples

- **Clash Royale:** Lucky Chests and Choice Chests can upgrade through several rarities and award different resources. Supercell publishes probability tables and explains duplicate conversion.
- **Pokémon GO:** encounter and item drops vary after play actions. This is a defensible example of variable content, though exact mechanics vary by feature and event; do not copy undocumented rates.

## Risks and anti-patterns

Paid random items can resemble gambling, especially for children. Near-miss visuals, concealed odds, fake choice, escalating purchase prompts, and unlimited spend are hostile design. Never lower odds for a player based on spending propensity. Do not make a rare random item the only practical route through the main game.

## Accessibility and ethics

Publish odds wherever real money or purchasable currency is involved; Apple requires disclosure for randomized virtual items. Offer purchase controls and a deterministic route to important content. Reveal rarity with text and shape, not color alone. Avoid flashing, forced suspense, and haptics that cannot be disabled.

## Metrics

Track reward opens, skip-reveal rate, reward satisfaction, duplicate rate, miss streaks, spend concentration, refunds, and progression time by payer status. A retention lift paired with complaints or sharply concentrated spending is not a clean win.

## Applying this pattern

Variable rewards fit post-level cosmetic crumbs or a choice among equivalent bakery decorations. They should not alter whether a solved board counts. A visible "fresh item guaranteed within N boxes" rule would make any random collection loop easier to trust.

## References

- [UI-Patterns: Variable Rewards](https://ui-patterns.com/patterns/Variable-rewards)
- [Clash Royale: discounts, offers, and drop rates](https://support.clashroyale.com/hc/en-us/articles/49484957630619-Information-About-Discounts-Offers-and-Drop-Rates)
- [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
