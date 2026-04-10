# Changelog

## [0.5.0] - 2026-04-10

### Features
- **CSRF Protection**: Implemented state-parameter verification for SSO flows to prevent forgery.
- **Node.js Compatibility**: Improved `b64url` encoding to utilize `Buffer` when available, ensuring compatibility with Next.js Server Actions and Middleware.
- **User Model**: Renamed `MayRLabsUser` to `AuthUser` and aligned interface with the Account Center (`id`, `username`, nullable name fields).
- **PKCE Utilities**: Added `generateCodeVerifier`, `generateCodeChallenge`, and `generateRandomString` (compatible with both Browser and Node.js).
- **Hooks**: Added `onAuthSuccess` and `onAuthFailure` event hooks to `ClientConfig`.
- **Breaking Changes**: Renamed `MayRLabsAuth*Payload` to `Auth*Payload` across the entire SDK.
- **Tests**: Added comprehensive unit tests for `AuthUser`, `PKCE`, and random string utilities.

## [0.4.2] - 2026-04-08

### Breaking Changes
- Separated session cookie keys for client and issuer applications.
- Updated default session key to `mayrlabs-client-session` (Client) and `mayrlabs-issuer-session` (Issuer).

## 0.4.1

Bump to sync

## 0.4.0

### Major Changes

- **Remote JWK Support**: Added support for fetching public keys from remote JWKS endpoints. If `remotePublicKey` is enabled, the SDK will automatically fetch and cache keys from `${accountUrl}/.well-known/jwks.json`.
- **Architectural Improvements**:
  - Renamed `getPublicKey` to `getVerifyKey` on `BaseAuthSetup` to accommodate both local `CryptoKey` and remote `JWTVerifyGetKey` sets.
  - Centralized core constants like `SESSION_KEY` and `ACCOUNT_URL`.
- **Documentation**: Added comprehensive TSDoc blocks to all public methods and types.

## 0.3.3

Minor bump for version synchronization with nextjs package.

## 0.3.2

Exported `BaseAuthSetup` to resolve typing issues in consuming packages.

## 0.3.1

Minor bump to ensure version sync

## 0.3.0

### Major Changes

- **Shared Verification Logic**: Introduced `BaseAuthSetup` as a common parent for `ClientAuthSetup` and `IssuerAuthSetup`, centralizing token verification logic.
- **Improved Issuer Capabilities**: `IssuerAuthSetup` now supports `verifyAuthToken` and `verifyErrorToken` methods by inheriting from `BaseAuthSetup`.
- **Refactored Key Management**:
  - Renamed internal key fields to `_publicKey` and `_privateKey` for clarity.
  - Standardized key retrieval with `getPublicKey()` (on base) and `getPrivateKey()` (on issuer).
- **Type Safety**: Updated `IssuerConfig` and introduced `IssuerConfigInput` to support public key verification within the issuer context.

## 0.2.0

### Major Changes

- **Identity SDK Overhaul**: Transitioned from symmetric AES-256-GCM encryption to asymmetric **PS256** (RSA-PSS with SHA-256) for all token signing and verification.
- **Architectural Split**: Replaced the monolithic `AuthSetup` class with two specialized classes:
  - `IssuerAuthSetup`: For identity providers (signing tokens with Private JWK).
  - `ClientAuthSetup`: For consumer applications (verifying tokens with Public JWK and machine authentication).
- **JWK Integration**: Switched to JSON Web Key (JWK) standard for key management with built-in caching for performance.
- **Strict Typing**: Removed all `any` types and implemented exhaustive TypeScript interfaces for `MayRLabsAuthUserPayload`, `MayRLabsAuthMachinePayload`, and `MayRLabsAuthErrorPayload`.
- **Breaking Changes**: Fully removed legacy symmetric encryption utilities (`src/core/encryption.ts`).

## 0.1.2

### Patch Changes

- Aligned internal types exports to guarantee TypeScript compatibility and sync versions ahead of dependency pushes.

## 0.1.1

### Patch Changes

- Bumped version to 0.1.1 to ensure sync with @mayrlabs/auth-nextjs

## 0.1.0

### Major Changes

- 12d4196: The initial major release of `@mayrlabs/auth` as a framework-agnostic core library!

  #### ✨ Core Features

  - **Framework Agnostic Identity Management**: The `AuthSetup` class provides universal JS support for authentication. Native methods `verifyAuthToken` and `verifyErrorToken` make SSO validation seamless across node-compatible runtimes.
  - **Secure M2M Edge**: Provides `sendRequest` parameterized natively to use `FormData` encryption payloads when communicating with the Account Center.
  - **Strictly Typed Ecosystem**: Nested envelope validation checks outer network operations and inner app logic automatically. Exports detailed structures such as `M2MPayload`, `M2MResponse`, and `DecryptedM2MResponse<T>` for confident TypeScript runtime verification.

  _(For Next.js App Router integrations, install the companion package `@mayrlabs/auth-nextjs` instead!)_
