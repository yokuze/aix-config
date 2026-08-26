---
title: Multimodal action feedback
slug: multimodal-feedback
category: ui-pattern
subcategory: feedback
source_type: platform-guidance
platforms: [ios, android]
tags: [haptics, sound, animation, feedback, game-feel]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.apple.com/design/human-interface-guidelines/playing-haptics
  - https://developer.android.com/design/ui/mobile/guides/foundations/accessibility
related_patterns: [reduced-motion, readable-gameplay, praise]
---

# Multimodal action feedback

Confirm an action through a coordinated mix of motion, sound, and haptics. Each channel should describe the same event, and the game must remain understandable when any one channel is disabled.

## Pattern

Use a light transient response for selection, a firmer response for a committed move, and a distinct cadence for success or failure. Synchronize the physical pulse with the visible collision or snap. Apple explicitly warns against reusing a learned haptic for the opposite meaning and recommends making haptics optional.

Candy Crush pairs matches with motion and sound that scale with the cascade. Marvel Snap uses card motion, sound, and screen response to make a digital card feel physical.

## Implementation guidance

- Build a small semantic vocabulary: select, commit, invalid, combo, win, lose.
- Trigger feedback from confirmed game state, not optimistic UI alone.
- Add separate toggles for haptics, music, and effects.
- Cap intensity and frequency during long cascades.
- Provide text or shape cues for events otherwise carried by color or sound.

## Risks and measures

Constant vibration becomes irritating and drains meaning from important events. Unsynchronized feedback feels laggy. Measure input-to-feedback latency, haptic disable rate, and invalid-action comprehension.

## Applying this pattern

The swap should feel different from the match resolution. Cascades can build intensity, but the final refill and board-ready state need their own clean signal.
