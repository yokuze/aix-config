---
title: Privileges
slug: privileges
category: game-mechanics
subcategory: gameplay-rewards
source_type: pattern-and-research
platforms: [ios, android]
tags: [powers, mastery, roles, progression, community]
maturity: established
updated: 2026-07-23
sources:
  - https://ui-patterns.com/patterns/Powers
  - https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf
  - https://support.supercell.com/clash-royale/en/articles/clan-roles-1.html
related_patterns: [unlock-features, levels, achievements]
---

# Privileges

## Summary

Privileges are earned powers that help a player act faster, with more freedom, or in a trusted role. Unlike a consumable reward, a privilege changes what the player is allowed to do.

## Problem

Experienced players often need more agency than beginners, while social systems need a safe way to grant trusted members moderation or coordination tools.

## How it works

The game grants a temporary or permanent capability after demonstrated skill, contribution, or role assignment. Good privileges support competence and autonomy; they do not simply let veterans dominate newcomers.

## Mobile-game application

Examples include extra deck slots, advanced level tools, guild officer controls, cosmetic authoring, or the ability to curate community challenges. Preview the benefit and criteria. Explain whether it expires or can be revoked.

## Implementation guidance

Model privileges as explicit capabilities checked on the server, not as hidden UI flags. Keep audit trails for social powers. Design revocation and appeal before launch. For convenience privileges, preserve parity in competitive outcomes.

## Examples

- **Clash Royale:** clan ranks grant different management powers; promotion changes what a member can do rather than granting a one-off item.
- **Pokémon GO:** higher trainer levels unlock access to additional items and systems. This overlaps with Unlock Features; the privilege framing applies where access changes the player’s capabilities.

## Risks and anti-patterns

Paid competitive power, veteran vote multiplication, opaque moderation, and permanent advantages create an old guard. Never make safety tools a prestige toy. Avoid revoking earned convenience solely to manufacture urgency.

## Accessibility and ethics

Capability names and consequences must be readable, localized, and available outside icon-only menus. Social powers need safeguards against harassment. Players who cannot perform high-speed or precision input should have equivalent ways to demonstrate competence.

## Metrics

Track privilege attainment, use, misuse reports, reversals, appeal outcomes, newcomer outcomes, competitive balance, and whether the capability reduces friction for its intended group.

## Applying this pattern

Privileges could include an advanced practice editor, extra saved puzzle slots, or community-host tools. Keep them out of ranked scoring. A strong solo privilege gives experienced players expressive control without making the core board easier.

## References

- [UI-Patterns: Privileges](https://ui-patterns.com/patterns/Powers)
- [Ryan and Deci: Self-Determination Theory](https://selfdeterminationtheory.org/SDT/documents/2000_RyanDeci_SDT.pdf)
- [Clash Royale Support: Clan roles](https://support.supercell.com/clash-royale/en/articles/clan-roles-1.html)
