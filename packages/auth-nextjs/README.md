# @mayrlabs/auth-nextjs

The Next.js integration wrapper for the MayR Labs authentication ecosystem (`@mayrlabs/auth`). Providing out-of-the-box Route Handlers, React Context Providers, Server Actions hooks, and Middleware protection for Next.js applications (App Router).

## ✨ Features

- ⚡ **Next.js Integration**: Optimized handlers for Proxy, Server Components, and Actions.
- ⚛️ **React Providers**: Out-of-the-box Context Providers and hooks for client-side user access.
- 🚀 **Zero Config**: Inherits all secure logic (PS256, JWK, JWT decoding) from `@mayrlabs/auth` seamlessly.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth-nextjs @mayrlabs/auth
```

_(Note: `@mayrlabs/auth` is required by this package for core operations)._

### Environment Variables

Ensure the following are set in your `.env`:

- `MAYRLABS_AUTH_PUBLIC_JWK`: Your application's Public JWK (JSON string).
- `MAYRLABS_CLIENT_ID`: Your application's unique ID.
- `MAYRLABS_CLIENT_SECRET`: Your application's secret key (keep this server-side only).
- `MAYRLABS_ACCOUNT_URL`: (Optional) The URL of the central account system center. Defaults to `https://myaccount.mayrlabs.com`.

## 🌐 Usage Setup

Initialize your auth utilities in a shared file (e.g., `lib/auth.ts`).

```typescript
// lib/auth.ts
import { createNextAuth } from "@mayrlabs/auth-nextjs";

export const {
  handleCallback,
  getUser,
  getUserOrThrow,
  getUserOrRedirect,
  authProxy,
  logoutHandler,
  redirectToLogin,
  AuthProvider,
  setup,
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
 */
export const GET = handleCallback;
```

### 🛡️ Proxy Protection (Middleware)

```typescript
// proxy.ts (Next.js proxy)
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

#### `getUserOrThrow`

Returns the user payload or throws an `UnauthenticatedError`.

```typescript
// app/actions/update-profile.ts
"use server";
import { getUserOrThrow } from "@/lib/auth";

export async function updateProfile(data: any) {
  const user = await getUserOrThrow(); // Throws if not authenticated
  // user.userId, user.email, etc.
}
```

#### `getUserOrRedirect`

Returns the user payload or redirects to the login page.

```tsx
// app/dashboard/page.tsx
import { getUserOrRedirect } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUserOrRedirect(); // Redirects if not authenticated
  return <div>Welcome back, {user.email}</div>;
}
```

### ⚛️ React Providers

The `AuthProvider` is a Server Component that handles hydration and protection.

```tsx
// app/(dashboard)/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
```

Use the `useUser` hook in any Client Component:

```tsx
"use client";
import { useUser } from "@mayrlabs/auth-nextjs/client";

export function UserProfile() {
  const { user } = useUser();
  if (!user) return <p>Not logged in</p>;
  return <p>Hello, {user.email}!</p>;
}
```

### 🚪 Logging Out (logoutHandler)

```typescript
// app/api/auth/logout/route.ts
import { logoutHandler } from "@/lib/auth";

export const GET = logoutHandler;
export const POST = logoutHandler;
```

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
