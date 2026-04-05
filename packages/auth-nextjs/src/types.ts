export interface NextAuthOptions {
  issuer?: string;
  audience?: string;
  redirects?: Partial<{ error: string; success: string }>;
  session?: Partial<{ key: string }>;
}

export interface NextIssuerAuthOptions {
  issuer?: string;
  audience?: string;
  session?: Partial<{ key: string }>;
  redirects?: Partial<{ error: string }>;
}
