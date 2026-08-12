# Release credential validation

Validate the complete credential set before a remote release build. A secret can exist, have a
recent timestamp, and still contain the wrong file, escaped newlines, a revoked token, or a key from
another account.

## Evidence levels

Apply every available level to each value:

1. Confirm that the workflow references a configured secret or variable and rejects empty,
   placeholder, and malformed values.
2. Parse files with the tool that owns the format. Examples include `openssl pkey`, `openssl x509`,
   `openssl pkcs12`, JSON parsing, and the platform configuration validator.
3. Compare related identifiers. Confirm that a certificate, provisioning profile, API key, bundle
   ID, team ID, application slug, account ID, signing public key, and configured endpoint describe
   the same release identity where applicable.
4. Call a read-only provider endpoint. Confirm that the token is active and can access the intended
   account, organization, application, or project. Prefer an authenticated list, identity, or token
   verification endpoint over a write operation.
5. Exercise the credential's purpose without publishing. Sign and verify a disposable file, perform
   a provider dry run, validate an archive, or build an unsigned artifact when the platform supports
   it.

Record which levels passed. Mark an unavailable level as unproved, not passed.

## Common checks

| Value | Minimum proof |
| --- | --- |
| Apple App Store Connect API key | Parse the `.p8` PEM; validate key ID and issuer formats; create a short-lived JWT; receive a successful response from a read-only App Store Connect endpoint. |
| Apple certificate | Parse the `.p12` with its password; check validity dates and certificate purpose; match its team and common name to the configured signing identity. |
| Apple provisioning profile | Decode it; match bundle ID, team ID, entitlements, distribution type, devices where applicable, certificate, and expiration. |
| Android keystore | Open it with the store password; resolve the alias; verify the key password; record certificate fingerprints and expiration; compare the upload certificate with Play Console. |
| Update signing key | Sign a disposable file; verify it with the public key embedded in the shipping configuration. |
| Provider API token | Use the provider's token or identity endpoint; verify access to the configured account, organization, project, or application. |
| Application or account identifier | Enforce its syntax; resolve it through the provider; compare the returned owner with the release ledger. |
| Release URL | Parse as an allowed HTTPS origin; reject credentials, unexpected paths, queries, and fragments; resolve DNS; request the required route; verify the response belongs to the intended service. |
| Legal or support URL | Require public HTTPS; request every final path without authentication; verify a successful HTML response and the expected page identity. |
| Configuration file stored as a secret | Recreate the file byte-for-byte; parse it with the owning tool; reject examples and placeholders; compare identifiers, public keys, and URLs with their authoritative records. |

Do not print private material, authorization headers, passwords, session tokens, or complete service
responses. Report the check and its result. A key length, certificate subject, public fingerprint,
expiration date, HTTP status, or provider identity is usually sufficient evidence.

## CI preflight

Run credential preflight before creating cloud resources, drafting releases, compiling native
artifacts, or consuming signing services. Keep the checks read-only and cheap.

The preflight must:

- validate every credential needed by that workflow path, not every credential the repository may
  use elsewhere;
- fail with the exact secret or variable name and the failed property;
- verify related values together instead of checking them independently;
- keep production and QA destinations explicit, including release channels and backend accounts;
- avoid provider writes merely to test access; and
- run again after credential rotation, account migration, certificate renewal, or environment
  replacement.

Do not rely on CI alone. Validate the authoritative source before writing it into the CI secret
store. CI systems usually reveal names and timestamps but do not allow a stored secret to be read
back for comparison.

## Failure handling

Stop the release path when a credential fails. Replace it from an authoritative source only after
validating that source. If a credential belongs to the wrong account or team, remove it from the
release environment so a presence-only gate cannot report a false pass.

Do not retry the same build after changing a secret when the job may already have captured its
environment. Start a new workflow run with a new build identity.
