# @mayrlabs/auth-nextjs

## 0.5.0 (2026-04-09)

### Features
- **CSRF Protection**: Added robust state-parameter verification for all SSO flows using `httpOnly` cookies (5-minute expiry).
- **Dynamic Redirects**: `redirectToLogin` now accepts an optional `params` object (e.g., `return_to`).
- **Session Sliding**: Added `autoRotateCookie` option for automatic token rotation in Middleware/Actions.
- **Role Gating**: Simplified UI-level protection with `allowedRoles` and `fallback` props in `AuthProvider`.
- **User Model**: `useUser()` now returns the standardized `AuthUser` class instance.
- **Breaking Changes**: Renamed `MayRLabsAuth*Payload` to `Auth*Payload` to match core v0.5.0.

## 0.4.2 (2026-04-08)

### Breaking Changes
- Updated session key defaults to prevent collision between Client and Issuer sessions.
- Default Client key: `mayrlabs-client-session`
- Default Issuer key: `mayrlabs-issuer-session`

## 0.4.1

Bump to sync

## 0.4.0

### Major Changes

- **Remote JWK Support**: Added support for fetching public keys from remote JWKS endpoints. If `remotePublicKey` is enabled, the SDK will automatically fetch and cache keys from `${accountUrl}/.well-known/jwks.json`.
- **Environment Validation**: Integrated `@t3-oss/env-nextjs` for strict runtime environment variable validation.
- **Documentation**: Added comprehensive TSDoc blocks to all public methods and types.

## 0.3.3

### Patch Changes

- Bumped version to sync with the core @mayrlabs/auth package.

## 0.3.2

### Patch Changes

- Internal type refinement to support PS256 transition in core.

## 0.3.1

### Patch Changes

- Bumped version to sync with the core @mayrlabs/auth package.

## 0.3.0

### Major Changes

- **SDK Modernization**: Fully rebuilt the Next.js integration to support the new asymmetric **PS256** standard.
- **Subpath Export**: Moved `AuthProvider` to `@mayrlabs/auth-nextjs/client` to prevent React Context errors in Next.js Server Components.
- **New Factory Pattern**: Introduced `createNextClientAuth` and `createNextIssuerAuth` for streamlined initialization.

## 0.2.0

### Major Changes

- This version was skipped to align major versioning with `@mayrlabs/auth`.

## 0.1.2

### Patch Changes

- Aligned internal types exports to guarantee TypeScript compatibility and sync versions ahead of dependency pushes.

## 0.1.1

### Patch Changes

- Bumped version to 0.1.1 to ensure sync with @mayrlabs/auth

## 0.1.0

### Major Changes

- 12d4196: The initial release of `@mayrlabs/auth-nextjs`! Featuring first-class support for Next.js App Router (Middleware, Server Components, and Client Components).
