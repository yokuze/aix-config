---
title: Intentional Gaps
slug: intentional-gaps
category: game-mechanics
subcategory: gameplay-design
source_type: ui-patterns
platforms: [ios, android]
tags: [completion, collections, empty-slots, curiosity, progress]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Intentional-gaps
  - https://psychclassics.yorku.ca/Zeigarnik/
  - https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/2155-buddy-adventure/
related_patterns: [collection, goal-gradient, progress-visualization, investment-loops]
---

# Intentional Gaps

## Summary

Show a meaningful, reachable absence: an empty collection slot, an unfinished map, a missing ingredient, or a silhouette in a set. The gap turns progress into a concrete question: "What belongs here?"

## Problem

Open-ended progression is hard to parse on a small screen. Players may own many objects yet have no sense of direction or completion.

## How it works

The interface supplies enough structure to reveal what is incomplete without giving away every answer. UI-Patterns relates this pull to incomplete-task effects and cognitive dissonance. In games, the strongest gaps are informative: they show category, proximity, or acquisition route and make the next action feel self-chosen.

## Mobile-game application

Use silhouettes, empty sockets, incomplete recipe rows, map fog, and segmented meters. A tap should explain what the gap means and, where reasonable, how to pursue it. Keep critical progress separate from optional collections.

## Implementation guidance

- Make the empty state visually distinct from locked, unavailable, and loading states.
- Reveal enough metadata to support a decision: region, rarity, activity, or chapter.
- Celebrate completion, then give the finished set a stable home.
- Preserve mystery for discovery-based play; offer progressive hints instead of a full checklist.
- Ensure the target is actually obtainable in the player's region and version.

## Examples

- *Pokémon GO* uses the Pokédex’s numbered entries and silhouettes to make missing species legible; medals and Buddy histories add smaller completion frames.
- *Animal Crossing: Pocket Camp Complete* organizes fish, insects, furniture, and catalog objects into bounded sets, so an empty entry suggests a concrete collecting goal.

## Risks and anti-patterns

Fake gaps for unreleased content, impossible region locks, and collections expanded faster than players can understand them breed fatigue. Red badges on every missing slot turn curiosity into nagging.

## Accessibility and ethics

Do not rely on silhouette or color alone. Label empty, discovered, locked, and completed states for screen readers. Avoid exploiting completion pressure with opaque loot-box odds or expiring paid sets.

## Metrics

Track gap-detail opens, pursuit starts, set completion, time from discovery to completion, abandonment by acquisition route, and spending prompted by gaps. Review compulsive-session and regret signals alongside conversion.

## Applying this pattern

A world map can show missing cookie stamps or recipe-book slots. Each gap should correspond to a known, earnable feat, such as completing a board with a special objective. Do not show paid-only holes inside the main completion set.

## References

- [UI-Patterns: Intentional Gaps](https://ui-patterns.com/patterns/Intentional-gaps)
- [Zeigarnik: On Finished and Unfinished Tasks](https://psychclassics.yorku.ca/Zeigarnik/)
- [Pokémon GO Help: Buddy Adventure](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/2155-buddy-adventure/)
