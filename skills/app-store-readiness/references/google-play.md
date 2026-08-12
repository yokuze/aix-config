# Google Play gates

Use this for Android publication. Sources were checked on 2026-08-08. API targets, console
declarations, country requirements, and policy dates drift; check the linked pages during the
release and write the live requirement into the ledger.

## Android artifact and quality

- Use a stable application ID and release version. Generate the artifact accepted by Play Console,
  enroll in Play App Signing where required, and protect upload-key recovery and release access.
- Set the live required `targetSdk`. The current Android guidance announces Android 16 / API 36
  for new apps and updates from 2026-08-31; do not treat that future date as proof of the target
  required on an earlier submission date.
- Audit the final manifest and merged permissions. Request runtime permissions in context, handle
  denial and revocation, and remove permissions or SDKs that are not needed.
- Test on physical phones and tablets that cover supported Android versions, densities, locales,
  font sizes, rotation, split screen or freeform windows, keyboard, TalkBack, network failure,
  background and resume, install, update, and uninstall.
- Run Play Console pre-launch reports and resolve material crashes, compatibility issues, security
  findings, and policy-relevant behavior before production.

## Console declarations and policy

- Complete Data safety from the evidence-based data map. It covers all data collection and sharing,
  including third-party SDKs. Keep it consistent with the privacy policy and actual traffic.
- Add a live, public, non-geofenced privacy policy URL in Play Console and a privacy policy link
  or text in the app. It cannot be a PDF. Include the developer or app name, data practices,
  retention/deletion policy, secure handling, and privacy contact.
- Complete App content accurately: app access/reviewer credentials, ads, target audience and
  content, content rating, data safety, and every applicable restricted-policy declaration.
- If the app creates accounts, offer an in-app account-deletion initiation and an external
  deletion-request URL in the designated Console field.
- If the app targets children, apply Families rules to the entire product and SDK stack. If it
  hosts UGC, handles sensitive or regulated data, contains gambling, finance, health, government,
  crypto, accessibility services, or uses high-risk permissions, read the specific policy before
  release.
- If selling digital goods or subscriptions, apply the current Google Play billing policy and
  purchase, cancellation, restoration, and disclosure rules.

## Account and test-track gates

- Verify the developer identity, organization/trader information, bank/tax setup, countries,
  pricing, support contact, and release managers in Play Console.
- For a personal developer account created after 2023-11-13, production access requires a closed
  test with at least 12 opted-in testers for 14 continuous days, then a production-access
  application. Preserve the tester and feedback evidence.
- Supply working reviewer credentials and any needed QR codes, hardware, subscriptions, or
  navigation instructions. Test them in a clean account before submitting.

## Official sources

- [Target API level requirement](https://developer.android.com/google/play/requirements/target-sdk)
- [Data safety form](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)
- [User Data policy](https://support.google.com/googleplay/android-developer/answer/17105854?hl=en)
- [Target audience and content](https://support.google.com/googleplay/android-developer/answer/9867159?hl=en)
- [Personal-account testing requirement](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [Preview assets](https://support.google.com/googleplay/android-developer/answer/9866151?hl=en)
