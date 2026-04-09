import {
  ACCOUNT_URL,
  CLIENT_SESSION_KEY,
  ClientAuthSetup,
  type MayRLabsAuthUserPayload,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { createEnv } from "@t3-oss/env-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import type React from "react";
import { z } from "zod";
import { jwkSchema, redirectTo } from "../_utils";
import type { NextAuthOptions, NextClientAuth } from "../types";
import { AuthClientProvider } from "./provider";

/**
 * Creates Next.js specific client auth utilities.
 * Automatically handles environment variables and validation securely using @t3-oss/env-nextjs.
 *
 * Configured via Environment Variables:
 * - MAYRLABS_CLIENT_ID: Your application Client ID
 * - MAYRLABS_CLIENT_SECRET: Your application Client Secret
 * - MAYRLABS_CLIENT_AUDIENCE: The audience validation for tokens
 * - MAYRLABS_ACCOUNT_URL: The centralized IdP Account URL (default: "https://myaccount.mayrlabs.com")
 * - MAYRLABS_AUTH_PUBLIC_JWK: The public JWK for token verification (Not required if remotePublicKey is true)
 * - MAYRLABS_AUTH_ISSUER: The expected Token Issuer string
 * - MAYRLABS_AUTH_SESSION_KEY: Local session cookie key (default: "mayrlabs-auth-session")
 * - MAYRLABS_AUTH_ERROR_REDIRECT: Redirect path on error (default: "/login")
 * - MAYRLABS_AUTH_SUCCESS_REDIRECT: Redirect path on success (default: "/dashboard")
 *
 * @param options Client authentication options, including remote public key JWKS fetching and redirect overlays
 *
 * @returns An object containing the NextClientAuth utilities and setup context.
 */
export function createNextClientAuth(
  options: NextAuthOptions = {},
): NextClientAuth {
  const clientEnv = createEnv({
    server: {
      MAYRLABS_AUTH_PUBLIC_JWK: jwkSchema.optional(),
      MAYRLABS_CLIENT_ID: z.string().min(1),
      MAYRLABS_CLIENT_SECRET: z.string().min(1),
      MAYRLABS_ACCOUNT_URL: z.string().url().default(ACCOUNT_URL),
      MAYRLABS_CLIENT_AUDIENCE: z.string().min(1),
      MAYRLABS_AUTH_ISSUER: z.string().optional(),
      MAYRLABS_AUTH_SESSION_KEY: z.string().default(CLIENT_SESSION_KEY),
      MAYRLABS_AUTH_ERROR_REDIRECT: z.string().default("/login"),
      MAYRLABS_AUTH_SUCCESS_REDIRECT: z.string().default("/dashboard"),
    },
    client: {},
    experimental__runtimeEnv: process.env,
    skipValidation: process.env.NODE_ENV === "test",
  });

  const {
    MAYRLABS_AUTH_PUBLIC_JWK: publicKey,
    MAYRLABS_CLIENT_ID: clientId,
    MAYRLABS_CLIENT_SECRET: clientSecret,
    MAYRLABS_ACCOUNT_URL: accountUrl,
    MAYRLABS_CLIENT_AUDIENCE: audience,
    MAYRLABS_AUTH_ISSUER: issuerEnv,
    MAYRLABS_AUTH_SESSION_KEY: sessionKey,
    MAYRLABS_AUTH_ERROR_REDIRECT: errorRedirect,
    MAYRLABS_AUTH_SUCCESS_REDIRECT: successRedirect,
  } = clientEnv;

  if (!options.remotePublicKey && !publicKey) {
    throw new UnauthenticatedError(
      "Either 'remotePublicKey: true' must be specified or 'MAYRLABS_AUTH_PUBLIC_JWK' must be provided in the environment.",
    );
  }

  const redirects = {
    error: options.redirects?.error || errorRedirect,
    success: options.redirects?.success || successRedirect,
  };

  const session = {
    key: options.session?.key || sessionKey,
  };

  const setup: ClientAuthSetup = new ClientAuthSetup({
    publicKey,
    remotePublicKey: options.remotePublicKey,
    clientId,
    clientSecret,
    accountUrl,
    issuer: issuerEnv,
    redirects,
    session,
    events: options.events,
  });

  /**
   * Handles the SSO callback from the central authentication server.
   * Securely sets up the session cookie upon successful verification.
   * Uses audience validation provided by MAYRLABS_CLIENT_AUDIENCE.
   *
   * @param request The original Next.js request.
   *
   * @returns Automatically redirects to success/error locations defined in configuration.
   */
  const handleCallback = async (request: NextRequest) => {
    const { searchParams } = new URL(request.url);

    const redirectToError = (code: string, message: string) => {
      const errorUrl = new URL(setup.config.redirects.error, request.url);

      errorUrl.searchParams.set("errorCode", code);
      errorUrl.searchParams.set("errorMessage", message);

      return NextResponse.redirect(errorUrl);
    };

    const errorToken = searchParams.get("error");

    if (errorToken) {
      const errorData = await setup.verifyErrorToken(errorToken, audience);

      if (errorData) await setup.config.events?.onAuthFailure?.(errorData);

      return redirectToError(
        errorData?.code || "CLIENT_UNEXPECTED_ERROR",
        errorData?.message || "An unexpected error occurred.",
      );
    }

    const token = searchParams.get("token");

    if (!token) {
      return redirectToError(
        "CLIENT_MISSING_AUTH_TOKEN",
        "Missing auth token.",
      );
    }

    const user = await setup.verifyAuthToken(token, audience);

    if (!user) {
      return redirectToError(
        "CLIENT_INVALID_AUTH_TOKEN",
        "Invalid auth token.",
      );
    }

    await setup.config.events?.onAuthSuccess?.(user);

    const response = redirectTo(setup.config.redirects.success, request.url);

    response.cookies.set(setup.config.session.key, token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  };

  /**
   * Retrieves the current user from the session cookie.
   *
   * @returns User payload or null if no session.
   */
  const getUser = async (): Promise<MayRLabsAuthUserPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(session.key)?.value;

    if (!token) return null;

    return setup.verifyAuthToken(token, audience);
  };

  /**
   * Retrieves the current user or throws an UnauthenticatedError if no session exists.
   *
   * @returns User payload.
   */
  const getUserOrThrow = async (): Promise<MayRLabsAuthUserPayload> => {
    const user = await getUser();

    if (!user) {
      throw new UnauthenticatedError(
        "User is not authenticated via session cookie",
      );
    }

    return user;
  };

  /**
   * Gets the current user or redirects to the login page if not logged in.
   * Useful for Server Components.
   */
  const getUserOrRedirect = async (): Promise<MayRLabsAuthUserPayload> => {
    const user = await getUser();

    if (!user) return redirect(setup.getLoginUrl());

    return user;
  };

  /**
   * Auth Proxy helper to protect routes.
   * If unauthenticated, redirects to the central login.
   * Returns NextResponse.next() if authenticated.
   */
  const authProxy = async (request: NextRequest) => {
    const token = request.cookies.get(session.key)?.value;

    let user: MayRLabsAuthUserPayload | null = null;

    if (token) user = await setup.verifyAuthToken(token, audience);

    if (!user) {
      const loginUrl = setup.getLoginUrl();

      return redirectTo(loginUrl, request.url);
    }

    return NextResponse.next();
  };

  /**
   * Specialized logout handler for Route Handlers (API /api/auth/logout).
   */
  const logoutHandler = async (request: NextRequest) => {
    const response = redirectTo(redirects.error, request.url);

    response.cookies.delete(session.key);

    return response;
  };

  /**
   * Returns a redirect to the central login URL.
   */
  const redirectToLogin = (request: NextRequest) => {
    const loginUrl = setup.getLoginUrl();

    return redirectTo(loginUrl, request.url);
  };

  /**
   * Server Component Provider that automatically fetches the user
   * and wraps children with the AuthClientProvider.
   */
  async function AuthProvider({
    children,
    allowedRoles,
    fallback,
  }: {
    children: React.ReactNode;
    allowedRoles?: string[];
    fallback?: React.ReactNode;
  }): Promise<React.JSX.Element | null> {
    const user = await getUser();

    if (!user) return redirect(setup.getLoginUrl());

    if (
      allowedRoles &&
      !allowedRoles.some((role) => user.roles.includes(role))
    ) {
      return (fallback as React.JSX.Element) || null;
    }

    return <AuthClientProvider user={user}>{children}</AuthClientProvider>;
  }

  return {
    setup,
    handleCallback,
    getUser,
    getUserOrThrow,
    getUserOrRedirect,
    authProxy,
    logoutHandler,
    redirectToLogin,
    AuthProvider,
  };
}
