# @mayrlabs/auth-nextjs

The Next.js integration wrapper for the MayR Labs authentication ecosystem (`@mayrlabs/auth`). Providing out-of-the-box Route Handlers, React Context Providers, Server Actions hooks, and Middleware protection for Next.js applications (App Router).

## ✨ Features

- ⚡ **Modular SDK**: Dedicated `client` and `issuer` exports for optimized bundling.
- ⚡ **Next.js Integration**: Optimized handlers for Callback, Server Components, and Actions.
- ⚛️ **React Providers**: Out-of-the-box Context Providers and hooks for client-side user access.
- 🛡️ **Role Gating**: Built-in authorization gating in the `AuthProvider`.
- 🔄 **Session Sliding**: Automatic token rotation to keep active users logged in.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth-nextjs
```

### Environment Variables

The SDK now strictly validates environment variables using Zod. Ensure the following are set in your `.env`:

#### Client Auth Variables (`createNextClientAuth`)
- `MAYRLABS_CLIENT_ID`: (Required) Your application's unique ID.
- `MAYRLABS_CLIENT_SECRET`: (Required) Your application's secret key.
- `MAYRLABS_CLIENT_AUDIENCE`: (Required) The audience validation for tokens.
- `MAYRLABS_AUTH_PUBLIC_JWK`: (Optional) Your application's Public JWK. Not required if `remotePublicKey: true` is set.
- `MAYRLABS_ACCOUNT_URL`: (Default: `https://myaccount.mayrlabs.com`) The URL of the central account center.
- `MAYRLABS_AUTH_SESSION_KEY`: (Default: `mayrlabs-client-session`) Local session cookie key.
- `MAYRLABS_AUTH_ERROR_REDIRECT`: (Default: `/login`) Path to redirect on error.
- `MAYRLABS_AUTH_SUCCESS_REDIRECT`: (Default: `/dashboard`) Path to redirect on success.
- `MAYRLABS_AUTH_STATE_KEY`: (Default: `mayrlabs-auth-state`) The key name for the CSRF state cookie.

#### Issuer Auth Variables (`createNextIssuerAuth`)
- `MAYRLABS_AUTH_PRIVATE_JWK`: (Required) The private JWK for signing tokens.
- `MAYRLABS_AUTH_PUBLIC_JWK`: (Required) The public JWK for verifying session tokens.
- `MAYRLABS_AUTH_ISSUER`: (Default: `auth.mayrlabs.com`) The token issuer string.

---

## 🏢 Client SDK Usage (`createNextClientAuth`)

Initialize your client auth utilities.

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
  redirectToLogin,
  AuthProvider,
} = createNextClientAuth({
  remotePublicKey: true, 
  autoRotateCookie: true,
  events: {
    onAuthSuccess: (user) => console.log(`User ${user.email} logged in`),
  },
  cookie: {
    stateKey: "custom-state-key", // Optional override
  }
});
```

### 🛡️ CSRF Protection
The SDK automatically implements **State-parameter verification**. When you call `redirectToLogin`, it:
1. Generates a random `state`.
2. Stores it in an `httpOnly` cookie (`mayrlabs-auth-state` or custom key) with a 5-minute expiry.
3. Appends the `state` to the login URL.

The `handleCallback` method strictly verifies this state and **immediately deletes the cookie after consumption** to maximize security and prevent replay attempts.

### 🔄 Dynamic Redirects
You can now pass custom parameters to the login page:
```typescript
await redirectToLogin({ return_to: "/dashboard/settings" });
```
> [!IMPORTANT]
> The `redirectToLogin` method no longer requires the `request` parameter. It utilizes absolute redirection to the central Account Center.

### ⚛️ React Setup

The `AuthProvider` now supports **Role Gating**:

```tsx
// app/layout.tsx
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider allowedRoles={['admin', 'editor']} fallback={<Forbidden />}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

Use the `useUser` hook in any Client Component. The `user` object is an instance of `AuthUser` with utility methods:

```tsx
"use client";
import { useUser } from "@mayrlabs/auth-nextjs/provider";

export function UserProfile() {
  const { user } = useUser();
  
  if (!user) return <p>Not logged in</p>;
  
  return (
    <div>
      <p>Hello, {user.email}!</p>
      {user.hasRole('admin') && <button>Delete Everything</button>}
    </div>
  );
}
```

---

## 🏛️ Issuer SDK Usage (`createNextIssuerAuth`)

For applications acting as identity providers (e.g., the Account App).

```typescript
// lib/issuer-auth.ts
import { createNextIssuerAuth } from "@mayrlabs/auth-nextjs/issuer";

export const {
  setup,
  getUser,
  getUserOrThrow,
  logoutHandler,
} = createNextIssuerAuth();
```

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
