---
title: "Appointment Dynamic"
slug: "appointment-dynamic"
category: "game-mechanics"
subcategory: "gameplay-rewards"
source_type: "ui-patterns-expanded"
platforms: [ios, android]
tags: [appointments, scheduled-events, daily-bonus, retention, timers, live-ops]
maturity: "established-with-ethical-risk"
updated: "2026-07-23"
sources:
  - "https://ui-patterns.com/patterns/appointment-dynamic"
  - "https://support.supercell.com/clash-of-clans/en/articles/about-multiplayer-and-trophies-2.html"
  - "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/5256-what-are-weekly-challenges-and-how-do-i-participate/"
  - "https://developer.apple.com/design/human-interface-guidelines/notifications"
related_patterns: [periodic-events, intentional-gaps, fixed-rewards, loss-aversion, notifications]
---

# Appointment Dynamic

## Summary

An appointment dynamic makes content or a reward available at a known time, giving players a reason to return. Daily bonuses, weekly challenges, scheduled raids, crop completion, and energy refills all use some form of appointment. The pattern can create a useful rhythm, but it becomes coercive when a narrow claim window, destructive penalty, or repeated alert makes real life feel subordinate to the game.

## Problem

Some mobile game activity benefits from spacing: asynchronous construction needs time, a social event needs participants at once, and rotating challenges keep a finite content set fresh. Without a visible schedule, players cannot plan a return and may miss the activity entirely.

The design problem is to communicate when something will be ready, how long it remains available, and what happens if the player returns later.

## How it works

The game sets a future availability time or recurring schedule, previews the reward or activity, shows the remaining time, and provides a clear route back when it opens. After participation, it communicates the next appointment.

There are several distinct forms:

- Readiness: a build, refill, or crop completes after a duration.
- Recurrence: a daily or weekly bonus resets on a stable cadence.
- Shared event: players gather during a scheduled window.
- Rotation: a mode, shop, or challenge changes at a stated time.

These should not be treated as identical. A readiness timer can be personal and forgiving. A shared event may require a real deadline, but it should offer enough windows, time-zone coverage, or asynchronous alternatives.

## Mobile-game application

Show the absolute time as well as a countdown when a time zone or long duration could cause confusion. State the time zone for global events. On return, summarize what became available rather than stacking several popups.

Notifications must be opt-in at the OS level and useful on their own: "Your bakery upgrade is ready" is better than "Come back now!" Provide granular notification controls inside the game. Do not ask for notification permission before the player has experienced the timed feature and understands the value.

## Implementation guidance

Use server-authoritative timestamps for rewards with economic value. Store availability and expiry as absolute instants, then render them in local time. Handle daylight-saving changes, device-clock tampering, offline play, and reconnect reconciliation. Countdown UI should derive from the timestamp rather than decrementing a persisted counter.

Design grace into the schedule:

- Let completed rewards wait for collection.
- Stack a small number of missed daily opportunities.
- Use broad event windows or repeat sessions across regions.
- Preserve earned progress when a weekly timer expires.
- Warn clearly before a real expiry and avoid surprise conversion or loss.

Schedule notifications through a single service that respects consent, quiet hours, per-category preferences, and cancellation when the player already returned. Deep-link to the relevant screen, but never bypass context or claim automatically.

## Examples

### Clash of Clans Star Bonus

Clash of Clans makes its Star Bonus available through a visible state on the Attack button. Completing the objective starts a 24-hour timer for the next bonus. The official support documentation also describes a forgiving queue: under certain conditions, up to two bonuses can stack. That softens the demand to return at one exact moment.

### Pokémon GO Weekly Challenges

Pokémon GO posts a new Weekly Challenge every Tuesday at 00:00 UTC. A progress screen shows the group goal, individual contributions, reward details, and time remaining. Players can claim rewards on completion or when time expires, and the help page states the schedule and UTC boundary explicitly.

## Risks and anti-patterns

- Destroying progress because a player slept, worked, traveled, or cared for someone turns a reminder into punishment.
- Tiny claim windows disadvantage players by time zone, disability, job schedule, and family responsibility.
- Daily streak loss can create anxiety far beyond the value of the reward.
- Excessive notifications train players to disable all notifications or uninstall.
- Placing the only fair source of a competitive resource behind an appointment makes the game less fair.
- A timer whose sole purpose is to sell a skip exploits impatience.

The original UI Patterns description explicitly recommends punishing no-shows. That advice should not be carried forward. Modern mobile design should favor predictable availability and grace.

## Accessibility and ethics

Timers need readable text, screen-reader labels, and a non-color signal for urgency. Avoid ticking audio, flashing countdowns, and escalating haptics. Give players control over notification categories and respect OS focus and quiet modes.

For children, avoid punitive streaks and late-night appointments. Do not schedule regional events at biologically unhealthy hours or encourage players to drive, trespass, or enter unsafe locations.

## Metrics

Measure awareness of the schedule, participation by local hour and time zone, notification opt-in and disable rates, missed-claim rate, stacked-reward use, event completion, and churn after expiry. Segment by schedule accessibility rather than reading raw return rate as success. A high return spike paired with notification disabling or post-event churn is a warning.

## Applying this pattern

A generous daily puzzle or weekend board set works if the puzzle remains claimable for a while and missed days do not destroy a streak. A small rolling archive is a better fit than a midnight cliff.

Keep timed content secondary to the complete core game. Show the next puzzle time in the mode-selection scene and notify only after the player opts into that category. Never put the main board behind a timer, and do not use a countdown whose primary job is to sell more moves or lives.

## References

- [UI Patterns: Appointment Dynamic](https://ui-patterns.com/patterns/appointment-dynamic)
- [Clash of Clans: Loot and Star Bonus](https://support.supercell.com/clash-of-clans/en/articles/about-multiplayer-and-trophies-2.html)
- [Pokémon GO: Weekly Challenges](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/5256-what-are-weekly-challenges-and-how-do-i-participate/)
- [Apple Human Interface Guidelines: Notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)
