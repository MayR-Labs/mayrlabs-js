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

## 🌐 Next.js Usage

Initialize your auth utilities in a shared file (e.g., `lib/auth.ts`).

```typescript
// lib/auth.ts
import { createNextAuth } from "@mayrlabs/auth/nextjs";

export const {
  handleCallback,
  getUser,
  getUserOrThrow,
  getUserOrRedirect,
  authProxy,
  logout,
  logoutHandler,
  sendRequest,
  redirectToLogin,
  AuthProvider,
} = createNextAuth({
  // error is redirected to when there is authentication error
  // and success is redirected to after a successful authentication
  redirects: { error: "/login", success: "/dashboard" },
  session: { key: "mayrlabs-session" },
});
```

### 🔐 Route Handler (SSO Callback)

```typescript
// app/api/auth/callback/route.ts
import { handleCallback } from "@/lib/auth";

/**
 * IMPORTANT: This callback URL (e.g., https://your-app.com/api/auth/callback)
 * must be registered and configured in your application settings
 * within the MayR Labs Account Admin panel.
 *
 * Failure to do so will result in authentication errors.
 */
export const GET = handleCallback;
```

### 🛡️ Proxy Protection (Middleware)

```typescript
// proxy.ts (Next.js Middleware)
import { authProxy } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function proxy(request: NextRequest) {
  // Protect specific routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return authProxy(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

### 🔒 Server-Side User (getUserOrThrow / getUserOrRedirect)

For Server Actions, Route Handlers, or complex Server Components where you need to ensure a user is authenticated, use `getUserOrThrow` or `getUserOrRedirect`.

#### `getUserOrThrow`

Returns the user object or throws an `UnauthenticatedError`. Ideal for Server Actions where you want to handle the error in a try/catch.

```typescript
// app/actions/update-profile.ts
"use server";
import { getUserOrThrow } from "@/lib/auth";

export async function updateProfile(data: any) {
  const user = await getUserOrThrow(); // Throws if not authenticated

  // Proceed with authorized action...
}
```

#### `getUserOrRedirect`

Returns the user object or automatically redirects to the login page if not authenticated. Ideal for Server Components (Page or Layout).

```tsx
// app/dashboard/page.tsx
import { getUserOrRedirect } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUserOrRedirect(); // Redirects if not authenticated

  return <div>Welcome back, {user.firstName}</div>;
}
```

### ⚛️ React Providers

The `AuthProvider` is a Server Component that handles two key things:

1. **Hydration**: It pre-fetches the user on the server and provides it to the client context via `AuthClientProvider`.
2. **Protection**: If the user is unauthenticated, it automatically redirects them to the `redirects.error` page (usually `/login`).

> [!TIP]
> Use `AuthProvider` in layouts that wrap protected portions of your application (e.g., `(dashboard)/layout.tsx`) rather than the root layout if some pages are public.

```tsx
// app/(dashboard)/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  // This layout and all its children are now protected.
  // Unauthenticated users will be redirected to /login automatically.
  return <AuthProvider>{children}</AuthProvider>;
}
```

Use the `useUser` hook in any Client Component. **Note**: This must be imported from the client-specific entry point to avoid server-only code in your client bundle.

```tsx
"use client";
import { useUser } from "@mayrlabs/auth/nextjs/client";

export function UserProfile() {
  const { user } = useUser();

  if (!user) return <p>Not logged in</p>;

  return <p>Hello, {user.firstName}!</p>;
}
```

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
