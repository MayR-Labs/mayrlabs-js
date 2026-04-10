"use client";

import { AuthUser, type AuthUserPayload } from "@mayrlabs/auth";
import { createContext, type ReactNode, useContext, useMemo } from "react";

/**
 * Context for holding the authenticated user state on the client.
 */
const AuthContext = createContext<{ user: AuthUserPayload | null } | undefined>(
  undefined,
);

/**
 * Client-side provider for auth context.
 */
export const AuthClientProvider = ({
  user,
  children,
}: {
  user: AuthUserPayload | null;
  children: ReactNode;
}) => <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;

/**
 * Hook to access the current user on the client.
 * Returns an AuthUser model instance for utility methods.
 */
export const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used within an AuthClientProvider");
  }

  return useMemo(() => {
    return {
      user: context.user ? new AuthUser(context.user) : null,
      raw: context.user,
    };
  }, [context.user]);
};
