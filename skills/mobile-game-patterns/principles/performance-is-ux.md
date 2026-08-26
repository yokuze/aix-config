---
title: Performance is interaction design
slug: performance-is-ux
category: design-principle
subcategory: performance
source_type: platform-guidance
platforms: [ios, android]
tags: [performance, frame-pacing, latency, battery, thermal]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.android.com/games/optimize/framerate
  - https://developer.android.com/games/optimize/power
  - https://developer.android.com/games/sdk/frame-pacing
related_patterns: [multimodal-feedback, short-session-design]
---

# Performance is interaction design

A button that answers late, an uneven cascade, or a hot phone changes how the game feels. Average frame rate alone does not describe that experience.

## Principle

Target stable pacing and low input latency at a sustainable power level. Android's current guidance uses 60 FPS as the baseline and recommends looking at P90 and P99 behavior to find hitches. Match the display refresh rate to the render target instead of spending power on duplicate refreshes.

## Implementation guidance

- Profile real low- and mid-tier devices, not only a desktop browser.
- Measure input-to-visible-response latency.
- Pool transient effects and cap overdraw during cascades.
- Reduce ambient effects before reducing input or board clarity.
- Configure Pixi with `autoDensity: true` and `resolution: window.devicePixelRatio`. The canvas can then keep its CSS size while matching the display's pixel density.
- Pause rendering appropriately in the background.
- Test after thermal soak, not just a cold launch.

## Measures

Track frame-time percentiles, long frames, battery drain, thermal throttling, memory pressure, crash-free sessions, and input latency.

## Applying this pattern

Pixi effects need a visual budget. The board and touch response get priority; frosting particles and backdrop animation degrade first. Keep the renderer at the device pixel ratio before reducing effects; a 2× cap makes 3× phone displays look soft. Replay representative cascades in performance tests.
