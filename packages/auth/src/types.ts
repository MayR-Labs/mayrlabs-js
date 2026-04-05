import type { JWTPayload } from "jose";

export interface MayRLabsAuthUserPayload extends JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
  iss: string;
}

export interface MayRLabsAuthMachinePayload extends JWTPayload {
  sub: string;
  type: "machine";
  aud: "mayrlabs-internal";
  iss: string;
}

export interface MayRLabsAuthErrorPayload extends JWTPayload {
  code: string;
  message: string;
  iss: string;
}

export interface IssuerConfig {
  privateKey: string;
  publicKey: string;
  issuer: string;
}

export interface IssuerConfigInput extends Omit<IssuerConfig, "issuer"> {
  issuer?: string;
}

export interface ClientConfig {
  accountUrl: string;
  clientId: string;
  clientSecret: string;
  publicKey: string;
  audience: string;
  issuer: string;
  redirects: { error: string; success: string };
  session: { key: string };
}

export interface ClientConfigInput extends Omit<
  ClientConfig,
  "redirects" | "session" | "issuer"
> {
  issuer?: string;
  redirects?: Partial<ClientConfig["redirects"]>;
  session?: Partial<ClientConfig["session"]>;
}
