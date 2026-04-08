import {
  ISSUER_SESSION_KEY,
  IssuerAuthSetup,
  type MayRLabsAuthUserPayload,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { createEnv } from "@t3-oss/env-nextjs";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { jwkSchema, redirectTo } from "../_utils";
import type { NextIssuerAuth } from "../types";

/**
 * Creates Next.js specific issuer auth utilities.
 * Automatically handles environment variables and validation securely using @t3-oss/env-nextjs and zod.
 *
 * Required Environment Variables to set:
 * - MAYRLABS_AUTH_PUBLIC_JWK: The public JWK as a JSON string
 * - MAYRLABS_AUTH_PRIVATE_JWK: The private JWK as a JSON string
 *
 * Optional Environment Variables with Defaults:
 * - MAYRLABS_AUTH_ISSUER: Token Issuer (Default: "auth.mayrlabs.com")
 * - MAYRLABS_AUTH_SESSION_KEY: Cookie key for issuer session tokens (Default: "mayrlabs-auth-session")
 * - MAYRLABS_AUTH_ERROR_REDIRECT: The URL path to redirect users to on an authentication error (Default: "/login")
 *
 * @returns The Next.js NextIssuerAuth utility objects including `setup`, `getUser`, `getUserOrThrow`, and `logoutHandler`.
 */
export function createNextIssuerAuth(): NextIssuerAuth {
  const issuerEnv = createEnv({
    server: {
      MAYRLABS_AUTH_PUBLIC_JWK: jwkSchema,
      MAYRLABS_AUTH_PRIVATE_JWK: jwkSchema,
      MAYRLABS_AUTH_ISSUER: z.string().min(1).default("auth.mayrlabs.com"),
      MAYRLABS_AUTH_SESSION_KEY: z.string().default(ISSUER_SESSION_KEY),
      MAYRLABS_AUTH_ERROR_REDIRECT: z.string().default("/login"),
    },
    client: {},
    experimental__runtimeEnv: process.env,
    skipValidation: process.env.NODE_ENV === "test",
  });

  const {
    MAYRLABS_AUTH_PRIVATE_JWK: privateKey,
    MAYRLABS_AUTH_PUBLIC_JWK: publicKey,
    MAYRLABS_AUTH_ISSUER: issuer,
    MAYRLABS_AUTH_SESSION_KEY: sessionKey,
    MAYRLABS_AUTH_ERROR_REDIRECT: errorRedirect,
  } = issuerEnv;

  const setup: IssuerAuthSetup = new IssuerAuthSetup({
    privateKey,
    publicKey,
    issuer,
  });

  /**
   * Gets the current user from the session cookie.
   * Works securely in Server Components, Server Actions, and Route Handlers.
   *
   * @returns A promise resolving to the user payload or null if unauthenticated.
   */
  const getUser = async (): Promise<MayRLabsAuthUserPayload | null> => {
    const cookieStore = await cookies();

    const token = cookieStore.get(sessionKey)?.value;

    if (!token) return null;

    return setup.verifyAuthToken(token);
  };

  /**
   * Gets the current user or throws an UnauthenticatedError if not logged in.
   * Useful for quickly securing Server Actions or strictly protected Route Handlers.
   *
   * @returns A promise resolving to the user payload.
   *
   * @throws {UnauthenticatedError} If the user session token is missing or invalid.
   */
  const getUserOrThrow = async (): Promise<MayRLabsAuthUserPayload> => {
    const user = await getUser();

    if (!user) throw new UnauthenticatedError();

    return user;
  };

  /**
   * Specialized logout handler for Route Handlers (e.g. /api/auth/logout).
   * Automatically clears cookies and returns a redirection response to the errorRedirect page.
   *
   * @param request The current Next.js Request.
   *
   * @returns A constructed NextResponse representing the redirection and cookie deletion.
   */
  const logoutHandler = async (request: NextRequest) => {
    const response = redirectTo(errorRedirect, request.url);

    response.cookies.delete(sessionKey);

    return response;
  };

  return { setup, getUser, getUserOrThrow, logoutHandler };
}
