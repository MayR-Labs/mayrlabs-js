# @mayrlabs/auth

The premium authentication and identity provider package for the MayR Labs ecosystem. This package provides a centralized, secure, and developer-friendly way to manage Single Sign-On (SSO), Cross-App communication (M2M), and React user state.

## ✨ Features

- 🔐 **Framework Agnostic Core**: Secure logic for encryption, JWT decoding, and session management.
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
  authProxy,
  logoutHandler,
  sendRequest,
  redirectToLogin,
  AuthProvider,
  useUser,
} = createNextAuth({
  redirects: {
    error: "/login",
    success: "/dashboard",
  },
  session: {
    key: "mayrlabs-session",
  },
});
```

### 🔐 Route Handler (SSO Callback)

```typescript
// app/api/auth/callback/route.ts
import { handleCallback } from "@/lib/auth";

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

### ⚛️ React Providers

Wrap your root layout with the `AuthProvider` to enable client-side user access.

```tsx
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

Use the `useUser` hook in any Client Component.

```tsx
"use client";
import { useUser } from "@/lib/auth";

export function UserProfile() {
  const { user } = useUser();

  if (!user) return <p>Not logged in</p>;

  return <p>Hello, {user.firstName}!</p>;
}
```

## 🔒 Encryption & M2M

Securely send data between applications in the MayR Labs ecosystem using the `sendRequest` helper.

```typescript
const result = await sendRequest("update-profile", user.id, {
  theme: "dark",
});
```

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
