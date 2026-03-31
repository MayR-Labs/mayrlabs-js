# @mayrlabs/auth

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
