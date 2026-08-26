---
title: Readable gameplay
slug: readable-gameplay
category: design-principle
subcategory: visual-hierarchy
source_type: modern-research
platforms: [ios, android]
tags: [readability, hierarchy, contrast, cause-and-effect]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://gameaccessibilityguidelines.com/basic/
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
related_patterns: [adaptive-hud, multimodal-feedback, reduced-motion]
---

# Readable gameplay

At any instant, the player should know what can be acted on, what just happened, and what requires attention next.

## Principle

Use contrast, scale, timing, and motion direction to establish order. Keep the board legible under effects. Let one causal event finish before an unrelated celebration covers it. Text needs contrast against the worst-case animated background, not a clean mockup.

Candy Crush stages removals, falling pieces, and refill so the board's change can be followed. Monument Valley uses restrained scenery and strong geometry to keep paths readable.

## Implementation guidance

- Give interactive, selected, invalid, and resolved states distinct treatments.
- Delay score totals until their contributing matches are visible.
- Limit simultaneous callouts and particle layers.
- Use scrims or dedicated plates behind dynamic text.
- Test at arm's length, in sunlight, and with effects muted.

## Risks and measures

More juice can make the result less understandable. Measure wrong taps after effects, objective recall, and whether playtesters can narrate a cascade correctly.

## Applying this pattern

Directional collapse and edge refill are part of the rules explanation. Effects must support that motion, not cover it. The final board-ready cue should happen only after every cookie settles.
