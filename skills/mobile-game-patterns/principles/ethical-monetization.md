---
title: Ethical monetization and transparent value
slug: ethical-monetization
category: design-principle
subcategory: commerce
source_type: policy-and-research
platforms: [ios, android]
tags: [monetization, dark-patterns, pricing, loot-boxes, trust]
maturity: established
ethical_risk: high
updated: 2026-07-23
sources:
  - https://developer.apple.com/app-store/review/guidelines/
  - https://support.google.com/googleplay/android-developer/answer/9858738
  - https://support.google.com/googleplay/android-developer/answer/17190352
related_patterns: [variable-rewards, prolonged-play, periodic-events]
---

# Ethical monetization and transparent value

Show what a purchase costs, what it grants, and whether it expires. Do not manufacture confusion or frustration to force the sale.

## Principle

Use direct prices near the decision. Explain currency conversions. Disclose randomized-item odds before purchase where applicable. Rewarded ads must be an explicit choice, and interstitials belong at natural breaks, never between a tap and its expected action.

Monument Valley 3 offers introductory chapters and a single full-game unlock. That is easy to understand. In contrast, stacked currencies, expiring bundles, and pay-to-remove-failure pressure make value hard to judge even when technically disclosed.

## Implementation guidance

- Prefer cosmetic or clearly scoped content purchases.
- Preserve a satisfying free loop.
- Never disguise an ad as game UI or a system warning.
- Put restore-purchases and parental controls where people can find them.
- Audit limited-time copy for false urgency.

## Measures

Track refunds, chargebacks, accidental-purchase reports, payer retention, and sentiment. Conversion alone is not a success measure.

## Applying this pattern

Keep purchases cosmetic and direct. A failed puzzle should offer learning and retry before commerce. Competitive outcomes cannot depend on spending.
