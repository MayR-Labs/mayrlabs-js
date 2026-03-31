# @mayrlabs/auth-nextjs

## 0.1.2

### Patch Changes

- Updated `exports` map resolution and reverted deep exports to fix `typesVersions` inference bugs.
- Bumped peer `@mayrlabs/auth` dependency to strict `^0.1.2`.

## 0.1.1

### Patch Changes

- Bumped dependency `@mayrlabs/auth` to `0.1.1` to ensure strict version synchronization across the MayR Labs ecosystem.

## 0.1.0

### Major Changes

- d5d0398: The first release of `@mayrlabs/auth-nextjs`!

  Provides seamless Next.js App Router integrations for the core `@mayrlabs/auth` ecosystem, including out-of-the-box components:
  - `createNextAuth`: Contextual setup utility to establish universal authentication context.
  - `AuthProvider` & `AuthClientProvider`: React Server and Client providers for session hydration.
  - `getUserOrThrow`, `getUserOrRedirect`, and `authProxy`: Secure server-side authorization blocks for protecting pages and actions.
  - `logoutHandler` & `handleCallback`: Automated Route Handlers for SSO flows.
  - `sendRequest`: Natively encrypted M2M function proxy wrapper for server-to-server communication.
