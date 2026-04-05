export interface MayRLabsAuthUserPayload {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  iat: number;
  exp: number;
  iss: "auth.mayrlabs.com";
  aud: string;
}

export interface MayRLabsAuthMachinePayload {
  sub: string;
  type: "machine";
  iat: number;
  exp: number;
  iss: "auth.mayrlabs.com";
  aud: "mayrlabs-internal";
}

export interface MayRLabsAuthErrorPayload {
  message: string;
  code: string;
  iat: number;
  iss: "auth.mayrlabs.com";
}

export interface IssuerConfig {
  privateKey: string;
  issuer?: string;
}

export interface ClientConfig {
  publicKey: string;
  clientId: string;
  clientSecret: string;
  accountUrl: string;
  redirects?: { error: string; success: string };
  session?: { key: string };
}
