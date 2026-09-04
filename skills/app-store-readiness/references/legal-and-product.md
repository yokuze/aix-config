# Legal and product requirements

Read this file before platform references. It decides which store rules, documents, and
in-app views apply. This is a release workflow, not legal advice. Send unresolved questions
to qualified counsel in the markets where the app is offered.

Sources were checked on 2026-08-08. Reopen the linked source during a real release.

## Build a data and feature map

For every feature and dependency, record the following before filling in any store form:

- data received, generated, inferred, stored, transmitted, retained, and deleted;
- whether it identifies, tracks, profiles, or can be linked to a person or device;
- data recipient, country or region, security controls, and purpose;
- platform permissions, native APIs, browser APIs, and user-visible purpose;
- whether the app has accounts, social login, subscriptions, ads, user-generated content,
  child users, regulated functions, physical goods, or digital goods; and
- every package, SDK, service, model, font, image, sound, and other third-party material.

Reconcile this map against network traces, package manifests, app configuration, and privacy
or analytics dashboards. A declaration based only on product intent is not evidence.

## Documents and in-app destinations

| Item | Apply it when | Delivery rule |
| --- | --- | --- |
| Privacy policy | Always publish one. Google Play requires a public policy URL and in-app link even when no user data is collected. Apple and Microsoft require appropriate disclosures when personal data is handled. | Identify the developer or app; explain data, purpose, recipients, security, retention, deletion, rights, and privacy contact. Host a stable public HTML page before release; a repository Markdown draft is only a pre-release fallback. |
| Terms of use or EULA | The service has accounts, payments, user content, important restrictions, or contractual rights. | Put it in settings or onboarding and link it from the public support/legal site. Apple can supply its standard EULA when no custom terms are needed. Obtain counsel review when terms govern a business. |
| Support and contact | Always. | Provide an accurate support route and keep it staffed. Apple requires a working Support URL/contact path. |
| Account deletion | Users can create an account. | Put an easy-to-find deletion initiation in the app. Google Play also requires an external deletion request URL in Play Console. Delete associated data unless retention is legally justified and disclosed. |
| Data export, access, correction, consent withdrawal | Applicable privacy law, app promise, or data type requires it. | Make the route usable, authenticated, and documented. Do not promise a deadline you cannot meet. |
| Community rules, report, block, moderation, contact | Users can post or interact with user-generated content. | Provide reporting, blocking, moderation, and support paths. Include policy and response ownership. |
| Age verification, parental flow, child-safety contact, family policy | The target audience includes children or the content warrants an age restriction. | Classify the audience accurately. Do not use general-audience defaults to avoid child protections. |
| Refund, subscription, cancellation, and purchase terms | Paid features, recurring billing, or digital goods. | Explain price, renewal, cancellation, restoration, and platform purchase handling at the point of decision. |
| Accessibility statement or contact | Required by a served jurisdiction, customer contract, or product promise. | Test the stated standard. An unsupported claim creates its own problem. |
| Export, sanctions, regulated-service, tax, or sector disclosures | Encryption, cross-border distribution, finance, health, gambling, communications, or other regulated activity is involved. | Stop for the appropriate specialist. Store forms do not replace this work. |

## Source-driven account and privacy rules

Apple requires in-app account deletion when the app supports account creation. Google Play
requires both an in-app deletion initiation and a web destination for apps that let people
create an account. Google Play's privacy policy must be public, non-geofenced, not a PDF, and
available in both Play Console and the app. The policy and Data safety form cover third-party
SDKs as well as first-party code.

- [Apple account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
- [Apple privacy details](https://developer.apple.com/app-store/app-privacy-details/)
- [Google Play User Data policy](https://support.google.com/googleplay/android-developer/answer/17105854?hl=en)
- [Google Play Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)

## Payments, identity, and content decisions

- If an Apple app unlocks digital goods, subscriptions, or features, inspect the App Review
  Guidelines payment rules before choosing any payment path. Do not assume a web checkout is
  allowed merely because it works in a webview.
- If an Android app sells digital goods or subscriptions, inspect Google Play's billing policy
  and use the required billing integration or a documented program exception.
- If the app uses a third-party sign-in as the primary account login on Apple platforms, check
  whether the Sign in with Apple rule applies. Avoid forced login when account features are not
  central to the app.
- If the app hosts user content, build moderation into the product. A policy page by itself is
  insufficient.
- If the app uses health, financial, education, location, biometric, government, or child data,
  perform a purpose, permissions, minimization, retention, and legal-basis review before store
  declarations.

## Third-party materials and open source

Create a complete dependency and asset inventory from lockfiles, Cargo metadata, native
projects, bundled resources, and manually imported files. Capture version, license identifier,
copyright/notice text, source URL, modifications, and how the material is delivered.

Fulfill the actual license terms. Many permissive licenses require preserving copyright and
license notices; copyleft licenses can impose source-offer or distribution duties; commercial
assets can have attribution or seat limits. An in-app "Open source licenses" page is not a
generic App Store, Play, or Microsoft Store requirement. Use one when the license requires
notice with the product, when the app's existing legal center is the right place to deliver it,
or when it improves access to required notices. Do not hide required notices behind a network
request that may fail.

Record the conclusion for every nontrivial dependency. Escalate incompatible, unknown,
custom, or source-available licenses before release.

## Regional and business requirements

Store publication can expose the app in many jurisdictions. Assess the regions selected in each
console and the developer's role. Check current platform processes for trader or business
identity disclosures, consumer cancellation rights, taxes, local content ratings, data-transfer
rules, and accessibility duties. These are conditional and change more often than source code.

Do not publish a placeholder privacy policy, terms page, or support address. If there is no
website, keep reviewed Markdown drafts in the repository, then deploy them to stable public URLs
before the store submission that requires them.
