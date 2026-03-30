# @mayrlabs/auth

The premium authentication and identity provider core package for the MayR Labs ecosystem. This package provides a centralized, secure, and developer-friendly way to manage Single Sign-On (SSO), Cross-App communication (M2M), and payload encryption across any JavaScript or Node.js runtime.

## ✨ Features

- 🔐 **Framework Agnostic Core**: Deployable in Node.js, Cloudflare Workers, or any modern JS environment.
- 🛡️ **JWT Verification**: Securely verify both Auth and Error tokens issued by the central identity provider.
- ⚡ **AES-256-GCM Encryption**: Built-in agnostic Web Crypto implementation for secure string manipulation.
- 🤖 **Secure M2M Engine**: Automated, encrypted Machine-to-Machine cross-app communication.
- 📦 **Type Safe**: Fully written in TypeScript with comprehensively exported generic interfaces.

---

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth
```

### Environment Variables

The package relies on specific environment logic to securely process encryptions and token validations. Ensure the following are set natively:

- `MAYRLABS_CLIENT_ID`: Your application's unique ID.
- `MAYRLABS_CLIENT_SECRET`: Your application's secret encryption/signing key (keep this strictly server-side).
- `MAYRLABS_ACCOUNT_URL`: (Optional) The central SSO identity host. Defaults to `https://myaccount.mayrlabs.com`.

---

## 🏗️ Initialization: `AuthSetup`

The heart of the package is the `AuthSetup` class. It wires your authentication parameters and returns core authorization mechanisms.

```typescript
import { AuthSetup } from "@mayrlabs/auth";

const auth = new AuthSetup({
  appId: process.env.MAYRLABS_CLIENT_ID!,
  clientSecret: process.env.MAYRLABS_CLIENT_SECRET!,
  accountUrl: process.env.MAYRLABS_ACCOUNT_URL, // Optional
  redirects: {
    error: "/login",
    success: "/dashboard",
  },
  session: {
    key: "mayrlabs-session", // Fallback session cookie key
  },
});
```

---

## 📚 Core API Reference

Once instantiated, your `AuthSetup` instance (`auth` in the example above) exposes several fundamental methods for handling SSO handshakes.

### `getLoginUrl(returnTo?: string): string`

Constructs the secure Single Sign-On URL for the MayR Labs Account system.

```typescript
// Redirect users here to initiate SSO:
const loginUrl = auth.getLoginUrl();
```

### `verifyAuthToken(token: string): Promise<MayRLabsUser | null>`

Verifies the authenticity of an SSO success token returned by the Account system. Uses `jose` internally to validate JWT signatures against your configured `clientSecret`.

```typescript
const user = await auth.verifyAuthToken(req.query.token);

if (!user) {
  throw new Error("Invalid or expired session token!");
}

console.log(`Welcome back, ${user.firstName}!`);
```

### `verifyErrorToken(token: string): Promise<any | null>`

If an SSO sign-in fails, the Account system replies with an encrypted error token. Decode it confidently with this method.

```typescript
const errorData = await auth.verifyErrorToken(req.query.error);

if (errorData) {
  console.error("SSO Failed:", errorData.message, errorData.errorCode);
}
```

---

## 🔐 Encryption Utilities

We expose the raw underlying cryptographic functions employed by the SDK for your own secure string manipulations. Both methods utilize `AES-256-GCM` via standard Web APIs.

```typescript
import { encrypt, decrypt } from "@mayrlabs/auth";

// 1. Encrypt a raw string
const secureStr = await encrypt(
  "my-secret-data",
  process.env.MAYRLABS_CLIENT_SECRET!
);

// 2. Decrypt it later
const decodedStr = await decrypt(
  secureStr,
  process.env.MAYRLABS_CLIENT_SECRET!
);
```

---

## 🤖 Secure M2M Communication

The `sendRequest` utility allows for secure, encrypted Machine-to-Machine (M2M) communication between your application and the central MayR Labs Account system.

### How it works

1. **Payload Preparation**: Your data is wrapped in an `M2MPayload` envelope containing your `appId`, `userId`, and the `action`.
2. **Encryption**: The entire payload is encrypted using `AES-256-GCM` parameterized with your `MAYRLABS_CLIENT_SECRET`.
3. **Transport**: The encrypted blob is transported over `POST` (as a standard `FormData` implementation layer) to the remote network.
4. **Decryption & Validation**: The response stream is received in an encrypted envelope, which the SDK automatically reads, unpackages, decrypts, and maps to the requested TypeScript generic entity.

### Built-in Interfaces

```typescript
import type {
  M2MPayload,
  M2MResponse,
  DecryptedM2MResponse,
} from "@mayrlabs/auth";

/** Represents the inner payload logic sent across the wire */
export interface M2MPayload {
  app_id: string;
  user_id: string;
  action: string;
  created_at: string;
  payload: unknown;
}

/** The outer JSON envelope delivered back from the Server */
export interface M2MResponse {
  success: boolean;
  data?: { response: string }; // Encrypted blob
  error?: { message: string; code: string };
}

/**
 * Final output type received globally when calling `auth.sendRequest<T>()`.
 * Represents the clean, decrypted state.
 */
export interface DecryptedM2MResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
}
```

### Usage Example

```typescript
interface UserSettings {
  theme: "light" | "dark";
  notifications: boolean;
}

/**
 * Sends an encrypted cross-app request to dynamically update user settings natively.
 */
async function syncSettingsRemote(userId: string) {
  try {
    const settings = await auth.sendRequest<UserSettings>(
      "update_settings", // The action
      userId, // The user target
      { theme: "dark", notifications: true } // The inner config payload
    );

    console.log("M2M Request Confirmed:", settings.theme);
    return settings;
  } catch (error) {
    console.error("M2M Request explicitly failed:", error.message);
    throw error;
  }
}
```

---

## 🌐 Next.js Integrations

If you are using **Next.js**, please utilize our native Next.js integration wrapper. It is precisely built utilizing `@mayrlabs/auth` internally and gives you out of the box route-protections, Middlewares, and standard React Session Context providers.

```bash
npm install @mayrlabs/auth-nextjs @mayrlabs/auth
```

See the [`@mayrlabs/auth-nextjs` repository/docs](../auth-nextjs/README.md) for full Next.js App Router guidelines!

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
