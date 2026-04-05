export interface NextAuthOptions {
  redirects?: { error: string; success: string };
  session?: { key: string };
}
