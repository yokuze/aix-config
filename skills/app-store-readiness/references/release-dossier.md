# Release dossier

Use this file to create the handoff that supports a real release decision. Keep it in the app
repository or release system; do not rely on an unrecorded console click.

## Release ledger

Use one row per gate.

| Gate | Applies | Owner | Evidence | Source and checked date | Status |
| --- | --- | --- | --- | --- | --- |
| Example: Google Play Data safety | Yes | Privacy owner | Data map and Console export | Google policy, 2026-08-08 | Passed |

Allowed statuses: `not started`, `in progress`, `blocked`, `not applicable` with rationale,
`passed`, and `waived` with named approver and expiry.

## Submission handoff

- Release identity: app name, bundle/package IDs, source commit, version/build numbers, artifact
  checksums, signed artifact locations, selected stores, regions, and release owner.
- Product evidence: device matrix, test results, known limitations, crash/analytics readiness,
  offline and restore behavior, accessibility result, security review, dependency inventory, and
  rollback procedure.
- Privacy and legal evidence: data map, permission map, Data safety/App Privacy answers, legal
  page URLs, account and data deletion flow, license notices, counsel decisions, and regional
  exceptions.
- Store content: final descriptions, categories, age ratings, pricing, availability, support URL,
  privacy URL, screenshots, icons, previews, localized variants, and asset source manifest.
- Reviewer access: demo username/password, reset instruction, subscription or purchase access,
  test data, external hardware/QR instructions, feature-flag state, and a support contact who can
  respond during review.

## Final proof

Before submission, have someone who did not build the release complete this sequence:

1. Install the exact signed artifact on a clean target device.
2. Finish the core journey using the reviewer instructions.
3. Exercise every permission both granted and denied.
4. Find privacy, support, legal notices, account deletion, and subscription controls where they
   apply.
5. Compare the store listing and declarations against the app and observed network behavior.
6. Confirm the release ledger has evidence for every applicable hard gate.

If the independent pass cannot reproduce a claimed result, mark it blocked. Do not replace the
evidence with a confidence statement.
