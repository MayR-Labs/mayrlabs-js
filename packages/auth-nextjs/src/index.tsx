import React from "react";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AuthSetup,
  MayRLabsUser,
  NextAuthOptions,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { redirectTo } from "./_utils";
import { AuthClientProvider } from "./client";

/**
 * Creates Next.js specific auth utilities.
 * Automatically handles environment variables and validation.
 */
export function createNextAuth(options: NextAuthOptions = {}) {
  const appId = process.env.MAYRLABS_CLIENT_ID;
  const clientSecret = process.env.MAYRLABS_CLIENT_SECRET;
  const accountUrl =
    process.env.MAYRLABS_ACCOUNT_URL || "https://myaccount.mayrlabs.com";

  if (!appId || !clientSecret) {
    throw new Error(
      "MayRLabs Auth: MAYRLABS_CLIENT_ID and MAYRLABS_CLIENT_SECRET are required environment variables."
    );
  }

  const setup = new AuthSetup({
    appId,
    clientSecret,
    accountUrl,
    redirects: {
      error: options.redirects?.error || "/login",
      success: options.redirects?.success || "/dashboard",
    },
    session: { key: options.session?.key || "mayrlabs-session" },
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
        errorData?.errorCode || "CLIENT_UNEXPECTED_ERROR",
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
  const getUser = async (): Promise<MayRLabsUser | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(setup.config.session.key)?.value;

    if (!token) return null;

    return setup.verifyAuthToken(token);
  };

  /**
   * Gets the current user or throws an UnauthenticatedError if not logged in.
   * Useful for Server Actions and protected Route Handlers.
   */
  const getUserOrThrow = async (): Promise<MayRLabsUser> => {
    const user = await getUser();

    if (!user) throw new UnauthenticatedError();

    return user;
  };

  /**
   * Gets the current user or redirects to the login page if not logged in.
   * Useful for Server Components.
   */
  const getUserOrRedirect = async (): Promise<MayRLabsUser> => {
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
    const cookieStore = await cookies();
    const token = cookieStore.get(setup.config.session.key)?.value;

    let user: MayRLabsUser | null = null;

    if (token) user = await setup.verifyAuthToken(token);

    if (!user) {
      const loginUrl = setup.getLoginUrl();

      return redirectTo(loginUrl, request.url);
    }

    return NextResponse.next();
  };

  /**
   * Clears the session cookie and redirects to the login/error page.
   */
  const logout = async (request: NextRequest) => {
    const response = redirectTo(setup.config.redirects.error, request.url);
    response.cookies.delete(setup.config.session.key);
    return response;
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
   * Proxied sendRequest from AuthSetup.
   */
  async function sendRequest<T>(
    action: string,
    userId: string,
    payload: any = {}
  ): Promise<T> {
    return setup.sendRequest<T>(action, userId, payload);
  }

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
    logout,
    logoutHandler,
    redirectToLogin,
    sendRequest,
    AuthProvider,
  };
}
