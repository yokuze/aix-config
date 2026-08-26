---
title: Live-ops event hub
slug: live-ops-event-hub
category: ux-trend
subcategory: live-ops
source_type: current-market-pattern
platforms: [ios, android]
tags: [live-ops, events, navigation, countdowns, retention]
maturity: widespread
ethical_risk: medium
updated: 2026-07-23
sources:
  - https://apps.apple.com/us/app/candy-crush-saga/id553834731
  - https://niantic.helpshift.com/hc/en/6-pokemon-go/
  - https://developer.apple.com/design/human-interface-guidelines/managing-notifications
related_patterns: [periodic-events, appointment-dynamic, ethical-monetization]
---

# Live-ops event hub

A live-ops hub collects active events, progress, rewards, and end times in one predictable place instead of scattering badges over the home screen.

## Pattern

Show active and upcoming events with local end times, eligibility, progress, rules, and reward previews. Deep-link from a notification to the exact event, then return players to the normal game flow cleanly.

Candy Crush runs themed seasons and time-limited challenges. Pokémon GO uses event calendars, research, raids, and Community Days. Their scale is large, but the transferable lesson is information architecture: players need one answer to "what is active now?"

## Implementation guidance

- Separate event discovery from core play.
- Use honest countdowns and state what happens to unfinished progress.
- Avoid overlapping currencies and unexplained badge storms.
- Let players mute event categories and promotional notifications.
- Archive results long enough for players to understand rewards.

## Risks and measures

An event hub can become a casino-lobby wall of urgency. Measure hub comprehension, event participation, notification opt-outs, and whether core-mode starts become harder.

## Applying this pattern

The daily event and future seasons can share one hub, but the practice mode must remain a clean one-tap path. No event badge should cover the board or interrupt a match.
