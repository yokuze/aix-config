---
title: Accessibility by design
slug: accessibility-by-design
category: design-principle
subcategory: inclusion
source_type: standards-and-guidance
platforms: [ios, android]
tags: [accessibility, motor, vision, hearing, cognition]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://gameaccessibilityguidelines.com/basic/
  - https://developer.android.com/design/ui/mobile/guides/foundations/accessibility
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
related_patterns: [readable-gameplay, reduced-motion, thumb-reachable-controls]
---

# Accessibility by design

Accessibility is a property of the game loop, not a settings page added at the end.

## Principle

The game must communicate essential state without relying on color, sound, motion, or fine motor control alone. Common baseline needs include remappable or alternate controls, readable text, color-safe state encoding, subtitle control, separate audio levels, adjustable haptics, and a way to slow noncompetitive play.

## Examples

A match-3 board can combine color with cookie silhouette and texture. A timed prompt can pause in practice mode. A drag can have a tap-to-select alternative. These choices keep the same rules while changing how players perceive or operate them.

## Implementation guidance

- Define semantic accessibility labels for every interactive game object.
- Keep gameplay and menus reachable through the same supported input paths.
- Test screen readers, switch input, text scaling, color filters, and reduced motion.
- Put accessibility options before the first forced tutorial.
- Save settings locally and across devices when accounts are available.

## Measures

Track option discovery and completion by configuration, but do not profile disability. Pair telemetry with playtests involving disabled players.

## Applying this pattern

Cookie types need shapes or markings beyond color. Keyboard and tap-to-select input should reach the same swap command as drag. Every cascade result needs a non-audio explanation.
