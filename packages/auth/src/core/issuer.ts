import { type CryptoKey, importJWK, SignJWT } from "jose";

import type {
  IssuerConfig,
  MayRLabsAuthUserPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthErrorPayload,
} from "../types";
import { MayRLabsAuthError } from "../errors";

export class IssuerAuthSetup {
  private _key: CryptoKey | null = null;
  private readonly privateKey: string;
  private readonly issuer: string;

  constructor(config: IssuerConfig) {
    this.privateKey = config.privateKey;
    this.issuer = config.issuer || "auth.mayrlabs.com";
  }

  private async getKey(): Promise<CryptoKey> {
    if (this._key) return this._key;

    try {
      this._key = (await importJWK(
        JSON.parse(this.privateKey),
        "PS256"
      )) as CryptoKey;

      return this._key;
    } catch (error) {
      throw new MayRLabsAuthError(
        `Failed to import Private JWK: ${error instanceof Error ? error.message : "Unknown error"}`,
        "INVALID_PRIVATE_KEY"
      );
    }
  }

  async signUserToken(
    payload: Omit<MayRLabsAuthUserPayload, "iat" | "exp" | "iss" | "aud">,
    options: { audience: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getKey();

    return new SignJWT(payload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signMachineToken(
    payload: { sub: string },
    options: { expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getKey();

    const machinePayload: MayRLabsAuthMachinePayload = {
      ...payload,
      type: "machine",
      iat: Math.floor(Date.now() / 1000),
      exp: 0, // Will be overriden by setExpirationTime
      iss: this.issuer as "auth.mayrlabs.com",
      aud: "mayrlabs-internal",
    };

    return new SignJWT(machinePayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setAudience("mayrlabs-internal")
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signErrorToken(payload: {
    message: string;
    code: string;
  }): Promise<string> {
    const key = await this.getKey();

    const errorPayload: MayRLabsAuthErrorPayload = {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      iss: this.issuer as "auth.mayrlabs.com",
    };

    return new SignJWT(errorPayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.issuer)
      .setIssuedAt()
      .sign(key);
  }
}
