# @mayrlabs/auth

The premium authentication and identity provider core package for the MayR Labs ecosystem. This package provides a centralized, secure, and developer-friendly way to manage Single Sign-On (SSO), Cross-App communication (M2M), and service-to-service authentication using industry-standard **PS256** (RSA-PSS with SHA-256) cryptography.

## ✨ Features

- 🔐 **Framework Agnostic Core**: Deployable in Node.js, Cloudflare Workers, or any modern JS environment.
- 🛡️ **PS256 Cryptography**: Uses RSA-PSS with SHA-256 for probabilistic, high-security JWT signing and verification.
- 🔑 **JWK Support**: Native handling of JSON Web Keys for environment-safe key management.
- 🏛️ **Dual Setup Roles**:
  - **`IssuerAuthSetup`**: For identity providers (e.g., the Account App) to sign tokens.
  - **`ClientAuthSetup`**: For consumer apps to verify tokens and initiate SSO.
- 📦 **Type Safe**: Fully written in TypeScript with comprehensive exported interfaces.
- 👤 **User Model**: Built-in `AuthUser` class with helper methods for roles (`hasRole`, `hasAnyRole`) and nullable name fields.
- 🔄 **Lifecycle Hooks**: Hook into auth events with `onAuthSuccess` and `onAuthFailure`.
- 🔑 **PKCE Support**: Built-in utilities for Proof Key for Code Exchange (`generateCodeVerifier`, `generateCodeChallenge`).

---

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth
```

---

## 🏛️ `IssuerAuthSetup` (For Identity Providers)

Designed exclusively for the **Account App**. It holds the Private Key and is the only entity that can sign tokens.

### Initialization

```typescript
import { IssuerAuthSetup } from "@mayrlabs/auth";

const issuer = new IssuerAuthSetup({
  privateKey: process.env.MAYRLABS_AUTH_PRIVATE_JWK!, // The full JSON private JWK string
  publicKey: process.env.MAYRLABS_AUTH_PUBLIC_JWK!, // The full JSON public JWK string
  issuer: "auth.mayrlabs.com", // Optional, defaults to auth.mayrlabs.com
});
```

---

## 🏢 `ClientAuthSetup` (For Consumer Apps)

Designed for consumer apps. Holds the Public Key for verification.

### Initialization

```typescript
import { ClientAuthSetup } from "@mayrlabs/auth";

const auth = new ClientAuthSetup({
  publicKey: process.env.MAYRLABS_AUTH_PUBLIC_JWK!, // The full JSON public JWK string
  clientId: process.env.MAYRLABS_CLIENT_ID!,
  clientSecret: process.env.MAYRLABS_CLIENT_SECRET!,
  accountUrl: process.env.MAYRLABS_ACCOUNT_URL!, // e.g., "https://myaccount.mayrlabs.com"
  issuer: "auth.mayrlabs.com", // Optional, defaults to auth.mayrlabs.com
});
```

### Methods

#### `getLoginUrl(): string`
Returns the SSO redirect URL to send unauthenticated users to.

#### `verifyAuthToken(token: string, audience?: string): Promise<AuthUserPayload | null>`
Locally verifies a signed User JWT. Defaults to using `clientId` as audience if none provided.

#### `verifyErrorToken(token: string, audience?: string): Promise<AuthErrorPayload | null>`
Locally verifies a signed Error JWT.

#### `authenticateMachine(): Promise<string>`
Fetches a **Machine Token** from the Account App's service endpoint using client credentials.

---

## 🛡️ Security Utilities (PKCE)

```typescript
import { generateCodeVerifier, generateCodeChallenge } from "@mayrlabs/auth";

const verifier = generateCodeVerifier();
const challenge = await generateCodeChallenge(verifier);
```

---

## 📚 Exported Interfaces

- `AuthUserPayload` (id, email, username, roles, firstName, lastName, avatarUrl)
- `AuthMachinePayload`
- `AuthErrorPayload`
- `AuthUser` (Utility Model)

---

## 🌐 Next.js Integrations

If you are using **Next.js**, please utilize our native Next.js integration wrapper.

```bash
npm install @mayrlabs/auth-nextjs
```

See the [`@mayrlabs/auth-nextjs` documentation](../auth-nextjs/README.md) for full guidelines!

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
