---
title: Goal-gradient effect
slug: goal-gradient-effect
category: game-mechanics
subcategory: gameplay-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [progress, motivation, completion, goals, progress-bar]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Completion
  - https://doi.org/10.1509/jmkr.43.1.39
related_patterns: [fixed-rewards, levels, achievements]
---

# Goal-gradient effect

## Summary

Effort often accelerates as a person sees a goal getting closer. Games use visible distance-to-go, chapter maps, collection counts, and reward tracks to turn an abstract objective into a finish line.

## Problem

Long progression can feel shapeless. Without a credible endpoint, players cannot judge the remaining effort or decide whether one more round is worthwhile.

## How it works

Set a concrete goal, expose progress, and make the remaining requirement legible. Research by Kivetz, Urminsky, and Zheng found purchase acceleration near loyalty rewards and an effect from endowed progress. Motivation commonly drops after the reward, so the next goal needs a clean handoff rather than an immediate new demand.

## Mobile-game application

Show "2 levels to the oven room," not a vague almost-there message. Use a compact map or segmented bar, celebrate completion, then let the player choose when to inspect the next chapter. Reserve exact percentages for systems that are actually measurable.

## Implementation guidance

Calculate progress from durable state. Label the endpoint, current position, remaining work, and reward. Do not move the finish line after the player commits. Break very long tracks into meaningful chapters, but avoid dozens of tiny claim buttons.

## Examples

- **Candy Crush Saga:** its level map makes the next checkpoint and the distance through an episode visible.
- **Clash Royale:** Trophy Road and reward tracks expose milestones along a continuous progression path.

## Risks and anti-patterns

Artificial progress becomes deceptive when the apparent head start is later offset. Moving thresholds, fake percentages, endless tracks, or a large paywall at 95% exploit the effect. Progress UI can also crowd out intrinsic play if every move is framed as grinding a bar.

## Accessibility and ethics

Pair visual bars with text such as "7 of 10." Announce changes without stealing screen-reader focus. Do not animate constant near-completion states or use loss warnings to pressure a purchase.

## Metrics

Measure velocity by distance band, abandonment near the goal, post-completion return, time to next voluntary session, reward claims, and complaints about unclear or changed requirements.

## Applying this pattern

Use the bakery journey to show a short run of boards ending in a named room or bake. A "3 of 5 recipes restored" label is more honest than an unlabeled bar. After completion, give the win room to breathe.

## References

- [UI-Patterns: Goal-Gradient Effect](https://ui-patterns.com/patterns/Completion)
- [Kivetz, Urminsky, and Zheng: The Goal-Gradient Hypothesis Resurrected](https://doi.org/10.1509/jmkr.43.1.39)
