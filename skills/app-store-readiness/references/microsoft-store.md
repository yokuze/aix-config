# Microsoft Store gates

Use this for Windows publication. Sources were checked on 2026-08-08. Confirm the current
Partner Center workflow, accepted package type, and policy version before submission.

## Product and package

- Reserve the product identity in Partner Center and select a release package path before final
  signing. For MSIX, verify package identity, publisher, version, architecture, visual assets,
  install, update, repair, and uninstall behavior in the final package.
- Run the Windows App Certification Kit when the selected package path supports it. Test on clean
  supported Windows versions and account types, including high-DPI displays, touch, keyboard,
  Narrator, window resizing, offline behavior, install/update/uninstall, and no-admin paths.
- Use production code signing where the chosen package or distribution path requires it. Microsoft
  Store packaging may provide signing for Store distribution; direct downloads have different
  signing and reputation concerns.
- Make the app testable. If a login or restricted feature exists, provide working demo access and
  clear Notes for certification. Keep required servers available through certification.

## Policy, metadata, and Console

- Read the active Microsoft Store Policies for value, security, usability, privacy, financial
  transactions, notifications, ads, content, local law, ratings, UGC, and gambling. Make product
  behavior and listing claims match.
- Complete Partner Center properties: category, system requirements, pricing and availability,
  age ratings through IARC, package upload, descriptions, support/contact details, and notes for
  certification.
- If the app accesses, collects, or transmits personal information, or law otherwise requires it,
  provide an accurate privacy policy URL in Partner Center and make it reachable in the product.
- Use licensed content and accurate branding. Apply country-specific ratings and restrictions to
  every chosen market.

## Official sources

- [Microsoft Store submission guide](https://learn.microsoft.com/en-us/windows/apps/publish/get-started)
- [Store listing information for MSIX](https://learn.microsoft.com/en-us/windows/apps/publish/publish-your-app/msix/add-and-edit-store-listing-info)
- [Microsoft Store Policies 7.18](https://learn.microsoft.com/en-us/windows/apps/publish/store-policy-archive/store-policy-7-18)
- [MSIX package signing](https://learn.microsoft.com/en-us/windows/msix/package/signing-package-overview)
- [Windows app icon construction](https://learn.microsoft.com/en-us/windows/apps/design/iconography/app-icon-construction)
