---
title: Safe-area and aspect-ratio layout
slug: safe-area-layout
category: ui-pattern
subcategory: responsive-layout
source_type: platform-guidance
platforms: [ios, android]
tags: [safe-area, dynamic-island, aspect-ratio, responsive-layout]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.apple.com/design/human-interface-guidelines/layout
  - https://developer.apple.com/design/human-interface-guidelines/designing-for-games
related_patterns: [adaptive-hud, thumb-reachable-controls]
---

# Safe-area and aspect-ratio layout

Protect controls and legible status from camera cutouts, rounded corners, system gestures, and unusual aspect ratios without boxing the whole game into a rectangle.

## Pattern

Let decorative backgrounds bleed to every edge. Keep interactive controls and essential text inside platform safe areas. Use relative constraints and a board scale policy for 16:10, 19.5:9, 4:3, portrait, and any supported landscape layout.

## Examples

Portrait puzzle games commonly extend art behind the status region while keeping currency, lives, and settings below it. Pokémon GO lets the map fill the display but holds its persistent controls away from the extreme edges.

## Implementation guidance

- Read insets at runtime and pass them into the Pixi scene layout.
- Decide whether the board fits by width, height, or a bounded scale range.
- Use extra space for atmosphere, never for required information that disappears on shorter screens.
- Test rotation, split view where supported, text scaling, and the smallest target device.

## Risks and measures

Hard-coded offsets fail on new devices. Scaling the entire scene uniformly can make text and targets too small. Use screenshot tests at representative aspect ratios and track clipped controls as release-blocking defects.

## Applying this pattern

The bakery backdrop can extend under every inset. The board, HUD, and pause target cannot. Scene transitions must recalculate layout before rendering the destination scene.
