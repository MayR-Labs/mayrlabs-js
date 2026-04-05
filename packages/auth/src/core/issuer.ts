import { type CryptoKey, SignJWT } from "jose";
import type {
  IssuerConfig,
  IssuerConfigInput,
  MayRLabsAuthErrorPayload,
  MayRLabsAuthMachinePayload,
  MayRLabsAuthUserPayload,
} from "../types";
import { BaseAuthSetup } from "./base";
import { ISSUER } from "./constants";

export class IssuerAuthSetup extends BaseAuthSetup<IssuerConfig> {
  private _privateKey: CryptoKey | null = null;

  constructor(config: IssuerConfigInput) {
    super({ ...config, issuer: config.issuer || ISSUER });
  }

  private async getPrivateKey(): Promise<CryptoKey> {
    this._privateKey ??= await this._getKey(this.config.privateKey, "Private");

    return this._privateKey;
  }

  async signUserToken(
    payload: Omit<MayRLabsAuthUserPayload, "iat" | "exp" | "iss" | "aud">,
    options: { audience: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getPrivateKey();

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signMachineToken(
    payload: { sub: string },
    options: { audience?: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getPrivateKey();
    const audience = options.audience || "mayrlabs-internal";

    const machinePayload: MayRLabsAuthMachinePayload = {
      ...payload,
      type: "machine",
      iss: this.config.issuer,
      aud: "mayrlabs-internal", // Internal structure still uses this, but JWT aud is set by setAudience
    };

    return new SignJWT(machinePayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }

  async signErrorToken(
    payload: { message: string; code: string },
    options: { audience: string; expiresIn: string | number }
  ): Promise<string> {
    const key = await this.getPrivateKey();

    const errorPayload: MayRLabsAuthErrorPayload = {
      ...payload,
      iss: this.config.issuer,
    };

    return new SignJWT(errorPayload as unknown as Record<string, unknown>)
      .setProtectedHeader({ alg: "PS256" })
      .setIssuer(this.config.issuer)
      .setAudience(options.audience)
      .setIssuedAt()
      .setExpirationTime(options.expiresIn)
      .sign(key);
  }
}
