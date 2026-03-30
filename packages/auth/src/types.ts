export interface MayRLabsUser {
  id: string; // ULID
  email: string;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  roles: string[];
  avatarUrl: string;
  hasGravatar: boolean;
  passwordLastUpdatedAt: string | null; // ISO string
}

export interface AuthConfig {
  appId: string;
  clientSecret: string;
  accountUrl?: string;
  redirects?: { error: string; success: string };
  session?: { key: string };
}

export interface NextAuthOptions {
  redirects?: { error?: string; success?: string };
  session?: { key?: string };
}

export * from "./core/types/m2m";
