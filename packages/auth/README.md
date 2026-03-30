# @mayrlabs/auth

The premium authentication and identity provider package for the MayR Labs ecosystem. This package provides a centralized, secure, and developer-friendly way to manage Single Sign-On (SSO), Cross-App communication (M2M), and React user state.

## ✨ Features

- 🔐 **Framework Agnostic Core**: Secure logic for encryption, JWT decoding, and session management.
- 🛡️ **JWT Error Verification**: Securely verify error tokens from the central identity provider.
- ⚡ **Next.js Integration**: Optimized handlers for Proxy, Server Components, and Actions.
- ⚛️ **React Providers**: Out-of-the-box Context Providers and hooks for client-side user access.
- 🛡️ **AES-256-GCM Encryption**: Environment-agnostic Web Crypto implementation for secure M2M.
- 📦 **Type Safe**: Fully written in TypeScript with comprehensive type definitions.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth
```

### Environment Variables

The package automatically reads configuration from environment variables. Ensure the following are set:

- `MAYRLABS_CLIENT_ID`: Your application's unique ID.
- `MAYRLABS_CLIENT_SECRET`: Your application's secret key (keep this server-side only).
- `MAYRLABS_ACCOUNT_URL`: (Optional) The URL of the central account system center. Defaults to `https://myaccount.mayrlabs.com`.

## 🌐 Next.js Integration

If you are using Next.js, use our wrapper package `@mayrlabs/auth-nextjs` which provides out of the box Route Handlers, Next.js Middleware protections, Server Actions hooks, and React Context Providers.

```bash
npm install @mayrlabs/auth-nextjs @mayrlabs/auth
```

See the [`@mayrlabs/auth-nextjs` documentation](../auth-nextjs/README.md) for full Next.js App Router usage instructions.

## 🔒 Secure M2M Communication

The `sendRequest` utility allows for secure, encrypted Machine-to-Machine (M2M) communication between your application and the MayR Labs Account system.

### How it works

1. **Payload Preparation**: Your data is wrapped in an `M2MPayload` containing `appId`, `userId`, and the `action`.
2. **Encryption**: The entire payload is encrypted using AES-256-GCM with your `MAYRLABS_CLIENT_SECRET`.
3. **Transport**: The encrypted data is sent via `POST` (as `FormData`) to the Account Center.
4. **Response**: The response is received in an encrypted envelope, which is automatically decrypted and validated by the SDK.

### M2M Types

```typescript
/**
 * Internal payload structure before encryption
 */
export interface M2MPayload {
  app_id: string;
  user_id: string;
  action: string;
  created_at: string;
  payload: unknown;
}

/**
 * Standard API response structure from the Account Center
 * This represents the outer JSON envelope.
 */
export interface M2MResponse {
  success: boolean;
  data?: {
    response: string; // The encrypted response payload
  };
  error?: { message: string; code: string };
}

/**
 * Structure of the decrypted inner response
 */
export interface DecryptedM2MResponse<T> {
  success: boolean;
  data: T;
  error?: { message: string; code: string };
}
```

### Usage Example

```typescript
import { sendRequest } from "@/lib/auth";

interface UserSettings {
  theme: "light" | "dark";
  notifications: boolean;
}

/**
 * Sends an encrypted request to update user settings in the Account Center.
 * Returns the decrypted data of type T.
 */
async function updateSettings(userId: string) {
  try {
    const settings = await sendRequest<UserSettings>(
      "update_settings",
      userId,
      { theme: "dark", notifications: true }
    );

    console.log("Updated settings:", settings.theme);
    return settings;
  } catch (error) {
    console.error("M2M Request failed:", error.message);
    throw error;
  }
}
```

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
