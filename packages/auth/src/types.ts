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
  accountUrl?: string; // Default: https://myaccount.mayrlabs.com
  redirects: {
    error: string; // Default: /login
    success: string; // Default: /dashboard
  };
  session: {
    key: string; // Default: mayrlabs-session
  };
}

export interface M2MPayload {
  app_id: string;
  user_id: string;
  action: string;
  created_at: string;
  payload: any;
}
