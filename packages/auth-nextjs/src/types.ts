import type {
  ClientAuthSetup,
  IssuerAuthSetup,
  MayRLabsAuthUserPayload,
} from "@mayrlabs/auth";
import type { NextRequest, NextResponse } from "next/server";
import type React from "react";

export interface NextAuthOptions {
  redirects?: Partial<{ error: string; success: string }>;
  session?: Partial<{ key: string }>;
}

export interface NextIssuerAuthOptions {
  session?: Partial<{ key: string }>;
  redirects?: Partial<{ error: string }>;
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
  }) => Promise<React.JSX.Element | null>;
}
