export interface MayRLabsAuthUserPayload {
  aud: string;
  email: string;
  exp: number;
  firstName?: string;
  iat: number;
  iss: "auth.mayrlabs.com";
  lastName?: string;
  roles: string[];
  userId: string;
}

export interface MayRLabsAuthMachinePayload {
  aud: "mayrlabs-internal";
  exp: number;
  iat: number;
  iss: "auth.mayrlabs.com";
  sub: string;
  type: "machine";
}

export interface MayRLabsAuthErrorPayload {
  code: string;
  iat: number;
  iss: "auth.mayrlabs.com";
  message: string;
}

export interface IssuerConfig {
  issuer?: string;
  privateKey: string;
}

export interface ClientConfig {
  accountUrl: string;
  clientId: string;
  clientSecret: string;
  publicKey: string;
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
