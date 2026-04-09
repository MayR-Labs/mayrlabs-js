import type {
  ClientAuthSetup,
  IssuerAuthSetup,
  MayRLabsAuthErrorPayload,
  MayRLabsAuthUserPayload,
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
    onAuthSuccess?: (user: MayRLabsAuthUserPayload) => Promise<void> | void;
    onAuthFailure?: (error: MayRLabsAuthErrorPayload) => Promise<void> | void;
  };
}

export interface NextIssuerAuth {
  setup: IssuerAuthSetup;
  getUser: () => Promise<MayRLabsAuthUserPayload | null>;
  getUserOrThrow: () => Promise<MayRLabsAuthUserPayload>;
  logoutHandler: (request: NextRequest) => Promise<NextResponse>;
}

export interface NextClientAuth {
  setup: ClientAuthSetup;
  handleCallback: (request: NextRequest) => Promise<NextResponse>;
  getUser: () => Promise<MayRLabsAuthUserPayload | null>;
  getUserOrThrow: () => Promise<MayRLabsAuthUserPayload>;
  getUserOrRedirect: () => Promise<MayRLabsAuthUserPayload>;
  authProxy: (request: NextRequest) => Promise<NextResponse>;
  logoutHandler: (request: NextRequest) => Promise<NextResponse>;
  redirectToLogin: (request: NextRequest) => NextResponse;
  AuthProvider: (props: {
    children: React.ReactNode;
    allowedRoles?: string[];
    fallback?: React.ReactNode;
  }) => Promise<React.JSX.Element | null>;
}
