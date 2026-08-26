---
title: Storytelling
slug: storytelling
category: game-mechanics
subcategory: gameplay-design
source_type: ui-patterns
platforms: [ios, android]
tags: [narrative, characters, worldbuilding, episodic-content, environmental-storytelling]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Storytelling
  - https://www.gutenberg.org/ebooks/3251
  - https://ustwogames.co.uk/games/monument-valley/
related_patterns: [levels, periodic-events, onboarding, player-agency]
---

# Storytelling

## Summary

Storytelling gives play a reason and a point of view. On mobile, it works best when narrative is carried by goals, spaces, animation, and brief exchanges rather than long text placed between play sessions.

## Problem

An abstract mechanic may be enjoyable but emotionally thin. Players can understand what to tap without caring why the next stage matters. Conversely, a story that repeatedly blocks interaction becomes a tax on returning players.

## How it works

The pattern frames the player as an actor facing a conflict and divides change into episodes. Plot establishes what changes, characters give the change emotional weight, and presentation makes the world coherent. Story can be explicit through dialogue or implied by the state of a board, a damaged object, or a character reaction.

## Mobile-game application

Assume interruptions. Keep scenes resumable, captioned, and replayable. Put essential objectives in the play space and preserve a concise chapter recap. A live game can use seasons for new stories, but the core premise should remain understandable to someone returning months later.

## Implementation guidance

- Write the gameplay verb and narrative verb together: matching may mean baking, repairing, escaping, or investigating.
- Give each chapter a visible before-and-after state.
- Let dialogue advance on tap and provide skip, log, and replay controls.
- Avoid explaining information the animation or board already communicates.
- Localize layouts early; dialogue length and reading direction affect composition.

## Examples

- *Monument Valley* tells Ida's journey through architecture, movement, sparse dialogue, and chapter framing. The puzzle action and story world use the same impossible geometry.
- *Florence* turns relationship moments into touch interactions: assembling conversations, moving through routines, and watching interface elements change as the relationship changes.

## Risks and anti-patterns

Lore dumps, unskippable scenes, and a player character who contradicts player action weaken the pattern. Episodic cliffhangers can become coercive when paired with artificial waits or purchases.

## Accessibility and ethics

Caption all speech and meaningful sound. Offer readable text sizing, strong contrast, reduced animation, scene transcripts, and enough dwell time. Content warnings should be specific and allow players to bypass a scene without losing mechanical progress.

## Metrics

Measure scene completion and skip rates, recap use, chapter return rate, objective confusion, and whether players can correctly describe the next goal. A high skip rate may mean pacing trouble, not disinterest in story.

## Applying this pattern

Let cookies, crumbs, board transformations, and character reactions carry the premise. A chapter intro should fit one phone screen and lead directly into a board. Completing a world should visibly repair or transform its scene.

## References

- [UI-Patterns: Storytelling](https://ui-patterns.com/patterns/Storytelling)
- [Mark Twain: How to Tell a Story](https://www.gutenberg.org/ebooks/3251)
- [ustwo games: Monument Valley](https://ustwogames.co.uk/games/monument-valley/)
