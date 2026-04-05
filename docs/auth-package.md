# MayR Labs Identity SDK (@mayrlabs/auth) - Technical Design

This document defines the internal logic, cryptographic standards, API surface, and usage patterns of the `@mayrlabs/auth` package. This is both a **builder's guide** and a **consumer's guide** for the SDK.

## 🏗️ Core Technology Stack

- **Cryptography**: `jose` — the standard JSON Web Token/Key toolkit for Node.js and Edge runtimes.
- **Algorithm**: **PS256** (RSA-PSS with SHA-256). Provides probabilistic padding, making it significantly stronger than `RS256`.
- **Key Format**: **JWK** (JSON Web Key) stored as environment variable strings and imported via `importJWK`.

---

## 📄 Exported Interfaces

All payload types are exported from the package root and used across the ecosystem.

### `MayRLabsAuthUserPayload`

```typescript
interface MayRLabsAuthUserPayload {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  iat: number; // Issued-at (auto-set by issuer)
  exp: number; // Expiry (auto-set by issuer)
  iss: string; // Issuer (auto-set by issuer)
  aud: string; // Receiving app's base URL OR "mayrlabs-internal"
}
```

### `MayRLabsAuthMachinePayload`

```typescript
interface MayRLabsAuthMachinePayload {
  sub: string; // appId of the requesting service (e.g., "contentforge")
  type: "machine";
  iat: number;
  exp: number;
  iss: string;
  aud: "mayrlabs-internal";
}
```

### `MayRLabsAuthErrorPayload`

```typescript
interface MayRLabsAuthErrorPayload {
  message: string;
  code: string;
  iat: number;
  iss: string;
}
```

---

## 🏛️ `IssuerAuthSetup`

Designed exclusively for the **Account App**. It holds the Private Key and is the only entity that can sign tokens.

### Internal Logic

- Accepts the Private JWK string and calls `importJWK(JSON.parse(privateKey), "PS256")` once, then caches the resulting `KeyLike`.
- All signing methods use `new SignJWT(payload).setProtectedHeader({ alg: "PS256" }).setIssuer(this.issuer).setIssuedAt()...sign(privateKey)`.

### Constructor

```typescript
const issuer = new IssuerAuthSetup({
  privateKey: process.env.MAYRLABS_AUTH_PRIVATE_JWK!, // The full JSON private JWK string
  issuer: "auth.mayrlabs.com", // Optional, defaults to "auth.mayrlabs.com"
});
```

### Methods

#### `signUserToken(payload, options?): Promise<string>`

Signs a JWT for an authenticated user. Automatically sets `iss`, `iat`. Caller provides the `aud` (receiving app's base URL or `"mayrlabs-internal"`).

```typescript
const token = await issuer.signUserToken(
  { userId: "user_123", email: "user@example.com", roles: ["user"] },
  { audience: "contentforge.mayrlabs.com", expiresIn: "7d" }
);
```

#### `signMachineToken(payload, options?): Promise<string>`

Signs a JWT for a service. Enforces `type: "machine"` and `aud: "mayrlabs-internal"`.

```typescript
const token = await issuer.signMachineToken(
  { sub: "contentforge" },
  { expiresIn: "1h" }
);
```

#### `signErrorToken(payload): Promise<string>`

Signs a JWT that wraps an error, issued when an SSO login fails. Used to pass structured error details back to the client app via the redirect URL.

```typescript
const token = await issuer.signErrorToken(
  {
    message: "User is restricted from this application.",
    code: "AUTH_RESTRICTED",
  },
  { audience: "contentforge.mayrlabs.com", expiresIn: "10m" }
);
```

---

## 🏢 `ClientAuthSetup`

Designed for consumer apps like **ContentForge** or **Vault**. Holds the Public Key (for verification) and the client credentials (for M2M machine token acquisition and login URL generation).

### Internal Logic

- Accepts the Public JWK string and calls `importJWK(JSON.parse(publicKey), "PS256")` once, then caches the result.
- All verification methods use `jwtVerify(token, publicKey, { issuer: this.config.issuer, audience: this.config.audience, algorithms: ["PS256"] })`.

### Constructor

```typescript
const auth = new ClientAuthSetup({
  publicKey: process.env.MAYRLABS_AUTH_PUBLIC_JWK!, // The full JSON public JWK string
  clientId: process.env.MAYRLABS_CLIENT_ID!,
  clientSecret: process.env.MAYRLABS_CLIENT_SECRET!,
  accountUrl: process.env.MAYRLABS_ACCOUNT_URL!, // e.g., "https://myaccount.mayrlabs.com"
  audience: process.env.MAYRLABS_CLIENT_ID!, // Required
  issuer: "auth.mayrlabs.com", // Optional
});
```

### Methods

#### `getLoginUrl(): string`

Returns the SSO redirect URL to send unauthenticated users to. The Account App uses the `appId` to determine which client app is initiating the login and where to redirect back after success/failure.

```typescript
// Usage: Redirect the user here when they hit a protected route
const loginUrl = auth.getLoginUrl();
// → "https://myaccount.mayrlabs.com/login?appId=contentforge"
redirect(loginUrl);
```

#### `verifyAuthToken(token: string): Promise<MayRLabsAuthUserPayload | null>`

Locally verifies a signed User JWT using the Public Key. Returns the decoded payload on success, `null` on failure. No network requests are made.

```typescript
// At the SSO callback: /auth/callback?token=...
const user = await auth.verifyAuthToken(searchParams.get("token"));

if (!user) {
  redirect(auth.getLoginUrl());
}

// Store in session cookie and proceed
await setSessionCookie(user);
redirect("/dashboard");
```

#### `verifyErrorToken(token: string): Promise<MayRLabsAuthErrorPayload | null>`

Locally verifies a signed Error JWT using the Public Key. Used at the SSO callback when the Account App redirects with an error instead of a success token.

```typescript
// At the SSO callback: /auth/callback?error=...
const error = await auth.verifyErrorToken(searchParams.get("error"));

if (error) {
  // Show the error message to the user
  redirect(`/login?error=${error.code}`);
}
```

#### `authenticateMachine(): Promise<string>`

Fetches a **Machine Token** from the Account App's service endpoint using `clientId` and `clientSecret`. This token is then used by `@mayrlabs/m2m` for service-to-service calls.

**Internal logic**: `POST {accountUrl}/api/auth/service → { clientId, clientSecret }` → returns a signed `MayRLabsAuthMachinePayload` JWT.

```typescript
// Typically called internally by @mayrlabs/m2m, not directly by app code
const machineToken = await auth.authenticateMachine();
```

---

## 🛡️ Implementation Guidelines

1. **Key Caching**: Parse JWKs once at initialization and cache the `KeyLike` object. Never parse per-request.
2. **PS256 Only**: Enforce `alg: "PS256"` on both signing (`setProtectedHeader`) and verification (`algorithms: ["PS256"]`).
3. **Never Throw Raw `jose` Errors**: Wrap all exceptions in a `MayRLabsAuthError` class with a human-readable `code` and `message`.
4. **Platform Agnostic**: Use `jose`'s high-level API to stay compatible with both Node.js and Edge runtimes (Cloudflare Workers, Vercel Edge).
5. **The Private Key Rule**: The Private JWK must never exist outside the Account App's environment.
