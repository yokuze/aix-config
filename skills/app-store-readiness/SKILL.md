---
name: app-store-readiness
description: Prepare a mobile or desktop app, especially a Tauri v2 app, for App Store, Google Play, Mac App Store, and Microsoft Store publication. Use when planning, auditing, implementing, or verifying release readiness, including store metadata and assets, signing, privacy, accounts, payments, accessibility, review access, legal documents, and release submission.
---

# App store readiness

Prepare a shipping app for the stores it will actually enter. Produce evidence for every
release gate; do not label an app "production-ready" because it builds locally.

## Operating rules

- Start by naming the target stores, countries or regions, developer account type, business
  model, data flows, and app features. Treat an unchosen store as out of scope.
- Read the matching store and Tauri references before changing app code or release files.
  Refresh policy pages during the release, even if this skill has a recent policy snapshot.
- Separate a store requirement, a law, a license obligation, a platform convention, and a
  recommended improvement. Cite the official source and the date checked for every hard
  release gate.
- Do not invent legal advice or claim that a document makes an app compliant. Flag cases
  that need qualified legal, privacy, tax, payments, healthcare, gambling, child-safety, or
  export-control review.
- Treat data collected by a backend, webview, analytics, ads, crash reporting, and every
  third-party SDK as app data. The app's own code is not the boundary.
- Do not add an open-source-license screen merely because the app uses open source. Add
  notices wherever each dependency license requires them; use an in-app view when that is
  the practical or required delivery channel. See `references/legal-and-product.md`.
- When the user asks for step-by-step instructions, write a click-by-click procedure rather than
  a release outline. Name the console and page, exact field values, every applicable checkbox or
  capability, what to leave off, required files or credentials, the save or submit action,
  expected result, and evidence to retain. Derive selections from the final manifest,
  entitlements, permissions, and product scope. Never say only "configure signing", "enable
  capabilities", or "complete the declarations" when the next screen has concrete choices.
- For store-listing marketing copy, use the `write-app-store-copy` skill. Its research,
  table-stakes rejection, claim-evidence check, and reader-inference test are required before
  approving copy.
- Distinguish similarly named portals. For Apple, configure App ID capabilities in Apple Developer
  under Certificates, Identifiers & Profiles. App listing and submission fields live in App Store
  Connect. Give the correct navigation path.
- Never treat a secret name, a recent write timestamp, or a nonempty value as credential proof.
  Validate release credentials and variables with `references/credential-validation.md` before the
  first remote build and after replacing or rotating any value.

## Workflow

1. Inventory the release surface.

   Inspect the repository, build configuration, packages, native manifests, entitlements,
   capabilities, permissions, backend APIs, telemetry, payments, auth, content sources,
   and supported devices. Write a release ledger with owner, evidence, status, source URL,
   and checked date for each gate.

2. Classify the app.

   Use `references/legal-and-product.md`. Record whether the app has accounts, user content,
   subscriptions or digital goods, ads, children, personal or sensitive data, regulated
   functions, hardware access, encryption, location, or content that varies by region. This
   decides which conditional gates apply.

3. Apply store and Tauri requirements.

   Read only the references for selected platforms:

   - iOS, iPadOS, or macOS App Store: `references/apple.md`
   - Android / Google Play: `references/google-play.md`
   - Windows / Microsoft Store: `references/microsoft-store.md`
   - Tauri v2 on any platform: `references/tauri-v2.md`

   Translate each requirement into a repository change, Console or Connect field, test, or
   explicit exemption. Keep permissions, disclosures, in-app behavior, and store answers in
   agreement.

   For a procedural handoff, inventory the actual choices on every referenced screen. Include a
   positive selection and an explicit "leave off" decision for capabilities and permissions. If a
   console choice cannot be derived, mark it as a decision or blocker instead of skipping it.

4. Build the legal and support surface.

   Use `references/legal-and-product.md` to decide which documents and in-app destinations
   are needed. If a public site is not available, draft version-controlled Markdown files for
   review. Mark any required public URL as a release blocker until it is hosted. Do not submit
   a file or placeholder URL where the store requires a live, public page.

5. Build the listing package.

   Use `references/store-assets.md`. Capture the shipping app on each supported device class;
   use fictional accounts and data; localize screenshots that contain text. Verify the final
   upload slots in the relevant console because asset dimensions and required device sets move.

6. Validate release credentials and variables.

   Use `references/credential-validation.md`. Inventory every secret and variable referenced by
   release workflows. Verify formats, parse cryptographic material, check related values belong
   together, and authenticate against read-only provider endpoints where available. Put cheap,
   non-destructive checks before resource creation and compilation in CI. Remove or mark invalid
   credentials as blockers; do not leave them present merely to satisfy a presence check.

7. Verify the product, not only the binary.

   Test clean install, upgrade, offline or failure behavior, permissions granted and denied,
   keyboard and touch paths, screen readers, scaling, external links, account creation and
   deletion, purchase restoration, logout, data export or deletion where offered, and every
   listed feature. Run the platform-specific checks in the selected references on real devices
   where a simulator cannot prove the behavior.

8. Assemble the review handoff.

   Use `references/release-dossier.md`. Supply working reviewer credentials, reset steps,
   hardware or sample-data instructions, test notes for non-obvious paths, feature flags,
   support contacts, and a rollback plan. Confirm servers, certificates, and purchase products
   are live for review.

9. Make the release decision.

   The release ledger must show every applicable hard gate as passed with evidence. Mark
   unknowns and policy changes as blockers. Keep a dated policy snapshot with the release so a
   later update can tell which rules were checked.

## Required handoff

Deliver a concise release dossier containing:

- selected platforms, regions, versions, package or bundle IDs, and release owner;
- a requirement matrix with source, checked date, applicability, evidence, and status;
- store listing copy, review instructions, asset inventory, and uploaded-artifact checksums;
- data map, permissions map, declarations, legal-document locations, and unresolved counsel
  questions;
- signing, provenance, dependency-license, security, accessibility, test-device, and rollback
  evidence; and
- the exact blockers, rather than a vague readiness verdict.

## References

- `references/legal-and-product.md` — data, accounts, payments, content, legal pages, and
  license-notice decisions. Read first for every app.
- `references/tauri-v2.md` — Tauri configuration, capabilities, mobile permissions, signing,
  and distribution checks. Read for Tauri v2 apps.
- `references/apple.md` — App Store and Mac App Store requirements. Read for any Apple target.
- `references/google-play.md` — Play Console, Android, and Google Play requirements. Read for
  Android publication.
- `references/microsoft-store.md` — Partner Center, packages, and Store certification. Read
  for Windows publication.
- `references/store-assets.md` — icons, screenshots, videos, copy, and localization. Read when
  making a listing package.
- `references/release-dossier.md` — the evidence ledger and reviewer handoff. Read before a
  submission or a production-readiness verdict.
- `references/credential-validation.md` — credential, variable, provider-authentication, and CI
  preflight proof. Read before configuring or running release automation.
