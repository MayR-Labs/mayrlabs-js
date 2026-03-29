# @mayrlabs/auth

The premium authentication and identity provider package for the MayR Labs ecosystem. This package provides a centralized, secure, and developer-friendly way to manage Single Sign-On (SSO) and Cross-App communication (M2M).

## ✨ Features

- 🔐 **Framework Agnostic Core**: Secure logic for encryption, JWT decoding, and session management.
- ⚡ **Next.js Integration**: Optimized handlers for Proxy/Middleware, Server Components, and Actions.
- 🛡️ **AES-256-GCM Encryption**: Enterprise-grade security for cross-app data sharing.
- 🛠️ **Local Dev Friendly**: Support for "Null" provider to bypass live SSO during development.
- 📦 **Type Safe**: Fully written in TypeScript with comprehensive type definitions.

## 🚀 Getting Started

### Installation

```bash
npm install @mayrlabs/auth
```

### Initializing Auth

Create a single auth instance to be shared across your application.

```typescript
import { AuthSetup } from "@mayrlabs/auth";

export const auth = new AuthSetup({
  appId: process.env.MAYRLABS_CLIENT_ID!,
  clientSecret: process.env.MAYRLABS_CLIENT_SECRET!,
  accountUrl: process.env.NEXT_PUBLIC_MAYRLABS_ACCOUNT_URL, // Optional
});
```

## 🌐 Next.js Usage

Initialize the Next.js utilities using your auth setup.

```typescript
// lib/auth.ts
import { createNextAuth } from "@mayrlabs/auth/nextjs";
import { auth } from "./setup";

export const { handleCallback, getUser, authProxy, logout } =
  createNextAuth(auth);
```

### Route Handler (SSO Callback)

```typescript
// app/api/auth/callback/route.ts
import { handleCallback } from "@/lib/auth";

export const GET = handleCallback;
```

### Proxy Protection (Next.js Middleware)

In MayR Labs applications, the `middleware.ts` (or `proxy.ts`) can optionally call the `authProxy` helper to protect specific routes.

```typescript
// proxy.ts (Next.js Middleware)
import { authProxy } from "@/lib/auth";
import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export default async function proxy(
  request: NextRequest,
  event: NextFetchEvent
) {
  // Optional: Only apply auth to specific routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return authProxy(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};
```

### Accessing User (Server Components)

```typescript
import { getUser } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) return <div>Please log in</div>;

  return <div>Welcome, {user.firstName}!</div>;
}
```

## 🔒 Encryption & M2M

Securely send data between applications in the MayR Labs ecosystem.

```typescript
const data = { score: 100 };
const result = await auth.sendRequest("update-score", user.id, data);
```

Built with discipline by [MayR Labs](https://mayrlabs.com).
Build. Ship. Repeat intelligently.
