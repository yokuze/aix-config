---
title: "Achievements"
slug: "achievements"
category: "game-mechanics"
subcategory: "gameplay-rewards"
source_type: "ui-patterns-expanded"
platforms: [ios, android]
tags: [achievements, badges, milestones, mastery, progression, social-proof]
maturity: "established"
updated: "2026-07-23"
sources:
  - "https://ui-patterns.com/patterns/Achievements"
  - "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/101-how-do-i-level-up-and-earn-medals/"
  - "https://support.clashroyale.com/hc/en-us/articles/49484923172123-Badges"
  - "https://support.supercell.com/clash-royale/en/articles/card-mastery-4.html"
related_patterns: [appropriate-challenge, levels, self-monitoring, goal-gradient-effect, praise]
---

# Achievements

## Summary

Achievements are named, persistent records of meaningful player accomplishments. They make optional goals visible, recognize mastery, and give players a history they can inspect or display. An achievement may be a badge, medal, title, trophy, collection entry, or upgraded emblem. The useful part is not the icon by itself. It is the clear link between an action worth doing and durable recognition that says, "you did this."

## Problem

A mobile game can contain more goals than its main level path communicates. Players may not know what kinds of mastery, experimentation, or long-term commitment the game supports. Raw counters do not always make progress feel meaningful, while one undifferentiated completion percentage says little about how someone plays.

Achievements turn selected behaviors into legible goals. They can also help a returning player remember what they accomplished and suggest a next objective without forcing it into the critical path.

## How it works

The game defines a condition, exposes enough information for the player to understand it, tracks progress, and grants durable recognition when the condition is met. Strong systems usually include:

- A browsable collection of earned and unearned achievements.
- Plain criteria and visible progress for non-secret goals.
- Tiers for naturally repeatable milestones, such as bronze through platinum.
- A short celebration when the achievement unlocks.
- A permanent place in the profile, collection, or history.
- Optional display choices rather than automatic public comparison.

Difficulty should rise with player skill. A first achievement can teach a basic move; later ones can recognize efficiency, unusual strategies, or sustained mastery. Hidden achievements are best reserved for genuine discoveries, not requirements the player could not reasonably infer.

## Mobile-game application

On a phone, achievement feedback must coexist with a small play area and short sessions. Use a compact toast during active play, then let the player open the full detail later. Do not cover the board, interrupt a timed move, or require immediate sharing.

Useful achievement families include:

- Onboarding: complete a first match, use a special piece, or recover from a mistake.
- Mastery: win with a constraint, create a difficult combo, or finish with moves remaining.
- Breadth: try each mode or use each mechanic.
- Persistence: reach a lifetime total, provided the counter rewards play rather than unhealthy session length.
- Discovery: find a rare interaction or optional route.

## Implementation guidance

Model each achievement with a stable ID, localized title and description, criterion type, threshold, progress value, visibility rule, tier, reward, and unlock timestamp. Evaluate progress from authoritative game events rather than UI state. Make event processing idempotent so reconnects cannot duplicate grants.

Keep achievement definitions data driven. That lets design rebalance thresholds without scattering rules across scene code. Preserve earned achievements if later thresholds change; retroactively grant newly qualified achievements where practical.

Show both the criterion and current progress, such as "37 / 50 striped-cookie clears." For a tiered series, show the current tier, the next threshold, and prior tiers. Secret entries should still say that they are secret and should not count against a prominent completion percentage unless the player can discover them fairly.

If an achievement grants currency or power, separate the recognition from the claim flow and make the reward explicit before claiming. Cosmetic or profile recognition is safer for difficult and social achievements because it does not distort competitive balance.

## Examples

### Pokémon GO medals

Pokémon GO medals record milestones for distance walked, PokéStops visited, Pokémon caught, and other activities. Each medal can progress through bronze, silver, gold, and platinum. The Trainer Profile lets players inspect medal progress, and some milestones grant a gameplay benefit such as an increased catch chance for a Pokémon type.

### Clash Royale badges and Card Mastery

Clash Royale describes badges as collectible cosmetics that display in a player's profile. Players can select eight for display, while repeat awards upgrade a badge's appearance. Card Mastery connects achievements to concrete tasks: winning with a card, dealing damage, and completing card-specific objectives. Progress is inspectable from the card collection, and mastery badges upgrade as tasks are completed.

## Risks and anti-patterns

- Giving badges for every trivial tap makes all achievements feel disposable.
- Obscure criteria turn a goal into a search-engine chore.
- Achievements based mainly on spending confuse purchasing power with mastery.
- Large, blocking unlock modals break the flow they are meant to celebrate.
- Public rarity percentages can motivate some players but shame or discourage others.
- Time-limited achievements presented in the same collection as permanent ones can create an impossible completion record.
- Tracking extreme session duration, sleep-disrupting play, or excessive purchases should never be framed as an accomplishment.

## Accessibility and ethics

Do not communicate tier or completion through color alone. Pair color with a name, icon shape, numeral, or texture. Unlock animation needs reduced-motion behavior, captions or text equivalents for sound cues, and enough display time to read. Achievement lists must work with screen readers and logical focus order.

Let players keep profile achievements private. Avoid goals that require unsolicited invitations, harassment of other players, or purchases. For young audiences, do not use an achievement to normalize spending or punish missed days.

## Metrics

Track discovery-to-start rate, start-to-completion rate, median time to completion, detail-view rate, achievement-driven mode breadth, and return rate after a near-complete milestone. Also watch dismissals, support searches for unclear criteria, and whether achievement hunters show abnormally long sessions. Completion distribution should reveal goals that are broken, trivial, or effectively impossible.

An achievement system is healthy when it broadens meaningful play. Total badge count alone is a vanity metric.

## Applying this pattern

Reward skillful board play, not merely accumulation. Good candidates include a first cross clear, clearing both arms of a cross in one cascade, finishing a puzzle without a hint, winning with one move left, and mastering each cookie type. Use tiered lifetime goals sparingly.

Keep the unlock as a small Pixi-led celebration near the result sequence, then store the permanent badge in a collection screen. A display slot could let players choose favorites without turning the home screen into a trophy dashboard. Do not create achievements for ad views, purchases, or playing late at night.

## References

- [UI Patterns: Achievements](https://ui-patterns.com/patterns/Achievements)
- [Pokémon GO: level up and earn medals](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/101-how-do-i-level-up-and-earn-medals/)
- [Clash Royale: Badges](https://support.clashroyale.com/hc/en-us/articles/49484923172123-Badges)
- [Clash Royale: Card Mastery](https://support.supercell.com/clash-royale/en/articles/card-mastery-4.html)
