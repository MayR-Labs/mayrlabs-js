import type { JWTPayload } from "jose";

export interface MayRLabsAuthUserPayload extends JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  iss: "auth.mayrlabs.com";
}

export interface MayRLabsAuthMachinePayload extends JWTPayload {
  sub: string;
  type: "machine";
  aud: "mayrlabs-internal";
  iss: "auth.mayrlabs.com";
}

export interface MayRLabsAuthErrorPayload extends JWTPayload {
  code: string;
  message: string;
  iss: "auth.mayrlabs.com";
}

export interface IssuerConfig {
  privateKey: string;
}

export interface ClientConfig {
  accountUrl: string;
  clientId: string;
  clientSecret: string;
  publicKey: string;
  audience: string;
  redirects: { error: string; success: string };
  session: { key: string };
}

export interface ClientConfigInput extends Omit<
  ClientConfig,
  "redirects" | "session"
> {
  redirects?: Partial<ClientConfig["redirects"]>;
  session?: Partial<ClientConfig["session"]>;
}
