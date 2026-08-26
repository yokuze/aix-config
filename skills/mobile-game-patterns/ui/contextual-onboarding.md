---
title: Contextual onboarding
slug: contextual-onboarding
category: ui-pattern
subcategory: learning
source_type: modern-research
platforms: [ios, android]
tags: [onboarding, tutorial, progressive-disclosure, learning]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://gameaccessibilityguidelines.com/basic/
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
related_patterns: [shaping, appropriate-challenge, thumb-reachable-controls]
---

# Contextual onboarding

Teach one action when it first matters, let the player perform it, and get out of the way.

## Pattern

Start in a real but controlled game state. Demonstrate with motion or a highlighted target, wait for the player, then respond to the attempt. Introduce scoring, special pieces, and secondary systems over later turns. Let experienced players skip and let returning players replay lessons.

Monument Valley teaches interaction through the first puzzle instead of a manual. Pokémon GO layers catching, map navigation, collections, and social systems over time.

## Implementation guidance

- Teach with an interactive state, not a wall of text.
- Allow prompts to advance at the player's pace.
- Never block every control with an unexplained spotlight overlay.
- Record mastery of the concept, not merely whether the tooltip was displayed.
- Offer a settings-level tutorial replay and a clear skip.

## Risks and measures

Over-constrained tutorials train obedience rather than understanding. Measure first-attempt success after guidance disappears, skip rate, repeat errors, and time to independent play.

## Applying this pattern

The first practice board should teach one swap and one cascade. Scoring explanations belong after the player sees the cause. The tutorial stays inside Pixi scenes; it should not be a React card laid over a live board.
