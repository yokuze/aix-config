---
title: Thumb-reachable controls
slug: thumb-reachable-controls
category: ui-pattern
subcategory: input
source_type: modern-research
platforms: [ios, android]
tags: [touch, ergonomics, controls, reachability, accessibility]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
  - https://developer.android.com/design/ui/mobile/guides/foundations/accessibility
related_patterns: [safe-area-layout, contextual-onboarding, adaptive-hud]
---

# Thumb-reachable controls

Put frequent actions where a player can hit them reliably while holding the phone, and give each action a generous invisible hit area.

## Why it exists

Mobile players change grip, play one-handed, and miss small targets while the game is moving. Apple recommends a 44 × 44 pt default button size on iOS; Android recommends at least 48 × 48 dp. Those are floors, not goals for a fast game.

## Application

Keep the board itself central. Put frequent secondary actions near the lower corners, away from system gestures. Reserve the top edge for status and infrequent controls. A small icon may sit inside a larger transparent hit target, but adjacent targets must not overlap.

Candy Crush keeps the primary gesture on the board and peripheral actions outside it. Pokémon GO uses a large bottom-center Poké Ball as the hub action. Both reduce precision demands.

## Implementation checklist

- Test left- and right-handed play on the smallest supported phone.
- Use at least 44 pt on iOS and 48 dp on Android; enlarge destructive or time-critical targets.
- Do not require a swipe when a visible tap action can provide the same result.
- Keep the home indicator and edge-back gesture clear.
- Expose the same actions to keyboard, switch, or assistive input where supported.

## Failure modes and measures

Crowding every action into the bottom area creates accidental taps. Hiding all controls behind gestures makes the game undiscoverable. Measure mis-taps, canceled touches, time-to-action, and handedness complaints in playtests.

## Applying this pattern

Swapping cookies should remain a direct board gesture. Pause, hint, and accessibility controls need large targets outside the board. Do not shrink cookie hit areas to match the visible art; use the full cell.
