export interface NextAuthOptions {
  issuer?: string;
  audience?: string;
  redirects?: Partial<{ error: string; success: string }>;
  session?: Partial<{ key: string }>;
}
