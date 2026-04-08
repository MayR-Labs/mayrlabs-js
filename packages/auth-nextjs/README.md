# @mayrlabs/auth-nextjs

The Next.js integration wrapper for the MayR Labs authentication ecosystem (`@mayrlabs/auth`). Providing out-of-the-box Route Handlers, React Context Providers, Server Actions hooks, and Middleware protection for Next.js applications (App Router).

## ✨ Features

- ⚡ **Modular SDK**: Dedicated `client` and `issuer` exports for optimized bundling.
- ⚡ **Next.js Integration**: Optimized handlers for Callback, Server Components, and Actions.
- ⚛️ **React Providers**: Out-of-the-box Context Providers and hooks for client-side user access.
- 🚀 **Zero Config**: Inherits all secure logic (PS256, JWK, JWT decoding) from `@mayrlabs/auth` seamlessly.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth-nextjs
```

### Environment Variables

Ensure the following are set in your `.env`:

- `MAYRLABS_AUTH_PUBLIC_JWK`: Your application's Public JWK (JSON string).
- `MAYRLABS_AUTH_ISSUER`: The expected issuer for your tokens (e.g., `auth.mayrlabs.com`).
- `MAYRLABS_CLIENT_ID`: Your application's unique ID.
- `MAYRLABS_CLIENT_SECRET`: Your application's secret key (keep this server-side only).
- `MAYRLABS_ACCOUNT_URL`: (Optional) The URL of the central account system center.

---

## 🏢 Client SDK Usage (`createNextClientAuth`)

Initialize your client auth utilities in a shared file (e.g., `lib/auth.ts`).

```typescript
// lib/auth.ts
import { createNextClientAuth } from "@mayrlabs/auth-nextjs";

export const {
  handleCallback,
  getUser,
  getUserOrThrow,
  getUserOrRedirect,
  authProxy,
  logoutHandler,
  AuthProvider, // Server Component Provider
} = createNextClientAuth({
  redirects: { error: "/login", success: "/dashboard" },
  session: { key: "mayrlabs-auth-session" },
});
```

### ⚛️ React Setup

The `AuthProvider` is a Server Component that should be wrapped around your layout. It automatically handles the session and provides the context to client components.

```tsx
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

Use the `useUser` hook in any Client Component:

```tsx
"use client";
import { useUser } from "@mayrlabs/auth-nextjs/provider";

export function UserProfile() {
  const { user } = useUser();
  if (!user) return <p>Not logged in</p>;
  return <p>Hello, {user.email}!</p>;
}
```

---

## 🏛️ Issuer SDK Usage (`createNextIssuerAuth`)

For applications acting as identity providers (e.g., the Account App).

```typescript
// lib/issuer-auth.ts
import { createNextIssuerAuth } from "@mayrlabs/auth-nextjs/issuer";

export const {
  setup, // The core IssuerAuthSetup instance
  getUser,
  getUserOrThrow,
  logoutHandler,
} = createNextIssuerAuth({
  session: { key: "issuer-session" },
});
```

### Methods

- `getUser()`: (Async) Retrieves the user payload from the session cookie.
- `logoutHandler(request)`: A Route Handler compatible function to clear the session.

---

## 🔒 Shared Utilities

### 🛡️ Proxy Protection (Middleware)

```typescript
// middleware.ts
import { authProxy } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return authProxy(request);
  }
  return NextResponse.next();
}
```

### 🚪 SSO Callback

```typescript
// app/api/auth/callback/route.ts
import { handleCallback } from "@/lib/auth";

export const GET = handleCallback;
```

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
