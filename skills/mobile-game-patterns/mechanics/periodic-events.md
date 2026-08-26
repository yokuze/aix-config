---
title: Periodic Events
slug: periodic-events
category: game-mechanics
subcategory: gameplay-design
source_type: ui-patterns
platforms: [ios, android]
tags: [live-ops, calendar, seasons, community, limited-time-event]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/periodic-events
  - https://supercell.com/en/games/clashofclans/blog/news/clan-games-changes-2/
  - https://pokemongolive.com/events/community-day/
related_patterns: [appointment-dynamic, storytelling, live-ops-calendar, social-play]
---

# Periodic Events

## Summary

Recurring events give the game a shared rhythm. A weekly challenge, monthly community day, or seasonal celebration can create anticipation and social context without replacing the evergreen game.

## Problem

Static content loses surprise, while one-off events are expensive and difficult for players to plan around. Mobile audiences also span time zones, work patterns, and inconsistent connectivity.

## How it works

An event repeats on a recognizable cadence with a temporary theme, rule set, or reward track. Recurrence builds familiarity; variation keeps the ritual from becoming routine. UI-Patterns stresses shared experience, anticipation, and narrative framing.

## Mobile-game application

Show start and end in local time, duration, eligibility, and reward rules before entry. Put the schedule in-game, support calendar reminders, and leave enough time for ordinary life. Let missed players rejoin the core loop without a power deficit.

## Implementation guidance

- Establish a stable cadence before adding overlapping events.
- Give every event one primary verb and one clear reward path.
- Test daylight-saving changes, server time, offline resumption, and late claims.
- Provide a short "what changed" panel and preview the next occurrence.
- Reuse an event shell, but vary goals based on actual play rather than reskinning chores.

## Examples

- *Pokémon GO* Community Day schedules a featured Pokémon and event bonuses for a published window, creating a recognizable monthly gathering.
- *Clash of Clans* Clan Games recur with time-boxed tasks and shared clan reward tiers. Supercell has publicly rebalanced task length and points to reduce grind.

## Risks and anti-patterns

Too many simultaneous timers create calendar fatigue. Exclusive power, narrow windows, and notification spam weaponize fear of missing out. A live-ops schedule should not make the base game feel empty.

## Accessibility and ethics

Rotate start windows or make the active period generous across regions. Avoid objectives that require unsafe travel or constant attention. Offer reduced-motion event presentation and accessible timer labels. Repeat important story or accessibility rewards.

## Metrics

Track eligible participation, completion, late entry, event-to-evergreen conversion, notification opt-out, timezone differences, and post-event churn. Measure enjoyment and perceived pressure in research, not only daily active users.

## Applying this pattern

Start with a weekend recipe challenge that uses existing boards and a shared visual theme. Keep rewards cosmetic and offer a later archive route. The home screen needs one event card, not a stack of countdowns.

## References

- [UI-Patterns: Periodic Events](https://ui-patterns.com/patterns/periodic-events)
- [Clash of Clans: Clan Games Changes](https://supercell.com/en/games/clashofclans/blog/news/clan-games-changes-2/)
- [Pokémon GO: Community Day](https://pokemongolive.com/events/community-day/)
