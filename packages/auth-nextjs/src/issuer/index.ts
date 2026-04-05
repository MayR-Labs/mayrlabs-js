import {
  IssuerAuthSetup,
  type MayRLabsAuthUserPayload,
  UnauthenticatedError,
} from "@mayrlabs/auth";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { redirectTo } from "../_utils";
import type { NextIssuerAuthOptions } from "../types";

/**
 * Creates Next.js specific issuer auth utilities.
 * Automatically handles environment variables and validation.
 */
export function createNextIssuerAuth(options: NextIssuerAuthOptions = {}) {
  const privateKey = process.env.MAYRLABS_AUTH_PRIVATE_JWK;
  const publicKey = process.env.MAYRLABS_AUTH_PUBLIC_JWK;
  const issuer = process.env.MAYRLABS_AUTH_ISSUER;
  const sessionKey = options.session?.key || "mayrlabs-session";
  const errorRedirect = options.redirects?.error || "/login";

  if (!privateKey || !publicKey || !issuer) {
    throw new Error(
      "MayRLabs Auth: MAYRLABS_AUTH_PRIVATE_JWK, MAYRLABS_AUTH_PUBLIC_JWK, and MAYRLABS_AUTH_ISSUER are required environment variables for issuer auth."
    );
  }

  const setup = new IssuerAuthSetup({ privateKey, publicKey, issuer });

  /**
   * Gets the current user from the session cookie.
   * Works in Server Components, Actions, and Route Handlers.
   */
  const getUser = async (): Promise<MayRLabsAuthUserPayload | null> => {
    const cookieStore = await cookies();

    const token = cookieStore.get(sessionKey)?.value;

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
   * Specialized logout handler for Route Handlers (API /api/auth/logout).
   */
  const logoutHandler = async (request: NextRequest) => {
    const response = redirectTo(errorRedirect, request.url);

    response.cookies.delete(sessionKey);

    return response;
  };

  return { setup, getUser, getUserOrThrow, logoutHandler };
}
