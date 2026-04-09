import type {
  AuthErrorPayload,
  AuthUserPayload,
  ClientAuthSetup,
  IssuerAuthSetup,
} from "@mayrlabs/auth";
import type { NextRequest, NextResponse } from "next/server";
import type React from "react";

export interface NextAuthOptions {
  /**
   * Redirects for successful authentication or errors.
   * Provide if you want to override env variables.
   */
  redirects?: Partial<{ error: string; success: string }>;
  /**
   * Session cookie configurations.
   */
  session?: Partial<{ key: string }>;
  /**
   * If true, securely fetches the public JWK directly from the IdP account URL (`/.well-known/jwks.json`).
   * No `MAYRLABS_AUTH_PUBLIC_JWK` needed.
   */
  remotePublicKey?: boolean;
  /**
   * Event hooks for authentication lifecycle.
   */
  events?: {
    onAuthSuccess?: (user: AuthUserPayload) => Promise<void> | void;
    onAuthFailure?: (error: AuthErrorPayload) => Promise<void> | void;
  };
  /**
   * Automatically refreshes the session cookie if more than half its life has passed.
   * Only works in contexts where cookies are writable (Middleware, Server Actions, Route Handlers).
   * @default false
   */
  autoRotateCookie?: boolean;
}

export interface NextIssuerAuth {
  setup: IssuerAuthSetup;
  getUser: () => Promise<AuthUserPayload | null>;
  getUserOrThrow: () => Promise<AuthUserPayload>;
  logoutHandler: (request: NextRequest) => Promise<NextResponse>;
}

export interface NextClientAuth {
  setup: ClientAuthSetup;
  handleCallback: (request: NextRequest) => Promise<NextResponse>;
  getUser: () => Promise<AuthUserPayload | null>;
  getUserOrThrow: () => Promise<AuthUserPayload>;
  getUserOrRedirect: () => Promise<AuthUserPayload>;
  authProxy: (request: NextRequest) => Promise<NextResponse>;
  logoutHandler: (request: NextRequest) => Promise<NextResponse>;
  redirectToLogin: (request: NextRequest) => NextResponse;
  AuthProvider: (props: {
    children: React.ReactNode;
    allowedRoles?: string[];
    fallback?: React.ReactNode;
  }) => Promise<React.JSX.Element | null>;
}
