---
title: Reduced motion without lost meaning
slug: reduced-motion
category: design-principle
subcategory: accessibility
source_type: platform-guidance
platforms: [ios, android]
tags: [reduced-motion, animation, accessibility, comfort]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://gameaccessibilityguidelines.com/basic/
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
related_patterns: [multimodal-feedback, readable-gameplay]
---

# Reduced motion without lost meaning

Reduced motion should shorten or replace movement while preserving sequence, direction, and state change.

## Pattern

Swap long camera moves for cuts or short fades. Replace elastic overshoot with a brief scale or opacity change. Keep logical staging when it explains rules: a reduced cascade may use rapid stepped transitions rather than teleporting straight to the final board.

## Implementation guidance

- Respect the operating-system preference on first launch.
- Offer an in-game setting with immediate preview.
- Separate essential state animation from decorative ambient motion.
- Stop parallax, shake, flashes, and looping background movement.
- Do not make reduced motion slower.

## Examples and measures

Card games can replace large card flights with a short origin-to-destination fade. Puzzle games can compress fall and refill timings while keeping their order. Measure completion, discomfort reports, and whether state comprehension changes between modes.

## Applying this pattern

The title and mode transitions already need a reduced-motion branch. Board resolution must retain remove, collapse, refill, ready as distinct steps, but each can be sharply shortened.
