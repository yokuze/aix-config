# Apple store gates

Use this for iOS, iPadOS, and macOS App Store releases. Sources were checked on 2026-08-08.
Apple changes the review rules and App Store Connect upload slots, so re-open the sources during
submission and record the result in the release ledger.

## Product and review

- Read the full App Review Guidelines for the app's category. The broad rules cover safety,
  performance, business, design, and legal compliance. Assess content, claims, privacy, ads,
  payments, account access, UGC, age suitability, and third-party SDK behavior.
- Submit a finished, stable app. Remove placeholder content, dead links, hidden features, and
  unsupported claims. Test on physical supported devices.
- Give App Review full access: active demo credentials or a complete demo mode, sample content,
  hardware or QR-code instructions, and review notes that explain non-obvious features and any
  purchases. Keep the review backend available.
- Make all metadata accurate. Screenshots must show the app in use, and previews must use app
  screen capture. Use fictional data and own the rights to every asset.
- Declare data practices for first-party code and third-party partners in App Store Connect. Keep
  the privacy policy, in-app behavior, and App Privacy answers aligned.
- If accounts exist, provide in-app deletion initiation. If account use is not central, do not
  force a login. Check primary third-party login flows against the Sign in with Apple rule.
- Use App Store payment paths when the guidelines require them for digital goods, subscriptions,
  or features. Describe paid content and renewal behavior plainly.

## Apple platform technical work

- Register the bundle ID, configure capabilities and entitlements, sign with the correct Apple
  distribution identity, and increment release versions. Verify the archive contains exactly the
  permissions and entitlements the product needs.
- Audit every sensitive API use. Supply accurate usage strings and test denial. Complete current
  privacy-manifest and required-reason-API work, including relevant third-party SDK signatures
  and manifests.
- Test iPhone and iPad layouts in the modes and orientations the app supports, including text
  size, keyboard, safe areas, interruption, accessibility, and restore after backgrounding.
- For macOS App Store, sandbox the app, package it with Apple technologies as a self-contained
  app bundle, and avoid third-party installers or installation to shared locations. Test sandbox
  file access, security-scoped access if used, quit/relaunch, window management, keyboard paths,
  VoiceOver, and display scaling.

## App Store Connect and assets

- Reserve the app record and name. Complete categories, availability, age rating, support URL,
  privacy policy URL, copyright, pricing, tax or banking information when relevant, and export
  compliance. Answer export questions from the actual cryptography used by the bundle.
- Supply the current app icon and screenshots for each required device family and localization.
  Confirm acceptance in App Store Connect rather than relying on an old device-size chart.
- Verify descriptions, subtitles, keywords, promotional text, "What’s New," and in-app purchase
  metadata. Do not put prices, competitor names, unsupported claims, personal data, or unrelated
  platform branding in metadata.

## Official sources

- [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Review submission guidance](https://developer.apple.com/app-store/review/)
- [App privacy details](https://developer.apple.com/app-store/app-privacy-details/)
- [Account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)
- [App Store Connect screenshots and previews](https://developer.apple.com/help/app-store-connect/manage-app-information/upload-app-previews-and-screenshots/)
