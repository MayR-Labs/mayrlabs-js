# MayR Labs Auth Package Design (@mayrlabs/auth)

This document outlines the architecture and implementation plan for the `@mayrlabs/auth` package. This package is designed to simplify Single Sign-On (SSO) integration for all applications within the MayR Labs ecosystem.

## 1. Core Principles

- **Framework Agnostic Core**: The central logic (URL construction, JWT decoding) resides in a platform-independent core.
- **Platform-Specific Entry Points**: Dedicated modules for `nextjs`, `vue`, `nuxt`, and `react/vite`.
- **Server-First Security**: JWT verification and secret handling happen strictly on the server.
- **Developer Productivity**: Minimizing code duplication through zero-config defaults.
- **Local Dev Friendly**: Support for a "Null" auth provider to bypass SSO during local development.

---

## 2. Package Architecture

```text
@mayrlabs/auth
├── src/
│   ├── core/              # Framework-agnostic logic
│   ├── nextjs/            # Next.js Server Components, Actions, Middleware
│   ├── react/             # Shared React Hooks and Client Context
│   ├── vue/               # Vue Composition API hooks
│   └── nuxt/              # Nuxt-specific plugins and server utilities
└── package.json           # Exports configuration (subpath exports)
```

### Subpath Exports

The `package.json` will define exports like:

- `@mayrlabs/auth` (Entry point for config/init)
- `@mayrlabs/auth/nextjs`
- `@mayrlabs/auth/vue`
- `@mayrlabs/auth/react`

---

## 3. Type Definitions

These types are defined in `@mayrlabs/auth/types`.

```typescript
export interface MayRLabsUser {
  id: string; // ULID
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  roles: string[];
  avatarUrl: string;
  hasGravatar: boolean;
  passwordLastUpdatedAt: string | null; // ISO string
}

export interface AuthConfig {
  appId: string;
  clientSecret: string;
  accountUrl?: string; // Default: https://account.mayrlabs.com
  redirects?: {
    error?: string; // Default: /login
    success?: string; // Default: /dashboard
  };
  session?: {
    key?: string; // Default: mayrlabs-session
    cookieOptions?: any;
  };
}
```

---

## 4. Encryption & Security Standards

Cross-app communication (M2M) uses **AES-256-GCM** encryption.

### Key Derivation

To ensure a consistent 32-byte key size, the `clientSecret` must be hashed using **SHA-256**:

```typescript
const encryptionKey = crypto.createHash("sha256").update(clientSecret).digest();
```

### Payload Format

Encrypted strings follow the format: `iv:authTag:encryptedText` (all parts are Base64 encoded).

### M2M Request Example

When sending an encrypted request to the Account Dispatcher:

```typescript
async sendRequest<T>(action: string, payload: any = {}): Promise<T> {
  const user = await this.getUser();
  if (!user) throw new Error("Unauthorized: No session found");

  const innerPayload = JSON.stringify({
    app_id: this.config.appId,
    user_id: user.id, // String (ULID)
    action: action,
    created_at: new Date().toISOString(),
    payload: payload,
  });

  const encrypted = await this.encrypt(innerPayload, this.config.clientSecret);

  const response = await fetch(`${this.config.accountUrl}/api/encrypted-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: this.config.appId,
      action: action,
      payload: encrypted,
    }),
  });

  // ... decryption logic ...
}
```

---

## 5. Next.js Implementation Details

These reside in `@mayrlabs/auth/nextjs`.

### a. `handleCallback`

Processes the SSO redirect and sets the session cookie.

### b. `getUser`

Reads the session cookie and returns a verified `MayRLabsUser`.

### c. `middleware`

Protects routes and redirects to the Central Account Login if the user is unauthenticated.

---

## 6. Local Development (The "Null" Provider)

To simplify local development without requiring live Clerk/SSO credentials, the package supports a `null` provider mode.

### Setup

Set `MAYRLABS_AUTH_PROVIDER=null` in your `.env`.

### Behavior

- Redirects to `${accountUrl}/login`, which displays a list of mock users.
- Upon selection, redirects back to the app with a session token representing the mock user.
- Supports special test accounts (e.g., `restricted@mayrlabs.local`) to test authorization flows.

---

## 7. Migration Guide

Users can migrate from manual integration to `@mayrlabs/auth` in under 5 minutes:

1. Delete custom `jwt.ts` and `session.ts` in the local repo.
2. Initialize `auth` in a single file: `const auth = new AuthSetup(config);`.
3. Update callback route and `layout.tsx` to use `auth.handleCallback()` and `AuthProvider`.

---

## 8. Expected Environment Variables

- `MAYRLABS_CLIENT_ID`: App-specific ID.
- `MAYRLABS_CLIENT_SECRET`: App-specific secret (Server only).
- `NEXT_PUBLIC_MAYRLABS_ACCOUNT_URL`: URL of the Central Account System.
- `MAYRLABS_AUTH_PROVIDER`: `clerk` (default) or `null`.
- `NEXT_PUBLIC_MAYRLABS_JWT_IDENTIFIER`: (Optional) Custom cookie name.
