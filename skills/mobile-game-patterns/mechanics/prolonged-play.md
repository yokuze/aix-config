---
title: "Prolonged Play"
slug: "prolonged-play"
category: "game-mechanics"
subcategory: "gameplay-rewards"
source_type: "ui-patterns-expanded"
platforms: [ios, android]
tags: [extra-life, continue, energy, moves, session-design, resource-reward]
maturity: "established-with-ethical-risk"
updated: "2026-07-23"
sources:
  - "https://ui-patterns.com/patterns/Prolonged-play"
  - "https://candycrush.zendesk.com/hc/en-us/articles/360000750878-How-do-lives-work"
  - "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/117-visiting-pokestops-and-gyms/"
related_patterns: [fixed-rewards, appointment-dynamic, intentional-gaps, privileges, variable-rewards]
---

# Prolonged Play

## Summary

Prolonged play rewards a player with more of the resource that permits play: an extra life, more time, bonus moves, energy, attempts, or another run. In an arcade game, an extra life has immediate value because it protects the current score. In a mobile puzzle game, a life or move can extend the session.

The pattern is strongest when the extension is earned through play and gives the player a satisfying second chance. It is ethically fraught when a game manufactures scarcity, interrupts a stopping point, or turns an exhausted resource into payment pressure.

## Problem

Some games use a depleting resource as part of their challenge. A player may fail just before a goal, lose a run after investing time, or reach the end of a limited attempt. A well-timed extension can reward mastery or soften bad luck without removing stakes.

The designer must identify the actual play-limiting resource and decide whether extending it improves the game or merely inflates session length.

## How it works

The game awards or offers an additional unit of the core limiting resource after a clear condition. Common variants include:

- Extra life during a score run.
- Bonus seconds earned by reaching a checkpoint.
- Extra moves for creating a difficult combination.
- Energy or attempts granted by a quest.
- A revive that resumes near the failure point.

State the resource and condition before the player acts when possible. The extension should arrive when it remains useful. A timed unlimited-lives reward granted just as the player wants to stop is not a considerate reward.

## Mobile-game application

Mobile sessions are interruptible. Pause time-limited rewards outside active play, or let the player choose when to activate them. Persist a continue safely if the app backgrounds or the OS terminates it. A call, low-battery shutdown, or child-care interruption should not silently consume a scarce revive.

Keep continue choices simple. Show what the player keeps, what the extension provides, and whether it costs currency, an ad view, or a stored item. Always include a clear stop option.

## Implementation guidance

Define the limiting resource in domain logic and treat grants as auditable transactions. Record source, amount, cap behavior, expiration, and whether overflow is banked. Make claims idempotent and reconcile server-side value on reconnect.

For active-run extensions, capture a deterministic checkpoint: board state, random seed, score, inventory, timer, and any pending effects. Test backgrounding during the choice, during an ad, and during restoration.

Balance around the unextended game. If nearly every level expects purchased moves, the base level is mis-tuned. Earned extensions should feel like a bonus rather than a hidden requirement. Cap repeated revives in competitive scoring so spending cannot buy a leaderboard position.

## Examples

### Candy Crush Saga lives

Candy Crush Saga starts players with five lives and removes one after a failed level. According to King's help center, players with an empty meter can wait 30 minutes for a life, buy more, or ask friends to send one. The received or purchased life prolongs access to levels. This also illustrates the pattern's monetization risk: the game places the purchase at the moment continued play becomes unavailable.

### Pokémon GO item replenishment

Pokémon GO uses Poké Balls as a central resource for its catching loop. Visiting a PokéStop or Gym and spinning its Photo Disc grants inventory items, allowing the player to keep catching and battling while exploring. This is a less literal version of prolonged play: the extension comes from core play in the world rather than a failure-screen purchase.

## Risks and anti-patterns

- Intentionally overtuning levels so paid moves feel mandatory.
- Offering an ad or purchase before showing the free stop option.
- Giving a real-time unlimited-play reward that expires while the player is offline.
- Allowing purchases to extend a competitive run indefinitely.
- Calling a refill a gift after the game deliberately removed the resource moments earlier.
- Using social requests to pressure contacts or reveal a player's activity.
- Extending sessions at the expense of sleep, work, or physical comfort.

## Accessibility and ethics

Do not put the stop button behind low contrast, tiny type, or a misleading close icon. Screen readers must announce the cost and exact benefit before confirmation. Timed choices need enough time to understand and should pause for accessibility services.

Offer session reminders, save-and-return support, and activation control for timed rewards. For children, avoid spend-to-continue pressure and repeated ad prompts. Never praise unusually long continuous play.

## Metrics

Track extension offers, acceptance by source, subsequent success, repeated extension count, stop-button selection, purchase regret or refund signals, ad abandonment, and session length after acceptance. Monitor whether level completion depends on extensions and whether the mechanic creates a sharp spending spike after near misses. Healthy use produces occasional satisfying recoveries, not routine rescue from unfair tuning.

## Applying this pattern

Treat bonus moves as a skill reward inside the board, not a storefront ambush after failure. A rare cross-chain could earn one clearly animated extra move. A challenge mode might grant a single revive at a milestone, with no paid repeats.

The standard puzzle flow should always allow the player to stop, preserve progress where the mode permits it, and return later. If a bonus is time based, let the player activate it. Avoid a lives meter on the core game; it would add friction without improving the puzzle.

## References

- [UI Patterns: Prolonged Play](https://ui-patterns.com/patterns/Prolonged-play)
- [Candy Crush Saga: How do lives work?](https://candycrush.zendesk.com/hc/en-us/articles/360000750878-How-do-lives-work)
- [Pokémon GO: Visiting PokéStops and Gyms](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/117-visiting-pokestops-and-gyms/)
