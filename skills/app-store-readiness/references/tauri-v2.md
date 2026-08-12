# Tauri v2 release gates

Use this alongside the chosen store reference. Sources were checked on 2026-08-08; recheck the
linked Tauri documentation and each platform's current build requirements during release.

## Configuration and identity

- Set one deliberate release version and verify the platform-specific version generated from it.
  Tauri recommends `tauri.conf.json > version`; do not let package and Cargo versions drift.
- Register stable, unique application and bundle identifiers before publication. Treat a published
  identifier, signing identity, and Android upload or app-signing key as permanent release data.
- Generate final bundles with the supported Tauri build command for each target. Archive the
  config, lockfiles, artifact checksums, signing identity reference, and build logs.
- Verify icons, display name, supported architectures, minimum OS versions, update endpoint, URL
  schemes, deep links, and file associations in the final native artifacts, not just config JSON.

## Tauri security review

- Review every `src-tauri/capabilities` file and every plugin permission. Grant each window or
  webview the smallest command set and filesystem or device scope it needs.
- Treat remote content as a separate trust boundary. Remote API access must list precise HTTPS
  origins and only the required commands. Do not grant a remote origin a broad desktop capability.
- Review custom Rust commands as privileged code. Tauri capabilities do not protect against
  unsafe command implementation, lax scopes, or compromised Rust dependencies.
- Keep a restrictive Content Security Policy. Inventory remote connect, image, media, frame, and
  navigation destinations. Avoid permissive wildcards and disable remote navigation unless it is
  an intentional product feature.
- Verify that external links use the approved opener path and that app-controlled URLs cannot
  become arbitrary file, shell, or deep-link execution.

## Mobile integration

- Audit `src-tauri/gen/android` and `src-tauri/gen/apple` after regenerating them. Treat native
  changes as release source, not disposable output.
- Declare only required Android permissions and iOS usage descriptions. Test the consent copy,
  denied state, partial state, revoked state, and the feature's fallback. Remove unused plugin
  permissions and native entitlements.
- Run the release app on actual iPhone, iPad, and Android hardware. Test safe areas, rotation,
  keyboard, text scaling, split view or multi-window where supported, notification flows, links,
  camera or file pickers, and background or resume behavior.
- Build Android as the required Play artifact and preserve the signing/key-management chain.
  Build iOS with the correct Apple Distribution identity, provisioning profile, bundle ID, and
  enabled capabilities.

## Desktop integration

- For Mac App Store, use the App Store bundle configuration and entitlements; do not submit a
  DMG, external installer, or an app that relies on shared installation locations.
- For the Microsoft Store, select the supported package path early. Validate the submitted package
  identity, architecture, install and uninstall behavior, and Store policy constraints.
- Code-sign desktop artifacts according to the selected distribution path. Direct macOS downloads
  also need notarization; this does not replace Mac App Store review.
- If the app has an updater, verify signature validation, downgrade behavior, update failure,
  rollback, and release-channel separation. A store-distributed app must not bypass store review
  with an unapproved update mechanism.

## Official sources

- [Tauri distribution](https://v2.tauri.app/distribute/)
- [Tauri capabilities](https://v2.tauri.app/security/capabilities/)
- [Tauri permissions](https://v2.tauri.app/security/permissions/)
- [Tauri iOS signing](https://v2.tauri.app/distribute/sign/ios/)
