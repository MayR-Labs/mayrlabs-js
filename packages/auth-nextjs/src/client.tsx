"use client";

import { createContext, useContext, ReactNode } from "react";
import { MayRLabsUser } from "@mayrlabs/auth";

/**
 * Context for holding the authenticated user state on the client.
 */
const AuthContext = createContext<{ user: MayRLabsUser | null }>({
  user: null,
});

/**
 * Client-side provider for auth context.
 */
export const AuthClientProvider = ({
  user,
  children,
}: {
  user: MayRLabsUser | null;
  children: ReactNode;
}) => <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;

/**
 * Hook to access the current user on the client.
 */
export const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used within an AuthClientProvider");
  }

  return context;
};
