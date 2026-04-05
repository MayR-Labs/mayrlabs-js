export interface NextAuthOptions {
  redirects?: Partial<{ error: string; success: string }>;
  session?: Partial<{ key: string }>;
}

export interface NextIssuerAuthOptions {
  session?: Partial<{ key: string }>;
  redirects?: Partial<{ error: string }>;
}
