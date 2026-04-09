import { type MayRLabsAuthUserPayload, MayRLabsUser } from "@mayrlabs/auth";
import { createContext, type ReactNode, useContext, useMemo } from "react";

/**
 * Context for holding the authenticated user state on the client.
 */
const AuthContext = createContext<
  { user: MayRLabsAuthUserPayload | null } | undefined
>(undefined);

/**
 * Client-side provider for auth context.
 */
export const AuthClientProvider = ({
  user,
  children,
}: {
  user: MayRLabsAuthUserPayload | null;
  children: ReactNode;
}) => <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;

/**
 * Hook to access the current user on the client.
 * Returns a MayRLabsUser model instance for utility methods.
 */
export const useUser = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useUser must be used within an AuthClientProvider");
  }

  return useMemo(() => {
    return {
      user: context.user ? new MayRLabsUser(context.user) : null,
      raw: context.user,
    };
  }, [context.user]);
};
