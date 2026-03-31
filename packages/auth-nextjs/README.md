# @mayrlabs/auth-nextjs

The Next.js integration wrapper for the MayR Labs authentication ecosystem (`@mayrlabs/auth`). Providing out-of-the-box Route Handlers, React Context Providers, Server Actions hooks, and Middleware protection for Next.js applications (App Router).

## ✨ Features

- ⚡ **Next.js Integration**: Optimized handlers for Proxy, Server Components, and Actions.
- ⚛️ **React Providers**: Out-of-the-box Context Providers and hooks for client-side user access.
- 🚀 **Zero Config**: Inherits all secure logic (encryption, JWT decoding, M2M) from `@mayrlabs/auth` seamlessly.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth-nextjs @mayrlabs/auth
```

_(Note: `@mayrlabs/auth` is required by this package for core operations)._

### Environment Variables

Ensure the following are set in your `.env`:

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
2. **Protection**: If the user is unauthenticated, it automatically redirects them to the centralized login URL (`setup.getLoginUrl()`).

> [!TIP]
> Use `AuthProvider` in layouts that wrap protected portions of your application (e.g., `(dashboard)/layout.tsx`) rather than the root layout if some pages are public.

```tsx
// app/(dashboard)/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function DashboardLayout({ children }) {
  // This layout and all its children are now protected.
  // Unauthenticated users will be redirected to the centralized login URL automatically.
  return <AuthProvider>{children}</AuthProvider>;
}
```

Use the `useUser` hook in any Client Component. **Note**: This must be imported from the client-specific entry point to avoid server-only code in your client bundle.

```tsx
"use client";
import { useUser } from "@mayrlabs/auth-nextjs/client";

export function UserProfile() {
  const { user } = useUser();

  if (!user) return <p>Not logged in</p>;

  return <p>Hello, {user.firstName}!</p>;
}
```

### 🚪 Logging Out (logoutHandler)

To securely clear the user's session locally and initiate a redirect to the central authentication flow (or log them out entirely), use the automated `logoutHandler` within a Route Handler:

```typescript
// app/api/auth/logout/route.ts
import { logoutHandler } from "@/lib/auth";

export const GET = logoutHandler;
export const POST = logoutHandler;
```

### 🛠️ Server-to-Server Requests (sendRequest)

Your server-side code can securely communicate with the MayR Labs central account system using the deeply integrated `sendRequest` utility. This internally utilizes AES-256-GCM encryption without leaking keys to the client.

```typescript
"use server";
import { sendRequest, getUserOrThrow } from "@/lib/auth";

export async function upgradeSubscription(planId: string) {
  // 1. Ensure the user is actually logged in
  const user = await getUserOrThrow();

  // 2. Transmit the encrypted M2M payload securely
  const result = await sendRequest<{ status: string }>(
    "update_subscription", // Action scope
    user.id, // Target user ID
    { plan_id: planId } // Encrypted arbitrary inner payload
  );

  return result.status;
}
```

### 🔀 Manual Redirection (redirectToLogin)

If you have custom middleware flows or Server Actions that need specialized conditional redirection without throwing an error, utilize `redirectToLogin`:

```typescript
import { redirectToLogin } from "@/lib/auth";
import { type NextRequest } from "next/server";

export function myCustomGuard(req: NextRequest) {
  // If some condition fails, manually redirect them to SSO:
  return redirectToLogin(req);
}
```

---

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
