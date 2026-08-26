---
title: "Self-Monitoring"
slug: "self-monitoring"
category: "game-mechanics"
subcategory: "gameplay-design"
source_type: "ui-patterns-expanded"
platforms: [ios, android]
tags: [self-monitoring, progress, statistics, feedback, goals, player-profile]
maturity: "established"
updated: "2026-07-23"
sources:
  - "https://ui-patterns.com/patterns/self-monitoring"
  - "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/82-viewing-your-trainer-profile-progress/"
  - "https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/3265-adventure-sync/"
  - "https://support.supercell.com/clash-royale/en/articles/card-mastery-4.html"
related_patterns: [achievements, levels, goal-gradient-effect, feedback-loops, progress-dashboard]
---

# Self-Monitoring

## Summary

Self-monitoring gives players a clear view of their own behavior, performance, and progress. It turns hidden history into feedback: win rate, puzzle attempts, mastery progress, weekly distance, best score, or the strategies a player uses most. The aim is not to produce a wall of analytics. It is to help someone answer, "How am I doing, and what could I try next?"

## Problem

Players often sense improvement without being able to see it. A difficult loss can outweigh ten quiet successes, and a lifetime total can hide recent progress. Without understandable feedback, players struggle to set goals, compare their current play with their past play, or diagnose where they get stuck.

Self-monitoring measures relevant behavior automatically and presents it in a form that supports reflection or adjustment.

## How it works

The system captures meaningful events, aggregates them over an appropriate time window, and shows a small set of interpretable measures. Strong self-monitoring supports three layers:

- Current state: score, streak within the run, moves left, or task progress.
- Recent trend: improvement over the last few sessions or a weekly summary.
- Long-term history: personal bests, total activity, mastery, and milestones.

The interface should connect a measure to an action. "Cross clears: 62%" is more useful when paired with a comparison to the player's own prior rate or a replayable practice goal. Real-time correction belongs near play; deeper analysis belongs in a result or profile screen.

## Mobile-game application

Keep the in-play HUD sparse. Show only information needed for the current decision. Put trends and breakdowns after the round, where they will not compete with touch targets.

Use compact visualizations with text summaries. A seven-day chart should still expose its values to screen readers. Avoid tiny legends, dense tables, and unexplained composite scores. Sync across devices carefully, but let offline sessions remain useful and reconcile later.

## Implementation guidance

Start with player questions, not available telemetry. For every metric, define:

- The player decision it supports.
- The exact event and denominator.
- The time window and reset rule.
- Whether it is local, synced, private, or shareable.
- The minimum sample size before drawing a conclusion.

Separate analytics collected for the studio from statistics shown to the player. Player-facing data needs stronger explanation, consistency, correction paths, and retention rules. Version metric definitions when game rules change; do not compare unlike eras as if they were equivalent.

Prefer personal baselines to global comparison. Show raw counts beside percentages where a small sample could mislead. Allow a player to clear local practice history where feasible, and provide account-level deletion and export through the game's privacy flow.

## Examples

### Pokémon GO Trainer Profile and Adventure Sync

The Pokémon GO Trainer Profile shows level progress, lifetime activity, weekly walking goals, egg incubation, medals, and a recent journal. Adventure Sync can record distance while the app is closed, then supplies weekly fitness reports and milestone progress. Its help documentation makes the feature optional and explains that it connects to Apple Health or Google Fit.

### Clash Royale Card Mastery

Clash Royale tracks progress on task families for individual cards, including wins, damage, and card-specific objectives. Players inspect that progress from a card's information screen. This makes self-monitoring narrow and actionable: instead of one general skill score, the player sees what remains for a particular card.

## Risks and anti-patterns

- A dashboard full of counts with no player decision attached is clutter.
- Global averages can discourage novices or expose matchmaking differences rather than skill.
- Win rate without mode, rank, or sample context is misleading.
- Constant measurement can make intrinsically enjoyable play feel like work.
- Streak counters can turn rest into perceived failure.
- Surfacing a decline without support can frustrate or shame the player.
- Quietly repurposing health, location, contacts, or device data for profiling violates trust.

The UI Patterns source notes a measurement paradox: tracking can improve performance while reducing enjoyment. Treat that as a design constraint, not a footnote.

## Accessibility and ethics

Charts need text alternatives, meaningful labels, sufficient contrast, and patterns or shapes beyond color. Do not animate historical numbers in a way that blocks reading. Let players hide sensitive statistics and choose whether anything is shared.

Collect only the data required for the feature. Ask permission in context, explain why a sensor or health connection is needed, and keep core play available when consent is declined. Fitness or location-derived goals must account for disabled players and should not define one body or movement pattern as the universal standard.

## Metrics

Measure profile and report views, return-to-play after viewing, use of suggested practice, comprehension in usability tests, privacy-setting changes, sensor opt-in and revocation, and whether players can accurately explain a displayed metric. Watch for lower enjoyment, compulsive checking, or mode avoidance after introducing detailed stats.

## Applying this pattern

Provide a concise result card: moves used, cross clears, cascade depth, hints used, and personal-best comparisons. A separate history view could show recent puzzle outcomes and mastery by mechanic. Keep the live board limited to goal progress and moves remaining.

Compare the player with their own earlier play, not a global percentile. Avoid a daily streak as the main identity metric. If the game offers a suggestion, make it concrete and playable, such as "Practice creating a cross without a hint," rather than assigning an opaque skill rating.

## References

- [UI Patterns: Self-Monitoring](https://ui-patterns.com/patterns/self-monitoring)
- [Pokémon GO: Trainer Profile and Progress](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/82-viewing-your-trainer-profile-progress/)
- [Pokémon GO: Adventure Sync](https://niantic.helpshift.com/hc/en/6-pokemon-go/faq/3265-adventure-sync/)
- [Clash Royale: Card Mastery](https://support.supercell.com/clash-royale/en/articles/card-mastery-4.html)
