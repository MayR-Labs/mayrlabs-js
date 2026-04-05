import {
  ClientAuthSetup,
  type MayRLabsAuthUserPayload,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import type React from "react";
import { redirectTo } from "../_utils";
import type { NextAuthOptions } from "../types";
import { AuthClientProvider } from "./provider";

/**
 * Creates Next.js specific client auth utilities.
 * Automatically handles environment variables and validation.
 */
export function createNextClientAuth(options: NextAuthOptions = {}) {
  const publicKey = process.env.MAYRLABS_AUTH_PUBLIC_JWK;
  const clientId = process.env.MAYRLABS_CLIENT_ID;
  const clientSecret = process.env.MAYRLABS_CLIENT_SECRET;
  const accountUrl =
    process.env.MAYRLABS_ACCOUNT_URL || "https://myaccount.mayrlabs.com";

  if (!publicKey || !clientId || !clientSecret) {
    throw new Error(
      "MayRLabs Auth: MAYRLABS_AUTH_PUBLIC_JWK, MAYRLABS_CLIENT_ID, and MAYRLABS_CLIENT_SECRET are required environment variables."
    );
  }

  const setup = new ClientAuthSetup({
    publicKey,
    clientId,
    clientSecret,
    accountUrl,
    audience: options.audience || clientId,
    issuer: options.issuer || process.env.MAYRLABS_AUTH_ISSUER,
    redirects: options.redirects,
    session: options.session,
  });

  /**
   * Handles the SSO callback.
   * Sets the session cookie and redirects to the success page.
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
      const errorData = await setup.verifyErrorToken(errorToken);

      return redirectToError(
        errorData?.code || "CLIENT_UNEXPECTED_ERROR",
        errorData?.message || "An unexpected error occurred."
      );
    }

    const token = searchParams.get("token");

    if (!token) {
      return redirectToError(
        "CLIENT_MISSING_AUTH_TOKEN",
        "Missing auth token."
      );
    }

    const user = await setup.verifyAuthToken(token);

    if (!user) {
      return redirectToError(
        "CLIENT_INVALID_AUTH_TOKEN",
        "Invalid auth token."
      );
    }

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
   * Gets the current user from the session cookie.
   * Works in Server Components, Actions, and Route Handlers.
   */
  const getUser = async (): Promise<MayRLabsAuthUserPayload | null> => {
    const cookieStore = await cookies();

    const token = cookieStore.get(setup.config.session.key)?.value;

    if (!token) return null;

    return setup.verifyAuthToken(token);
  };

  /**
   * Gets the current user or throws an UnauthenticatedError if not logged in.
   * Useful for Server Actions and protected Route Handlers.
   */
  const getUserOrThrow = async (): Promise<MayRLabsAuthUserPayload> => {
    const user = await getUser();

    if (!user) throw new UnauthenticatedError();

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
    const token = request.cookies.get(setup.config.session.key)?.value;

    let user: MayRLabsAuthUserPayload | null = null;

    if (token) user = await setup.verifyAuthToken(token);

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
    const response = redirectTo(setup.config.redirects.error, request.url);

    response.cookies.delete(setup.config.session.key);

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
  }: {
    children: React.ReactNode;
  }): Promise<React.JSX.Element | null> {
    const user = await getUser();

    if (!user) return redirect(setup.getLoginUrl());

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
