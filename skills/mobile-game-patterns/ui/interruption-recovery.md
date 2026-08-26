---
title: Interruption recovery
slug: interruption-recovery
category: ui-pattern
subcategory: session
source_type: modern-research
platforms: [ios, android]
tags: [resume, save-state, interruptions, mobile-lifecycle]
maturity: established
ethical_risk: low
updated: 2026-07-23
sources:
  - https://developer.apple.com/design/human-interface-guidelines/managing-notifications
  - https://developer.android.com/games/guidelines
related_patterns: [short-session-design, self-monitoring]
---

# Interruption recovery

Assume a call, lock screen, low-battery warning, or app switch can stop play at any moment. Restore the exact meaningful state and explain anything that changed while the player was away.

## Pattern

Persist at atomic boundaries. A swap and its cascade should either resume deterministically or restore from the last confirmed revision. Online matches need a reconnect state, not a blank lobby. Returning players should see a short recap only when state changed.

Pokémon GO tolerates frequent backgrounding around map play. Turn-based games such as Marvel Snap make the match clock and reconnect outcome explicit rather than pretending no time passed.

## Implementation guidance

- Save the input, RNG seed, revision, objective, and remaining turns.
- Pause local animation when the app is inactive.
- On resume, reconcile server authority before accepting input.
- Never punish a player merely because the operating system suspended the app.
- Keep marketing notifications passive or active; do not misuse urgent delivery.

## Risks and measures

Resuming halfway through a visual cascade can produce a board that looks wrong even if data is correct. Measure failed resumes, duplicate actions, reconnect time, and support tickets about lost progress.

## Applying this pattern

Persist the board before animation begins and after the final refill. Rebuild visuals from the authoritative board revision on resume, then offer a brief recap of the last resolved move.
