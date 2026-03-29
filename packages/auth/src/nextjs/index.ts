import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AuthSetup } from "../core/auth";
import { MayRLabsUser } from "../types";

/**
 * Creates Next.js specific auth utilities.
 */
export function createNextAuth(setup: AuthSetup) {
  return {
    /**
     * Handles the SSO callback.
     * Sets the session cookie and redirects to the success page.
     */
    async handleCallback(request: NextRequest) {
      const { searchParams } = new URL(request.url);
      const token = searchParams.get("token");

      if (!token) {
        return NextResponse.redirect(
          new URL(setup.config.redirects.error, request.url)
        );
      }

      const user = await setup.verifyToken(token);
      if (!user) {
        return NextResponse.redirect(
          new URL(setup.config.redirects.error, request.url)
        );
      }

      const response = NextResponse.redirect(
        new URL(setup.config.redirects.success, request.url)
      );

      // Set the session cookie
      response.cookies.set(
        setup.config.session.key,
        token,
        setup.config.session.cookieOptions as any
      );

      return response;
    },

    /**
     * Gets the current user from the session cookie.
     * Works in Server Components, Actions, and Route Handlers.
     */
    async getUser(): Promise<MayRLabsUser | null> {
      const cookieStore = await cookies();
      const token = cookieStore.get(setup.config.session.key)?.value;

      if (!token) return null;

      return setup.verifyToken(token);
    },

    /**
     * Middleware helper to protect routes.
     * If unauthenticated, redirects to the central login.
     */
    async middleware(request: NextRequest) {
      const cookieStore = await cookies();
      const token = cookieStore.get(setup.config.session.key)?.value;

      let user: MayRLabsUser | null = null;
      if (token) {
        user = await setup.verifyToken(token);
      }

      if (!user) {
        const loginUrl = setup.getLoginUrl(request.nextUrl.pathname);
        return NextResponse.redirect(new URL(loginUrl, request.url));
      }

      return NextResponse.next();
    },

    /**
     * Clears the session cookie and redirects to the login/error page.
     */
    async logout(request: NextRequest) {
      const response = NextResponse.redirect(
        new URL(setup.config.redirects.error, request.url)
      );
      response.cookies.delete(setup.config.session.key);
      return response;
    },
  };
}
